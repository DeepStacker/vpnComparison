/**
 * Editorial content domain — OPINION and analysis.
 *
 * These types model the human-judgment layer: scores, verdicts, pros/cons,
 * methodology, and educational writing. They reference the objective
 * Provider records by id but never duplicate the structured specs.
 */

import type { ID, ISODateString, Maybe, Slug, URLString } from "./common";
import type { ProviderFilter } from "./provider";

/* ------------------------------------------------------------
 * Authors
 * ------------------------------------------------------------ */
export interface AuthorSocial {
  website?: URLString;
  twitter?: string;
  mastodon?: URLString;
  linkedin?: URLString;
  github?: string;
}

export interface Author {
  id: ID;
  slug: Slug;
  name: string;
  role: string;
  /** One-paragraph bio. */
  bio: string;
  avatar?: string;
  social?: AuthorSocial;
}

/* ------------------------------------------------------------
 * Scores & verdicts
 * ------------------------------------------------------------ */
/**
 * Sub-scores are 0–10. The overall score is derived, never invented, and the
 * weighting must be documented in the review's methodology section.
 */
export interface ReviewScores {
  privacy: number;
  security: number;
  performance: number;
  streaming: number;
  torrenting: number;
  easeOfUse: number;
  value: number;
  /** Computed overall (0–10). */
  overall: number;
}

export interface Verdict {
  /** One-sentence headline verdict. */
  headline: string;
  /** Longer paragraph explaining the call. */
  summary: string;
  /** "Recommended" | "Conditional" | "Not recommended". */
  recommendation: "recommended" | "conditional" | "not-recommended";
}

/* ------------------------------------------------------------
 * Review (per-provider editorial)
 * ------------------------------------------------------------ */
export interface Review {
  id: ID;
  slug: Slug;
  /** Provider this review covers. */
  providerId: ID;
  title: string;
  /** Short SEO-ready summary (~150 chars). */
  summary: string;
  reviewerId: ID;
  scores: ReviewScores;
  verdict: Verdict;
  pros: string[];
  cons: string[];
  /** Which tests were run and how (links to methodology). */
  methodology: string;
  /** ISO date the hands-on testing was performed. */
  testDate: ISODateString;
  publishedAt: ISODateString;
  updatedAt: Maybe<ISODateString>;
}

/* ------------------------------------------------------------
 * Comparison (multi-provider editorial)
 * ------------------------------------------------------------ */
export interface ComparisonSection {
  id: string;
  title: string;
  /** Markdown/MDX body for the section narrative. */
  body: string;
  /** Attribute ids rendered in the structured table for this section. */
  attributes?: string[];
}

export interface Comparison {
  id: ID;
  slug: Slug;
  title: string;
  summary: string;
  /** Two or more providers being compared. */
  providerIds: ID[];
  /** Optional editor's pick among the compared providers. */
  winnerId?: ID;
  sections: ComparisonSection[];
  authorId: ID;
  publishedAt: ISODateString;
  updatedAt: Maybe<ISODateString>;
}

/* ------------------------------------------------------------
 * Best lists (curated shortlists by use case)
 * ------------------------------------------------------------ */
export interface BestListEntry {
  providerId: ID;
  /** Why this provider made the list, in this specific context. */
  rationale: string;
  rank: number;
}

export interface BestList {
  id: ID;
  slug: Slug;
  title: string;
  summary: string;
  /** Use-case category slug (e.g. "streaming", "privacy", "budget"). */
  category: Slug;
  /** Transparent selection criteria. */
  criteria: string[];
  entries: BestListEntry[];
  authorId: ID;
  publishedAt: ISODateString;
  updatedAt: Maybe<ISODateString>;
}

/* ------------------------------------------------------------
 * Guides (educational explainers)
 * ------------------------------------------------------------ */
export type GuideDifficulty = "beginner" | "intermediate" | "advanced";

export interface Guide {
  id: ID;
  slug: Slug;
  title: string;
  summary: string;
  category: Slug;
  difficulty: GuideDifficulty;
  /** Estimated reading time in minutes (computed, not hand-set). */
  readingTimeMinutes?: number;
  authorId: ID;
  publishedAt: ISODateString;
  updatedAt: Maybe<ISODateString>;
  /** Related guides/provider ids for internal linking. */
  relatedGuideIds?: ID[];
  relatedProviderIds?: ID[];
}

/* ------------------------------------------------------------
 * Categories (taxonomy shared by guides & best lists)
 * ------------------------------------------------------------ */
export interface Category {
  id: ID;
  slug: Slug;
  name: string;
  description: string;
  /** Optional parent category for a nested taxonomy. */
  parentId?: Maybe<ID>;
}

/* ------------------------------------------------------------
 * FAQs
 * ------------------------------------------------------------ */
export interface FAQ {
  id: ID;
  slug: Slug;
  question: string;
  /** Plain-text or MDX answer. */
  answer: string;
  category: Slug;
  /** Optional context this FAQ is scoped to. */
  relatedProviderId?: Maybe<ID>;
  relatedGuideId?: Maybe<ID>;
}

/* ------------------------------------------------------------
 * Tooling payload returned by filtering/comparison helpers
 * ------------------------------------------------------------ */
export interface FilteredProviderResult {
  providers: ID[];
  /** Human-readable description of the active filter for UI display. */
  description: string;
  filter: ProviderFilter;
}
