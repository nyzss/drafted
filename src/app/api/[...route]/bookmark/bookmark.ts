import { Hono } from "hono";
import ogs from "open-graph-scraper-lite";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

const router = app.post(
    "/",
    zValidator("json", z.object({ url: z.string() })),
    async (c) => {
        const { url } = c.req.valid("json");

        const html = await fetch(url).then((res) => res.text());
        const options = {
            html,
        };
        const data = await ogs(options);
        console.log(data);

        return c.json(data);
    }
);

export default router;
