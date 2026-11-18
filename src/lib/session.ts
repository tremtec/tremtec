/**
 * Page helpers for the session the middleware resolved.
 */

export const isAdmin = (user: App.CurrentUser | undefined): boolean =>
  user?.role === "admin" && user.status === "active";

/**
 * Returns the signed-in user. Private routes are guarded by the middleware,
 * so a missing user here means a route was not registered as private.
 */
export function requireUser(locals: App.Locals): App.CurrentUser {
  if (!locals.user) throw new Error("Private page rendered without a session");
  return locals.user;
}
