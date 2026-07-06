# Performance

## Targets

| Metric           | Target          |
| ---------------- | --------------- |
| Lighthouse Performance | 95+       |
| Lighthouse Accessibility | 100      |
| Lighthouse SEO   | 100             |
| Lighthouse Best Practices | 100     |

## Strategy

### Static-first

- All pages pre-rendered to HTML at build time. No server runtime.
- Zero hydration by default. Interactive components (`<Tabs>`, `<ThemeToggle>`)
  use tiny inline scripts, not Astro islands/client components.

### Minimal JavaScript

- No UI framework runtime (no React/Vue/Svelte).
- Total client JS should stay in the low single-digit KB. Every script must
  justify itself.
- Inline scripts are `is:inline` (no module wait) where they affect first paint
  (theme), or module scripts bundled by Vite where they enhance post-paint.

### CSS

- Tailwind v4 ships only the utilities actually used (scanned from source).
- Token classes are static literals (see `maps.ts`) so the scanner sees them.
- One global stylesheet (`src/styles/global.css`); no per-page CSS bloat.

### Images

- Local images via Astro Image (responsive, optimized formats).
- `image.responsiveStyles` enabled to avoid layout shift.
- SVG for icons (astro-icon/Lucide) and OG/logo assets (no raster where vector
  suffices).

### Fonts

- Inter via system fallback stack; no web-font blocking by default. If a web
  font is added later, load with `font-display: swap` and preconnect.

### Prefetch

- `prefetch.prefetchAll` with `viewport` strategy so likely-next pages are
  fetched without expensive eager loading.

## Budgets (to enforce in Phase 2/3)

| Asset          | Budget                        |
| -------------- | ----------------------------- |
| HTML per page  | < 50 KB gzip                  |
| CSS (global)   | < 30 KB gzip                  |
| JS (per page)  | < 15 KB gzip                  |
| LCP image      | < 100 KB, responsive `srcset` |

## Measuring

- Run `npm run build && npm run preview` and audit with Lighthouse.
- Check `dist/_astro/*.js` size after each feature that adds client JS.
- Watch the warning list from `astro build` for regressions.
