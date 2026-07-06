/**
 * NetworksHome — Content Collections configuration.
 *
 * Objective vs editorial separation is enforced at the collection level:
 *   - `providers`            → JSON structured specs (objective facts)
 *   - `provider-overviews`   → MDX factual narrative (objective, long-form)
 *   - `reviews`              → MDX editorial verdicts per provider
 *   - `comparisons`          → MDX editorial head-to-heads
 *   - `best-lists`           → MDX editorial curated shortlists
 *   - `guides`               → MDX educational explainers
 *   - `categories`           → MDX taxonomy nodes
 *   - `faqs`                 → MDX question/answer entries
 *   - `authors`              → MDX contributor profiles
 *
 * Cross references (e.g. a review → its provider) use `reference()` so broken
 * links fail the build instead of shipping to users.
 */

import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

import {
  auditRecordSchema,
  authorSocialSchema,
  countryCodeSchema,
  idSchema,
  isoDateSchema,
  nonEmptyString,
  pricePlanSchema,
  reviewScoresSchema,
  slugSchema,
  stringList,
  urlSchema,
  verdictSchema,
} from "@/schemas/common";

/* ============================================================
 * Objective structured data (JSON)
 * ============================================================ */
const providers = defineCollection({
  loader: glob({ base: "./src/data/providers", pattern: "**/*.json" }),
  schema: z.object({
    id: idSchema,
    slug: slugSchema,
    name: nonEmptyString,
    tagline: nonEmptyString,
    logo: z.string().optional(),
    websiteUrl: urlSchema,
    affiliateUrl: urlSchema.optional(),
    foundedYear: z.number().int().min(1990),
    jurisdiction: countryCodeSchema,
    hqCountry: countryCodeSchema,
    serverNetwork: z.object({
      serverCount: z.number().int().nonnegative(),
      countryCount: z.number().int().nonnegative(),
      countries: z.array(countryCodeSchema),
      virtualLocations: z.boolean(),
    }),
    protocols: z.array(idSchema),
    platforms: z.array(idSchema),
    features: z.array(idSchema),
    streaming: z.array(
      z.object({
        service: idSchema,
        support: z.enum(["verified", "partial", "unsupported", "unknown"]),
        verifiedAt: isoDateSchema.optional(),
      }),
    ),
    torrenting: z.object({
      supported: z.boolean(),
      labeledServers: z.boolean(),
      rating: z.number().min(0).max(10).optional(),
    }),
    loggingPolicy: z.enum([
      "no-logs",
      "minimal",
      "connection-only",
      "usage-only",
      "unknown",
    ]),
    killSwitch: z.boolean(),
    splitTunneling: z.boolean(),
    adBlocker: z.boolean(),
    multiHop: z.boolean(),
    dedicatedIp: z.boolean(),
    simultaneousConnections: z.number().int().nonnegative(),
    pricing: z.object({
      currency: z.string().min(1).default("USD"),
      plans: z.array(pricePlanSchema),
      moneyBackGuaranteeDays: z.number().int().nonnegative(),
      paymentMethods: z.array(nonEmptyString),
      freeTier: z.boolean(),
      freeTierNotes: z.string().optional(),
    }),
    audits: z.array(auditRecordSchema).default([]),
    updatedAt: isoDateSchema,
    sources: z.array(urlSchema).optional(),
  }),
});

/* Provider long-form factual overview (no opinion, no scores). */
const providerOverviews = defineCollection({
  loader: glob({ base: "./src/content/providers", pattern: "**/*.mdx" }),
  schema: z.object({
    provider: reference("providers"),
    title: nonEmptyString,
    summary: nonEmptyString,
    updatedAt: isoDateSchema,
  }),
});

/* ============================================================
 * Reference data (JSON) — protocols, platforms, countries, features, streaming
 * ============================================================ */
const protocols = defineCollection({
  loader: glob({ base: "./src/data/protocols", pattern: "**/*.json" }),
  schema: z.object({
    id: idSchema,
    slug: slugSchema,
    name: nonEmptyString,
    category: z.enum([
      "openvpn",
      "wireguard",
      "ikev2",
      "l2tp",
      "pptp",
      "sstp",
      "softether",
      "proprietary",
      "other",
    ]),
    description: nonEmptyString,
    encryption: z.string().optional(),
    transport: z.enum(["udp", "tcp", "both"]).optional(),
    openSource: z.boolean(),
    strengths: stringList,
  }),
});

const platforms = defineCollection({
  loader: glob({ base: "./src/data/platforms", pattern: "**/*.json" }),
  schema: z.object({
    id: idSchema,
    slug: slugSchema,
    name: nonEmptyString,
    icon: nonEmptyString,
    official: z.boolean(),
  }),
});

const countries = defineCollection({
  loader: glob({ base: "./src/data/countries", pattern: "**/*.json" }),
  schema: z.object({
    code: countryCodeSchema,
    slug: slugSchema,
    name: nonEmptyString,
    region: z.enum([
      "north-america",
      "south-america",
      "europe",
      "asia",
      "africa",
      "oceania",
      "middle-east",
    ]),
    flagEmoji: z.string().min(1),
    privacyFriendly: z.boolean(),
    jurisdictionNote: z.string().optional(),
  }),
});

const features = defineCollection({
  loader: glob({ base: "./src/data/features", pattern: "**/*.json" }),
  schema: z.object({
    id: idSchema,
    slug: slugSchema,
    name: nonEmptyString,
    category: z.enum([
      "security",
      "privacy",
      "performance",
      "usability",
      "streaming",
      "torrenting",
      "advanced",
      "pricing",
    ]),
    description: nonEmptyString,
  }),
});

const streamingServices = defineCollection({
  loader: glob({ base: "./src/data/streaming-services", pattern: "**/*.json" }),
  schema: z.object({
    id: idSchema,
    slug: slugSchema,
    name: nonEmptyString,
    icon: nonEmptyString,
    regions: z.array(countryCodeSchema),
  }),
});

/* ============================================================
 * Editorial content (MDX)
 * ============================================================ */
const reviews = defineCollection({
  loader: glob({ base: "./src/content/reviews", pattern: "**/*.mdx" }),
  schema: z.object({
    provider: reference("providers"),
    title: nonEmptyString,
    summary: z.string().max(160),
    reviewer: reference("authors"),
    scores: reviewScoresSchema,
    verdict: verdictSchema,
    pros: z.array(nonEmptyString),
    cons: z.array(nonEmptyString),
    methodology: nonEmptyString,
    testDate: isoDateSchema,
    publishedAt: isoDateSchema,
    updatedAt: isoDateSchema.optional(),
  }),
});

const comparisons = defineCollection({
  loader: glob({ base: "./src/content/comparisons", pattern: "**/*.mdx" }),
  schema: z.object({
    title: nonEmptyString,
    summary: z.string().max(160),
    providers: z.array(reference("providers")).min(2),
    winner: reference("providers").optional(),
    author: reference("authors"),
    publishedAt: isoDateSchema,
    updatedAt: isoDateSchema.optional(),
    /** Structured section ids referenced in the MDX body. */
    sections: z
      .array(
        z.object({
          id: slugSchema,
          title: nonEmptyString,
          attributes: z.array(nonEmptyString).optional(),
        }),
      )
      .default([]),
  }),
});

const bestLists = defineCollection({
  loader: glob({ base: "./src/content/best-lists", pattern: "**/*.mdx" }),
  schema: z.object({
    title: nonEmptyString,
    summary: z.string().max(160),
    category: slugSchema,
    criteria: z.array(nonEmptyString),
    entries: z
      .array(
        z.object({
          provider: reference("providers"),
          rationale: nonEmptyString,
          rank: z.number().int().positive(),
        }),
      )
      .min(1),
    author: reference("authors"),
    publishedAt: isoDateSchema,
    updatedAt: isoDateSchema.optional(),
  }),
});

const guides = defineCollection({
  loader: glob({ base: "./src/content/guides", pattern: "**/*.mdx" }),
  schema: z.object({
    title: nonEmptyString,
    summary: z.string().max(160),
    category: slugSchema,
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    author: reference("authors"),
    publishedAt: isoDateSchema,
    updatedAt: isoDateSchema.optional(),
    relatedGuides: z.array(reference("guides")).optional(),
    relatedProviders: z.array(reference("providers")).optional(),
  }),
});

const categories = defineCollection({
  loader: glob({ base: "./src/content/categories", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    name: nonEmptyString,
    summary: nonEmptyString,
    parent: reference("categories").optional(),
  }),
});

const faqs = defineCollection({
  loader: glob({ base: "./src/content/faqs", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    question: nonEmptyString,
    answer: nonEmptyString,
    category: slugSchema,
    relatedProvider: reference("providers").optional(),
    relatedGuide: reference("guides").optional(),
  }),
});

const authors = defineCollection({
  loader: glob({ base: "./src/content/authors", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    name: nonEmptyString,
    role: nonEmptyString,
    bio: nonEmptyString,
    avatar: z.string().optional(),
    social: authorSocialSchema.optional(),
  }),
});

export const collections = {
  providers,
  "provider-overviews": providerOverviews,
  protocols,
  platforms,
  countries,
  features,
  "streaming-services": streamingServices,
  reviews,
  comparisons,
  "best-lists": bestLists,
  guides,
  categories,
  faqs,
  authors,
};
