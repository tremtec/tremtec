import { beforeEach, describe, expect, it } from "vitest";
import { createTestDb } from "~/lib/testing/d1";
import type { NewUser } from "./schema";
import {
  UserService,
  deleteUser,
  getMetrics,
  isAdminEmail,
  listUsers,
  signIn,
  updateUser,
} from "./service";

const identity = (name: string, email: string): NewUser => ({
  name,
  login: name.toLowerCase(),
  email,
  provider: "github",
  avatar: "https://example.com/a.png",
});

let db: D1Database;

beforeEach(() => {
  db = createTestDb();
});

describe("validate service was created", () => {
  it("has user schema", () => {
    expect(UserService.userSchema).not.toBeNull();
  });
});

describe("isAdminEmail", () => {
  it("trusts verified tremtec.com addresses only", () => {
    expect(isAdminEmail("a@tremtec.com", true)).toBe(true);
    expect(isAdminEmail("A@TremTec.com", true)).toBe(true);
    expect(isAdminEmail("a@tremtec.com", false)).toBe(false);
    expect(isAdminEmail("a@tremtec.com.evil.io", true)).toBe(false);
    expect(isAdminEmail("a@gmail.com", true)).toBe(false);
  });
});

describe("signIn", () => {
  it("creates admins as active and everyone else as pending", async () => {
    const admin = await signIn(db, identity("Ana", "ana@tremtec.com"), true);
    const guest = await signIn(db, identity("Bob", "bob@example.com"), false);

    expect(admin).toMatchObject({ role: "admin", status: "active" });
    expect(guest).toMatchObject({ role: "user", status: "pending" });
  });

  it("keeps role and status on later sign ins but refreshes the profile", async () => {
    const first = await signIn(db, identity("Bob", "bob@example.com"), false);
    await updateUser(db, "someone-else", first.id, { status: "active" });

    const again = await signIn(
      db,
      { ...identity("Robert", "bob@example.com") },
      true,
    );

    expect(again.id).toBe(first.id);
    expect(again).toMatchObject({
      name: "Robert",
      role: "user",
      status: "active",
    });
  });
});

describe("listUsers", () => {
  beforeEach(async () => {
    await signIn(db, identity("Ana", "ana@tremtec.com"), true);
    const bob = await signIn(db, identity("Bob", "bob@example.com"), false);
    await signIn(db, identity("100%_Cris", "cris@example.com"), false);
    await updateUser(db, "x", bob.id, { status: "suspended" });
  });

  it("filters by status and role", async () => {
    expect(
      (await listUsers(db, { limit: 20, offset: 0, status: "pending" })).total,
    ).toBe(1);
    expect(
      (await listUsers(db, { limit: 20, offset: 0, role: "admin" })).total,
    ).toBe(1);
  });

  it("searches and treats wildcards literally", async () => {
    const byName = await listUsers(db, { limit: 20, offset: 0, q: "bob" });
    expect(byName.users.map((u) => u.name)).toEqual(["Bob"]);

    const wildcard = await listUsers(db, { limit: 20, offset: 0, q: "%" });
    expect(wildcard.users.map((u) => u.name)).toEqual(["100%_Cris"]);
  });

  it("paginates and reports the total", async () => {
    const page = await listUsers(db, { limit: 2, offset: 2 });
    expect(page.users).toHaveLength(1);
    expect(page.total).toBe(3);
  });
});

describe("updateUser and deleteUser", () => {
  it("changes role and status", async () => {
    const bob = await signIn(db, identity("Bob", "bob@example.com"), false);
    const result = await updateUser(db, "admin-id", bob.id, {
      role: "admin",
      status: "active",
    });

    expect(result).toMatchObject({
      ok: true,
      user: { role: "admin", status: "active" },
    });
  });

  it("refuses to change or delete yourself", async () => {
    const ana = await signIn(db, identity("Ana", "ana@tremtec.com"), true);

    expect(await updateUser(db, ana.id, ana.id, { role: "user" })).toEqual({
      ok: false,
      reason: "self",
    });
    expect(await deleteUser(db, ana.id, ana.id)).toEqual({
      ok: false,
      reason: "self",
    });
  });

  it("reports missing users", async () => {
    const missing = crypto.randomUUID();
    expect(await updateUser(db, "x", missing, { role: "user" })).toEqual({
      ok: false,
      reason: "not_found",
    });
    expect(await deleteUser(db, "x", missing)).toEqual({
      ok: false,
      reason: "not_found",
    });
  });

  it("deletes users", async () => {
    const bob = await signIn(db, identity("Bob", "bob@example.com"), false);
    expect(await deleteUser(db, "x", bob.id)).toEqual({ ok: true });
    expect((await listUsers(db, { limit: 20, offset: 0 })).total).toBe(0);
  });
});

describe("getMetrics", () => {
  it("is all zeros with a 14 day series when empty", async () => {
    const m = await getMetrics(db);

    expect(m).toMatchObject({
      total: 0,
      active: 0,
      pending: 0,
      suspended: 0,
      admins: 0,
      newThisWeek: 0,
    });
    expect(m.signupsByDay).toHaveLength(14);
    expect(m.signupsByDay.every((d) => d.count === 0)).toBe(true);
  });

  it("counts users by status, role, provider and day", async () => {
    await signIn(db, identity("Ana", "ana@tremtec.com"), true);
    await signIn(db, identity("Bob", "bob@example.com"), false);
    await signIn(
      db,
      { ...identity("Cris", "cris@example.com"), provider: "google" },
      false,
    );

    const m = await getMetrics(db);

    expect(m).toMatchObject({
      total: 3,
      active: 1,
      pending: 2,
      admins: 1,
      newThisWeek: 3,
    });
    expect(m.byProvider).toEqual({ github: 2, google: 1 });
    expect(m.signupsByDay.at(-1)?.count).toBe(3);
  });
});
