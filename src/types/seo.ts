/**
 * SEO metadata and structured-data (JSON-LD) types.
 *
 * These mirror the schema.org vocabulary the project emits via `JsonLd`
 * components. Keeping them typed here lets utilities produce valid payloads
 * and lets `astro:check` catch drift.
 */

import type { ISODateString } from "./common";

/* ------------------------------------------------------------
 * Page metadata (used by <head>)
 * ------------------------------------------------------------ */
export type RobotsDirective =
  | "index,follow"
  | "noindex,follow"
  | "index,nofollow"
  | "noindex,nofollow";

export interface SeoMeta {
  title: string;
  description: string;
  /** Canonical path or absolute URL. */
  canonical: string;
  /** Override the og/twitter image (absolute or root-relative). */
  image?: string;
  /** Per-page noindex/follow control. Defaults to index,follow. */
  robots?: RobotsDirective;
  /** Optional keywords (low SEO weight, kept for completeness). */
  keywords?: string[];
  /** ISO date for article pages; emits article:published_time. */
  publishedAt?: ISODateString;
  updatedAt?: ISODateString;
  /** Author name for article pages. */
  author?: string;
  /** Restrict alternate-language variants when i18n lands. */
  alternates?: { hreflang: string; href: string }[];
}

/* ------------------------------------------------------------
 * Open Graph + Twitter card payloads (derived from SeoMeta)
 * ------------------------------------------------------------ */
export interface OpenGraph {
  type: "website" | "article" | "profile";
  url: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
  publishedTime?: ISODateString;
  modifiedTime?: ISODateString;
  authors?: string[];
}

export type TwitterCardType = "summary" | "summary_large_image";

export interface TwitterCard {
  card: TwitterCardType;
  title: string;
  description: string;
  image: string;
  site?: string;
}

/* ------------------------------------------------------------
 * JSON-LD structured data
 * ------------------------------------------------------------ */
export type JsonLdType =
  | "Organization"
  | "WebSite"
  | "WebPage"
  | "BreadcrumbList"
  | "Article"
  | "FAQPage"
  | "Product"
  | "Review"
  | "AggregateRating"
  | "HowTo"
  | "TechArticle";

export interface JsonLdNode {
  "@context": "https://schema.org";
  "@type": JsonLdType | JsonLdType[];
  [key: string]: unknown;
}

/** A BreadcrumbList item. */
export interface BreadcrumbListItem {
  position: number;
  name: string;
  item: string;
}

/* ------------------------------------------------------------
 * Rating (schema.org/Rating + AggregateRating)
 * ------------------------------------------------------------ */
export interface Rating {
  "@type": "Rating";
  ratingValue: number;
  bestRating?: number;
  worstRating?: number;
}

export interface AggregateRating {
  "@type": "AggregateRating";
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}
