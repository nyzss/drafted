"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { ResBookmark } from "@/types/bookmark";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Link2, FileText, ImageIcon, Lock, Save } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  url: z.string().url("Please enter a valid URL"),
  image: z
    .string()
    .url("Please enter a valid image URL")
    .optional()
    .or(z.literal("")),
  isPrivate: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface EditBookmarkFormProps {
  bookmark: ResBookmark;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EditBookmarkForm({
  bookmark,
  onCancel,
  onSuccess,
}: EditBookmarkFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: bookmark.title,
      description: bookmark.description || "",
      url: bookmark.url,
      image: bookmark.image || "",
      isPrivate: bookmark.isPrivate,
    },
  });

  const updateBookmarkMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await client.api.bookmark.$put({
        json: {
          id: bookmark.id,
          ...values,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update bookmark");
      }

      return data;
    },
    onSuccess: async () => {
      toast.success("Bookmark updated successfully");
      await queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });

      onSuccess();
    },
    onError: (error) => {
      toast.error("Failed to update bookmark", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    updateBookmarkMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-sm font-medium">
                <FileText className="h-4 w-4 mr-2 text-primary" />
                Title
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-10 bg-background border-input focus-visible:ring-1 transition-all dark:bg-muted/20 dark:border-border/70 dark:focus-visible:ring-primary/40"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-sm font-medium">
                <Link2 className="h-4 w-4 mr-2 text-primary" />
                URL
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-10 bg-background border-input focus-visible:ring-1 transition-all dark:bg-muted/20 dark:border-border/70 dark:focus-visible:ring-primary/40"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-sm font-medium">
                <FileText className="h-4 w-4 mr-2 text-primary" />
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter a description (optional)"
                  className="resize-none bg-background border-input focus-visible:ring-1 transition-all min-h-[80px] dark:bg-muted/20 dark:border-border/70 dark:focus-visible:ring-primary/40"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-sm font-medium">
                <ImageIcon className="h-4 w-4 mr-2 text-primary" />
                Image URL
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://example.com/image.jpg (optional)"
                  className="h-10 bg-background border-input focus-visible:ring-1 transition-all dark:bg-muted/20 dark:border-border/70 dark:focus-visible:ring-primary/40"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPrivate"
          render={({ field }) => (
            <FormItem>
              <div className="border-input has-[data-state=checked]:border-ring relative flex w-full items-start gap-3 rounded-md border p-4 shadow-xs outline-none dark:border-border/70 dark:has-[data-state=checked]:border-primary/50 dark:bg-muted/20 dark:backdrop-blur-sm">
                <FormControl>
                  <Checkbox
                    id="private-bookmark"
                    className="order-1 mt-1 after:absolute after:inset-0 dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-primary-foreground"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-describedby="private-bookmark-description"
                  />
                </FormControl>
                <div className="flex grow flex-col">
                  <FormLabel
                    htmlFor="private-bookmark"
                    className="text-base flex items-center"
                  >
                    <Lock className="h-4 w-4 mr-2 text-primary" />
                    Private Bookmark
                  </FormLabel>
                  <p
                    id="private-bookmark-description"
                    className="text-muted-foreground text-sm mt-1"
                  >
                    Make this bookmark visible only to you
                  </p>
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={updateBookmarkMutation.isPending}
            className="w-full sm:w-auto dark:border-border/70 dark:hover:bg-muted/30"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              !form.formState.isDirty || updateBookmarkMutation.isPending
            }
            className="w-full sm:w-auto gap-2 group dark:hover:bg-primary/90"
          >
            {updateBookmarkMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
