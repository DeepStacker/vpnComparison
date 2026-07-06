# FreeVPN4USA

**A static-first VPN Intelligence Platform built entirely with Astro.**

FreeVPN4USA helps users confidently choose the right VPN through transparent
information, structured comparisons, educational content, and interactive
decision-making tools. It is a knowledge platform and decision-support system —
not a blog, not an affiliate landing page, not a generic review site.

## Project goals

- Help users **discover, compare, understand, and decide** with the fewest clicks.
- Separate **objective facts** (specs, pricing, jurisdiction, audits) from
  **editorial opinion** (scores, verdicts, pros/cons) — never mix the two.
- Ship a premium product feel while remaining a static website: zero backend,
  zero runtime server, minimal JavaScript.
- Target Lighthouse 95+, Accessibility 100, SEO 100, Best Practices 100.

## Technology stack

| Concern              | Choice                                        |
| -------------------- | --------------------------------------------- |
| Framework            | Astro (static output)                         |
| Language             | TypeScript (strictest preset)                 |
| Styling              | Tailwind CSS v4 (CSS-first, `@tailwindcss/vite`) |
| Content              | Astro Content Collections + MDX               |
| Structured data      | JSON / TypeScript interfaces + Zod schemas    |
| Icons                | astro-icon + `@iconify-json/lucide`           |
| Sitemap              | `@astrojs/sitemap`                            |
| Type checking        | `@astrojs/check`                              |

No React, Vue, Svelte, or Solid. Interactive features use native Astro
islands or tiny progressive-enhancement scripts.

## Getting started

```bash
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:4321)
npm run build      # build the static site to ./dist
npm run preview    # preview the production build
npm run check      # typecheck (astro check)
```

> The dev server supports background mode: `astro dev --background`, managed
> with `astro dev status` / `astro dev logs` / `astro dev stop`.

### Environment variables

| Variable   | Default                      | Purpose                                  |
| ---------- | ---------------------------- | ---------------------------------------- |
| `SITE_URL` | `https://freevpn4usa.com`   | Canonical origin for SEO, sitemap, OG.   |

## Folder structure

```
src/
├── assets/            # Local images consumed by Astro Image
├── components/
│   ├── ui/            # Shared, reusable UI primitives
│   ├── layout/        # Site chrome (Header, Footer, Logo, ThemeToggle)
│   └── seo/           # SEO/structured-data components (Meta, JsonLd, …)
├── content/           # Editorial MDX collections (reviews, guides, …)
├── content.config.ts  # Content Collection schemas (Zod) + loaders
├── data/              # Objective structured JSON (providers, protocols, …)
├── icons/             # Custom SVG icons for astro-icon
├── layouts/           # Base, SEO, Documentation, Article, Comparison, Tool
├── lib/               # Utilities: seo, schema, content, utils
├── pages/             # File-based routes
├── schemas/           # Reusable Zod schema building blocks
├── styles/            # Design tokens + global stylesheet
├── types/             # Shared TypeScript interfaces (the data model)
└── constants/         # Site config + navigation architecture
docs/                  # Versioned project documentation (see below)
public/                # Static assets served as-is (favicon, OG images)
```

## Documentation

All architecture and product decisions are documented and version-controlled
under [`/docs`](./docs). Start with the index:

- [Documentation index](./docs/README.md)

## Status

Phase 1 — **Foundation** is complete: project scaffolding, design system, data
layer, content collection schemas, core utilities, the full UI primitive
library, and the six base layouts. No user-facing pages have been designed yet.
See [ROADMAP](./docs/ROADMAP.md) and [CHANGELOG](./docs/CHANGELOG.md).
