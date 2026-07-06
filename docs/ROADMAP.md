# Roadmap

## Phase 1 — Foundation ✅ (complete)

Production-grade architecture with no user-facing pages:

- Astro 7 + TypeScript (strictest) + Tailwind v4 + MDX + Content Collections.
- Modular folder structure (`src/{components,content,data,layouts,lib,pages,
  schemas,styles,types,constants,assets,icons}` + `docs/`).
- Design system: tokens (color, typography, spacing, radius, shadow, z-index,
  motion, containers), light/dark themes, no-flash theme script.
- Six layouts: `BaseLayout`, `SeoLayout`, `DocumentationLayout`,
  `ArticleLayout`, `ComparisonLayout`, `ToolLayout`.
- UI library: 28 typed, accessible primitives (see COMPONENT_LIBRARY).
- Data layer: TypeScript interfaces + Zod schemas for 14 collections.
- Utilities: SEO meta, JSON-LD, breadcrumbs, slugs, reading time, related
  content, internal links, comparison matrix, filtering, search index.
- Quality gate: `astro check` 0/0; `astro build` succeeds; sitemap emitted.

## Phase 2 — Information Architecture & Core Experiences (Planned)

- Homepage with discover/compare/understand/decide entry points.
- Provider index + detail (objective specs) + review (editorial) pages.
- Comparison index + editorial comparison articles + dynamic `-vs-` pages.
- Best-list index + use-case pages with transparent criteria.
- Guides index + guide pages with TOC.
- Country / platform / protocol / feature / streaming landing pages.
- FAQ index + pages (FAQPage schema).
- Author pages.
- Search (Pagefind or Fuse.js) and the VPN picker decision tool.

## Phase 3 — Content & Trust (Planned)

- Editorial workflow, methodology page, editorial policy, affiliate disclosure.
- Populate objective data (providers, protocols, platforms, countries,
  features, streaming services) and editorial content (reviews, comparisons,
  best-lists, guides, FAQs, authors).
- Audit-evidence pages linking claims to sources.
- Accessibility audit pass and performance budget enforcement.
- `robots.txt`, `hreflang` (if multi-language), and 404/500 pages.

## Future enhancements

- Interactive feature/price filters with URL state.
- Side-by-side comparison tool with selectable attributes.
- Provider network map and country coverage visualizations.
- Optional Light/Torch search with offline index.
