import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { LOCALE_COOKIE_NAME } from "~/domain/shared/locale";
import type { User } from "~/domain/user/schema";
import { resolveLocale } from "~/lib/i18n";
import type { AppEnv } from "./env";

/** The caller's locale outside the URL: user, then cookie, then `Accept-Language`. */
export const requestLocale = (c: Context<AppEnv>, user?: User) =>
  resolveLocale({
    user,
    cookie: getCookie(c, LOCALE_COOKIE_NAME),
    acceptLanguage: c.req.header("accept-language"),
  });
