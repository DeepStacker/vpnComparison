// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

/**
 * NetworksHome — Astro configuration.
 *
 * Static-first VPN Intelligence Platform.
 * - site URL is sourced from env (SITE_URL) with a production default so
 *   canonical URLs, sitemap, and Open Graph stay correct across environments.
 * - Tailwind v4 is wired through the official Vite plugin (CSS-first config).
 * - MDX enables rich editorial content inside Content Collections.
 * - astro-icon + the Lucide set provide the icon system used by the UI library.
 */
const SITE_URL = process.env.SITE_URL ?? "https://networkshome.com";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: "ignore",
  output: "static",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  integrations: [
    mdx(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
    icon({
      iconDir: "src/icons",
      include: {
        lucide: ["*"],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    // Responsive images + remote optimization is handled per-image; keep sane
    // defaults so contributors don't ship oversized assets by accident.
    responsiveStyles: true,
  },
});
