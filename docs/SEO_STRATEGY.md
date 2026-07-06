# SEO Strategy

## Per-page metadata

Every page supplies a `SeoMeta` object (`src/types/seo.ts`) consumed by
`src/components/seo/Meta.astro`:

- `<title>` via `buildTitle()` → `"{Page title} — FreeVPN4USA"` (home variant
  uses the tagline).
- `meta[name=description]`.
- `<link rel="canonical">` via `canonicalUrl()` (resolves absolute against
  `SITE.url`).
- `meta[name=robots]` (default `index,follow`; `noindex` supported).
- Optional `keywords`, `publishedAt`, `updatedAt`, `author`, `alternates`.

## Open Graph & Twitter

`buildOpenGraph()` and `buildTwitterCard()` (`src/lib/seo/meta.ts`) derive OG
and Twitter payloads from `SeoMeta`:

- OG: `og:type` (`article` when `publishedAt` set, else `website`), `og:url`,
  `og:title`, `og:description`, `og:image`, `og:site_name`,
  `article:published_time`/`modified_time`/`author`.
- Twitter: `summary_large_image`, `twitter:site` from `SITE.twitterHandle`.
- Default OG image: `/og/default.svg` (override per page via `seo.image`).

## Structured data (JSON-LD)

Emitted by `src/components/seo/JsonLd.astro` from generators in
`src/lib/schema/jsonld.ts`:

| Generator              | Where emitted                                 |
| ---------------------- | --------------------------------------------- |
| `organizationJsonLd`   | Every page (site-wide, in `BaseLayout`)       |
| `websiteJsonLd`        | Every page (site-wide, in `BaseLayout`)       |
| `breadcrumbListJsonLd` | Pages with breadcrumbs (in `SeoLayout`)       |
| `articleJsonLd`        | `ArticleLayout` (TechArticle)                 |
| `faqPageJsonLd`        | FAQ pages (Phase 2)                           |
| `productJsonLd`        | Provider pages (Product + optional Review/AggregateRating) |
| `howToJsonLd`          | Step-by-step guides (Phase 2)                 |

Rules: never invent values (e.g. aggregate ratings the content doesn't have);
keep payloads minimal and accurate; serialize with `serializeJsonLd()`.

## Sitemap & robots

- `@astrojs/sitemap` generates `/sitemap-index.xml` (changefreq `weekly`,
  priority `0.7`).
- `<link rel="sitemap">` is in `BaseLayout`.
- A `robots.txt` and route-level `noindex` (via `seo.robots`) control indexing.

## Internal linking & breadcrumbs

- Visible breadcrumbs (`<Breadcrumbs>`) + `BreadcrumbList` JSON-LD from the
  same `items` array (`breadcrumbsFromPath()` or explicit).
- Internal links via `src/lib/content/links.ts`; `prefetch` enabled
  (viewport strategy) for fast navigation.

## Internationalization

Planned. `SeoMeta.alternates` and `hreflang` are typed and ready; the root
locale is `SITE.locale` (`en`).
