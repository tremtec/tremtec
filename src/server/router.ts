import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { auth } from "./auth";
import { contact } from "./contact";
import type { AppEnv } from "./env";
import { health } from "./health";
import { createServices } from "./services";
import { users } from "./users";

const provideServices = createMiddleware<AppEnv>(async (c, next) => {
  c.set("services", createServices(c.env.DB));
  await next();
});

export const app = new Hono<AppEnv>()
  .basePath("/api")
  .use(provideServices)
  .route("/auth", auth)
  .route("/contact", contact)
  .route("/users", users)
  .route("/healthcheck", health);

export type AppType = typeof app;
