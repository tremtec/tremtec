/**
 * Blog helpers over collection entries. Pure on purpose: they take plain
 * `{ id, data }` objects, so Vitest runs them without `astro:content`.
 * Entry ids are `<locale>/<slug>` (one folder per locale in `src/content/blog`).
 */

import { DEFAULT_LOCALE, LOCALES, type Locale } from "~/domain/shared/locale";
import { localizePath } from "~/lib/i18n";

export interface BlogEntry {
  id: string;
  data: { date?: Date };
}

export interface BlogPost<E extends BlogEntry> {
  entry: E;
  slug: string;
  /** Language the post is written in. */
  locale: Locale;
  href: string;
  /** True when the page's locale has no translation and the default one is shown. */
  fallback: boolean;
}

/** Splits a collection id into its locale folder and slug. */
export const splitPostId = (id: string) => {
  const [locale, ...rest] = id.split("/");
  return { locale: LOCALES.find((l) => l === locale), slug: rest.join("/") };
};

const hrefFor = (locale: Locale, slug: string) =>
  localizePath(locale, `/blog/${slug}`);

const time = (entry: BlogEntry) => entry.data.date?.getTime() ?? 0;

/** One locale's post list: its own posts, else the default locale's, newest first. */
export function postsForLocale<E extends BlogEntry>(
  entries: E[],
  locale: Locale,
): BlogPost<E>[] {
  const bySlug = new Map<string, BlogPost<E>>();
  for (const entry of entries) {
    const { locale: entryLocale, slug } = splitPostId(entry.id);
    if (entryLocale !== locale && entryLocale !== DEFAULT_LOCALE) continue;
    if (bySlug.get(slug)?.locale === locale) continue;
    const own = entryLocale === locale;
    bySlug.set(slug, {
      entry,
      slug,
      locale: entryLocale,
      href: hrefFor(entryLocale, slug),
      fallback: !own,
    });
  }
  return [...bySlug.values()].sort((a, b) => time(b.entry) - time(a.entry));
}

/** A slug's URL in every locale where it is really translated. */
export function postAlternates(
  entries: BlogEntry[],
  slug: string,
): Partial<Record<Locale, string>> {
  const alternates: Partial<Record<Locale, string>> = {};
  for (const { id } of entries) {
    const { locale, slug: entrySlug } = splitPostId(id);
    if (locale && entrySlug === slug)
      alternates[locale] = hrefFor(locale, slug);
  }
  return alternates;
}
