import { z } from "zod";

export const LOCALES = ["en", "pt-br"] as const;
export const DEFAULT_LOCALE = "en";

export const localeEnum = z.enum(LOCALES);
export type Locale = z.infer<typeof localeEnum>;

/** `tag` is for `<html lang>`, hreflang and `Intl`; `ogLocale` for `og:locale`; `label` is the native name. */
export const LOCALE_INFO: Record<
  Locale,
  { tag: string; ogLocale: string; label: string }
> = {
  en: { tag: "en", ogLocale: "en_US", label: "English" },
  "pt-br": { tag: "pt-BR", ogLocale: "pt_BR", label: "Português" },
};

export const LOCALE_COOKIE_NAME = "tremtec_locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds
