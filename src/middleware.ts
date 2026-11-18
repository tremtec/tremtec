import { SESSION_COOKIE_NAME } from "~/domain/auth/constants";
import { resolveSessionUser } from "~/domain/auth/service";
import { isPrivateRoute, routes } from "~/server/contants";
import { defineMiddleware, sequence } from "astro:middleware";

// Define a simple logging middleware
const loggingMiddleware = defineMiddleware(async (context, next) => {
  console.log(`Intercepted request to: ${context.url.pathname}`);

  const response = await next();

  console.log("Page rendered. Returning response...");
  return response;
});

const authMiddleware = defineMiddleware(async (context, next) => {
  context.locals.title = "New title";

  const pathname = context.url.pathname;
  const needsSession =
    isPrivateRoute(pathname) || pathname.startsWith(routes.public.login);

  // Only hit the database where the session matters
  if (needsSession) {
    // Lazy: neither the Worker env nor process.env exist while prerendering
    const { env } = await import("cloudflare:workers");
    const { config } = await import("~/config");
    const user = await resolveSessionUser(
      context.cookies.get(SESSION_COOKIE_NAME)?.value,
      env.DB,
      config.SESSION_SECRET,
    );
    context.locals.user = user ?? undefined;
  }

  const user = context.locals.user;

  if (isPrivateRoute(pathname) && !user) {
    return context.redirect(routes.public.login);
  }

  if (pathname.startsWith(routes.public.login) && user) {
    return context.redirect(routes.private.dashboard);
  }

  if (
    pathname.startsWith(routes.private.users) &&
    (user?.role !== "admin" || user.status !== "active")
  ) {
    return context.redirect(routes.private.dashboard);
  }

  return next();
});

// Export the sequence of middleware functions
export const onRequest = sequence(loggingMiddleware, authMiddleware);
