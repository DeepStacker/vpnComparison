/**
 * Search index builder.
 *
 * Produces a flat, lightweight index of all public, indexable content. The
 * index can be consumed by a client-side search (Fuse.js) or merged into
 * Pagefind's output. Kept as a pure builder so it can run at build time and
 * be serialized to `/public/search-index.json` by an endpoint.
 */

import { getCollection } from "astro:content";
import { reviewHref, providerHref, guideHref, bestListHref, comparisonArticleHref } from "./links";

export interface SearchIndexEntry {
  title: string;
  description: string;
  href: string;
  /** Section the result belongs to, for grouping in the UI. */
  section: "providers" | "reviews" | "guides" | "best-lists" | "comparisons";
  /** Optional tags/keywords to improve recall. */
  keywords?: string[];
}

/** Build the complete search index across indexed collections. */
export async function buildSearchIndex(): Promise<SearchIndexEntry[]> {
  const [providers, reviews, guides, bestLists, comparisons] = await Promise.all([
    getCollection("providers"),
    getCollection("reviews"),
    getCollection("guides"),
    getCollection("best-lists"),
    getCollection("comparisons"),
  ]);

  const toEntry = (
    section: SearchIndexEntry["section"],
    title: string,
    description: string,
    href: string,
    keywords?: string[],
  ): SearchIndexEntry => ({ title, description, href, section, keywords });

  return [
    ...providers.map((p) =>
      toEntry(
        "providers",
        p.data.name,
        p.data.tagline,
        providerHref(p.data.slug),
        [p.data.jurisdiction, p.data.loggingPolicy],
      ),
    ),
    ...reviews.map((r) =>
      // Provider references resolve to { id, collection }; provider ids are
      // kebab slugs by convention, so they double as route slugs here.
      toEntry(
        "reviews",
        r.data.title,
        r.data.summary,
        reviewHref(r.data.provider.id),
        [r.data.verdict.recommendation],
      ),
    ),
    ...guides.map((g) =>
      toEntry("guides", g.data.title, g.data.summary, guideHref(g.id)),
    ),
    ...bestLists.map((b) =>
      toEntry("best-lists", b.data.title, b.data.summary, bestListHref(b.id)),
    ),
    ...comparisons.map((c) =>
      toEntry(
        "comparisons",
        c.data.title,
        c.data.summary,
        comparisonArticleHref(c.id),
      ),
    ),
  ];
}
