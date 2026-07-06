# Accessibility

Accessibility is mandatory, not optional. Target: WCAG 2.2 AA.

## Baseline (implemented in Phase 1)

- **Semantic HTML**: layouts use `<header>`, `<main id="main">`, `<footer>`,
  `<nav>`, `<article>`, `<aside>`, `<section>`, `<table>` with `<caption>`,
  `<details>`/`<summary>`.
- **Skip link**: `src/components/layout/SkipLink.astro` jumps to `#main`
  (visible only on focus).
- **Focus visibility**: global `:focus-visible` rule draws a 2px
  `--color-ring` outline with offset; interactive primitives add
  `focus-visible:outline-none` only where they replace the default affordance.
- **Keyboard**: `<Tabs>` implements a roving-tabindex tablist with Arrow/Home/
  End keys; `<Accordion>` uses native `<details>` (Enter/Space + click);
  `<ThemeToggle>` and mobile menu are keyboard-operable.
- **Color contrast**: semantic tokens are tuned for AA in both themes; status
  tokens flip foreground/surface pairs in dark mode.
- **Reduced motion**: `prefers-reduced-motion` collapses transition/animation
  durations globally (base layer).
- **Icons**: decorative icons set `aria-hidden`; meaningful icons take
  `aria-label`/`title`.
- **Forms**: `<SearchInput>` associates a `<label>` (visible or `sr-only`) with
  its input.
- **Landmarks**: header/nav/main/footer provide a consistent region map.

## Component rules

- Prefer native elements (`<details>`, radio/checkbox, native `<button>`) over
  custom JS where they satisfy the interaction.
- Add ARIA only when native semantics are insufficient; never duplicate native
  semantics with redundant ARIA.
- Use `aria-current="page"` for the active nav/breadcrumb item.
- Use `role="status"`/`role="alert"` for `<Alert>`; `role="progressbar"` with
  `aria-valuenow/min/max` for `<ProgressBar>`; `role="img"` with an accessible
  label for `<Rating>`.

## Checklist for new pages/components

1. Keyboard-reachable and operable without a mouse.
2. Visible focus on every interactive element.
3. Meaningful labels/legends; no label-less inputs.
4. Sufficient contrast in light **and** dark.
5. No information conveyed by color alone (pair with text/icon).
6. Motion respects `prefers-reduced-motion`.
7. Heading levels reflect document outline (one `<h1>`).
8. Tested with at least one screen reader (VoiceOver/NVDA).
