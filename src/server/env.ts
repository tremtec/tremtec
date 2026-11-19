import type { User } from "~/domain/user/schema";
import type { Services } from "./services";

/** Hono environment shared by all routes. */
export type AppEnv = {
  Bindings: Env;
  Variables: {
    services: Services;
    user: User;
  };
};
