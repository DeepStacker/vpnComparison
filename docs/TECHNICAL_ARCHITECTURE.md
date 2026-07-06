# Technical Architecture

## Architecture rules

- Entirely statically generated (`output: "static"`).
- No backend, authentication, database, API server, or CMS dependency.
- Everything builds to static HTML.
- Interactive features run entirely in the browser, as native Astro islands
  or tiny progressive-enhancement scripts.

## Astro configuration

`astro.config.mjs`:

- `site` sourced from `SITE_URL` env (default `https://networkshome.com`) so
  canonical URLs, sitemap, and OG stay correct across environments.
- `trailingSlash: "ignore"`, `prefetch: { prefetchAll: true, defaultStrategy: "viewport" }`.
- Integrations: `@astrojs/mdx`, `@astrojs/sitemap`, `astro-icon` (Lucide set,
  custom dir `src/icons`).
- Tailwind v4 wired through `@tailwindcss/vite` (CSS-first; no JS config file).

## TypeScript

`tsconfig.json` extends `astro/tsconfigs/strictest` and adds:

- `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`,
  `noImplicitOverride`, `verbatimModuleSyntax`, `isolatedModules`.
- Path aliases: `@/*`, `@/components/*`, `@/layouts/*`, `@/lib/*`, `@/types/*`,
  `@/schemas/*`, `@/constants/*`, `@/data/*`, `@/styles/*`, `@/assets/*`.

## Content layer

- Collections defined in `src/content.config.ts` using the Content Layer API
  (`glob` loaders from `astro/loaders`).
- **Objective data** lives as JSON in `src/data/` (providers, protocols,
  platforms, countries, features, streaming-services).
- **Editorial content** lives as MDX in `src/content/` (reviews, comparisons,
  best-lists, guides, categories, faqs, authors, provider overviews).
- Cross-collection links use `reference()` so broken references fail the build.
- Zod schemas import `z` from `astro/zod` (Astro 7 deprecated `astro:content`'s `z`).
- Shared Zod building blocks live in `src/schemas/common.ts`.

## Layering

```
types/        ← single source of truth for the data model (interfaces)
schemas/      ← Zod building blocks
content.config.ts ← collection schemas + loaders (validate content/data)
constants/    ← site config, navigation
lib/          ← pure utilities (seo, schema/jsonld, content helpers, utils)
components/   ← ui (primitives), layout (chrome), seo (head/JSON-LD)
layouts/      ← page shells composing components + lib
pages/        ← routes composing layouts + content
```

Dependencies flow downward: `pages → layouts → components → lib → constants/types`.
No upward imports; no cycles.

## Theming (no-flash)

- `src/components/seo/ThemeScript.astro` is inlined in `<head>` and sets
  `html.dark` before paint from `localStorage("nh-theme")` or
  `prefers-color-scheme`.
- `src/components/layout/ThemeToggle.astro` flips the class and persists via a
  single delegated inline click listener (no hydration).

## Image strategy

- Local assets in `src/assets/` consumed via Astro Image for responsive,
  optimized output.
- `public/` for static assets served as-is (favicon, OG images).
- `astro.config` enables `image.responsiveStyles` so contributors don't ship
  oversized assets by accident.

## Build pipeline

`npm run build` → sync content → type-check-free static build →
`@astrojs/sitemap` → `dist/`. `npm run check` runs `astro check` (the project's
typecheck and lint gate).
