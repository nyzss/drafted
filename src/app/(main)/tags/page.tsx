"use client";

import { Button } from "@/components/ui/button";
import { client } from "@/lib/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function TagsPage() {
  const queryClient = useQueryClient();

  const { data: tags, isPending } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const resp = await client.api.tags.$get();
      const tags = await resp.json();
      return tags;
    },
  });

  const createTag = async () => {
    const resp = await client.api.tags.$post({
      json: {
        name: "Test Tag",
        description: "Test Description",
        isPrivate: false,
      },
    });

    const tags = await resp.json();

    queryClient.invalidateQueries({ queryKey: ["tags"] });
    console.log(tags);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tags</h1>
        <Button onClick={createTag}>Create Tag</Button>
      </div>
      {isPending && <div>Loading...</div>}
      {tags && <pre>{JSON.stringify(tags, null, 2)}</pre>}
    </div>
  );
}
