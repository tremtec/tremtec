/**
 * User Service
 *
 * Business rules for users on top of a UserRepository. It has no idea
 * how the data is stored, so it can be tested with a stub repository.
 */

import type { UserRepository } from "./repository";
import type {
  ListUsersQuery,
  NewUser,
  UpdateUserRequest,
  User,
} from "./schema";

export const ADMIN_EMAIL_DOMAIN = "tremtec.com";

/** Only verified @tremtec.com addresses are trusted to become admins. */
export const isAdminEmail = (email: string, emailVerified: boolean) =>
  emailVerified && email.toLowerCase().endsWith(`@${ADMIN_EMAIL_DOMAIN}`);

export type MutationResult =
  | { ok: true; user: User }
  | { ok: false; reason: "self" | "not_found" };

export type DeleteResult =
  | { ok: true }
  | { ok: false; reason: "self" | "not_found" };

export function createUserService(repo: UserRepository) {
  return {
    /**
     * Creates the user on first sign in, or refreshes profile and last login.
     * Role and status are only decided at creation, so admins stay in control after.
     */
    signIn(identity: NewUser, emailVerified: boolean): Promise<User> {
      const admin = isAdminEmail(identity.email, emailVerified);
      return repo.upsertFromSignIn(
        identity,
        admin
          ? { role: "admin", status: "active" }
          : { role: "user", status: "pending" },
      );
    },

    getUser: (id: string) => repo.findById(id),

    listUsers: (query: ListUsersQuery) => repo.list(query),

    getMetrics: (now?: Date) => repo.metrics(now),

    /** Admins cannot change or remove themselves, so one admin always remains. */
    async updateUser(
      actorId: string,
      targetId: string,
      patch: UpdateUserRequest,
    ): Promise<MutationResult> {
      if (actorId === targetId) return { ok: false, reason: "self" };

      const user = await repo.update(targetId, patch);
      return user ? { ok: true, user } : { ok: false, reason: "not_found" };
    },

    async deleteUser(actorId: string, targetId: string): Promise<DeleteResult> {
      if (actorId === targetId) return { ok: false, reason: "self" };

      return (await repo.delete(targetId))
        ? { ok: true }
        : { ok: false, reason: "not_found" };
    },
  };
}

export type UserService = ReturnType<typeof createUserService>;
