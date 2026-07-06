# Design System

## Philosophy

A professional product feel, not a marketing site. Prioritize whitespace,
typography, readability, hierarchy, consistency, subtle motion, and
accessibility. Avoid flashy gradients, excessive animations, dark patterns,
clickbait styling, and intrusive banners.

## Token architecture

Tokens are split into **primitives** and **semantic** layers:

- **Primitives** live in `@theme` in `src/styles/global.css` and generate
  Tailwind utilities *and* CSS variables simultaneously
  (e.g. `--color-brand-500` → `bg-brand-500` + `var(--color-brand-500)`).
- **Semantic** tokens live in `src/styles/tokens.css` as `:root` / `.dark`
  overrides (e.g. `--background`, `--foreground`) and are mapped into
  Tailwind's color namespace via `@theme inline`, so utilities like
  `bg-background`, `text-foreground`, `border-border` respond to `.dark`
  automatically.

Components should prefer **semantic** tokens so dark mode and future rebrands
stay centralized in `tokens.css`.

## Color

| Token group   | Examples                                                       |
| ------------- | -------------------------------------------------------------- |
| Brand         | `brand-50` … `brand-950` (calm indigo/blue, trustworthy)       |
| Neutral       | `neutral-0` … `neutral-950` (cool slate)                       |
| Semantic      | `background`, `foreground`, `surface`, `surface-raised`,       |
|               | `surface-sunken`, `border`, `border-strong`, `muted`,          |
|               | `muted-foreground`, `primary`, `primary-hover`,                |
|               | `primary-foreground`, `accent`, `accent-foreground`, `ring`    |
| Status        | `success[-foreground/-surface]`, `warning[-…]`, `danger[-…]`,  |
|               | `info[-…]`                                                     |

Status tokens flip their foreground/surface pair in dark mode for contrast.

## Typography

- Sans: Inter (with system fallbacks). Mono: native UI mono stack.
- Type scale relies on Tailwind defaults; headings use `tracking-tight` and
  `text-balance`.
- `<Heading>` maps h1–h6 to responsive sizes; `<Text>` provides size/tone/weight.

## Spacing, radius, shadow

- Spacing: Tailwind's 4px-based scale.
- Radius: `xs` (0.25) → `2xl` (1.5) → `full`, exposed as `rounded-*` utilities
  and in `maps.ts` (`radiusClass`).
- Shadows: `xs` → `xl`, soft and layered; dark theme deepens them.

## Z-index layers

`base(0) < raised(10) < dropdown(1000) < sticky(1100) < header(1200) <
overlay(1300) < modal(1400) < toast(1500)`. Use via `z-base`, `z-header`, etc.

## Motion

- Durations: `fast` (120ms), `base` (180ms), `slow` (280ms).
- Easings: `standard`, `emphasized`, `out`.
- `prefers-reduced-motion` collapses durations to ~0 globally (base layer).

## Layout / containers

| Token              | Width   | Use                                  |
| ------------------ | ------- | ------------------------------------ |
| `container-prose`  | 768px   | Long-form reading (guides, reviews)  |
| `container-page`   | 1152px  | Default page content                 |
| `container-2xl`    | 1280px  | Wide data views                      |

`<Container size="page|prose|wide|full">` and the `.container-page` /
`.container-prose` utilities apply them.

## Dark mode

Class-based: `@custom-variant dark (&:where(.dark, .dark *))`. The root
`<html>` gets `.dark` from the no-flash theme script. Never hardcode light-only
colors; always use semantic tokens.

## Utility maps

`src/components/ui/maps.ts` exposes static class-name lookup maps (`gapClass`,
`colsClass`, `sectionPadClass`, `containerSizeClass`, `shadowClass`,
`radiusClass`) so numeric/enum props compile to literal Tailwind strings the
scanner can detect. Never build Tailwind classes with template literals.
