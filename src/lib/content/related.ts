/**
 * Related-content helpers.
 *
 * Relations are derived from shared taxonomy (category) and explicit
 * frontmatter references (`relatedGuides`, `relatedProviders`). Explicit
 * references always win; taxonomy similarity fills remaining slots so the
 * UI never shows empty "related" sections.
 */

import { getCollection, type CollectionEntry } from "astro:content";
import { compareISODate } from "@/lib/utils/date";

/** Guides sharing a category with the source, newest first, excluding self. */
export async function getRelatedGuides(
  sourceId: string,
  category: string,
  limit = 3,
): Promise<CollectionEntry<"guides">[]> {
  const guides = await getCollection("guides", (entry) => {
    return entry.id !== sourceId && entry.data.category === category;
  });
  return guides
    .sort((a, b) => compareISODate(b.data.publishedAt, a.data.publishedAt))
    .slice(0, limit);
}

/** Reviews for a given provider id, newest first. */
export async function getReviewsForProvider(
  providerId: string,
): Promise<CollectionEntry<"reviews">[]> {
  const reviews = await getCollection("reviews");
  return reviews
    .filter((entry) => entry.data.provider.id === providerId)
    .sort((a, b) => compareISODate(b.data.publishedAt, a.data.publishedAt));
}

/** Best lists that include a given provider. */
export async function getBestListsForProvider(
  providerId: string,
): Promise<CollectionEntry<"best-lists">[]> {
  const lists = await getCollection("best-lists");
  return lists.filter((entry) =>
    entry.data.entries.some((e) => e.provider.id === providerId),
  );
}

/** Comparisons that include a given provider. */
export async function getComparisonsForProvider(
  providerId: string,
): Promise<CollectionEntry<"comparisons">[]> {
  const comparisons = await getCollection("comparisons");
  return comparisons.filter((entry) =>
    entry.data.providers.some((p) => p.id === providerId),
  );
}
