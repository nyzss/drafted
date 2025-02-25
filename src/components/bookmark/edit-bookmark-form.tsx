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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter a description (optional)"
                  className="resize-none"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://example.com/image.jpg (optional)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPrivate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Private Bookmark</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Make this bookmark visible only to you
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={updateBookmarkMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              !form.formState.isDirty || updateBookmarkMutation.isPending
            }
          >
            {updateBookmarkMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
