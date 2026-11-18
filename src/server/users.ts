/**
 * Users API Route (admin only)
 *
 * Called by htmx from the users page. Successful changes ask htmx to
 * refresh the page so every number on it stays consistent.
 */

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { config } from "~/config";
import { SESSION_COOKIE_NAME } from "~/domain/auth/constants";
import { resolveSessionUser } from "~/domain/auth/service";
import {
  updateUserRequestSchema,
  userIdParamSchema,
} from "~/domain/user/schema";
import { deleteUser, updateUser } from "~/domain/user/service";
import { isHtmxRequest } from "~/lib/htmx";
import type { AppEnv } from "./env";

const requireAdmin = createMiddleware<AppEnv>(async (c, next) => {
  // Custom header blocks cross-site form posts on top of the SameSite cookie
  if (!isHtmxRequest(c)) return c.json({ error: "Bad request" }, 400);

  const user = await resolveSessionUser(
    getCookie(c, SESSION_COOKIE_NAME),
    c.env.DB,
    config.SESSION_SECRET,
  );
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  if (user.role !== "admin" || user.status !== "active") {
    return c.json({ error: "Forbidden" }, 403);
  }

  c.set("user", user);
  await next();
});

const failureMessage = {
  self: "You cannot change your own account",
  not_found: "User not found",
} as const;

const failureStatus = { self: 409, not_found: 404 } as const;

export const users = new Hono<AppEnv>()
  .use(requireAdmin)
  .patch(
    "/:id",
    zValidator("param", userIdParamSchema),
    zValidator("form", updateUserRequestSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const result = await updateUser(
        c.env.DB,
        c.get("user").id,
        id,
        c.req.valid("form"),
      );

      if (!result.ok) {
        return c.json(
          { error: failureMessage[result.reason] },
          failureStatus[result.reason],
        );
      }
      c.header("HX-Refresh", "true");
      return c.json({ success: true });
    },
  )
  .delete("/:id", zValidator("param", userIdParamSchema), async (c) => {
    const { id } = c.req.valid("param");
    const result = await deleteUser(c.env.DB, c.get("user").id, id);

    if (!result.ok) {
      return c.json(
        { error: failureMessage[result.reason] },
        failureStatus[result.reason],
      );
    }
    c.header("HX-Refresh", "true");
    return c.json({ success: true });
  });
