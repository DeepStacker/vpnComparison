/**
 * String + DOM class utilities.
 */

/** Lowercase, kebab-case, accent-folded slug from arbitrary input. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Title-case a slug or dashed string ("best-vpns" → "Best VPNs"). */
export function humanize(input: string): string {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Conditional class joiner. Filters falsy values and joins with spaces.
 * Intentionally dependency-free; authors resolve conflicting Tailwind
 * utilities manually to keep the bundle minimal.
 */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Truncate text to a max length on a word boundary, adding an ellipsis. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  return `${slice.slice(0, lastSpace > 0 ? lastSpace : slice.length)}…`;
}
