import { describe, expect, it, vi } from "vitest";
import type { UserRepository } from "./repository";
import type { NewUser, User } from "./schema";
import { createUserService, isAdminEmail } from "./service";

const identity = (email: string): NewUser => ({
  name: "Test",
  login: "test",
  email,
  provider: "github",
  avatar: "https://example.com/a.png",
});

const user: User = {
  id: "11111111-1111-4111-8111-111111111111",
  ...identity("test@example.com"),
  role: "user",
  status: "active",
  locale: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  lastLoginAt: "2026-01-01T00:00:00.000Z",
};

const stubRepo = (overrides: Partial<UserRepository> = {}): UserRepository => ({
  upsertFromSignIn: vi.fn(async () => user),
  findById: vi.fn(async () => user),
  list: vi.fn(async () => ({ users: [user], total: 1 })),
  update: vi.fn(async () => user),
  setLocale: vi.fn(async () => user),
  delete: vi.fn(async () => true),
  metrics: vi.fn(),
  ...overrides,
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
  it("creates verified tremtec.com users as active admins", async () => {
    const repo = stubRepo();
    await createUserService(repo).signIn(identity("ana@tremtec.com"), true);

    expect(repo.upsertFromSignIn).toHaveBeenCalledWith(expect.anything(), {
      role: "admin",
      status: "active",
    });
  });

  it("creates everyone else as pending users", async () => {
    const repo = stubRepo();
    const service = createUserService(repo);

    await service.signIn(identity("bob@example.com"), true);
    await service.signIn(identity("eve@tremtec.com"), false);

    expect(repo.upsertFromSignIn).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      { role: "user", status: "pending" },
    );
    expect(repo.upsertFromSignIn).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      { role: "user", status: "pending" },
    );
  });
});

describe("updateUser", () => {
  it("returns the updated user", async () => {
    const service = createUserService(stubRepo());

    expect(
      await service.updateUser("admin-id", user.id, { role: "admin" }),
    ).toEqual({ ok: true, user });
  });

  it("refuses to change yourself without touching the repository", async () => {
    const repo = stubRepo();

    expect(
      await createUserService(repo).updateUser(user.id, user.id, {
        role: "user",
      }),
    ).toEqual({
      ok: false,
      reason: "self",
    });
    expect(repo.update).not.toHaveBeenCalled();
  });

  it("reports missing users", async () => {
    const service = createUserService(
      stubRepo({ update: vi.fn(async () => null) }),
    );

    expect(
      await service.updateUser("admin-id", user.id, { role: "user" }),
    ).toEqual({
      ok: false,
      reason: "not_found",
    });
  });
});

describe("deleteUser", () => {
  it("deletes other users", async () => {
    expect(
      await createUserService(stubRepo()).deleteUser("admin-id", user.id),
    ).toEqual({ ok: true });
  });

  it("refuses to delete yourself without touching the repository", async () => {
    const repo = stubRepo();

    expect(await createUserService(repo).deleteUser(user.id, user.id)).toEqual({
      ok: false,
      reason: "self",
    });
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it("reports missing users", async () => {
    const service = createUserService(
      stubRepo({ delete: vi.fn(async () => false) }),
    );

    expect(await service.deleteUser("admin-id", user.id)).toEqual({
      ok: false,
      reason: "not_found",
    });
  });
});
