import { Hono } from "hono";
import { streamText } from "ai";
import { CoreMessage } from "ai";
import { generateEmbeddings, openai } from "@/lib/llm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { parseUrlToMarkdown } from "@/lib/md";
import { db } from "@/db";
import { embeddingsTable } from "@/db/schema";

const aiRouter = new Hono()
  .post("/chat", async (c) => {
    const { messages }: { messages: CoreMessage[] } = await c.req.json();

    const resp = streamText({
      model: openai("gpt-4o-mini"),
      system: `
        You are a helpful assistant that can help users with their questions.
        End all your responses with this emoji: 🔖
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
  .post(
    "/bookmark",
    zValidator(
      "json",
      z.object({
        url: z.string().url("Invalid URL"),
      }),
    ),
    async (c) => {
      const { url }: { url: string } = await c.req.json();

      const markdown = await parseUrlToMarkdown(url);

      const embeddings = await generateEmbeddings(markdown);

      await db.insert(embeddingsTable).values(
        embeddings.map((embedding) => ({
          bookmarkId: "938eb0b0-ee64-4eb1-951f-a7d149010feb",
          ...embedding,
        })),
      );

      return c.json({
        markdown,
      });
    },
  );

export default aiRouter;
