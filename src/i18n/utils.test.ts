import { describe, expect, it } from "vitest";
import { ui } from "./ui";
import { useTranslations } from "./utils";

describe("useTranslations", () => {
  it("returns the pt-br value for pt-br", () => {
    expect(useTranslations("pt-br")("nav.login")).toBe(
      ui["pt-br"]["nav.login"],
    );
  });

  it("returns the en value for en", () => {
    expect(useTranslations("en")("nav.login")).toBe(ui.en["nav.login"]);
  });

  it("falls back to en for a missing or unknown locale", () => {
    expect(useTranslations(undefined)("nav.login")).toBe(ui.en["nav.login"]);
    expect(useTranslations("fr")("nav.login")).toBe(ui.en["nav.login"]);
  });
});

describe("ui", () => {
  it("has the same keys in every language", () => {
    expect(Object.keys(ui["pt-br"]).sort()).toEqual(Object.keys(ui.en).sort());
  });

  it("has only non-empty strings", () => {
    for (const lang of Object.values(ui)) {
      for (const value of Object.values(lang)) {
        expect(typeof value).toBe("string");
        expect(value.trim()).not.toBe("");
      }
    }
  });
});
