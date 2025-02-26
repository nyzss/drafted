/* eslint-disable @next/next/no-img-element */
"use client";

import {
  ExternalLink,
  Globe,
  Eye,
  EyeOff,
  Edit,
  Loader2,
  Clock,
  Folder,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { EditBookmarkForm } from "./edit-bookmark-form";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { cn } from "@/lib/utils";

interface BookmarkInfoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
}

export function BookmarkInfo({ id, open, onOpenChange }: BookmarkInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { data: bookmark, isPending } = useQuery({
    queryKey: ["bookmarks", id],
    queryFn: async () => {
      const resp = await client.api.bookmark[":id"].$get({
        param: {
          id,
        },
      });

      const data = await resp.json();
      if (data === null) {
        throw new Error("Bookmark not found");
      }

      return data;
    },
  });
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
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto p-0 backdrop-blur-sm bg-background/95 dark:bg-background/90 border-border/70">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            {isEditing ? "Edit Bookmark" : "Bookmark Details"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="px-6 text-muted-foreground">
          {isEditing
            ? "Edit the bookmark details"
            : "View the bookmark details"}
        </DialogDescription>

        {isEditing ? (
          <EditBookmarkForm
            bookmark={bookmark}
            onCancel={handleEditCancel}
            onSuccess={handleEditSuccess}
          />
        ) : !bookmark || isPending ? (
          <div className="flex justify-center items-center h-40 w-full">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Loading bookmark details...
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-6 p-6 pt-2">
              {bookmark.image && (
                <div className="overflow-hidden rounded-lg aspect-video w-full shadow-sm dark:shadow-md">
                  <img
                    src={bookmark.image}
                    alt={bookmark.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                </div>
              )}

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {bookmark.title}
                </h2>
                {bookmark.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {bookmark.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center w-full sm:w-auto group transition-all"
                  >
                    <ExternalLink className="h-4 w-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
                    Visit Website
                  </Button>
                </a>
                <div className="flex-1 overflow-hidden bg-muted/50 rounded-md px-3 py-2 dark:backdrop-blur-sm">
                  <p className="text-sm text-muted-foreground truncate text-wrap break-all">
                    {bookmark.url}
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  "grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg",
                  "bg-muted/30 dark:bg-muted/30 dark:backdrop-blur-sm",
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Added on</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(bookmark.createdAt), "PPP")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {bookmark.isPrivate ? (
                      <EyeOff className="h-4 w-4 text-primary" />
                    ) : (
                      <Eye className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Visibility</p>
                    <p className="text-sm text-muted-foreground">
                      {bookmark.isPrivate ? "Private" : "Public"}
                    </p>
                  </div>
                </div>
              </div>

              {bookmark.folderId && (
                <div className="flex items-center space-x-3 bg-muted/30 p-4 rounded-lg dark:backdrop-blur-sm">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Folder className="h-4 w-4 text-primary" />
                  </div>
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
                  <Separator className="my-4 dark:bg-border/40" />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-primary" />
                      Metadata
                    </h3>

                    <div className="bg-muted/30 p-4 rounded-lg space-y-4 dark:backdrop-blur-sm">
                      {bookmark.ogType && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <div>
                            <p className="text-sm font-medium">Type</p>
                            <p className="text-sm text-muted-foreground">
                              {bookmark.ogType}
                            </p>
                          </div>
                        </div>
                      )}

                      {bookmark.ogTitle && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <div>
                            <p className="text-sm font-medium">Title</p>
                            <p className="text-sm text-muted-foreground">
                              {bookmark.ogTitle}
                            </p>
                          </div>
                        </div>
                      )}

                      {bookmark.ogDescription && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <div>
                            <p className="text-sm font-medium">Description</p>
                            <p className="text-sm text-muted-foreground">
                              {bookmark.ogDescription}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <DialogFooter className="p-6 pt-0">
              <Button
                variant="outline"
                onClick={handleEditClick}
                className="flex items-center group hover:bg-primary hover:text-primary-foreground transition-all dark:border-border/70 dark:hover:bg-primary/90"
              >
                <Edit className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                Edit Bookmark
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
