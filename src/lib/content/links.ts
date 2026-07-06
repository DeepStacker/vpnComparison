/**
 * Internal linking helpers.
 *
 * Centralizing URL construction means route changes happen in one place.
 * Every helper returns a root-relative href with a trailing slash for
 * consistency with the site's routing convention.
 */

import { slugify } from "@/lib/utils/string";

const slash = (href: string): string => (href.endsWith("/") ? href : `${href}/`);

/** Provider detail page. */
export function providerHref(slug: string): string {
  return slash(`/providers/${slugify(slug)}`);
}

/** Provider editorial review page. */
export function reviewHref(providerSlug: string): string {
  return slash(`/providers/${slugify(providerSlug)}/review`);
}

/** Comparison page for a set of provider slugs. */
export function comparisonHref(...providerSlugs: string[]): string {
  const ids = providerSlugs.map(slugify).join("-vs-");
  return slash(`/compare/${ids}`);
}

/** Editorial comparison article page. */
export function comparisonArticleHref(slug: string): string {
  return slash(`/compare/${slugify(slug)}`);
}

/** Best-list page by use-case slug. */
export function bestListHref(slug: string): string {
  return slash(`/best/${slugify(slug)}`);
}

/** Guide page. */
export function guideHref(slug: string): string {
  return slash(`/guides/${slugify(slug)}`);
}

/** Category landing page. */
export function categoryHref(slug: string): string {
  return slash(`/categories/${slugify(slug)}`);
}

/** Protocol landing page. */
export function protocolHref(slug: string): string {
  return slash(`/protocols/${slugify(slug)}`);
}

/** Platform landing page. */
export function platformHref(slug: string): string {
  return slash(`/platforms/${slugify(slug)}`);
}

/** Country landing page. */
export function countryHref(slug: string): string {
  return slash(`/countries/${slugify(slug)}`);
}

/** Streaming service landing page. */
export function streamingHref(slug: string): string {
  return slash(`/streaming/${slugify(slug)}`);
}

/** Feature landing page. */
export function featureHref(slug: string): string {
  return slash(`/features/${slugify(slug)}`);
}

/** Author page. */
export function authorHref(slug: string): string {
  return slash(`/authors/${slugify(slug)}`);
}

/** FAQ anchor (single FAQ, scoped under the FAQ index). */
export function faqHref(slug: string): string {
  return slash(`/faq/#${slugify(slug)}`);
}
