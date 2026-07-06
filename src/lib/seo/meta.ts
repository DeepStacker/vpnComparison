/**
 * SEO metadata construction.
 *
 * Given a page-level `SeoMeta` input plus site defaults, produce the derived
 * payloads consumed by the <head> SEO components: a finalized <title>, a
 * canonical absolute URL, an OpenGraph object, and a Twitter card.
 */

import { SITE, absoluteUrl } from "@/constants/site";
import type {
  OpenGraph,
  RobotsDirective,
  SeoMeta,
  TwitterCard,
} from "@/types/seo";

/** Default robots policy when a page doesn't override it. */
export const DEFAULT_ROBOTS: RobotsDirective = "index,follow";

/** Compose the document <title> with a consistent suffix. */
export function buildTitle(title: string, options?: { home?: boolean }): string {
  if (options?.home) return `${SITE.name} — ${SITE.tagline}`;
  return `${title} — ${SITE.name}`;
}

/** Resolve an absolute canonical URL from a path or absolute string. */
export function canonicalUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return absoluteUrl(path);
}

/** Resolve an absolute image URL (root-relative → absolute). */
export function resolveImageUrl(image?: string): string {
  const img = image ?? SITE.defaultOgImage;
  if (/^https?:\/\//i.test(img)) return img;
  return absoluteUrl(img);
}

/** Build the OpenGraph payload from SeoMeta. */
export function buildOpenGraph(meta: SeoMeta, path: string): OpenGraph {
  const url = canonicalUrl(path);
  return {
    type: meta.publishedAt ? "article" : "website",
    url,
    title: meta.title,
    description: meta.description,
    image: resolveImageUrl(meta.image),
    siteName: SITE.name,
    publishedTime: meta.publishedAt,
    modifiedTime: meta.updatedAt,
    authors: meta.author ? [meta.author] : undefined,
  };
}

/** Build the Twitter card payload from SeoMeta. */
export function buildTwitterCard(meta: SeoMeta): TwitterCard {
  return {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
    image: resolveImageUrl(meta.image),
    site: SITE.twitterHandle ? `@${SITE.twitterHandle}` : undefined,
  };
}

/** Normalize a raw SeoMeta input, filling defaults. */
export function normalizeSeoMeta(input: SeoMeta): SeoMeta {
  return {
    title: input.title,
    description: input.description,
    canonical: input.canonical,
    image: input.image,
    robots: input.robots ?? DEFAULT_ROBOTS,
    keywords: input.keywords,
    publishedAt: input.publishedAt,
    updatedAt: input.updatedAt,
    author: input.author,
    alternates: input.alternates,
  };
}
