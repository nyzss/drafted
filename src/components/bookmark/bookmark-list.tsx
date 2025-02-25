/* eslint-disable @next/next/no-img-element */
"use client";

import { LayoutGrid, List, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { BookmarkInfo } from "./bookmark-info";
import { ResBookmark } from "@/types/bookmark";

export function BookmarkList() {
  const { data: bookmarks, isPending } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const resp = await client.api.bookmark.list.$get();
      const data = await resp.json();

      return data.bookmarks;
    },
  });
  const [view, setView] = useState<"list" | "grid">("list");
  const [selectedBookmark, setSelectedBookmark] = useState<ResBookmark | null>(
    null,
  );
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  const handleBookmarkClick = (bookmark: ResBookmark) => {
    setSelectedBookmark(bookmark);
    setInfoDialogOpen(true);
  };

  if (isPending || !bookmarks) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bookmarks</h2>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(value) => value && setView(value as "list" | "grid")}
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
            : "space-y-4",
        )}
      >
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className={cn(
              "group rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer",
              view === "list"
                ? "flex items-start space-x-4"
                : "flex flex-col space-y-2",
            )}
            onClick={() => handleBookmarkClick(bookmark)}
          >
            {bookmark.image && (
              <div
                className={cn(
                  "overflow-hidden rounded-md",
                  view === "list"
                    ? "h-20 w-20 flex-shrink-0"
                    : "aspect-video w-full",
                )}
              >
                <img
                  src={bookmark.image}
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
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {bookmark.title}
                </a>
              </h3>
              {bookmark.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {bookmark.description}
                </p>
              )}
              <div className="text-xs text-muted-foreground">
                Added {format(bookmark.createdAt, "MMM d, yyyy")}
              </div>
            </div>
          </div>
        ))}
        {bookmarks.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground">No bookmarks found</p>
          </div>
        )}
      </div>

      <BookmarkInfo
        bookmark={selectedBookmark}
        open={infoDialogOpen}
        onOpenChange={setInfoDialogOpen}
      />
    </div>
  );
}
