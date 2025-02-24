import { HonoType } from "../route";
import { createMiddleware } from "hono/factory";

export const protectedMiddleware = createMiddleware<HonoType>(
  async (c, next) => {
    const user = c.get("user");

    if (!user)
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    await next();
  },
);
