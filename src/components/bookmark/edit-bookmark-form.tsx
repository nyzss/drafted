"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { ResSingleBookmark } from "@/types/bookmark";
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
import {
  Loader2,
  Link2,
  FileText,
  ImageIcon,
  Lock,
  Save,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import MultipleSelector from "../ui/multiselect";

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
  tagIds: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditBookmarkFormProps {
  bookmark: ResSingleBookmark;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EditBookmarkForm({
  bookmark,
  onCancel,
  onSuccess,
}: EditBookmarkFormProps) {
  const queryClient = useQueryClient();

  const { data: tags, isPending: isLoadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await client.api.tags.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }

      const data = await response.json();
      console.log(data);
      return data;
    },
  });

  const tagOptions =
    tags?.map((tag) => ({
      label: tag.name,
      value: tag.id,
    })) || [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: bookmark.title,
      description: bookmark.description || "",
      url: bookmark.url,
      image: bookmark.image || "",
      isPrivate: bookmark.isPrivate,
      tagIds:
        bookmark.tags?.map((tag) => ({
          label: tag.tag.name,
          value: tag.tagId,
        })) || [],
    },
  });

  const updateBookmarkMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await client.api.bookmark.$put({
        json: {
          id: bookmark.id,
          ...values,
          tagIds: values.tagIds?.map((tag) => tag.value) || [],
        },
      });

      const data = await response.json();

      if (!response.ok) {
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
          name="tagIds"
          render={() => (
            <FormItem>
              <FormLabel className="flex items-center text-sm font-medium">
                <Tag className="h-4 w-4 mr-2 text-primary" />
                Tags
              </FormLabel>
              <FormControl>
                <MultipleSelector
                  commandProps={{
                    label: "Select tags",
                  }}
                  value={form.watch("tagIds")}
                  onChange={(e) =>
                    form.setValue("tagIds", e, {
                      shouldDirty: true,
                    })
                  }
                  defaultOptions={tagOptions}
                  options={tagOptions}
                  hideClearAllButton
                  hidePlaceholderWhenSelected
                  emptyIndicator={
                    <p className="text-center text-sm">No tags found</p>
                  }
                  className="bg-background border-input focus-visible:ring-1 transition-all dark:bg-muted/20 dark:border-border/70 dark:focus-visible:ring-primary/40"
                />
              </FormControl>
              <FormMessage className="text-xs" />
              <p className="text-xs text-muted-foreground mt-1">
                {isLoadingTags
                  ? "Loading tags..."
                  : "Select tags to categorize your bookmark"}
              </p>
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
