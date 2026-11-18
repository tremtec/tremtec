import type { User } from "~/domain/user/schema";

/** Hono environment shared by all routes. */
export type AppEnv = {
  Bindings: Env;
  Variables: {
    user: User;
  };
};
