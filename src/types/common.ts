/**
 * Shared primitive types used across the data model.
 * Branded types prevent accidentally swapping IDs, slugs, and URLs.
 */

/** ISO-8601 date string, e.g. "2025-07-06" or full timestamp. */
export type ISODateString = string & { readonly __brand: "ISODateString" };

/** URL-safe slug used for content routing and IDs. */
export type Slug = string & { readonly __brand: "Slug" };

/** Stable identifier referencing a structured-data record. */
export type ID = string & { readonly __brand: "ID" };

/** Fully-qualified URL string. */
export type URLString = string & { readonly __brand: "URLString" };

/** BCP-47 locale tag, e.g. "en", "en-US". */
export type Locale = string & { readonly __brand: "Locale" };

/** ISO 3166-1 alpha-2 country code, uppercased. */
export type CountryCode = string & { readonly __brand: "CountryCode" };

/** Normalize any string into a URL-safe slug. Runtime helper lives in lib. */
export type Maybe<T> = T | null | undefined;

/** A value that may be loaded asynchronously. */
export type AsyncResult<T, E = Error> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: E };
