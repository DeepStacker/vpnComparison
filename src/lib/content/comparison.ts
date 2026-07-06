/**
 * Comparison helpers — turn objective provider records into a renderable
 * matrix. Attributes are derived from the structured data only; editorial
 * judgement belongs in the comparison article's narrative.
 */

import type { Provider } from "@/types/provider";
import { formatPrice, formatNumber } from "@/lib/utils/format";

export interface ComparisonRow {
  attribute: string;
  label: string;
  /** Per-provider display value, keyed by provider id. */
  values: Record<string, string>;
  /** Whether a higher value is better (for highlighting). */
  higherIsBetter?: boolean;
}

/** Lowest effective monthly price across a provider's plans. */
function lowestMonthly(provider: Provider): number {
  return provider.pricing.plans.reduce(
    (min, plan) => Math.min(min, plan.effectiveMonthly),
    Number.POSITIVE_INFINITY,
  );
}

/**
 * Build the canonical comparison matrix for a set of providers.
 * Rows are ordered by importance: price → privacy → network → features.
 */
export function buildComparisonMatrix(providers: Provider[]): ComparisonRow[] {
  const row = (
    attribute: string,
    label: string,
    pick: (p: Provider) => string,
    higherIsBetter?: boolean,
  ): ComparisonRow => ({
    attribute,
    label,
    higherIsBetter,
    values: Object.fromEntries(providers.map((p) => [p.id, pick(p)])),
  });

  return [
    row(
      "price",
      "Starting price",
      (p) => formatPrice(lowestMonthly(p), p.pricing.currency) + "/mo",
      false,
    ),
    row(
      "money-back",
      "Money-back guarantee",
      (p) =>
        p.pricing.moneyBackGuaranteeDays > 0
          ? `${p.pricing.moneyBackGuaranteeDays} days`
          : "None",
    ),
    row(
      "free-tier",
      "Free tier",
      (p) => (p.pricing.freeTier ? "Yes" : "No"),
    ),
    row(
      "jurisdiction",
      "Jurisdiction",
      (p) => p.jurisdiction,
    ),
    row(
      "logging",
      "Logging policy",
      (p) => p.loggingPolicy.replace(/-/g, " "),
    ),
    row(
      "audits",
      "Independent audits",
      (p) => String(p.audits.length),
      true,
    ),
    row(
      "servers",
      "Servers",
      (p) => formatNumber(p.serverNetwork.serverCount),
      true,
    ),
    row(
      "countries",
      "Countries",
      (p) => String(p.serverNetwork.countryCount),
      true,
    ),
    row(
      "protocols",
      "Protocols",
      (p) => p.protocols.length.toString(),
      true,
    ),
    row(
      "connections",
      "Simultaneous devices",
      (p) =>
        p.simultaneousConnections === 0
          ? "Unlimited"
          : String(p.simultaneousConnections),
      true,
    ),
    row(
      "kill-switch",
      "Kill switch",
      (p) => (p.killSwitch ? "Yes" : "No"),
    ),
    row(
      "split-tunneling",
      "Split tunneling",
      (p) => (p.splitTunneling ? "Yes" : "No"),
    ),
    row(
      "multi-hop",
      "Multi-hop",
      (p) => (p.multiHop ? "Yes" : "No"),
    ),
    row(
      "torrenting",
      "P2P / torrenting",
      (p) => (p.torrenting.supported ? "Yes" : "No"),
    ),
  ];
}

/** Highlight the best value in each row (mutates a copy, returns highlights). */
export function pickRowWinners(
  rows: ComparisonRow[],
  ids: string[],
): Record<string, string> {
  const winners: Record<string, string> = {};
  for (const row of rows) {
    if (row.higherIsBetter === undefined) continue;
    const firstId = ids[0];
    if (firstId === undefined) continue;
    let bestId = firstId;
    let bestVal = -Infinity;
    for (const id of ids) {
      const raw = row.values[id] ?? "";
      const numeric = parseFloat(raw.replace(/[^0-9.]/g, "")) || 0;
      const adjusted = row.higherIsBetter ? numeric : -numeric;
      if (adjusted > bestVal) {
        bestVal = adjusted;
        bestId = id;
      }
    }
    winners[row.attribute] = bestId;
  }
  return winners;
}
