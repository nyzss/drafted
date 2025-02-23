import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),
        OPENAI_API_KEY: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_API_URL: z.string().url(),
    },
    experimental__runtimeEnv: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
});
