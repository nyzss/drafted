"use client";

import { BookmarkList } from "@/components/bookmark/bookmark-list";
import { AddBookmarkDialog } from "@/components/bookmark/add-bookmark-dialog";

export default function LibraryPage() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Library</h1>
        <AddBookmarkDialog />
      </div>
      <BookmarkList />
    </div>
  );
}
