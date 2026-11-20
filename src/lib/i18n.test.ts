import { describe, expect, it } from "vitest";
import {
  homeRedirect,
  localeCookieOptions,
  localeCookieString,
  localeStaticPaths,
  localizePath,
  negotiateLocale,
  parseLocaleParam,
  resolveLocale,
  splitLocale,
} from "./i18n";

describe("localizePath", () => {
  it("leaves the default locale unchanged", () => {
    expect(localizePath("en", "/")).toBe("/");
    expect(localizePath("en", "/services")).toBe("/services");
  });

  it("prefixes other locales", () => {
    expect(localizePath("pt-br", "/")).toBe("/pt-br/");
    expect(localizePath("pt-br", "/services")).toBe("/pt-br/services");
  });

  it("leaves anchors, mailto and absolute URLs unchanged", () => {
    for (const locale of ["en", "pt-br"] as const) {
      expect(localizePath(locale, "#about")).toBe("#about");
      expect(localizePath(locale, "mailto:hello@tremtec.com")).toBe(
        "mailto:hello@tremtec.com",
      );
      expect(localizePath(locale, "https://example.com/a")).toBe(
        "https://example.com/a",
      );
    }
  });
});

describe("splitLocale", () => {
  it("reads the locale from the first segment", () => {
    expect(splitLocale("/pt-br/login")).toEqual({
      locale: "pt-br",
      path: "/login",
    });
    expect(splitLocale("/pt-br")).toEqual({ locale: "pt-br", path: "/" });
    expect(splitLocale("/pt-br/")).toEqual({ locale: "pt-br", path: "/" });
  });

  it("defaults to en", () => {
    expect(splitLocale("/login")).toEqual({ locale: "en", path: "/login" });
    expect(splitLocale("/pt-brx")).toEqual({ locale: "en", path: "/pt-brx" });
    expect(splitLocale("/")).toEqual({ locale: "en", path: "/" });
  });
});

describe("parseLocaleParam", () => {
  it("maps the route param to a locale", () => {
    expect(parseLocaleParam(undefined)).toBe("en");
    expect(parseLocaleParam("pt-br")).toBe("pt-br");
  });

  it("rejects the default locale prefix and unknown values", () => {
    expect(parseLocaleParam("en")).toBeNull();
    expect(parseLocaleParam("fr")).toBeNull();
    expect(parseLocaleParam("pt-br/x")).toBeNull();
  });
});

describe("localeStaticPaths", () => {
  it("lists the unprefixed default and every other locale", () => {
    expect(localeStaticPaths()).toEqual([
      { params: { locale: undefined } },
      { params: { locale: "pt-br" } },
    ]);
  });
});

describe("negotiateLocale", () => {
  it("honours q-values", () => {
    expect(negotiateLocale("pt-BR,pt;q=0.9,en;q=0.8")).toBe("pt-br");
    expect(negotiateLocale("en-US,en;q=0.9,pt;q=0.8")).toBe("en");
    expect(negotiateLocale("en;q=0.5, pt;q=0.9")).toBe("pt-br");
  });

  it("falls back to the primary subtag", () => {
    expect(negotiateLocale("pt-PT")).toBe("pt-br");
  });

  it("returns null when nothing matches", () => {
    expect(negotiateLocale("fr-FR")).toBeNull();
    expect(negotiateLocale("")).toBeNull();
    expect(negotiateLocale(undefined)).toBeNull();
    expect(negotiateLocale("*")).toBeNull();
    expect(negotiateLocale("pt;q=0, fr")).toBeNull();
  });
});

describe("resolveLocale", () => {
  it("prefers the user, then the cookie, then the header, then en", () => {
    const all = { cookie: "en", acceptLanguage: "pt-BR" };
    expect(resolveLocale({ user: { locale: "pt-br" }, ...all })).toBe("pt-br");
    expect(resolveLocale({ user: { locale: null }, ...all })).toBe("en");
    expect(resolveLocale({ cookie: "pt-br", acceptLanguage: "en" })).toBe(
      "pt-br",
    );
    expect(resolveLocale({ acceptLanguage: "pt-BR" })).toBe("pt-br");
    expect(resolveLocale({})).toBe("en");
  });

  it("ignores an invalid cookie", () => {
    expect(resolveLocale({ cookie: "fr", acceptLanguage: "pt-BR" })).toBe(
      "pt-br",
    );
    expect(resolveLocale({ cookie: "fr" })).toBe("en");
  });
});

describe("homeRedirect", () => {
  const pt = "pt-BR,pt;q=0.9,en;q=0.8";

  it("redirects / on a first visit that prefers Portuguese", () => {
    expect(homeRedirect("/", undefined, pt)).toBe("/pt-br/");
  });

  it("does not redirect with any locale cookie", () => {
    expect(homeRedirect("/", "en", pt)).toBeNull();
    expect(homeRedirect("/", "pt-br", pt)).toBeNull();
    expect(homeRedirect("/", "junk", pt)).toBeNull();
  });

  it("does not redirect other paths", () => {
    expect(homeRedirect("/services", undefined, pt)).toBeNull();
    expect(homeRedirect("/pt-br/", undefined, pt)).toBeNull();
  });

  it("does not redirect English or unknown preferences", () => {
    expect(homeRedirect("/", undefined, "en-US,en;q=0.9")).toBeNull();
    expect(homeRedirect("/", undefined, "fr-FR")).toBeNull();
    expect(homeRedirect("/", undefined, undefined)).toBeNull();
  });
});

describe("locale cookie", () => {
  it("has the options both runtimes share", () => {
    expect(localeCookieOptions()).toEqual({
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
      httpOnly: false,
      secure: false,
    });
  });

  it("serialises for document.cookie", () => {
    expect(localeCookieString("pt-br")).toBe(
      "tremtec_locale=pt-br; Path=/; Max-Age=31536000; SameSite=Lax",
    );
  });
});
