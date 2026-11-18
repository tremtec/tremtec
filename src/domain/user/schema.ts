import { z } from "zod";
import { paginationSchema } from "~/domain/shared/pagination";
import { providerEnum } from "~/domain/shared/provider";

export const roleEnum = z.enum(["admin", "user"]);
export type Role = z.infer<typeof roleEnum>;

export const statusEnum = z.enum(["active", "pending", "suspended"]);
export type Status = z.infer<typeof statusEnum>;

export const userSchema = z.strictObject({
  id: z.uuid(),
  name: z.string().default("Jane Doe"),
  login: z.string(),
  email: z.email(),
  provider: providerEnum,
  avatar: z.url(),
  role: roleEnum,
  status: statusEnum,
  createdAt: z.string(),
  lastLoginAt: z.string(),
});
export type User = z.infer<typeof userSchema>;

/** Identity fields taken from an OAuth provider at sign in. */
export const newUserSchema = userSchema.pick({
  name: true,
  login: true,
  email: true,
  provider: true,
  avatar: true,
});
export type NewUser = z.infer<typeof newUserSchema>;

// API DTOs

export const userIdParamSchema = userSchema.pick({ id: true });
export type UserIdParam = z.infer<typeof userIdParamSchema>;

export const updateUserRequestSchema = z
  .object({
    role: roleEnum.optional(),
    status: statusEnum.optional(),
  })
  .refine((v) => v.role !== undefined || v.status !== undefined, {
    message: "Provide a role or a status",
  });
export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>;

export const listUsersQuerySchema = paginationSchema.extend({
  q: z.string().trim().max(100).optional(),
  role: roleEnum.optional(),
  status: statusEnum.optional(),
});
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

// Metrics

export type DailyCount = { date: string; count: number };

export type UserMetrics = {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  admins: number;
  newThisWeek: number;
  byProvider: Record<"github" | "google", number>;
  signupsByDay: DailyCount[];
};
