/* eslint-disable @next/next/no-img-element */
"use client";

import {
  LayoutGrid,
  List,
  Loader2,
  Search,
  Calendar,
  ExternalLink,
  Globe,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { BookmarkInfo } from "./bookmark-info";
import { ResSingleBookmark } from "@/types/bookmark";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  const [selectedBookmark, setSelectedBookmark] =
    useState<ResSingleBookmark | null>(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  const handleBookmarkClick = (bookmark: ResSingleBookmark) => {
    setSelectedBookmark(bookmark);
    setInfoDialogOpen(true);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
  };

  if (isPending || !bookmarks) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Loading your bookmarks...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 dark:from-foreground dark:to-foreground/70">
          Bookmarks
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bookmarks..."
              className="pl-9 w-full bg-background border-muted dark:bg-muted/20 dark:border-border/70 dark:focus-visible:ring-primary/40"
            />
          </div>
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(value) =>
              value && setView(value as "list" | "grid")
            }
            className="border rounded-md dark:border-border/70"
          >
            <ToggleGroupItem
              value="list"
              aria-label="List view"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="grid"
              aria-label="Grid view"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div
        className={cn(
          "gap-6",
          view === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "space-y-4",
        )}
      >
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className={cn(
              "group rounded-lg border bg-card shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20 dark:backdrop-blur-sm dark:hover:border-primary/30",
              view === "list"
                ? "flex items-start p-4 space-x-4"
                : "flex flex-col p-0 overflow-hidden",
            )}
            onClick={() => handleBookmarkClick(bookmark)}
          >
            {bookmark.image ? (
              <div
                className={cn(
                  "overflow-hidden",
                  view === "list"
                    ? "h-24 w-24 rounded-md flex-shrink-0"
                    : "aspect-video w-full rounded-t-lg",
                )}
              >
                <img
                  src={bookmark.image}
                  alt={bookmark.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-500"
                />
              </div>
            ) : (
              view === "grid" && (
                <div className="aspect-video w-full bg-gradient-to-br from-primary/5 to-primary/20 rounded-t-lg flex items-center justify-center">
                  <Globe className="h-8 w-8 text-primary/40" />
                </div>
              )
            )}
            <div className={cn("flex-1", view === "grid" && "p-4")}>
              <div className="flex items-start justify-between">
                <h3 className="font-medium leading-tight text-lg group-hover:text-primary transition-colors">
                  {bookmark.title}
                </h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  onClick={handleLinkClick}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              {bookmark.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                  {bookmark.description}
                </p>
              )}

              {bookmark.tags && bookmark.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <div className="flex items-center text-xs text-muted-foreground mr-0.5">
                    <Tag className="h-3 w-3 mr-1" />
                  </div>
                  {bookmark.tags.slice(0, 3).map((tagItem) => (
                    <Badge
                      key={tagItem.tagId}
                      variant="outline"
                      className="text-xs py-0 px-1.5 bg-primary/5 hover:bg-primary/10 border-primary/10 dark:border-primary/20"
                    >
                      {tagItem.tag.icon && (
                        <span className="mr-1">{tagItem.tag.icon}</span>
                      )}
                      {tagItem.tag.name}
                    </Badge>
                  ))}
                  {bookmark.tags.length > 3 && (
                    <Badge
                      variant="outline"
                      className="text-xs py-0 px-1.5 bg-muted/50 border-muted/50"
                    >
                      +{bookmark.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center mt-3 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                <span>
                  {format(new Date(bookmark.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
        ))}
        {bookmarks.length === 0 && (
          <div className="flex flex-col justify-center items-center h-64 w-full border rounded-lg bg-muted/20 p-6 dark:border-border/70 dark:backdrop-blur-sm">
            <Globe className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">
              No bookmarks found
            </p>
            <p className="text-sm text-muted-foreground/70 text-center mt-1">
              Add your first bookmark to get started
            </p>
          </div>
        )}
      </div>

      {selectedBookmark && (
        <BookmarkInfo
          id={selectedBookmark?.id}
          open={infoDialogOpen}
          onOpenChange={setInfoDialogOpen}
        />
      )}
    </div>
  );
}
