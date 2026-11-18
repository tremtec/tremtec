import { Hono } from "hono";
import { auth } from "./auth";
import { contact } from "./contact";
import type { AppEnv } from "./env";
import { health } from "./health";
import { users } from "./users";

export const app = new Hono<AppEnv>()
  .basePath("/api")
  .route("/auth", auth)
  .route("/contact", contact)
  .route("/users", users)
  .route("/healthcheck", health);

export type AppType = typeof app;
