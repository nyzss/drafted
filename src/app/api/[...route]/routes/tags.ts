import { db } from "@/db/db";
import { tagsTable } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import type { HonoType } from "../route";

const app = new Hono<HonoType>()
  .get("/", async (c) => {
    const user = c.get("user")!;

    const folders = await db
      .select()
      .from(tagsTable)
      .where(eq(tagsTable.userId, user.id));

    return c.json(folders);
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
  );

export default app;
