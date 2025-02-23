import { Hono } from "hono";
import { handle } from "hono/vercel";
import { Message, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import bookmarkRouter from "./bookmark/bookmark";

export const runtime = "edge";

const app = new Hono()
    .basePath("/api")
    .get("/hello", (c) => {
        return c.json({
            message: "Hello from Hono!",
        });
    })
    .post("/chat", async (c) => {
        const { messages }: { messages: Message[] } = await c.req.json();
        const resp = streamText({
            model: openai("gpt-4o-mini"),
            system: `
            You are an assistant that will help user find their bookmarks
        `,
            messages,
        });

        return resp.toDataStreamResponse();
    })
    .post("/completion", async (c) => {
        const { prompt }: { prompt: string } = await c.req.json();
        const resp = streamText({
            model: openai("gpt-4o-mini"),
            system: `
            You are a auto-completion system that completes the user's prompt.
            You will usually complete the prompt with a few words, but sometimes you will complete the prompt with a few sentences.
            Do not add any other text than the completion.
            Follow the user's prompt closely.
            `,
            prompt,
        });

        return resp.toDataStreamResponse();
    })
    .route("/bookmark", bookmarkRouter);

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
