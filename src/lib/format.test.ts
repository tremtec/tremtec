import { describe, expect, it } from "vitest";
import { formatDate, formatNumber, initials, plural, timeAgo } from "./format";

const now = new Date("2026-06-15T12:00:00Z").getTime();

describe("timeAgo", () => {
  it("returns now for recent times", () => {
    expect(timeAgo("2026-06-15T11:59:40Z", "en", now)).toBe("now");
    expect(timeAgo("2026-06-15T11:59:40Z", "pt-br", now)).toBe("agora");
  });

  it("uses hours, days and months", () => {
    expect(timeAgo("2026-06-15T09:00:00Z", "en", now)).toBe("3 hours ago");
    expect(timeAgo("2026-06-15T09:00:00Z", "pt-br", now)).toBe("há 3 horas");
    expect(timeAgo("2026-06-14T12:00:00Z", "en", now)).toBe("yesterday");
    expect(timeAgo("2026-06-14T12:00:00Z", "pt-br", now)).toBe("ontem");
    expect(timeAgo("2026-04-15T12:00:00Z", "en", now)).toBe("2 months ago");
    expect(timeAgo("2026-04-15T12:00:00Z", "pt-br", now)).toBe("há 2 meses");
  });
});

describe("formatNumber", () => {
  it("groups digits by locale", () => {
    expect(formatNumber(12345, "en")).toBe("12,345");
    expect(formatNumber(12345, "pt-br")).toBe("12.345");
  });
});

describe("plural", () => {
  const forms = { one: "{count} user", other: "{count} users" };
  const ptForms = {
    zero: "{count} usuários",
    one: "{count} usuário",
    other: "{count} usuários",
  };

  it("picks the form for the count", () => {
    expect(plural(1, "en", forms)).toBe("1 user");
    expect(plural(2, "en", forms)).toBe("2 users");
    expect(plural(0, "en", forms)).toBe("0 users");
    expect(plural(1, "pt-br", ptForms)).toBe("1 usuário");
    expect(plural(2, "pt-br", ptForms)).toBe("2 usuários");
  });

  it("prefers a zero form where the dictionary gives one", () => {
    expect(plural(0, "pt-br", ptForms)).toBe("0 usuários");
  });

  it("formats the count in the locale", () => {
    expect(plural(12345, "en", forms)).toBe("12,345 users");
    expect(plural(12345, "pt-br", ptForms)).toBe("12.345 usuários");
  });
});

describe("initials", () => {
  it("takes up to two initials", () => {
    expect(initials("marco antonio souza")).toBe("MA");
    expect(initials("Ana")).toBe("A");
    expect(initials("")).toBe("?");
  });
});

describe("formatDate", () => {
  const long = { year: "numeric", month: "long", day: "numeric" } as const;

  it("formats in the page locale", () => {
    expect(formatDate("2026-03-10", "en", long)).toBe("March 10, 2026");
    expect(formatDate("2026-03-10", "pt-br", long)).toBe("10 de março de 2026");
  });

  it("accepts a Date and keeps the calendar day in UTC", () => {
    expect(formatDate(new Date("2026-03-10"), "en", long)).toBe(
      "March 10, 2026",
    );
  });

  it("defaults to the long date", () => {
    expect(formatDate("2026-03-10", "pt-br")).toBe("10 de março de 2026");
  });
});
