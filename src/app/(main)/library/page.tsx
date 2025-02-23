"use client";

import { client } from "@/client";

import { BookmarkList } from "@/components/bookmark/bookmark-list";
import { sampleBookmarks } from "@/components/bookmark/bookmarks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LibraryPage() {
    const [url, setUrl] = useState("");

    const handleAdd = async () => {
        const res = await client.api.bookmark.$post({
            json: {
                url,
            },
        });

        const json = await res.json();

        console.log("BOOKMARK ADDED:", json);
    };
    return (
        <div className="container py-8">
            <BookmarkList bookmarks={sampleBookmarks} />

            <div className="flex items-center gap-2 mt-3">
                <Input
                    placeholder="Search"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <Button onClick={handleAdd}>Add</Button>
            </div>
        </div>
    );
}
