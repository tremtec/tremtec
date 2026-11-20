import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";
import mermaid from "astro-mermaid";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_LOCALE,
  LOCALE_INFO,
  LOCALES,
} from "./src/domain/shared/locale";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const site = process.env.BASE_URL || "https://tremtec.com";

// Pages served by the Worker are not in the sitemap on their own
const customPages = LOCALES.flatMap((locale) =>
  ["/", "/login"].map(
    (page) =>
      new URL(locale === DEFAULT_LOCALE ? page : `/${locale}${page}`, site)
        .href,
  ),
);

// https://astro.build/config
export default defineConfig({
  site,
  adapter: cloudflare({
    prerenderEnvironment: "node",
  }),

  i18n: {
    locales: [...LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    routing: { prefixDefaultLocale: false },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: Object.fromEntries(
          LOCALES.map((locale) => [locale, LOCALE_INFO[locale].tag]),
        ),
      },
      customPages,
    }),
    icon(),
    mermaid(),
  ],

  fonts: [
    {
      name: "Inter",
      cssVariable: "--font-inter",
      provider: fontProviders.fontsource(),
    },
  ],

  security: {
    csp: true,
  },

  // Use Prism instead of Shiki for CSP compatibility
  markdown: {
    syntaxHighlight: "prism",
  },

  vite: {
    define: {
      // Force debug package to use browser detection
      "process.browser": true,
    },
    resolve: {
      alias: {
        // Map debug to a no-op ESM module to avoid CommonJS issues
        debug: path.resolve(__dirname, "src/lib/debug-shim.js"),
      },
    },
    plugins: [tailwindcss()],
  },
});
