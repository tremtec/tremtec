import { LOCALE_INFO, type Locale } from "~/domain/shared/locale";

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
];

/** "3 hours ago", "yesterday", "now", in the given locale. */
export function timeAgo(iso: string, locale: Locale, now = Date.now()): string {
  const relative = new Intl.RelativeTimeFormat(LOCALE_INFO[locale].tag, {
    numeric: "auto",
  });
  const diff = new Date(iso).getTime() - now;
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms)
      return relative.format(Math.round(diff / ms), unit);
  }
  return relative.format(0, "second");
}

export function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

const LONG_DATE: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

/**
 * Formats a date for a locale, as a long date unless `options` say otherwise.
 * Uses UTC so a date-only value keeps its calendar day on any server.
 */
export function formatDate(
  value: Date | string | number,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = LONG_DATE,
): string {
  return new Intl.DateTimeFormat(LOCALE_INFO[locale].tag, {
    timeZone: "UTC",
    ...options,
  }).format(new Date(value));
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_INFO[locale].tag).format(value);
}

/** Plural forms of one phrase. `{count}` is replaced by the formatted count. */
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & {
  other: string;
};

/**
 * Picks the phrase for `count` with `Intl.PluralRules` and fills in `{count}`.
 * A `zero` form wins for 0, for languages whose rules treat 0 like 1.
 */
export function plural(
  count: number,
  locale: Locale,
  forms: PluralForms,
): string {
  const category = new Intl.PluralRules(LOCALE_INFO[locale].tag).select(count);
  const form = (count === 0 && forms.zero) || forms[category] || forms.other;
  return form.replace("{count}", formatNumber(count, locale));
}
