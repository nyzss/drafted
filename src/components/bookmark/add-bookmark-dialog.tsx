"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Loader2,
  CircleXIcon,
  LoaderCircleIcon,
  Link2,
  BookmarkPlus,
} from "lucide-react";
import { client } from "@/lib/client";
import { OpenGraphData } from "@/types/bookmark";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PreviewBookmark from "./preview-bookmark";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  url: z.string().url(),
});

export function AddBookmarkDialog() {
  const [preview, setPreview] = useState<OpenGraphData | null>(null);
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const previewBookmarkMutation = useMutation({
    mutationFn: async ({ url }: { url: string }) => {
      const res = await client.api.bookmark.preview.$get({
        query: { url },
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      return { ...data.bookmark, url };
    },
    onSuccess: (data) => {
      setPreview({
        ogTitle: data.ogTitle,
        ogDescription: data.ogDescription,
        ogImage: data.ogImage,
        url: data.url,
      });
    },
    onError: (error) => {
      console.error("Error fetching bookmark data:", error);
    },
  });

  const addBookmarkMutation = useMutation({
    mutationFn: async ({ url }: { url: string }) => {
      const res = await client.api.bookmark.$post({
        query: { url },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add bookmark");
      }
      return data.message;
    },
    onSuccess: (data) => {
      toast.success(data, {
        description: "Bookmark added successfully",
        position: "bottom-right",
      });

      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (error) => {
      console.error("Error adding bookmark:", error);
    },
  });

  const handleAddBookmark = async () => {
    const url = form.getValues("url");

    addBookmarkMutation.mutate({ url });
  };

  const handlePreview = form.handleSubmit(async (data) => {
    previewBookmarkMutation.mutate({ url: data.url });
  });

  const handleClear = () => {
    form.setFocus("url");
    form.reset();
    setPreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer group transition-all">
          <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
          Add Bookmark
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] p-0 backdrop-blur-sm bg-background/95 dark:bg-background/90 border-border/70">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold flex items-center">
            <BookmarkPlus className="h-5 w-5 mr-2 text-primary" />
            Add New Bookmark
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter the URL of the page you want to bookmark.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 p-6 pt-4">
          <Form {...form}>
            <form
              onSubmit={handlePreview}
              className="flex flex-col sm:flex-row sm:items-end gap-3"
            >
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm font-medium">
                      Website URL
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-muted-foreground">
                          <Link2 className="h-4 w-4" />
                        </div>
                        <Input
                          className="pl-9 pr-9 h-10 bg-background border-input focus-visible:ring-1 transition-all dark:bg-muted/20 dark:border-border/70 dark:focus-visible:ring-primary/40"
                          placeholder="https://example.com"
                          type="url"
                          {...field}
                        />
                        {field.value && (
                          <button
                            className="text-muted-foreground/70 hover:text-foreground absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-colors outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Clear input"
                            onClick={handleClear}
                          >
                            <CircleXIcon size={16} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={
                  previewBookmarkMutation.isPending || !form.formState.isValid
                }
                variant="outline"
                size="sm"
                className="w-full sm:w-auto h-10 dark:border-border/70 dark:hover:bg-primary/10 dark:hover:text-primary"
              >
                {previewBookmarkMutation.isPending ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  "Preview"
                )}
              </Button>
            </form>
          </Form>

          {preview && (
            <div className="mt-2 animate-in fade-in-50 duration-300">
              <PreviewBookmark preview={preview} />
            </div>
          )}
        </div>
        <DialogFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto order-2 sm:order-1 dark:border-border/70 dark:hover:bg-muted/30"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddBookmark}
            disabled={!form.formState.isValid || addBookmarkMutation.isPending}
            className="w-full sm:w-auto order-1 sm:order-2 gap-2 dark:hover:bg-primary/90"
          >
            {addBookmarkMutation.isPending ? (
              <>
                <LoaderCircleIcon
                  className="animate-spin"
                  size={16}
                  aria-hidden="true"
                />
                Adding...
              </>
            ) : (
              <>
                <BookmarkPlus className="h-4 w-4" />
                Add Bookmark
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
