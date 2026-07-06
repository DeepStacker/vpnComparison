/**
 * Site-wide configuration — the canonical product identity.
 *
 * Keep this as the single source of truth for branding, contact, and default
 * SEO metadata. `astro.config.mjs` mirrors the production URL fallback so
 * canonical/sitemap/OG output stays consistent across environments.
 */

export const SITE = {
  /** Product name shown across the UI. */
  name: "FreeVPN4USA",
  /** Short tagline used in headers and default meta descriptions. */
  tagline: "VPN Intelligence Platform",
  /** Full description for default SEO and JSON-LD organization. */
  description:
    "FreeVPN4USA helps you choose the right VPN through transparent information, structured comparisons, educational content, and interactive decision-making tools.",
  /** Published production origin (override with SITE_URL env var at build). */
  url: process.env.SITE_URL ?? "https://freevpn4usa.com",
  /** Default site locale for <html lang> and hreflang root. */
  locale: "en",
  /** Default Open Graph image (relative to site root). */
  defaultOgImage: "/og/default.svg",
  /** Twitter handle for twitter:card metadata (no @). */
  twitterHandle: "freevpn4usa",
  /** Contact email shown in footer/legal pages. */
  contactEmail: "hello@freevpn4usa.com",
  /** Year the project was first published (for copyright). */
  foundingYear: 2025,
} as const;

/** Build the current copyright range, e.g. "2025–2026". */
export function copyrightYears(
  now: Date = new Date(),
): string {
  const start = SITE.foundingYear;
  const current = now.getUTCFullYear();
  return current > start ? `${start}–${current}` : `${start}`;
}

/** Absolute URL helper joined to the site origin. */
export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE.url).href;
}
