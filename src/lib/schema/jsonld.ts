/**
 * Structured-data (JSON-LD) generators.
 *
 * Each function returns a schema.org node ready to serialize into a
 * <script type="application/ld+json"> tag. Nodes are typed via `JsonLdNode`
 * so `astro:check` catches schema drift. Keep payloads minimal and accurate —
 * never invent values (e.g. aggregate ratings) the content doesn't have.
 */

import { SITE, absoluteUrl } from "@/constants/site";
import type { Breadcrumb } from "@/types/site";
import type {
  AggregateRating,
  JsonLdNode,
  OpenGraph,
  Rating,
} from "@/types/seo";

/* ------------------------------------------------------------
 * Organization + WebSite (site-wide, emitted on every page)
 * ------------------------------------------------------------ */
export function organizationJsonLd(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    logo: absoluteUrl("/og/logo.svg"),
    sameAs: [],
  };
}

export function websiteJsonLd(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: SITE.locale,
  };
}

/* ------------------------------------------------------------
 * WebPage + BreadcrumbList
 * ------------------------------------------------------------ */
export function webPageJsonLd(
  path: string,
  title: string,
  description: string,
): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(path),
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
    inLanguage: SITE.locale,
  };
}

export function breadcrumbListJsonLd(crumbs: Breadcrumb[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.href),
    })),
  };
}

/* ------------------------------------------------------------
 * Article / TechArticle
 * ------------------------------------------------------------ */
export interface ArticleLdInput {
  path: string;
  title: string;
  description: string;
  og: OpenGraph;
  authorName: string;
  section?: string;
}

export function articleJsonLd(input: ArticleLdInput): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    image: input.og.image,
    datePublished: input.og.publishedTime,
    dateModified: input.og.modifiedTime ?? input.og.publishedTime,
    inLanguage: SITE.locale,
    author: { "@type": "Person", name: input.authorName },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    ...(input.section ? { articleSection: input.section } : {}),
  };
}

/* ------------------------------------------------------------
 * FAQ
 * ------------------------------------------------------------ */
export interface FaqLdEntry {
  question: string;
  answer: string;
}

export function faqPageJsonLd(entries: FaqLdEntry[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

/* ------------------------------------------------------------
 * Product + Review + AggregateRating (provider pages)
 * ------------------------------------------------------------ */
export interface ProductLdInput {
  name: string;
  description: string;
  brand: string;
  url: string;
  image?: string;
  rating?: AggregateRating;
  review?: {
    authorName: string;
    datePublished: string;
    reviewRating: Rating;
    body: string;
  };
}

export function productJsonLd(input: ProductLdInput): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    brand: { "@type": "Brand", name: input.brand },
    url: input.url,
    ...(input.image ? { image: input.image } : {}),
    ...(input.rating ? { aggregateRating: input.rating } : {}),
    ...(input.review
      ? {
          review: {
            "@type": "Review",
            author: { "@type": "Person", name: input.review.authorName },
            datePublished: input.review.datePublished,
            reviewRating: input.review.reviewRating,
            reviewBody: input.review.body,
          },
        }
      : {}),
  };
}

/** Build a schema.org/Rating node from a 0–10 score. */
export function ratingJsonLd(value: number, best = 10): Rating {
  return { "@type": "Rating", ratingValue: value, bestRating: best, worstRating: 0 };
}

/** Build an AggregateRating node. */
export function aggregateRatingJsonLd(
  value: number,
  reviewCount: number,
  best = 10,
): AggregateRating {
  return {
    "@type": "AggregateRating",
    ratingValue: value,
    reviewCount,
    bestRating: best,
    worstRating: 0,
  };
}

/* ------------------------------------------------------------
 * HowTo (guides that are step-by-step)
 * ------------------------------------------------------------ */
export interface HowToStep {
  name: string;
  text: string;
}

export function howToJsonLd(name: string, description: string, steps: HowToStep[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

/** Serialize a node for embedding. Stable key order, no extra whitespace. */
export function serializeJsonLd(node: JsonLdNode): string {
  return JSON.stringify(node);
}
