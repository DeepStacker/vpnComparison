/**
 * Explorer helpers — cross-reference reference data with providers.
 *
 * Every function follows the same pattern: given a reference data id, return
 * the matching providers (their full data objects) plus any per-provider
 * metadata relevant to the dimension (e.g. streaming support level).
 */

import { getCollection, type CollectionEntry } from "astro:content";

/* ------------------------------------------------------------
 * Countries
 * ------------------------------------------------------------ */
export interface ProviderCountryMatch {
  provider: CollectionEntry<"providers">["data"];
}

export async function getProvidersByCountry(
  code: string,
): Promise<ProviderCountryMatch[]> {
  const providers = await getCollection("providers");
  return providers
    .filter((p) => p.data.serverNetwork.countries.includes(code as any))
    .map((p) => ({ provider: p.data }));
}

export async function getCountryCountMap(): Promise<Map<string, number>> {
  const providers = await getCollection("providers");
  const counts = new Map<string, number>();
  for (const p of providers) {
    for (const code of p.data.serverNetwork.countries) {
      counts.set(code, (counts.get(code) ?? 0) + 1);
    }
  }
  return counts;
}

/* ------------------------------------------------------------
 * Features
 * ------------------------------------------------------------ */
export interface ProviderFeatureMatch {
  provider: CollectionEntry<"providers">["data"];
}

export async function getProvidersByFeature(
  id: string,
): Promise<ProviderFeatureMatch[]> {
  const providers = await getCollection("providers");
  return providers
    .filter((p) => p.data.features.includes(id as any))
    .map((p) => ({ provider: p.data }));
}

export async function getFeatureCountMap(): Promise<Map<string, number>> {
  const providers = await getCollection("providers");
  const counts = new Map<string, number>();
  for (const p of providers) {
    for (const id of p.data.features) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  return counts;
}

/* ------------------------------------------------------------
 * Protocols
 * ------------------------------------------------------------ */
export interface ProviderProtocolMatch {
  provider: CollectionEntry<"providers">["data"];
}

export async function getProvidersByProtocol(
  id: string,
): Promise<ProviderProtocolMatch[]> {
  const providers = await getCollection("providers");
  return providers
    .filter((p) => p.data.protocols.includes(id as any))
    .map((p) => ({ provider: p.data }));
}

export async function getProtocolCountMap(): Promise<Map<string, number>> {
  const providers = await getCollection("providers");
  const counts = new Map<string, number>();
  for (const p of providers) {
    for (const id of p.data.protocols) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  return counts;
}

/* ------------------------------------------------------------
 * Platforms
 * ------------------------------------------------------------ */
export interface ProviderPlatformMatch {
  provider: CollectionEntry<"providers">["data"];
}

export async function getProvidersByPlatform(
  id: string,
): Promise<ProviderPlatformMatch[]> {
  const providers = await getCollection("providers");
  return providers
    .filter((p) => p.data.platforms.includes(id as any))
    .map((p) => ({ provider: p.data }));
}

export async function getPlatformCountMap(): Promise<Map<string, number>> {
  const providers = await getCollection("providers");
  const counts = new Map<string, number>();
  for (const p of providers) {
    for (const id of p.data.platforms) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  return counts;
}

/* ------------------------------------------------------------
 * Streaming services
 * ------------------------------------------------------------ */
export interface ProviderStreamingMatch {
  provider: CollectionEntry<"providers">["data"];
  support: "verified" | "partial" | "unsupported" | "unknown";
  verifiedAt?: string;
}

export async function getProvidersByStreamingService(
  id: string,
): Promise<ProviderStreamingMatch[]> {
  const providers = await getCollection("providers");
  const results: ProviderStreamingMatch[] = [];
  for (const p of providers) {
    const match = p.data.streaming.find((s) => s.service === id);
    if (match && match.support !== "unsupported") {
      results.push({
        provider: p.data,
        support: match.support,
        verifiedAt: match.verifiedAt,
      });
    }
  }
  return results;
}

export async function getStreamingServiceCountMap(): Promise<
  Map<string, number>
> {
  const providers = await getCollection("providers");
  const counts = new Map<string, number>();
  for (const p of providers) {
    for (const s of p.data.streaming) {
      if (s.support !== "unsupported") {
        counts.set(s.service, (counts.get(s.service) ?? 0) + 1);
      }
    }
  }
  return counts;
}

/* ------------------------------------------------------------
 * Generic: get related guides for any entity
 * ------------------------------------------------------------ */
export async function getRelatedGuidesForEntity(
  category: string,
): Promise<CollectionEntry<"guides">[]> {
  const guides = await getCollection("guides", (g) =>
    g.data.category === category ? true : false,
  );
  return guides.sort(
    (a, b) =>
      new Date(b.data.publishedAt).getTime() -
      new Date(a.data.publishedAt).getTime(),
  );
}
