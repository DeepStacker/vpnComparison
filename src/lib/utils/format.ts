/**
 * Formatting helpers for prices, numbers, scores, and percentages.
 * Locale-aware via Intl where it improves consistency.
 */

/** Format a price with currency. `value` is in major units (e.g. dollars). */
export function formatPrice(value: number, currency = "USD", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Compact number formatting: 1200 → "1,200", 1500000 → "1.5M". */
export function formatNumber(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    notation: value >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Score on a 0–10 scale with one decimal, e.g. 8.5. */
export function formatScore(value: number): string {
  return value.toFixed(1);
}

/** Percentage with optional fraction digits. */
export function formatPercent(value: number, fractionDigits = 0): string {
  return `${(value * 100).toFixed(fractionDigits)}%`;
}
