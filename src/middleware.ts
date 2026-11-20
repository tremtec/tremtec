import { SESSION_COOKIE_NAME } from "~/domain/auth/constants";
import { resolveSessionUser } from "~/domain/auth/service";
import { LOCALE_COOKIE_NAME } from "~/domain/shared/locale";
import {
  homeRedirect,
  localizePath,
  resolveLocale,
  splitLocale,
} from "~/lib/i18n";
import { isAdmin } from "~/lib/session";
import { isPrivateRoute, routes } from "~/server/contants";
import { defineMiddleware, sequence } from "astro:middleware";

// Define a simple logging middleware
const loggingMiddleware = defineMiddleware(async (context, next) => {
  console.log(`Intercepted request to: ${context.url.pathname}`);

  const response = await next();

  console.log("Page rendered. Returning response...");
  return response;
});

// Gives pages request-scoped services. Prerendered pages have no Worker env.
const servicesMiddleware = defineMiddleware(async (context, next) => {
  if (!context.isPrerendered) {
    const { env } = await import("cloudflare:workers");
    const { createServices } = await import("~/server/services");
    context.locals.services = createServices(env.DB);
  }

  return next();
});

// First visit to `/` goes to the preferred locale. The answer depends on both headers.
const homeMiddleware = defineMiddleware(async (context, next) => {
  if (context.isPrerendered || context.url.pathname !== routes.public.home) {
    return next();
  }

  const target = homeRedirect(
    context.url.pathname,
    context.cookies.get(LOCALE_COOKIE_NAME)?.value,
    context.request.headers.get("accept-language"),
  );
  const response = target ? context.redirect(target) : await next();
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
});

const authMiddleware = defineMiddleware(async (context, next) => {
  context.locals.title = "New title";

  const pathname = context.url.pathname;
  const { locale: pathLocale, path } = splitLocale(pathname);
  const isLogin = path.startsWith(routes.public.login);
  const needsSession = isPrivateRoute(pathname) || isLogin;

  // Only hit the database where the session matters
  if (needsSession) {
    // Lazy: process.env does not exist while prerendering
    const { config } = await import("~/config");
    const user = await resolveSessionUser(
      context.cookies.get(SESSION_COOKIE_NAME)?.value,
      context.locals.services.users,
      config.SESSION_SECRET,
    );
    context.locals.user = user ?? undefined;
  }

  const user = context.locals.user;

  // Cookies and headers do not exist while prerendering
  context.locals.locale =
    isPrivateRoute(pathname) && !context.isPrerendered
      ? resolveLocale({
          user,
          cookie: context.cookies.get(LOCALE_COOKIE_NAME)?.value,
          acceptLanguage: context.request.headers.get("accept-language"),
        })
      : pathLocale;

  if (isPrivateRoute(pathname) && !user) {
    return context.redirect(
      localizePath(context.locals.locale, routes.public.login),
    );
  }

  if (isLogin && user) {
    return context.redirect(routes.private.dashboard);
  }

  if (pathname.startsWith(routes.private.users) && !isAdmin(user)) {
    return context.redirect(routes.private.dashboard);
  }

  return next();
});

// Export the sequence of middleware functions
export const onRequest = sequence(
  loggingMiddleware,
  servicesMiddleware,
  homeMiddleware,
  authMiddleware,
);
