# Information Architecture

## User intents

The product is organized around four user intents from the product vision:

1. **Discover** — browse providers, best lists, countries, platforms.
2. **Compare** — side-by-side comparisons, by feature / streaming / pricing.
3. **Understand** — guides, protocols, glossary, FAQ.
4. **Decide** — the VPN picker tool and best-list shortlists.

## Primary navigation

Defined in `src/constants/navigation.ts` (`PRIMARY_NAV`):

| Label       | Route          | Intent     |
| ----------- | -------------- | ---------- |
| Providers   | `/providers/`  | Discover   |
| Compare     | `/compare/`    | Compare    |
| Best VPNs   | `/best/`       | Discover/Decide |
| Guides      | `/guides/`     | Understand |
| FAQ         | `/faq/`        | Understand |

## Footer navigation

Grouped by the same four intents plus a "Company" group (About, Methodology,
Editorial policy, Contact). Utility links: Privacy, Terms, Affiliate
disclosure, Sitemap. See `FOOTER_NAV` and `UTILITY_NAV` in
`src/constants/navigation.ts`.

## Planned site map (Phase 2)

```
/                                   Home
/providers/                         Provider index
/providers/{slug}/                  Provider detail (objective specs)
/providers/{slug}/review            Provider editorial review
/compare/                           Comparison index
/compare/{slug}/                    Editorial comparison article
/compare/{a}-vs-{b}[-vs-...]        Dynamic head-to-head
/best/                              Best-list index
/best/{slug}/                       Best-list page (use case)
/guides/                            Guide index
/guides/{slug}/                     Guide article
/categories/                        Category index
/categories/{slug}/                 Category landing
/protocols/{slug}/                  Protocol landing
/platforms/{slug}/                  Platform landing
/countries/{slug}/                  Country landing
/features/{slug}/                   Feature landing
/streaming/{slug}/                  Streaming service landing
/faq/                               FAQ index
/authors/{slug}/                    Author page
/finder/                            VPN picker tool (Decide)
/about/ /methodology/ /editorial-policy/ /contact/   Company
/privacy/ /terms/ /affiliate-disclosure/             Legal
```

## User flows

- **Browse → detail**: Home / Providers index → Provider detail → Review.
- **Compare**: Compare index → comparison article or dynamic `vs` page →
  decision.
- **Decide**: Home → Best-list or Finder tool → provider detail.
- **Understand**: Guides index → guide → related guides/providers.

No dead ends: every leaf page links to related content and back to its index.

## Routing conventions

- Routes are root-relative with a trailing slash (`/providers/`, `/best/`).
- Dynamic comparison routes use `-vs-` between provider slugs.
- Internal link builders live in `src/lib/content/links.ts` so route changes
  happen in one place.
