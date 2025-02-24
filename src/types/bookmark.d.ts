export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  thumbnail?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OpenGraphData {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: Array<{ url: string }>;
  url?: string;
}
