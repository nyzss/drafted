/* eslint-disable @next/next/no-img-element */
"use client";

import {
  ExternalLink,
  Calendar,
  Tag,
  Globe,
  Eye,
  EyeOff,
  Edit,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { ResBookmark } from "@/types/bookmark";
import { useState } from "react";
import { EditBookmarkForm } from "./edit-bookmark-form";

interface BookmarkInfoProps {
  bookmark: ResBookmark | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookmarkInfo({
  bookmark,
  open,
  onOpenChange,
}: BookmarkInfoProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (!bookmark) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  const createdDate =
    bookmark.createdAt instanceof Date
      ? bookmark.createdAt
      : new Date(bookmark.createdAt);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          setIsEditing(false);
        }
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">
            {isEditing ? "Edit Bookmark" : "Bookmark Details"}
          </DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <EditBookmarkForm
            bookmark={bookmark}
            onCancel={handleEditCancel}
            onSuccess={handleEditSuccess}
          />
        ) : (
          <>
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
                  <p className="text-muted-foreground">
                    {bookmark.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center cursor-pointer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                </a>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm text-muted-foreground truncate text-wrap break-all">
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

              {(bookmark.ogType ||
                bookmark.ogTitle ||
                bookmark.ogDescription) && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Metadata</h3>

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

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleEditClick}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Bookmark
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
