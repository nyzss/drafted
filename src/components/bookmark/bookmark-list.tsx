/* eslint-disable @next/next/no-img-element */
"use client";

import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { type Bookmark } from "@/types/bookmark";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { format } from "date-fns";

interface BookmarkListProps {
    bookmarks: Bookmark[];
}

export function BookmarkList({ bookmarks }: BookmarkListProps) {
    const [view, setView] = useState<"list" | "grid">("list");

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Bookmarks</h2>
                <ToggleGroup
                    type="single"
                    value={view}
                    onValueChange={(value) =>
                        value && setView(value as "list" | "grid")
                    }
                >
                    <ToggleGroupItem value="list" aria-label="List view">
                        <List className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="grid" aria-label="Grid view">
                        <LayoutGrid className="h-4 w-4" />
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            <div
                className={cn(
                    "gap-4",
                    view === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        : "space-y-4"
                )}
            >
                {bookmarks.map((bookmark) => (
                    <div
                        key={bookmark.id}
                        className={cn(
                            "group rounded-lg border p-4 transition-colors hover:bg-muted/50",
                            view === "list"
                                ? "flex items-start space-x-4"
                                : "flex flex-col space-y-2"
                        )}
                    >
                        {bookmark.thumbnail && (
                            <div
                                className={cn(
                                    "overflow-hidden rounded-md",
                                    view === "list"
                                        ? "h-20 w-20 flex-shrink-0"
                                        : "aspect-video w-full"
                                )}
                            >
                                <img
                                    src={bookmark.thumbnail}
                                    alt={bookmark.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1 space-y-1">
                            <h3 className="font-medium leading-none">
                                <a
                                    href={bookmark.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    {bookmark.title}
                                </a>
                            </h3>
                            {bookmark.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {bookmark.description}
                                </p>
                            )}
                            {bookmark.tags && bookmark.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {bookmark.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                                Added{" "}
                                {format(bookmark.createdAt, "MMM d, yyyy")}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
