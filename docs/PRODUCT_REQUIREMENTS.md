# Product Requirements (PRD)

Functional requirements, grouped by phase. Planned phases beyond Phase 1 are
marked **Planned** and may evolve.

## Phase 1 — Foundation ✅

Delivered: production-grade architecture with no user-facing pages.

- Astro + TypeScript (strictest) + Tailwind v4 + MDX + Content Collections.
- Modular, scalable folder structure (content, data, layouts, components,
  utilities, styles, types, schemas, constants).
- Design system: color/typography/spacing/radius/shadow/z-index/motion/
  container tokens, light + dark themes, CSS variables + Tailwind utilities.
- Six base layouts: Root (`BaseLayout`), `SeoLayout`, `DocumentationLayout`,
  `ArticleLayout`, `ComparisonLayout`, `ToolLayout` — with metadata, canonical
  URLs, Open Graph, Twitter cards, breadcrumbs, JSON-LD hooks, dark mode, and
  accessibility landmarks.
- Shared UI library: 28 typed, accessible, variant-driven primitives.
- Data layer: TypeScript interfaces + Zod content-collection schemas for
  providers, protocols, platforms, countries, features, streaming services,
  reviews, comparisons, best-lists, guides, categories, FAQs, authors.
- Core utilities: SEO meta, structured-data (JSON-LD) generation, breadcrumbs,
  slugs, reading time, related content, internal linking, comparison matrix,
  filtering, search index builder.
- Quality gate: `astro check` passes with 0 errors / 0 warnings; `astro build`
  succeeds.

## Phase 2 — Information Architecture & Core Experiences (Planned)

- Homepage: discover/compare/understand/decide entry points.
- Provider index + provider detail pages (objective specs + linked review).
- Comparison index + dynamic head-to-head comparison pages.
- Best-list index + best-list pages by use case.
- Guides index + guide pages with table of contents.
- FAQ index + FAQ pages with FAQPage schema.
- Country / platform / protocol / feature / streaming landing pages.
- Search (Pagefind or Fuse.js) and the VPN picker decision tool.

## Phase 3 — Content & Trust (Planned)

- Editorial workflow, methodology page, editorial policy, affiliate
  disclosure.
- Author profiles, review methodology transparency, audit evidence pages.
- Accessibility audit pass, performance budget enforcement.

## Cross-cutting requirements

- **Accessibility**: WCAG 2.2 AA; keyboard, screen-reader, focus visibility,
  semantic HTML, ARIA only when necessary, color contrast.
- **SEO**: per-page metadata, OG, Twitter, canonical, JSON-LD, breadcrumbs,
  internal linking, FAQ schema where relevant, sitemap.
- **Performance**: Lighthouse 95+; Accessibility/SEO/Best Practices 100;
  minimal JS; responsive images.
- **Trust**: objective vs editorial separation enforced at the schema level.
