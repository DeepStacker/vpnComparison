/**
 * Date helpers. All internal dates are ISO-8601 strings; these helpers
 * convert to and from human-readable forms for the UI.
 */

const LOCALE = "en-US";

/** Format an ISO date for display, e.g. "July 6, 2025". */
export function formatDate(iso: string, locale = LOCALE): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** Short format, e.g. "Jul 6, 2025". */
export function formatDateShort(iso: string, locale = LOCALE): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/** Convert a Date to a calendar ISO date (YYYY-MM-DD). */
export function toISODate(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** Compare two ISO dates chronographically (negative = a earlier). */
export function compareISODate(a: string, b: string): number {
  return new Date(a).getTime() - new Date(b).getTime();
}
