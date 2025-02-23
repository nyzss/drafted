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
