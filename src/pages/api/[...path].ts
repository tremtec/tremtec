import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { app } from "~/server/router";

export const prerender = false;

// pass requests to Hono backend, with the Worker bindings (DB, EMAIL, ...)
export const ALL: APIRoute = (context) => app.fetch(context.request, env);
