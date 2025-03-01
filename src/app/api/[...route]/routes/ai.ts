import { Hono } from "hono";
import { streamText, tool } from "ai";
import { CoreMessage } from "ai";
import {
  findRelevantContent,
  generateEmbeddings,
  openai,
  getMarkdownChunks,
  getMetadataChunks,
} from "@/lib/llm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { parseUrlToMarkdown } from "@/lib/md";
import { db } from "@/db";
import { embeddingsTable } from "@/db/schema";
import { getOpenGraphData } from "@/utils";

const aiRouter = new Hono()
  .post("/chat", async (c) => {
    const { messages }: { messages: CoreMessage[] } = await c.req.json();

    const resp = streamText({
      model: openai("gpt-4o-mini"),
      system: `
            You are a helpful assistant. Check your knowledge base before answering any questions.
            Only respond to questions using information from tool calls.
            The user might ask about their bookmarks, if so, use the getInformation tool to get the information.
            if no relevant information is found in the tool calls, respond, "Sorry, I don't know."
            `,
      messages,
      tools: {
        getInformation: tool({
          description: `get information from your knowledge base and bookmarks history to answer questions.
          `,
          parameters: z.object({
            question: z.string().describe("the users question"),
          }),
          execute: async ({ question }) => findRelevantContent(question),
        }),
      },
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

      const metadata = await getOpenGraphData(url);

      const metadataChunks = await getMetadataChunks(
        JSON.stringify(metadata.result),
      );

      const markdown = await parseUrlToMarkdown(url);
      const mdChunks = await getMarkdownChunks(markdown);

      const chunks = [...mdChunks, ...metadataChunks];

      const embeddings = await generateEmbeddings(chunks);

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
  )
  .post("/completion", async (c) => {
    const { prompt }: { prompt: string } = await c.req.json();
    const resp = streamText({
      model: openai("gpt-4o-mini"),
      system: `
            You are a helpful assistant. Check your knowledge base before answering any questions.
            Only respond to questions using information from tool calls.
            The user might ask about their bookmarks, if so, use the getInformation tool to get the information.
            if no relevant information is found in the tool calls, respond, "Sorry, I don't know."
            `,
      prompt,
      tools: {
        getInformation: tool({
          description: `get information from your knowledge base and bookmarks history to answer questions.
          `,
          parameters: z.object({
            question: z.string().describe("the users question"),
          }),
          execute: async ({ question }) => findRelevantContent(question),
        }),
      },
    });

    return resp.toDataStreamResponse();
  });

export default aiRouter;
