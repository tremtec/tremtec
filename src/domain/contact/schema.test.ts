import { describe, expect, it } from "vitest";
import { contactSchema } from "./schema";

const form = {
  name: "Ana Lima",
  email: "ana@example.com",
  message: "Quero conversar sobre um projeto",
  service: "other",
};

describe("contactSchema locale", () => {
  it("defaults to en when the field is missing", () => {
    expect(contactSchema.parse(form).locale).toBe("en");
  });

  it("accepts a known locale", () => {
    expect(contactSchema.parse({ ...form, locale: "pt-br" }).locale).toBe(
      "pt-br",
    );
  });

  it("rejects an unknown locale", () => {
    expect(contactSchema.safeParse({ ...form, locale: "fr" }).success).toBe(
      false,
    );
  });
});
