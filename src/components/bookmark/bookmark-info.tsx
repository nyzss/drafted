/* eslint-disable @next/next/no-img-element */
"use client";

import { ExternalLink, Calendar, Tag, Globe, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Bookmark } from "@/types/schema";

interface BookmarkInfoProps {
  bookmark: Bookmark | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookmarkInfo({
  bookmark,
  open,
  onOpenChange,
}: BookmarkInfoProps) {
  if (!bookmark) return null;

  const createdDate =
    bookmark.createdAt instanceof Date
      ? bookmark.createdAt
      : new Date(bookmark.createdAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">Bookmark Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {bookmark.image && (
            <div className="overflow-hidden rounded-md aspect-video w-full">
              <img
                src={bookmark.image}
                alt={bookmark.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">{bookmark.title}</h2>
            {bookmark.description && (
              <p className="text-muted-foreground">{bookmark.description}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(bookmark.url, "_blank", "noopener,noreferrer")
              }
              className="flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Website
            </Button>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm text-muted-foreground truncate">
                {bookmark.url}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Added on</p>
                <p className="text-sm text-muted-foreground">
                  {format(createdDate, "PPP")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {bookmark.isPrivate ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">Visibility</p>
                <p className="text-sm text-muted-foreground">
                  {bookmark.isPrivate ? "Private" : "Public"}
                </p>
              </div>
            </div>
          </div>

          {bookmark.folderId && (
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Folder</p>
                <p className="text-sm text-muted-foreground">
                  {bookmark.folderId}
                </p>
              </div>
            </div>
          )}

          {(bookmark.ogType || bookmark.ogTitle || bookmark.ogDescription) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Open Graph Data</h3>

                {bookmark.ogType && (
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Type</p>
                      <p className="text-sm text-muted-foreground">
                        {bookmark.ogType}
                      </p>
                    </div>
                  </div>
                )}

                {bookmark.ogTitle && (
                  <div>
                    <p className="text-sm font-medium">Title</p>
                    <p className="text-sm text-muted-foreground">
                      {bookmark.ogTitle}
                    </p>
                  </div>
                )}

                {bookmark.ogDescription && (
                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">
                      {bookmark.ogDescription}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
