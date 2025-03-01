"use client";
import { client } from "@/lib/client";
import { useState } from "react";

export default function DashboardPage() {
  // const { messages, input, handleInputChange, handleSubmit } = useChat({
  //   api: "/api/ai/chat",
  // });

  // const { messages, input, handleInputChange, handleSubmit } = useChat({
  //   api: "/api/ai/bookmark",
  // });

  const [url, setUrl] = useState("");
  const [markdown, setMarkdown] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resp = await client.api.ai.bookmark.$post({
      json: {
        url,
      },
    });

    const data = await resp.json();
    setMarkdown(data.markdown);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Dashboard</h1>
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        <div className="text-sm text-zinc-500">url: {url}</div>
        <div className="whitespace-pre-wrap">{markdown}</div>

        <form onSubmit={handleSubmit}>
          <input
            className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
            value={url}
            placeholder="Say something..."
            onChange={(e) => setUrl(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
