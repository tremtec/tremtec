import { describe, expect, it } from "vitest";
import { formatDate, initials, timeAgo } from "./format";

const now = new Date("2026-06-15T12:00:00Z").getTime();

describe("timeAgo", () => {
  it("returns just now for recent times", () => {
    expect(timeAgo("2026-06-15T11:59:40Z", now)).toBe("just now");
  });

  it("uses hours, days and months", () => {
    expect(timeAgo("2026-06-15T09:00:00Z", now)).toBe("3 hours ago");
    expect(timeAgo("2026-06-14T12:00:00Z", now)).toBe("yesterday");
    expect(timeAgo("2026-04-15T12:00:00Z", now)).toBe("2 months ago");
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
