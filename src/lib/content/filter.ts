/**
 * Provider filtering helpers.
 *
 * Pure functions over already-loaded provider records, safe to run during
 * static generation. The filter shape mirrors `ProviderFilter` and returns
 * both the filtered set and a human-readable description for UI display.
 */

import type { Provider, ProviderFilter } from "@/types/provider";

/** Apply a filter to a set of providers. */
export function filterProviders(
  providers: Provider[],
  filter: ProviderFilter,
): Provider[] {
  return providers.filter((p) => {
    if (filter.freeTierOnly && !p.pricing.freeTier) return false;

    if (filter.loggingPolicy && !filter.loggingPolicy.includes(p.loggingPolicy)) {
      return false;
    }

    if (
      filter.maxMonthlyPrice !== undefined &&
      lowestMonthly(p) > filter.maxMonthlyPrice
    ) {
      return false;
    }

    if (filter.featureIds) {
      const hasAll = filter.featureIds.every((id) => p.features.includes(id));
      if (!hasAll) return false;
    }

    if (filter.protocolIds) {
      const hasAll = filter.protocolIds.every((id) => p.protocols.includes(id));
      if (!hasAll) return false;
    }

    if (filter.platformIds) {
      const hasAll = filter.platformIds.every((id) => p.platforms.includes(id));
      if (!hasAll) return false;
    }

    if (filter.streamingServiceId) {
      const match = p.streaming.find((s) => s.service === filter.streamingServiceId);
      if (!match || match.support === "unsupported") return false;
    }

    return true;
  });
}

/** Lowest effective monthly price for a provider. */
function lowestMonthly(p: Provider): number {
  return p.pricing.plans.reduce(
    (min, plan) => Math.min(min, plan.effectiveMonthly),
    Number.POSITIVE_INFINITY,
  );
}

/** Build a human description of the active filter, e.g. "Free tier • No-logs". */
export function describeFilter(filter: ProviderFilter): string {
  const parts: string[] = [];
  if (filter.freeTierOnly) parts.push("Free tier");
  if (filter.loggingPolicy?.length) {
    parts.push(filter.loggingPolicy.map((p) => p.replace(/-/g, " ")).join(" / "));
  }
  if (filter.maxMonthlyPrice !== undefined) {
    parts.push(`≤ $${filter.maxMonthlyPrice}/mo`);
  }
  if (filter.featureIds?.length) parts.push(`${filter.featureIds.length} features`);
  if (filter.protocolIds?.length) parts.push(`${filter.protocolIds.length} protocols`);
  if (filter.platformIds?.length) parts.push(`${filter.platformIds.length} platforms`);
  if (filter.streamingServiceId) parts.push("Streaming-friendly");
  return parts.length ? parts.join(" • ") : "All providers";
}
