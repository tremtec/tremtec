import { githubAuth } from "@hono/oauth-providers/github";
import { googleAuth } from "@hono/oauth-providers/google";
import { type Context, Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { config } from "~/config";
import { SESSION_COOKIE_NAME } from "~/domain/auth/constants";
import {
  extractOAuthUser,
  getSessionCookieConfig,
  signSession,
} from "~/domain/auth/service";
import type { Provider } from "~/domain/shared/provider";
import { localizePath } from "~/lib/i18n";
import { routes } from "./contants";
import type { AppEnv } from "./env";
import { requestLocale } from "./locale";

const sessionCookieOptions = () => ({
  ...getSessionCookieConfig(),
  secure: Boolean(import.meta.env.PROD),
});

/**
 * Stores the user, starts a signed session and redirects to the app.
 * Suspended users are sent back to the login page instead.
 */
async function startSession(
  c: Context<AppEnv>,
  provider: Provider,
  payload: Record<string, unknown> | undefined,
  emailVerified: boolean,
) {
  const locale = requestLocale(c);
  const login = localizePath(locale, routes.public.login);
  const failed = `${login}?error=${provider}_auth_failed`;
  if (!payload) return c.redirect(failed);

  const identity = extractOAuthUser(provider, payload);
  if (!identity) return c.redirect(failed);

  const user = await c.var.services.users.signIn(
    identity,
    emailVerified,
    locale,
  );
  if (user.status === "suspended") {
    return c.redirect(`${login}?error=suspended`);
  }

  setCookie(
    c,
    SESSION_COOKIE_NAME,
    await signSession(user.id, config.SESSION_SECRET),
    sessionCookieOptions(),
  );
  return c.redirect(routes.private.dashboard);
}

export const auth = new Hono<AppEnv>()
  .use(
    "/github",
    githubAuth({
      client_id: config.GITHUB_ID,
      client_secret: config.GITHUB_SECRET,
      redirect_uri: `${config.BASE_URL}/api/auth/github`,
      scope: ["user:email"],
      oauthApp: false,
    }),
  )
  // GitHub only exposes an email on the profile once the user verified it
  .get("/github", (c) => startSession(c, "github", c.get("user-github"), true))
  .use(
    "/google",
    googleAuth({
      client_id: config.GOOGLE_ID,
      client_secret: config.GOOGLE_SECRET,
      redirect_uri: `${config.BASE_URL}/api/auth/google`,
      scope: ["openid", "email", "profile"],
    }),
  )
  .get("/google", (c) => {
    const user = c.get("user-google");
    return startSession(c, "google", user, user?.verified_email === true);
  })
  .get("/logout", (c) => {
    deleteCookie(c, SESSION_COOKIE_NAME, {
      ...sessionCookieOptions(),
      maxAge: 0,
    });

    return c.redirect(localizePath(requestLocale(c), routes.public.login));
  });
