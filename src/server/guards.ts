/**
 * Session guards for the htmx write routes. `requireUser` loads the caller,
 * `requireAdmin` adds the role check on top of it.
 */

import { every } from "hono/combine";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { config } from "~/config";
import { SESSION_COOKIE_NAME } from "~/domain/auth/constants";
import { resolveSessionUser } from "~/domain/auth/service";
import { isHtmxRequest } from "~/lib/htmx";
import { isAdmin } from "~/lib/session";
import type { AppEnv } from "./env";

export const requireUser = createMiddleware<AppEnv>(async (c, next) => {
  // Custom header blocks cross-site form posts on top of the SameSite cookie
  if (!isHtmxRequest(c)) return c.json({ error: "Bad request" }, 400);

  const user = await resolveSessionUser(
    getCookie(c, SESSION_COOKIE_NAME),
    c.var.services.users,
    config.SESSION_SECRET,
  );
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  c.set("user", user);
  await next();
});

const adminOnly = createMiddleware<AppEnv>(async (c, next) => {
  if (!isAdmin(c.get("user"))) return c.json({ error: "Forbidden" }, 403);
  await next();
});

export const requireAdmin = every(requireUser, adminOnly);
