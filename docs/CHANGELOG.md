# Changelog

Documentation and architecture changes. Dates are UTC.

## 2026-07-06 — Phase 1 Foundation

### Added

- Initialized Astro 7 project (TypeScript strictest) in `freevpn4usa`/
  (package name `networkshome`).
- Installed and configured integrations: `@astrojs/mdx`,
  `@astrojs/sitemap`, `astro-icon` (Lucide), Tailwind v4 via
  `@tailwindcss/vite`, `@astrojs/check`.
- Modular folder structure: `src/{components/{ui,layout,seo},content,data,
  icons,layouts,lib/{seo,schema,content,utils},pages,schemas,styles,types,
  constants,assets}` and `docs/`.
- Design system: `src/styles/tokens.css` (semantic tokens, light/dark) and
  `src/styles/global.css` (`@theme` primitives, `@theme inline` semantic
  mapping, base layer with a11y + reduced motion, `container-page`/`prose`
  and `sr-only`/`focus-restore` utilities).
- Data model: `src/types/{common,site,provider,content,seo,index}.ts` and
  Zod building blocks in `src/schemas/common.ts`.
- Content collections in `src/content.config.ts` (14 collections, `glob`
  loaders, `reference()` cross-links). Uses `z` from `astro/zod` (Astro 7).
- Utilities in `src/lib/`: `seo/{meta,breadcrumbs}`, `schema/jsonld`,
  `content/{links,related,comparison,filter,search-index}`,
  `utils/{string,format,date,reading-time}`.
- UI library in `src/components/ui/`: Container, Section, Stack, Grid, Divider,
  Heading, Text, Link, Button, Badge, Tag, Pill, Chip, Avatar, Icon, Card,
  Alert, Callout, Tooltip, Accordion, AccordionItem, Tabs, Table, Breadcrumbs,
  Pagination, SearchInput, EmptyState, LoadingState, Rating, ProgressBar.
  Static class maps in `maps.ts`.
- Layout components in `src/components/layout/`: SkipLink, Logo, ThemeToggle,
  Header (sticky, `<details>` mobile menu), Footer (grouped nav from
  constants).
- SEO components in `src/components/seo/`: Meta, JsonLd, ThemeScript.
- Layouts in `src/layouts/`: BaseLayout, SeoLayout, DocumentationLayout,
  ArticleLayout, ComparisonLayout, ToolLayout.
- Site config (`src/constants/site.ts`) and navigation architecture
  (`src/constants/navigation.ts`).
- Brand assets: `public/favicon.svg`, `public/og/default.svg`,
  `public/og/logo.svg`.
- Project documentation set in `docs/` and a root `README.md`.
- Temporary foundation-verification index page (`src/pages/index.astro`,
  `noindex`) to exercise the layout system — to be replaced in Phase 2.

### Decisions

- **Polymorphic prop named `element`, not `as`**: Astro reserves `as`, which
  broke `interface Props` detection and typed `Astro.props` as `any`.
- **Tailwind v4 CSS-first config**: primitives in `@theme`, semantic tokens
  in `tokens.css` mapped via `@theme inline` for dark-mode-aware utilities.
- **`z` imported from `astro/zod`**: Astro 7 deprecated `import { z } from
  "astro:content"`; switched all schemas.
- **Class lookup maps** (`maps.ts`) instead of template literals so Tailwind's
  scanner detects dynamically-selected utilities.
- **No `tailwind-merge`**: dependency-free `cx()` to keep the bundle minimal.

### Quality gate

- `astro check`: 0 errors, 0 warnings.
- `astro build`: succeeds; `/index.html` and `/sitemap-index.xml` produced.
