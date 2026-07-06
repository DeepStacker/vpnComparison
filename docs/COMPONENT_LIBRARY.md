# Component Library

All primitives live in `src/components/ui/` and are imported by path
(`@/components/ui/Button.astro`). Every component has typed `Props`, variants,
accessible markup, responsive behavior, and a documentation comment.

## Conventions

- Polymorphic elements use an **`element`** prop (not `as` — `as` is reserved
  by Astro and breaks `Props` detection).
- Numeric/enum props resolve to Tailwind classes via static maps in
  `maps.ts` (never dynamic template strings).
- Class merging uses `cx()` (`src/lib/utils/string.ts`); pass extra classes via
  `class`. No `tailwind-merge` dependency by design.
- Interactive components justify their JavaScript: `<Tabs>` uses a single
  inline module script (no hydration); `<ThemeToggle>` uses a delegated inline
  listener; `<Accordion>` uses native `<details>` (zero JS).

## Layout primitives

| Component      | Props highlights                                              |
| -------------- | ------------------------------------------------------------- |
| `Container`    | `size` (`page` \| `prose` \| `wide` \| `full`), `element`     |
| `Section`      | `padding` (`none` \| `tight` \| `default` \| `loose`), `id`   |
| `Stack`        | `gap`, `align`, `element` (flex column)                       |
| `Grid`         | `cols`, `colsSm/Md/Lg/Xl`, `gap`                              |
| `Divider`      | `variant` (`subtle` \| `strong`)                              |

## Typography & links

| Component | Props highlights                                                        |
| --------- | ----------------------------------------------------------------------- |
| `Heading` | `level` (1–6), `size` override, `element`, `id`                         |
| `Text`    | `size`, `tone`, `weight`, `element`                                     |
| `Link`    | `href`, `variant` (`default` \| `muted` \| `primary` \| `unstyled`); external-safe |

## Actions & status

| Component | Props highlights                                                                |
| --------- | ------------------------------------------------------------------------------- |
| `Button`  | `variant` (`primary` \| `secondary` \| `outline` \| `ghost` \| `danger`), `size`, `href`, `fullWidth`, `type`, `target`, `rel`; slots `icon-leading`, `icon-trailing` |
| `Badge`   | `tone`, `size` (filled status label)                                            |
| `Tag`     | `tone`, `href` (bordered taxonomy label)                                        |
| `Pill`    | `tone` (rounded-full soft label)                                                |
| `Chip`    | `tone`, `href`, `icon` slot (compact rounded label)                             |
| `Avatar`  | `src?`, `name` (initials fallback), `size`                                      |
| `Icon`    | `name` (lucide, with or without `lucide:` prefix), `size`, `aria-label`/`title` |
| `Rating`  | `value`, `max` (default 10), `size`, `showValue`, `label` (5-star partial fill) |
| `ProgressBar` | `value`, `max?`, `tone`, `label`, `showValue`                               |

## Surfaces & feedback

| Component      | Props highlights                                              |
| -------------- | ------------------------------------------------------------- |
| `Card`         | `variant` (`default` \| `raised` \| `outline`), `padding`, `href`, `radius`, `element`; slots `header`, `footer` |
| `Alert`        | `tone` (`info` \| `success` \| `warning` \| `danger`), `title`, `icon`; role `alert`/`status` |
| `Callout`      | `tone` (`note` \| `tip` \| `warning` \| `danger`), `title` (docs aside) |
| `Tooltip`      | `label`, `placement`; CSS-only, shows on hover + focus-within |
| `EmptyState`   | `icon`, `title`, `description`; `action` slot                 |
| `LoadingState` | `variant` (`skeleton` \| `spinner`), `lines`, `label`         |

## Navigation & data

| Component      | Props highlights                                              |
| -------------- | ------------------------------------------------------------- |
| `Breadcrumbs`  | `items: Breadcrumb[]` (last = `aria-current="page"`)          |
| `Pagination`   | `currentPage`, `totalPages`, `href(page)`, `siblingCount`     |
| `Tabs`         | `tabs: {id,label}[]`, `defaultTab`, `id`; panels via named slots `panel-{id}`; ARIA + roving tabindex |
| `Accordion`    | container (divide + border)                                   |
| `AccordionItem`| `summary`/slot, `open`, `id` (native `<details>`)            |
| `Table`        | `columns: {key,label,align,sticky}[]`, `rows`, `caption`, `zebra`, `firstColumnSticky` |
| `SearchInput`  | `id`, `placeholder`, `name`, `value`, `label`; `data-search-input` hook |

## Layout & SEO components

- `src/components/layout/`: `SkipLink`, `Logo`, `ThemeToggle`, `Header`
  (sticky, `<details>` mobile menu), `Footer` (grouped nav from constants).
- `src/components/seo/`: `Meta` (title/description/canonical/robots/OG/Twitter),
  `JsonLd` (emits schema.org nodes), `ThemeScript` (no-flash).

## Layouts

| Layout                 | Purpose                                                  |
| ---------------------- | -------------------------------------------------------- |
| `BaseLayout`           | Root HTML shell + site-wide JSON-LD + theme + skip link  |
| `SeoLayout`            | Default chrome: header + footer + breadcrumbs + `<main>` |
| `DocumentationLayout`  | Guides/docs: prose column + sticky TOC sidebar           |
| `ArticleLayout`        | Editorial articles: byline + TechArticle JSON-LD         |
| `ComparisonLayout`     | Wide, data-dense comparison pages                        |
| `ToolLayout`           | Full-bleed app-like shell for interactive tools          |
