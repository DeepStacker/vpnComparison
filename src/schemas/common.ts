/**
 * Reusable Zod schema building blocks for Content Collections.
 *
 * Importing `z` from `astro:content` guarantees we share Astro's bundled
 * Zod instance, avoiding duplicate-schema pitfalls. Compose these in
 * `src/content.config.ts` to keep each collection schema readable.
 */

import { z } from "astro/zod";

/** URL-safe slug with basic validation. */
export const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase kebab slug");

/** Stable id (same rules as slug — opaque to consumers). */
export const idSchema = slugSchema;

/** ISO-8601 date string (YYYY-MM-DD or full). */
export const isoDateSchema = z.string().regex(
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?([+-]\d{2}:\d{2}|Z)?)?$/,
  "must be an ISO-8601 date",
);

/** Fully-qualified URL (zod v4 top-level string format). */
export const urlSchema = z.url();

/** ISO 3166-1 alpha-2 country code. */
export const countryCodeSchema = z
  .string()
  .regex(/^[A-Z]{2}$/, "must be an ISO 3166-1 alpha-2 country code");

/** Non-empty trimmed string. */
export const nonEmptyString = z.string().trim().min(1);

/** Array of non-empty strings with a sensible default. */
export const stringList = z.array(nonEmptyString).default([]);

/** 0–10 numeric score. */
export const scoreSchema = z.number().min(0).max(10);

/** A price plan attached to a provider. */
export const pricePlanSchema = z.object({
  cycle: z.enum(["monthly", "quarterly", "yearly", "biennially", "triennially"]),
  price: z.number().nonnegative(),
  currency: z.string().min(1).default("USD"),
  effectiveMonthly: z.number().nonnegative(),
  featured: z.boolean().optional(),
});

/** Independent audit record. */
export const auditRecordSchema = z.object({
  auditor: nonEmptyString,
  date: isoDateSchema,
  scope: nonEmptyString,
  reportUrl: urlSchema.optional(),
  independent: z.boolean().default(true),
});

/** Sub-scores + overall. */
export const reviewScoresSchema = z.object({
  privacy: scoreSchema,
  security: scoreSchema,
  performance: scoreSchema,
  streaming: scoreSchema,
  torrenting: scoreSchema,
  easeOfUse: scoreSchema,
  value: scoreSchema,
  overall: scoreSchema,
});

/** Editor's verdict. */
export const verdictSchema = z.object({
  headline: nonEmptyString,
  summary: nonEmptyString,
  recommendation: z.enum(["recommended", "conditional", "not-recommended"]),
});

/** Author social links. */
export const authorSocialSchema = z.object({
  website: urlSchema.optional(),
  twitter: z.string().optional(),
  mastodon: urlSchema.optional(),
  linkedin: urlSchema.optional(),
  github: z.string().optional(),
});

/** A breadcrumb segment used in frontmatter-defined breadcrumb overrides. */
export const breadcrumbSchema = z.object({
  label: nonEmptyString,
  href: z.string().min(1),
});
