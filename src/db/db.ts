import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/env";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
}

const sql = neon(env.DATABASE_URL);
export const db = drizzle({ client: sql, schema });
