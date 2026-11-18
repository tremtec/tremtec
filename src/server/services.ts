import { createUserRepository } from "~/domain/user/repository";
import { createUserService } from "~/domain/user/service";

/**
 * Composition root: wires repositories into services for one request.
 * Middleware calls this once and hands the result to pages and routes.
 */
export function createServices(db: D1Database) {
  return {
    users: createUserService(createUserRepository(db)),
  };
}

export type Services = ReturnType<typeof createServices>;
