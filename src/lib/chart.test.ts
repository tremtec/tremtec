import { describe, expect, it } from "vitest";
import { niceMax, smoothPath } from "./chart";

describe("smoothPath", () => {
  it("returns an empty path without points", () => {
    expect(smoothPath([])).toBe("");
  });

  it("starts with a move and curves to each point", () => {
    const d = smoothPath([
      { x: 0, y: 10 },
      { x: 10, y: 0 },
    ]);
    expect(d).toBe("M0.0,10.0 C5.0,10.0 5.0,0.0 10.0,0.0");
  });
});

describe("niceMax", () => {
  it("never goes below the minimum", () => {
    expect(niceMax(0)).toBe(4);
    expect(niceMax(1)).toBe(4);
  });

  it("rounds up to an even or round number", () => {
    expect(niceMax(7)).toBe(8);
    expect(niceMax(43)).toBe(50);
  });
});
