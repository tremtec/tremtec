import { z } from "zod";
import { providerEnum } from "~/domain/shared/provider";

export const userSessionSchema = z.strictObject({
  name: z.string().default("Jane Doe"),
  login: z.string(),
  email: z.email(),
  provider: providerEnum,
  avatar: z.url(),
});
export type UserSession = z.infer<typeof userSessionSchema>;

/** Contents of the signed session cookie. The user itself is loaded from D1. */
export const sessionPayloadSchema = z.strictObject({
  uid: z.uuid(),
  exp: z.number().int(), // unix seconds
});
export type SessionPayload = z.infer<typeof sessionPayloadSchema>;
