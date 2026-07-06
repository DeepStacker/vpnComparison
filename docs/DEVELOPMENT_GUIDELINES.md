# Development Guidelines

## Workflow

```bash
npm install
npm run dev          # http://localhost:4321 (background mode supported)
npm run check        # typecheck/lint gate — run before committing
npm run build        # verify the static build succeeds
npm run preview      # preview the production build
```

Run `npm run check` before considering work done. It must report
**0 errors, 0 warnings**.

## Code style

- **Strict TypeScript** (strictest preset). No `any` without justification.
- `noUncheckedIndexedAccess` is on — guard array/record access.
- `verbatimModuleSyntax` is on — use `import type` for type-only imports.
- Descriptive names, small functions, no magic values, no duplicated logic.
- Prefer readability over cleverness.

## Tailwind v4 rules

- No `tailwind.config.js` — configuration is CSS-first via `@theme`.
- **Never** build Tailwind classes with template literals (`gap-${n}`). Use the
  static lookup maps in `src/components/ui/maps.ts` so the scanner detects them.
- Prefer **semantic** tokens (`bg-surface`, `text-muted-foreground`,
  `border-border`) over primitives so dark mode works automatically.
- Class merging uses `cx()` from `src/lib/utils/string.ts`.

## Astro component rules

- Declare `interface Props` for every component; destructure from
  `Astro.props` with defaults.
- Polymorphic tags use the **`element`** prop, never `as` (Astro reserves it
  and `Props` detection breaks).
- Document each component with a leading JSDoc comment (purpose + props).
- No comments inside code unless requested; component docs go in the
  frontmatter JSDoc.

## Architecture rules

- Dependencies flow downward:
  `pages → layouts → components → lib → constants/types`. No upward imports,
  no cycles.
- Objective data = JSON in `src/data/`. Editorial content = MDX in
  `src/content/`. Never mix.
- Routes live in `src/pages/`; internal URL builders live in
  `src/lib/content/links.ts`.
- Content collection changes require updates to both `src/types/` and
  `src/content.config.ts` (schema + interface stay in sync).

## Documentation

- Update the relevant `/docs` file and append a `CHANGELOG` entry for any
  architectural change.
- Never let docs describe behavior the code doesn't implement; mark planned
  work as "Planned".

## Committing

- Do not commit unless explicitly asked.
- Never commit secrets or keys.
- Keep commits focused; stage only intended files.
