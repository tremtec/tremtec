import { MAX_SESSION_AGE, SESSION_COOKIE_NAME } from "~/domain/auth/constants";
import {
  type SessionPayload,
  type UserSession,
  sessionPayloadSchema,
  userSessionSchema,
} from "~/domain/auth/schema";
import type { Provider } from "~/domain/shared/provider";
import type { User } from "~/domain/user/schema";
import type { UserService } from "~/domain/user/service";

/**
 * Extracts normalized user data from an OAuth provider payload.
 * Each provider returns different fields, so this normalizes to our schema.
 */
export function extractOAuthUser(
  provider: Provider,
  payload: Record<string, unknown>,
): UserSession | null {
  try {
    switch (provider) {
      case "github": {
        const user = userSessionSchema.parse({
          name: payload.name || payload.login || "GitHub User",
          login: payload.login,
          email: payload.email,
          provider: "github",
          avatar: payload.avatar_url,
        });
        return user;
      }

      case "google": {
        const user = userSessionSchema.parse({
          name: payload.name || "Google User",
          login: payload.email,
          email: payload.email,
          provider: "google",
          avatar: payload.picture,
        });
        return user;
      }

      default:
        return null;
    }
  } catch {
    return null;
  }
}

const encoder = new TextEncoder();

const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");

const fromBase64Url = (value: string) =>
  Uint8Array.from(atob(value.replaceAll("-", "+").replaceAll("_", "/")), (c) =>
    c.charCodeAt(0),
  );

const hmacKey = (secret: string, usage: "sign" | "verify") =>
  crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage],
  );

/** Creates the cookie value: `<base64url payload>.<base64url HMAC-SHA256>`. */
export async function signSession(
  userId: string,
  secret: string,
  now = Date.now(),
): Promise<string> {
  const payload: SessionPayload = {
    uid: userId,
    exp: Math.floor(now / 1000) + MAX_SESSION_AGE,
  };
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await hmacKey(secret, "sign");
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

/** Returns the payload when the signature is valid and the session has not expired. */
export async function verifySession(
  value: string,
  secret: string,
  now = Date.now(),
): Promise<SessionPayload | null> {
  try {
    const [body, signature, ...rest] = value.split(".");
    if (!body || !signature || rest.length > 0) return null;

    const key = await hmacKey(secret, "verify");
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signature),
      encoder.encode(body),
    );
    if (!valid) return null;

    const payload = sessionPayloadSchema.parse(
      JSON.parse(new TextDecoder().decode(fromBase64Url(body))),
    );
    return payload.exp * 1000 > now ? payload : null;
  } catch {
    return null;
  }
}

/**
 * Gets the session cookie configuration object.
 */
export function getSessionCookieConfig() {
  return {
    name: SESSION_COOKIE_NAME,
    maxAge: MAX_SESSION_AGE,
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
  };
}

/**
 * Resolves the signed-in user from the session cookie.
 * Suspended users are treated as signed out, so changes by admins apply immediately.
 */
export async function resolveSessionUser(
  cookieValue: string | undefined,
  users: Pick<UserService, "getUser">,
  secret: string,
): Promise<User | null> {
  if (!cookieValue) return null;

  const session = await verifySession(cookieValue, secret);
  if (!session) return null;

  const user = await users.getUser(session.uid);
  return user && user.status !== "suspended" ? user : null;
}
