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
import { Plus, Loader2 } from "lucide-react";
import { client } from "@/client";

interface OpenGraphData {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: Array<{ url: string }>;
}

interface AddBookmarkDialogProps {
    onBookmarkAdded?: () => void;
}

export function AddBookmarkDialog({ onBookmarkAdded }: AddBookmarkDialogProps) {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState<OpenGraphData | null>(null);
    const [open, setOpen] = useState(false);

    const handleAdd = async () => {
        try {
            setIsLoading(true);
            const res = await client.api.bookmark.$post({
                json: { url },
            });
            const data = await res.json();

            if (!data.error && data.result) {
                setPreview({
                    ogTitle: data.result.ogTitle,
                    ogDescription: data.result.ogDescription,
                    ogImage: data.result.ogImage,
                });
            } else {
                console.error(
                    "Error fetching bookmark data:",
                    data.error || "Unknown error"
                );
            }
        } catch (error) {
            console.error("Error fetching bookmark data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (preview) {
            // TODO: save bookmark to database
            console.log("Saving bookmark:", preview);
            onBookmarkAdded?.();
            setOpen(false);
            setUrl("");
            setPreview(null);
        }
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
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !isLoading) {
                                    handleAdd();
                                }
                            }}
                        />
                        <Button
                            onClick={handleAdd}
                            disabled={isLoading || !url}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Preview"
                            )}
                        </Button>
                    </div>

                    {preview && (
                        <div className="rounded-lg border p-4 space-y-3">
                            {preview.ogImage?.[0]?.url && (
                                <div className="aspect-video w-full overflow-hidden rounded-md">
                                    <img
                                        src={preview.ogImage[0].url}
                                        alt={preview.ogTitle || "Preview"}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}
                            <div>
                                <h3 className="font-medium">
                                    {preview.ogTitle || url}
                                </h3>
                                {preview.ogDescription && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {preview.ogDescription}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!preview || isLoading}
                    >
                        Add Bookmark
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
