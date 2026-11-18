import { beforeEach, describe, expect, it } from "vitest";
import { createTestDb } from "~/lib/testing/d1";
import { type UserRepository, createUserRepository } from "./repository";
import type { NewUser } from "./schema";

const identity = (name: string, email: string): NewUser => ({
  name,
  login: name.toLowerCase(),
  email,
  provider: "github",
  avatar: "https://example.com/a.png",
});

const PENDING = { role: "user", status: "pending" } as const;
const ADMIN = { role: "admin", status: "active" } as const;

let repo: UserRepository;

beforeEach(() => {
  repo = createUserRepository(createTestDb());
});

describe("upsertFromSignIn", () => {
  it("applies the initial role and status on insert", async () => {
    const admin = await repo.upsertFromSignIn(
      identity("Ana", "ana@tremtec.com"),
      ADMIN,
    );
    const guest = await repo.upsertFromSignIn(
      identity("Bob", "bob@example.com"),
      PENDING,
    );

    expect(admin).toMatchObject(ADMIN);
    expect(guest).toMatchObject(PENDING);
  });

  it("keeps role and status on later sign ins but refreshes the profile", async () => {
    const first = await repo.upsertFromSignIn(
      identity("Bob", "bob@example.com"),
      PENDING,
    );
    await repo.update(first.id, { status: "active" });

    const again = await repo.upsertFromSignIn(
      identity("Robert", "bob@example.com"),
      ADMIN,
    );

    expect(again.id).toBe(first.id);
    expect(again).toMatchObject({
      name: "Robert",
      role: "user",
      status: "active",
    });
  });
});

describe("findById", () => {
  it("finds users and returns null for unknown ids", async () => {
    const bob = await repo.upsertFromSignIn(
      identity("Bob", "bob@example.com"),
      PENDING,
    );

    expect(await repo.findById(bob.id)).toMatchObject({
      email: "bob@example.com",
    });
    expect(await repo.findById(crypto.randomUUID())).toBeNull();
  });
});

describe("list", () => {
  beforeEach(async () => {
    await repo.upsertFromSignIn(identity("Ana", "ana@tremtec.com"), ADMIN);
    const bob = await repo.upsertFromSignIn(
      identity("Bob", "bob@example.com"),
      PENDING,
    );
    await repo.upsertFromSignIn(
      identity("100%_Cris", "cris@example.com"),
      PENDING,
    );
    await repo.update(bob.id, { status: "suspended" });
  });

  it("filters by status and role", async () => {
    expect(
      (await repo.list({ limit: 20, offset: 0, status: "pending" })).total,
    ).toBe(1);
    expect(
      (await repo.list({ limit: 20, offset: 0, role: "admin" })).total,
    ).toBe(1);
  });

  it("searches and treats wildcards literally", async () => {
    const byName = await repo.list({ limit: 20, offset: 0, q: "bob" });
    expect(byName.users.map((u) => u.name)).toEqual(["Bob"]);

    const wildcard = await repo.list({ limit: 20, offset: 0, q: "%" });
    expect(wildcard.users.map((u) => u.name)).toEqual(["100%_Cris"]);
  });

  it("paginates and reports the total", async () => {
    const page = await repo.list({ limit: 2, offset: 2 });
    expect(page.users).toHaveLength(1);
    expect(page.total).toBe(3);
  });
});

describe("update and delete", () => {
  it("updates only the given fields", async () => {
    const bob = await repo.upsertFromSignIn(
      identity("Bob", "bob@example.com"),
      PENDING,
    );

    expect(await repo.update(bob.id, { role: "admin" })).toMatchObject({
      role: "admin",
      status: "pending",
    });
  });

  it("returns null or false for unknown users", async () => {
    const missing = crypto.randomUUID();

    expect(await repo.update(missing, { role: "user" })).toBeNull();
    expect(await repo.delete(missing)).toBe(false);
  });

  it("deletes users", async () => {
    const bob = await repo.upsertFromSignIn(
      identity("Bob", "bob@example.com"),
      PENDING,
    );

    expect(await repo.delete(bob.id)).toBe(true);
    expect((await repo.list({ limit: 20, offset: 0 })).total).toBe(0);
  });
});

describe("metrics", () => {
  it("is all zeros with a 14 day series when empty", async () => {
    const m = await repo.metrics();

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
    await repo.upsertFromSignIn(identity("Ana", "ana@tremtec.com"), ADMIN);
    await repo.upsertFromSignIn(identity("Bob", "bob@example.com"), PENDING);
    await repo.upsertFromSignIn(
      { ...identity("Cris", "cris@example.com"), provider: "google" },
      PENDING,
    );

    const m = await repo.metrics();

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
