# Content Strategy

## Purpose

Content exists to **educate**. Never exaggerate. Never use fake urgency. Never
use manipulative affiliate tactics. Explain methodology, show evidence, be
transparent.

## The content model

| Layer      | Format | Home            | Examples                              |
| ---------- | ------ | --------------- | ------------------------------------- |
| Objective  | JSON   | `src/data/`     | Provider specs, protocols, pricing    |
| Objective  | MDX    | `src/content/providers/` | Provider factual overviews    |
| Editorial  | MDX    | `src/content/reviews/`    | Per-provider verdicts          |
| Editorial  | MDX    | `src/content/comparisons/` | Head-to-head narratives       |
| Editorial  | MDX    | `src/content/best-lists/` | Curated shortlists + criteria  |
| Editorial  | MDX    | `src/content/guides/`    | Educational explainers           |
| Editorial  | MDX    | `src/content/faqs/`      | Question/answer entries          |
| Taxonomy   | MD/MDX | `src/content/categories/` | Categories                      |
| People     | MD/MDX | `src/content/authors/`   | Reviewer profiles               |

## Editorial rules

- **Never mix objective and editorial.** Specs live in JSON; opinions live in
  MDX frontmatter/body. A review references a provider; it never duplicates
  specs.
- **Every score is derived, not invented.** `ReviewScores.overall` must be
  explainable by the sub-scores; the weighting is documented in the review's
  `methodology`.
- **Every claim has a source.** Provider records may include `sources[]`
  (URLs) and `audits[]` (independent auditor, date, scope, report URL).
- **Verdicts use a fixed vocabulary**: `recommended` | `conditional` |
  `not-recommended`.
- **Best lists require explicit `criteria[]`.** No "top 10" without saying why.
- **Be transparent about monetization.** `affiliateUrl` is optional and
  disclosed via the Affiliate Disclosure page; `websiteUrl` is always the
  non-affiliate informational link.

## Reading experience

- Long-form uses `DocumentationLayout`/`ArticleLayout` with the `prose` measure
  (768px) and an optional sticky TOC.
- Reading time is **computed** (`readingTimeMinutes` in
  `src/lib/utils/reading-time.ts`), never hand-set.
- Callouts (`<Callout tone="note|tip|warning|danger">`) annotate prose without
  asserting false urgency.

## Internal linking

- Route builders in `src/lib/content/links.ts` (`providerHref`, `reviewHref`,
  `comparisonHref`, `guideHref`, …) — change routes in one place.
- Related content via `src/lib/content/related.ts` (shared taxonomy + explicit
  frontmatter references; explicit wins, taxonomy fills gaps).
- No dead ends: every leaf links to related content and back to its index.

## Authorship

- Every editorial entry references an `authors` entry (`reviewer`/`author`).
- Authors carry `role`, `bio`, optional `avatar`, and `social` links, rendered
  in `ArticleLayout`'s byline.
