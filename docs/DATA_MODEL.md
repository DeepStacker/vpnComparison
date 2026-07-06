# Data Model

## Principle: objective facts vs editorial opinion

The data model enforces separation at the collection level:

- **Objective** (verifiable specs) → JSON in `src/data/`, typed by
  `src/types/provider.ts`, validated by Zod in `src/content.config.ts`.
- **Editorial** (human judgement) → MDX in `src/content/`, typed by
  `src/types/content.ts`, validated by Zod in `src/content.config.ts`.

The two never mix. Editorial records **reference** objective records by id via
`reference()`, so broken links fail the build.

## TypeScript interfaces (`src/types/`)

| File           | Exports                                                        |
| -------------- | -------------------------------------------------------------- |
| `common.ts`    | `ID`, `Slug`, `ISODateString`, `URLString`, `Locale`, `CountryCode`, `Maybe`, `AsyncResult` (branded primitives) |
| `site.ts`      | `NavItem`, `NavSection`, `Breadcrumb`, `ThemePreference`       |
| `provider.ts`  | `Provider`, `Protocol`, `Platform`, `Country`, `Region`, `Feature`, `StreamingService`, `Pricing`, `PricePlan`, `AuditRecord`, `LoggingPolicy`, `ProviderFilter`, `ComparisonCell` |
| `content.ts`   | `Author`, `Review`, `ReviewScores`, `Verdict`, `Comparison`, `ComparisonSection`, `BestList`, `BestListEntry`, `Guide`, `Category`, `FAQ`, `FilteredProviderResult` |
| `seo.ts`       | `SeoMeta`, `OpenGraph`, `TwitterCard`, `JsonLdNode`, `Rating`, `AggregateRating` |
| `index.ts`     | Barrel re-export                                              |

Branded types (`ID`, `Slug`, …) prevent accidentally swapping identifiers;
runtime helpers (`slugify`) live in `src/lib/utils/string.ts`.

## Content collections (`src/content.config.ts`)

| Collection            | Loader (glob base)            | Format | Layer      |
| --------------------- | ----------------------------- | ------ | ---------- |
| `providers`           | `src/data/providers`          | JSON   | Objective  |
| `protocols`           | `src/data/protocols`          | JSON   | Objective  |
| `platforms`           | `src/data/platforms`          | JSON   | Objective  |
| `countries`           | `src/data/countries`          | JSON   | Objective  |
| `features`            | `src/data/features`           | JSON   | Objective  |
| `streaming-services`  | `src/data/streaming-services` | JSON   | Objective  |
| `provider-overviews`  | `src/content/providers`       | MDX    | Objective narrative |
| `reviews`             | `src/content/reviews`         | MDX    | Editorial  |
| `comparisons`         | `src/content/comparisons`     | MDX    | Editorial  |
| `best-lists`          | `src/content/best-lists`      | MDX    | Editorial  |
| `guides`              | `src/content/guides`          | MDX    | Editorial  |
| `categories`          | `src/content/categories`      | MD/MDX | Taxonomy   |
| `faqs`                | `src/content/faqs`            | MD/MDX | Editorial  |
| `authors`             | `src/content/authors`         | MD/MDX | Editorial  |

## Key entity: Provider (objective)

Fields include: `id`, `slug`, `name`, `tagline`, `websiteUrl`, `affiliateUrl?`,
`foundedYear`, `jurisdiction`, `hqCountry`, `serverNetwork` (serverCount,
countryCount, countries, virtualLocations), `protocols[]`, `platforms[]`,
`features[]`, `streaming[]` (service + support level + verifiedAt),
`torrenting`, `loggingPolicy`, `killSwitch`, `splitTunneling`, `adBlocker`,
`multiHop`, `dedicatedIp`, `simultaneousConnections`, `pricing` (plans,
moneyBackGuaranteeDays, paymentMethods, freeTier), `audits[]`, `updatedAt`,
`sources[]`.

## Key entity: Review (editorial)

Fields: `provider` (reference), `title`, `summary` (≤160 chars), `reviewer`
(reference), `scores` (privacy/security/performance/streaming/torrenting/
easeOfUse/value + overall, all 0–10), `verdict` (headline, summary,
recommendation), `pros[]`, `cons[]`, `methodology`, `testDate`, `publishedAt`,
`updatedAt?`.

## Identity convention

For JSON collections, the **filename stem equals the entry `id` equals the
`slug`** (all kebab-case). This keeps `reference()` ids usable as route slugs
(see `src/lib/content/search-index.ts` and `links.ts`).

## Validation

Zod schemas live in `src/content.config.ts` and reuse building blocks from
`src/schemas/common.ts` (`slugSchema`, `isoDateSchema`, `urlSchema` (zod v4
`z.url()`), `pricePlanSchema`, `auditRecordSchema`, `reviewScoresSchema`,
`verdictSchema`, …). Invalid content or broken references fail `astro build`.
