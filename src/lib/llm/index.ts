export * from "./model";
export * from "./agent";

import { embed, embedMany } from "ai";
import { embeddingModel } from "./model";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { embeddingsTable } from "@/db/schema";
import { db } from "@/db";
import { MDocument } from "@mastra/rag";

export const getMarkdownChunks = async (markdown: string) => {
  const doc = MDocument.fromMarkdown(markdown);
  const mdChunks = (await doc.chunk()).map((chunk) => chunk.text);

  return mdChunks;
};

export const getMetadataChunks = async (json: string) => {
  const docMetadata = MDocument.fromText(json);
  const metadataChunks = (await docMetadata.chunk()).map((chunk) => chunk.text);

  return metadataChunks;
};

export const generateEmbeddings = async (chunks: string[]) => {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  return embeddings.map((e, i) => ({
    content: chunks[i],
    embedding: e,
  }));
};

export const generateUserEmbedding = async (input: string) => {
  const value = input.replaceAll("\\n", " ");

  const { embedding } = await embed({
    model: embeddingModel,
    value,
  });

  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateUserEmbedding(userQuery);

  const similarity = sql<number>`1 - (${cosineDistance(
    embeddingsTable.embedding,
    userQueryEmbedded,
  )})`;

  const similarBookmarks = await db
    .select({ name: embeddingsTable.content, similarity })
    .from(embeddingsTable)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
  console.log(similarBookmarks);

  return similarBookmarks;
};
