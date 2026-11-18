/**
 * User Service
 *
 * Persistence and rules for users, backed by Cloudflare D1.
 * The database is injected so the logic can be tested without a Worker.
 */

import {
  type DailyCount,
  type ListUsersQuery,
  type NewUser,
  type Role,
  type Status,
  type UpdateUserRequest,
  type User,
  type UserMetrics,
  userSchema,
} from "./schema";

export const ADMIN_EMAIL_DOMAIN = "tremtec.com";
const SIGNUP_CHART_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

type UserRow = {
  id: string;
  name: string;
  login: string;
  email: string;
  provider: string;
  avatar: string;
  role: string;
  status: string;
  created_at: string;
  last_login_at: string;
};

const toUser = (row: UserRow): User =>
  userSchema.parse({
    id: row.id,
    name: row.name,
    login: row.login,
    email: row.email,
    provider: row.provider,
    avatar: row.avatar,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  });

/** Only verified @tremtec.com addresses are trusted to become admins. */
export const isAdminEmail = (email: string, emailVerified: boolean) =>
  emailVerified && email.toLowerCase().endsWith(`@${ADMIN_EMAIL_DOMAIN}`);

/**
 * Creates the user on first sign in, or refreshes profile and last login.
 * Role and status are only decided at creation, so admins stay in control after.
 */
export async function signIn(
  db: D1Database,
  identity: NewUser,
  admin: boolean,
): Promise<User> {
  const now = new Date().toISOString();
  const row = await db
    .prepare(
      `INSERT INTO users (id, name, login, email, provider, avatar, role, status, created_at, last_login_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?9)
       ON CONFLICT (provider, email) DO UPDATE SET
         name = excluded.name,
         login = excluded.login,
         avatar = excluded.avatar,
         last_login_at = excluded.last_login_at
       RETURNING *`,
    )
    .bind(
      crypto.randomUUID(),
      identity.name,
      identity.login,
      identity.email,
      identity.provider,
      identity.avatar,
      admin ? "admin" : "user",
      admin ? "active" : "pending",
      now,
    )
    .first<UserRow>();

  if (!row) throw new Error("failed to upsert user");
  return toUser(row);
}

export async function getUser(
  db: D1Database,
  id: string,
): Promise<User | null> {
  const row = await db
    .prepare("SELECT * FROM users WHERE id = ?1")
    .bind(id)
    .first<UserRow>();
  return row ? toUser(row) : null;
}

const escapeLike = (value: string) => value.replace(/[\\%_]/g, "\\$&");

export async function listUsers(
  db: D1Database,
  query: ListUsersQuery,
): Promise<{ users: User[]; total: number }> {
  const where: string[] = [];
  const params: (string | number)[] = [];

  if (query.q) {
    params.push(`%${escapeLike(query.q)}%`);
    const n = params.length;
    where.push(
      `(name LIKE ?${n} ESCAPE '\\' OR email LIKE ?${n} ESCAPE '\\' OR login LIKE ?${n} ESCAPE '\\')`,
    );
  }
  if (query.role) {
    params.push(query.role);
    where.push(`role = ?${params.length}`);
  }
  if (query.status) {
    params.push(query.status);
    where.push(`status = ?${params.length}`);
  }
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [rows, count] = await db.batch([
    db
      .prepare(
        `SELECT * FROM users ${clause} ORDER BY created_at DESC LIMIT ?${params.length + 1} OFFSET ?${params.length + 2}`,
      )
      .bind(...params, query.limit, query.offset),
    db.prepare(`SELECT COUNT(*) AS n FROM users ${clause}`).bind(...params),
  ]);

  return {
    users: (rows.results as UserRow[]).map(toUser),
    total: (count.results[0] as { n: number }).n,
  };
}

export type MutationResult =
  | { ok: true; user: User }
  | { ok: false; reason: "self" | "not_found" };

/** Admins cannot change or remove themselves, so one admin always remains. */
export async function updateUser(
  db: D1Database,
  actorId: string,
  targetId: string,
  patch: UpdateUserRequest,
): Promise<MutationResult> {
  if (actorId === targetId) return { ok: false, reason: "self" };

  const row = await db
    .prepare(
      `UPDATE users SET role = COALESCE(?2, role), status = COALESCE(?3, status)
       WHERE id = ?1 RETURNING *`,
    )
    .bind(targetId, patch.role ?? null, patch.status ?? null)
    .first<UserRow>();

  return row
    ? { ok: true, user: toUser(row) }
    : { ok: false, reason: "not_found" };
}

export async function deleteUser(
  db: D1Database,
  actorId: string,
  targetId: string,
): Promise<{ ok: true } | { ok: false; reason: "self" | "not_found" }> {
  if (actorId === targetId) return { ok: false, reason: "self" };

  const result = await db
    .prepare("DELETE FROM users WHERE id = ?1")
    .bind(targetId)
    .run();

  return result.meta.changes > 0
    ? { ok: true }
    : { ok: false, reason: "not_found" };
}

const countBy = (column: "role" | "status", value: Role | Status) =>
  `SUM(CASE WHEN ${column} = '${value}' THEN 1 ELSE 0 END)`;

export async function getMetrics(
  db: D1Database,
  now = new Date(),
): Promise<UserMetrics> {
  const weekAgo = new Date(now.getTime() - 7 * DAY_MS).toISOString();
  const chartStart = new Date(now);
  chartStart.setUTCHours(0, 0, 0, 0);
  chartStart.setTime(chartStart.getTime() - (SIGNUP_CHART_DAYS - 1) * DAY_MS);

  const [totals, providers, signups] = await db.batch([
    db
      .prepare(
        `SELECT COUNT(*) AS total,
          COALESCE(${countBy("status", "active")}, 0) AS active,
          COALESCE(${countBy("status", "pending")}, 0) AS pending,
          COALESCE(${countBy("status", "suspended")}, 0) AS suspended,
          COALESCE(${countBy("role", "admin")}, 0) AS admins,
          COALESCE(SUM(CASE WHEN created_at >= ?1 THEN 1 ELSE 0 END), 0) AS new_this_week
         FROM users`,
      )
      .bind(weekAgo),
    db.prepare("SELECT provider, COUNT(*) AS n FROM users GROUP BY provider"),
    db
      .prepare(
        `SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS n
         FROM users WHERE created_at >= ?1 GROUP BY day`,
      )
      .bind(chartStart.toISOString()),
  ]);

  const t = totals.results[0] as Record<string, number>;
  const byProvider = { github: 0, google: 0 };
  for (const p of providers.results as {
    provider: keyof typeof byProvider;
    n: number;
  }[]) {
    byProvider[p.provider] = p.n;
  }

  const perDay = new Map(
    (signups.results as { day: string; n: number }[]).map((r) => [r.day, r.n]),
  );
  const signupsByDay: DailyCount[] = Array.from(
    { length: SIGNUP_CHART_DAYS },
    (_, i) => {
      const date = new Date(chartStart.getTime() + i * DAY_MS)
        .toISOString()
        .slice(0, 10);
      return { date, count: perDay.get(date) ?? 0 };
    },
  );

  return {
    total: t.total,
    active: t.active,
    pending: t.pending,
    suspended: t.suspended,
    admins: t.admins,
    newThisWeek: t.new_this_week,
    byProvider,
    signupsByDay,
  };
}

export const UserService = {
  userSchema,
  signIn,
  getUser,
  listUsers,
  updateUser,
  deleteUser,
  getMetrics,
  isAdminEmail,
};
