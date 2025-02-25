import { Env, Hono } from "hono";
import { handle } from "hono/vercel";
import bookmarkRouter from "./routes/bookmark";
import aiRouter from "./routes/ai";
import { auth } from "@/lib/auth";
import { protectedMiddleware } from "./middleware/protected";

export const runtime = "edge";
export interface HonoType extends Env {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}

const app = new Hono<HonoType>()
  .basePath("/api")
  .use("*", async (c, next) => {
    // better auth middleware to get user and session
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  })
  .on(["POST", "GET"], "/auth/*", (c) => {
    // better auth handler
    return auth.handler(c.req.raw);
  })
  .use("/ai/*", protectedMiddleware)
  .use("/bookmark/*", protectedMiddleware)
  .route("/ai", aiRouter)
  .route("/bookmark", bookmarkRouter);

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
