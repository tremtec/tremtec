/**
 * Locale helpers shared by Astro pages, middleware and Hono routes.
 * Pure on purpose: no `astro:i18n` import, so Vitest and Hono can use them.
 */

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
  LOCALES,
  type Locale,
  localeEnum,
} from "~/domain/shared/locale";

/** One value per locale, so a missing translation fails type checking. */
export type Dictionary<T> = Readonly<Record<Locale, T>>;

const isDefault = (locale: Locale) => locale === DEFAULT_LOCALE;

const nonDefaultLocale = (segment: string | undefined): Locale | null =>
  LOCALES.find((l) => !isDefault(l) && l === segment) ?? null;

/** Anchors, `mailto:` and absolute URLs are not site paths. */
const isExternal = (path: string) =>
  path.startsWith("#") ||
  path.startsWith("//") ||
  /^[a-z][a-z0-9+.-]*:/i.test(path);

/** Prefixes a site path with the locale, the default locale has no prefix. */
export function localizePath(locale: Locale, path: string): string {
  if (isDefault(locale) || isExternal(path)) return path;
  return `/${locale}${path}`;
}

/** Splits `/pt-br/login` into the locale and the unprefixed `/login`. */
export function splitLocale(pathname: string): {
  locale: Locale;
  path: string;
} {
  const [, first = "", ...rest] = pathname.split("/");
  const locale = nonDefaultLocale(first);
  if (!locale) return { locale: DEFAULT_LOCALE, path: pathname };
  return { locale, path: `/${rest.join("/")}` };
}

/** Reads the `[...locale]` route param: `null` means the URL is not a locale URL (404). */
export function parseLocaleParam(param: string | undefined): Locale | null {
  if (param === undefined) return DEFAULT_LOCALE;
  return nonDefaultLocale(param);
}

/** `getStaticPaths` for pages under `[...locale]`. */
export function localeStaticPaths() {
  return LOCALES.map((locale) => ({
    params: { locale: isDefault(locale) ? undefined : locale },
  }));
}

/**
 * Picks a locale from an `Accept-Language` header: highest q first, an exact
 * code before the primary subtag (`pt-PT` matches `pt-br`).
 */
export function negotiateLocale(
  acceptLanguage: string | null | undefined,
): Locale | null {
  if (!acceptLanguage) return null;

  const preferences = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim().match(/^q=([\d.]+)$/i)?.[1])
        .find((v) => v !== undefined);
      return {
        tag: tag.trim().toLowerCase(),
        q: q === undefined ? 1 : Number(q),
      };
    })
    .filter(({ tag, q }) => tag !== "" && tag !== "*" && q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferences) {
    const exact = LOCALES.find((l) => l === tag);
    if (exact) return exact;

    const primary = tag.split("-")[0];
    const match = LOCALES.find((l) => l.split("-")[0] === primary);
    if (match) return match;
  }
  return null;
}

const parseCookie = (cookie: string | null | undefined): Locale | null => {
  const parsed = localeEnum.safeParse(cookie);
  return parsed.success ? parsed.data : null;
};

/** Locale outside the URL: user, then cookie, then `Accept-Language`, then the default. */
export function resolveLocale(input: {
  user?: { locale: Locale | null } | null;
  cookie?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  return (
    input.user?.locale ??
    parseCookie(input.cookie) ??
    negotiateLocale(input.acceptLanguage) ??
    DEFAULT_LOCALE
  );
}

/**
 * Where a first-time visitor of `/` should go. Any locale cookie means the
 * visitor already chose, so only a cookie-less `/` with a non-default
 * preference redirects.
 */
export function homeRedirect(
  pathname: string,
  cookie: string | null | undefined,
  acceptLanguage: string | null | undefined,
): string | null {
  if (pathname !== "/" || cookie != null) return null;

  const locale = negotiateLocale(acceptLanguage);
  return locale && !isDefault(locale) ? localizePath(locale, "/") : null;
}

/** Cookie options for Astro and Hono. Readable by scripts so the switcher can overwrite it. */
export function localeCookieOptions() {
  return {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax" as const,
    httpOnly: false,
    secure: Boolean(import.meta.env.PROD),
  };
}

/** The same cookie serialised for `document.cookie`. */
export function localeCookieString(locale: Locale): string {
  const { path, maxAge, secure } = localeCookieOptions();
  return `${LOCALE_COOKIE_NAME}=${locale}; Path=${path}; Max-Age=${maxAge}; SameSite=Lax${secure ? "; Secure" : ""}`;
}
