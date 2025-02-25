import { client } from "@/lib/client";

export interface OpenGraphData {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: Array<{ url: string }>;
  url?: string;
}

export type ResBookmark = InferResponseType<
  typeof client.api.bookmark.list.$get
>;
