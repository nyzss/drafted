import { db } from "@/db/db";
import { tagsTable } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import type { HonoType } from "../route";

const app = new Hono<HonoType>()
  .get("/", async (c) => {
    const user = c.get("user")!;

    const tags = await db
      .select()
      .from(tagsTable)
      .where(eq(tagsTable.userId, user.id));

    return c.json(tags);
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        isPrivate: z.boolean().optional(),
        icon: z.string().optional(),
      }),
    ),
    async (c) => {
      const user = c.get("user")!;

      const { name, description, isPrivate, icon } = c.req.valid("json");

      const tag = await db
        .insert(tagsTable)
        .values({
          name,
          userId: user.id,
          description,
          icon,
          isPrivate,
        })
        .returning();

      if (!tag || tag.length === 0) {
        return c.json(
          {
            success: false,
            message: "Failed to create tag",
          },
          400,
        );
      }

      return c.json(tag[0]);
    },
  )
  .put(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        isPrivate: z.boolean().optional(),
        icon: z.string().optional(),
        id: z.string().min(1),
      }),
    ),
    async (c) => {
      const user = c.get("user")!;

      const { name, description, isPrivate, icon, id } = c.req.valid("json");

      const tag = await db
        .update(tagsTable)
        .set({
          name,
          userId: user.id,
          description,
          icon,
          isPrivate,
        })
        .where(and(eq(tagsTable.id, id), eq(tagsTable.userId, user.id)))
        .returning();

      if (!tag || tag.length === 0) {
        return c.json(
          {
            success: false,
            message: "Failed to update tag",
          },
          400,
        );
      }

      return c.json(tag[0]);
    },
  )
  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().min(1),
      }),
    ),
    async (c) => {
      const user = c.get("user")!;

      const { id } = c.req.valid("param");

      const tag = await db
        .delete(tagsTable)
        .where(and(eq(tagsTable.id, id), eq(tagsTable.userId, user.id)))
        .returning();

      if (!tag || tag.length === 0) {
        return c.json({ success: false, message: "Failed to delete tag" }, 400);
      }

      return c.json({ success: true, message: "Tag deleted" });
    },
  );
export default app;
