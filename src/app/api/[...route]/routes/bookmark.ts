import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/db/db";
import { bookmarksTable } from "@/db/schema";
import { getOpenGraphData } from "@/utils";
import { OpenGraphData } from "@/types/bookmark";
import type { HonoType } from "../route";
import { and, desc, eq, ilike, or } from "drizzle-orm";

type ErrorResponse = {
  success: false;
  message: string;
};

type SuccessResponse = {
  success: true;
  message: string;
  bookmark: OpenGraphData;
};

export type ApiResponse = ErrorResponse | SuccessResponse;

const updateBookmarkSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  url: z.string().url("Please enter a valid URL").optional(),
  image: z.string().url("Please enter a valid image URL").optional().nullable(),
  isPrivate: z.boolean().optional(),
  folderId: z.string().optional().nullable(),
});

export type UpdateBookmarkRequest = z.infer<typeof updateBookmarkSchema>;

const app = new Hono<HonoType>()
  .get(
    "/list",
    zValidator(
      "query",
      z
        .object({
          offset: z.number().optional(),
          limit: z.number().optional(),
          search: z.string().optional(),
        })
        .optional(),
    ),
    async (c) => {
      const user = c.get("user")!;
      const { offset = 0, limit = 10, search } = c.req.valid("query") || {};

      const bookmarks = await db
        .select()
        .from(bookmarksTable)
        .where(
          and(
            eq(bookmarksTable.userId, user.id),
            search
              ? or(
                  ilike(bookmarksTable.title, `%${search}%`),
                  ilike(bookmarksTable.url, `%${search}%`),
                  ilike(bookmarksTable.description, `%${search}%`),
                )
              : undefined,
          ),
        )
        .limit(limit)
        .offset(offset)
        .orderBy(desc(bookmarksTable.createdAt));

      return c.json({
        success: true,
        message: "Bookmarks fetched successfully",
        bookmarks,
      });
    },
  )
  .get(
    "/preview",
    zValidator("query", z.object({ url: z.string() })),
    async (c) => {
      const { url } = c.req.valid("query");

      const data = await getOpenGraphData(url);

      if (data.error) {
        return c.json(
          {
            success: false,
            message: "Couldn't fetch URL data",
          } satisfies ErrorResponse,
          400,
        );
      }

      return c.json({
        success: true,
        message: "Bookmark added successfully",
        bookmark: data.result,
      } satisfies SuccessResponse);
    },
  )
  .post("/", zValidator("query", z.object({ url: z.string() })), async (c) => {
    const { url } = c.req.valid("query");
    const user = c.get("user")!;
    const data = await getOpenGraphData(url);

    const ogImage = Array.isArray(data.result.ogImage)
      ? data.result.ogImage[0]?.url || null
      : data.result.ogImage || null;

    const res = await db
      .insert(bookmarksTable)
      .values({
        userId: user.id,
        title: data.result.ogTitle || url,
        url: data.result.ogUrl || url,
        description: data.result.ogDescription || null,
        image: ogImage,
        ogType: data.result.ogType || null,
        ogTitle: data.result.ogTitle || null,
        ogDescription: data.result.ogDescription || null,
        isPrivate: false,
        favicon: data.result.favicon || null,
        charset: data.result.charset || null,
        ogImage: ogImage || null,
      })
      .returning();

    if (!res) {
      return c.json(
        {
          success: false,
          message: "Couldn't add bookmark",
        } satisfies ErrorResponse,
        400,
      );
    }

    return c.json({
      success: true,
      message: "Bookmark added successfully",
    });
  })
  .put("/", zValidator("json", updateBookmarkSchema), async (c) => {
    const updateData = c.req.valid("json");
    const user = c.get("user")!;

    const res = await db
      .update(bookmarksTable)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(bookmarksTable.id, updateData.id),
          eq(bookmarksTable.userId, user.id),
        ),
      )
      .returning();

    if (!res || res.length === 0) {
      return c.json(
        {
          success: false,
          message: "Couldn't update bookmark",
        },
        400,
      );
    }

    return c.json({
      success: true,
      message: "Bookmark updated successfully",
    });
  });

export default app;
