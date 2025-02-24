import { OpenGraphData } from "@/types/bookmark";
import React from "react";

export default function PreviewBookmark({
  preview,
}: {
  preview: OpenGraphData;
}) {
  return (
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
        <h3 className="font-medium">{preview.ogTitle || preview.url}</h3>
        {preview.ogDescription && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {preview.ogDescription}
          </p>
        )}
      </div>
    </div>
  );
}
