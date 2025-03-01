export * from "./model";
export * from "./agent";

import { MDocument } from "@mastra/rag";
import { embedMany } from "ai";
import { embeddingModel } from "./model";

export const generateEmbeddings = async (value: string) => {
  const doc = MDocument.fromMarkdown(value);

  const chunks = (await doc.chunk()).map((chunk) => chunk.text);

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  return embeddings.map((e, i) => ({
    content: chunks[i],
    embedding: e,
  }));
};
