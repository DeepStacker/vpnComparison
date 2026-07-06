# FreeVPN4USA Documentation

This directory is the project's single source of truth for product, design,
engineering, and content decisions. The documentation evolves alongside the
codebase — every major architectural or product decision should be reflected
here so the docs and the implementation never drift.

## Index

| Document                       | What it covers                                            |
| ------------------------------ | --------------------------------------------------------- |
| [PRODUCT_VISION](./PRODUCT_VISION.md)               | Product vision, principles, and non-goals.           |
| [PRODUCT_REQUIREMENTS](./PRODUCT_REQUIREMENTS.md)   | Functional requirements (PRD) by phase.               |
| [INFORMATION_ARCHITECTURE](./INFORMATION_ARCHITECTURE.md) | Site map, navigation, and user flows.          |
| [TECHNICAL_ARCHITECTURE](./TECHNICAL_ARCHITECTURE.md) | Astro architecture and engineering decisions.       |
| [DESIGN_SYSTEM](./DESIGN_SYSTEM.md)                 | Design tokens, UI principles, theming.               |
| [COMPONENT_LIBRARY](./COMPONENT_LIBRARY.md)         | Component specifications and usage.                  |
| [DATA_MODEL](./DATA_MODEL.md)                       | Structured-data schemas and content collections.     |
| [CONTENT_STRATEGY](./CONTENT_STRATEGY.md)           | Editorial guidelines and the content model.          |
| [SEO_STRATEGY](./SEO_STRATEGY.md)                   | SEO architecture and schema.org usage.               |
| [ACCESSIBILITY](./ACCESSIBILITY.md)                 | WCAG implementation guidelines.                      |
| [PERFORMANCE](./PERFORMANCE.md)                     | Performance budgets and optimization strategy.       |
| [DEVELOPMENT_GUIDELINES](./DEVELOPMENT_GUIDELINES.md) | Coding standards, conventions, and workflow.       |
| [ROADMAP](./ROADMAP.md)                             | Milestones and future enhancements.                  |
| [CHANGELOG](./CHANGELOG.md)                         | Documentation and architecture changes.              |

## Conventions

- Keep documents terse and scannable; use tables and lists over prose walls.
- Reference real file paths (`src/...`) so docs stay navigable in an IDE.
- When you change architecture, update the relevant doc **and** append a
  dated entry to [CHANGELOG](./CHANGELOG.md).
- Never let a document describe behavior the code does not implement — if a
  feature is planned but unbuilt, mark it explicitly as "Planned".
