"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { client } from "@/lib/client";
import { useState } from "react";
import { toast } from "sonner";
import { useChat } from "@ai-sdk/react";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const {
    messages,
    input,
    setInput,
    handleSubmit: handleChatSubmit,
  } = useChat({
    api: "/api/ai/chat",
    maxSteps: 3,
  });

  const [url, setUrl] = useState("");
  const [markdown, setMarkdown] = useState("");

  const handleURLSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resp = await client.api.ai.bookmark.$post({
      json: {
        url,
      },
    });

    const data = await resp.json();
    if (resp.ok) {
      toast.success("Embeddings for bookmark created");
    } else {
      toast.error("Failed to create embeddings for bookmark");
    }
    setMarkdown(data.markdown);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Dashboard</h1>
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        <div className="text-sm text-zinc-500">url: {url}</div>
        <ScrollArea className="h-52">
          <div className="whitespace-pre-wrap">{markdown}</div>
        </ScrollArea>

        <ScrollArea className="h-96">
          {messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              <div>
                <div className="font-bold">{m.role}</div>
                <p>
                  {m.content.length > 0 ? (
                    m.content
                  ) : (
                    <span className="italic font-light">
                      {"calling tool: " + m?.toolInvocations?.[0].toolName}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>

        <form onSubmit={handleURLSubmit}>
          <label className="text-sm text-zinc-500">URL</label>
          <Input
            value={url}
            placeholder="Say something..."
            onChange={(e) => setUrl(e.target.value)}
          />
        </form>

        <form onSubmit={handleChatSubmit}>
          <label className="text-sm text-zinc-500">Prompt</label>
          <Input
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
