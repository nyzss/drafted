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
import { Plus, Loader2, CircleXIcon, LoaderCircleIcon } from "lucide-react";
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
            if (!data.success) {
                throw new Error(data.message);
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
        form.reset();
        setPreview(null);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Bookmark
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add New Bookmark</DialogTitle>
                    <DialogDescription>
                        Enter the URL of the page you want to bookmark.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form
                            onSubmit={handlePreview}
                            className="flex items-end gap-2"
                        >
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>URL</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    className="pe-9"
                                                    placeholder="https://example.com"
                                                    type="text"
                                                    {...field}
                                                />
                                                {field.value && (
                                                    <button
                                                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                        aria-label="Clear input"
                                                        onClick={handleClear}
                                                    >
                                                        <CircleXIcon
                                                            size={16}
                                                            aria-hidden="true"
                                                        />
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
                                    previewBookmarkMutation.isPending ||
                                    !form.formState.isValid
                                }
                            >
                                {previewBookmarkMutation.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading..
                                    </>
                                ) : (
                                    "Preview"
                                )}
                            </Button>
                        </form>
                    </Form>
                    {preview && <PreviewBookmark preview={preview} />}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddBookmark}
                        disabled={
                            !form.formState.isValid ||
                            addBookmarkMutation.isPending
                        }
                    >
                        {addBookmarkMutation.isPending ? (
                            <>
                                <LoaderCircleIcon
                                    className="-ms-1 animate-spin"
                                    size={16}
                                    aria-hidden="true"
                                />
                                Adding..
                            </>
                        ) : (
                            "Add Bookmark"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
