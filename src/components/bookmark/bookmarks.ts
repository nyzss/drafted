import type { Bookmark } from "@/types/bookmark";

// sample data
export const sampleBookmarks: Bookmark[] = [
    {
        id: "1",
        title: "Next.js Documentation",
        url: "https://nextjs.org/docs",
        description:
            "The official Next.js documentation with comprehensive guides and API reference.",
        thumbnail: "https://www.svgrepo.com/show/354113/nextjs-icon.svg",
        tags: ["nextjs", "react", "documentation"],
        createdAt: new Date("2024-02-23"),
        updatedAt: new Date("2024-02-23"),
    },
    {
        id: "2",
        title: "Tailwind CSS",
        url: "https://tailwindcss.com",
        description:
            "A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.",
        thumbnail: "https://www.svgrepo.com/show/333609/tailwind-css.svg",
        tags: ["css", "tailwind", "design"],
        createdAt: new Date("2024-02-22"),
        updatedAt: new Date("2024-02-22"),
    },
    {
        id: "3",
        title: "Radix UI",
        url: "https://www.radix-ui.com",
        description:
            "Unstyled, accessible components for building high‑quality design systems and web apps in React.",
        tags: ["react", "ui", "components"],
        createdAt: new Date("2024-02-21"),
        updatedAt: new Date("2024-02-21"),
    },
];
