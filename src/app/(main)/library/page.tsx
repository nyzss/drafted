import { BookmarkList } from "@/components/bookmark/bookmark-list";
import { sampleBookmarks } from "@/components/bookmark/bookmarks";

export default function LibraryPage() {
    return (
        <div className="container py-8">
            <BookmarkList bookmarks={sampleBookmarks} />
        </div>
    );
}
