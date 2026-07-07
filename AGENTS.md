## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Quality gate

Before considering work done, run the typecheck/lint gate and the build:

```
npm run check    # astro check — must report 0 errors, 0 warnings
npm run build    # astro build — must succeed
```

## Custom Agents

This project includes a custom agent in `.github/agents/`:

- **Network Coder** (`.github/agents/network-coder.agent.md`) — General-purpose coding agent powered by NetworkHome models. Select it from the agent picker dropdown in Copilot Chat.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
