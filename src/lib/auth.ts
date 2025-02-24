import { betterAuth } from "better-auth";
import { env } from "./env";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    url: env.BETTER_AUTH_URL,
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
    },
});
