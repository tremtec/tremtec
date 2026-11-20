/**
 * Me API Route
 *
 * Lets any signed-in user change their own preferences, called by htmx from
 * the app shell. Success asks htmx to refresh so the page renders in the new locale.
 */

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { LOCALE_COOKIE_NAME } from "~/domain/shared/locale";
import { updateMeRequestSchema } from "~/domain/user/schema";
import { localeCookieOptions } from "~/lib/i18n";
import type { AppEnv } from "./env";
import { requireUser } from "./guards";

export const me = new Hono<AppEnv>()
  .use(requireUser)
  .patch("/", zValidator("form", updateMeRequestSchema), async (c) => {
    const { locale } = c.req.valid("form");
    await c.var.services.users.setLocale(c.get("user").id, locale);

    setCookie(c, LOCALE_COOKIE_NAME, locale, localeCookieOptions());
    c.header("HX-Refresh", "true");
    return c.json({ success: true });
  });
