import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/db/db";
import { bookmarksTable } from "@/db/schema";
import { getOpenGraphData } from "@/utils";
import { OpenGraphData } from "@/types/bookmark";
import type { HonoType } from "../route";

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

const app = new Hono<HonoType>()
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
                    400
                );
            }

            return c.json({
                success: true,
                message: "Bookmark added successfully",
                bookmark: data.result,
            } satisfies SuccessResponse);
        }
    )
    .post(
        "/",
        zValidator("query", z.object({ url: z.string() })),
        async (c) => {
            const { url } = c.req.valid("query");

            const data = await getOpenGraphData(url);

            const ogImage = Array.isArray(data.result.ogImage)
                ? data.result.ogImage[0]?.url || null
                : data.result.ogImage || null;

            const res = await db
                .insert(bookmarksTable)
                .values({
                    userId: "daed8c5a-ec22-4275-bfeb-196f5ea0f334",
                    title: data.result.ogTitle || url,
                    url: data.result.ogUrl || url,
                    description: data.result.ogDescription || null,
                    image: ogImage,
                    ogType: data.result.ogType || null,
                    ogTitle: data.result.ogTitle || null,
                    ogDescription: data.result.ogDescription || null,
                    isPrivate: false,
                })
                .returning();

            if (!res) {
                return c.json(
                    {
                        success: false,
                        message: "Couldn't add bookmark",
                    } satisfies ErrorResponse,
                    400
                );
            }

            return c.json({
                success: true,
                message: "Bookmark added successfully",
            });
        }
    );

export default app;
