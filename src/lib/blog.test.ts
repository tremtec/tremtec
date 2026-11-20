import { describe, expect, it } from "vitest";
import { postAlternates, postsForLocale } from "./blog";

const entry = (id: string, date?: string) => ({
  id,
  data: { title: id, date: date ? new Date(date) : undefined },
});

const entries = [
  entry("en/hello-world", "2026-03-10"),
  entry("en/ai-driven-sdlc", "2026-04-01"),
  entry("en/old-post", "2025-01-01"),
  entry("pt-br/hello-world", "2026-03-10"),
];

describe("postsForLocale", () => {
  it("lists a translated post under its own locale URL", () => {
    const post = postsForLocale(entries, "pt-br").find(
      (p) => p.slug === "hello-world",
    );
    expect(post).toMatchObject({
      entry: entries[3],
      locale: "pt-br",
      href: "/pt-br/blog/hello-world",
      fallback: false,
    });
  });

  it("falls back to the en entry and URL for untranslated posts", () => {
    const post = postsForLocale(entries, "pt-br").find(
      (p) => p.slug === "ai-driven-sdlc",
    );
    expect(post).toMatchObject({
      entry: entries[1],
      locale: "en",
      href: "/blog/ai-driven-sdlc",
      fallback: true,
    });
  });

  it("lists every slug once, newest first", () => {
    expect(postsForLocale(entries, "pt-br").map((p) => p.slug)).toEqual([
      "ai-driven-sdlc",
      "hello-world",
      "old-post",
    ]);
    expect(postsForLocale(entries, "en").map((p) => p.slug)).toEqual([
      "ai-driven-sdlc",
      "hello-world",
      "old-post",
    ]);
  });

  it("never flags the default locale's own posts as fallbacks", () => {
    expect(postsForLocale(entries, "en").some((p) => p.fallback)).toBe(false);
  });

  it("sorts posts without a date last", () => {
    const list = postsForLocale(
      [entry("en/a"), entry("en/b", "2026-01-01")],
      "en",
    );
    expect(list.map((p) => p.slug)).toEqual(["b", "a"]);
  });
});

describe("postAlternates", () => {
  it("lists only the existing translations", () => {
    expect(postAlternates(entries, "hello-world")).toEqual({
      en: "/blog/hello-world",
      "pt-br": "/pt-br/blog/hello-world",
    });
    expect(postAlternates(entries, "ai-driven-sdlc")).toEqual({
      en: "/blog/ai-driven-sdlc",
    });
  });
});
