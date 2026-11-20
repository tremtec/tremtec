/**
 * Users API Route (admin only)
 *
 * Called by htmx from the users page. Successful changes ask htmx to
 * refresh the page so every number on it stays consistent.
 */

import { zValidator } from "@hono/zod-validator";
import { type Context, Hono } from "hono";
import {
  updateUserRequestSchema,
  userIdParamSchema,
} from "~/domain/user/schema";
import { usersContent } from "~/ui/contents/users";
import type { AppEnv } from "./env";
import { requireAdmin } from "./guards";
import { requestLocale } from "./locale";

const failureKey = { self: "self", not_found: "notFound" } as const;

const failureStatus = { self: 409, not_found: 404 } as const;

/** The message follows the acting admin's locale. */
const failureMessage = (
  c: Context<AppEnv>,
  reason: keyof typeof failureKey,
) => {
  const { errors } = usersContent[requestLocale(c, c.get("user"))];
  return errors[failureKey[reason]];
};

export const users = new Hono<AppEnv>()
  .use(requireAdmin)
  .patch(
    "/:id",
    zValidator("param", userIdParamSchema),
    zValidator("form", updateUserRequestSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const result = await c.var.services.users.updateUser(
        c.get("user").id,
        id,
        c.req.valid("form"),
      );

      if (!result.ok) {
        return c.json(
          { error: failureMessage(c, result.reason) },
          failureStatus[result.reason],
        );
      }
      c.header("HX-Refresh", "true");
      return c.json({ success: true });
    },
  )
  .delete("/:id", zValidator("param", userIdParamSchema), async (c) => {
    const { id } = c.req.valid("param");
    const result = await c.var.services.users.deleteUser(c.get("user").id, id);

    if (!result.ok) {
      return c.json(
        { error: failureMessage(c, result.reason) },
        failureStatus[result.reason],
      );
    }
    c.header("HX-Refresh", "true");
    return c.json({ success: true });
  });
