/**
 * Reading-time estimation for editorial content.
 *
 * Operates on plain text or markdown; strips frontmatter and common markup
 * so the estimate reflects what a reader actually reads. Default rate is
 * 200 wpm (adult silent reading average for non-technical prose).
 */

const WORDS_PER_MINUTE = 200;

/** Strip markdown/frontmatter to a plain-text word stream. */
function toPlainText(input: string): string {
  return input
    .replace(/^---[\s\S]*?---/, "") // YAML frontmatter
    .replace(/```[\s\S]*?```/g, " ") // code fences
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → text
    .replace(/[#>*_~|-]/g, " ") // markdown symbols
    .replace(/\s+/g, " ")
    .trim();
}

/** Estimate reading time in minutes for the given content. */
export function readingTimeMinutes(content: string, wpm = WORDS_PER_MINUTE): number {
  const words = toPlainText(content).split(/\s+/).filter(Boolean).length;
  if (words === 0) return 0;
  return Math.max(1, Math.round(words / wpm));
}

/** Human label, e.g. "5 min read". */
export function readingTimeLabel(content: string): string {
  const minutes = readingTimeMinutes(content);
  return minutes === 1 ? "1 min read" : `${minutes} min read`;
}
