import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { LOCALE_INFO } from "~/domain/shared/locale";
import { postsForLocale } from "~/lib/blog";
import { localeStaticPaths } from "~/lib/i18n";
import { blogContent } from "~/ui/contents/blog";
import { getCollection } from "astro:content";

export const getStaticPaths = localeStaticPaths;

export const GET: APIRoute = async (context) => {
  const locale = context.locals.locale;
  const posts = postsForLocale(await getCollection("blog"), locale);
  const { rss: channel } = blogContent[locale];

  return rss({
    title: channel.title,
    description: channel.description,
    site: context.site?.href || "https://tremtec.com",
    items: posts.map(({ entry, href }) => ({
      title: entry.data.title,
      pubDate: entry.data.date,
      description: entry.data.description,
      link: href,
    })),
    customData: `<language>${LOCALE_INFO[locale].tag.toLowerCase()}</language>`,
  });
};
