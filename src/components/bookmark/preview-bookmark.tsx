/* eslint-disable @next/next/no-img-element */
import { OpenGraphData } from "@/types/bookmark";
import { ExternalLink, Globe } from "lucide-react";
import React from "react";

export default function PreviewBookmark({
  preview,
}: {
  preview: OpenGraphData;
}) {
  return (
    <div className="rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden bg-card dark:backdrop-blur-sm dark:border-border/70">
      {preview.ogImage?.[0]?.url ? (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={preview.ogImage[0].url}
            alt={preview.ogTitle || "Preview"}
            className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
          <Globe className="h-8 w-8 text-primary/40" />
        </div>
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-lg leading-tight">
            {preview.ogTitle || preview.url}
          </h3>
          {preview.url && (
            <a
              href={preview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
        {preview.ogDescription && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {preview.ogDescription}
          </p>
        )}
      </div>
    </div>
  );
}
