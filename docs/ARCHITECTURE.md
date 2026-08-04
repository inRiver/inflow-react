# Inflow Design System Architecture

This repository has two jobs:

1. Build the importable `@inriver/inflow-react` package.
2. Host a live showcase so designers and developers can review the theme in context.

Those two jobs share code, but they are intentionally not the same public API.

```mermaid
flowchart TB
  subgraph Library["Published package"]
    Entry["src/index.ts"]
    Theme["src/theme/*"]
    Provider["src/providers/*"]
    Themed["src/components/themed/*"]
    Entry --> Theme
    Entry --> Provider
    Entry --> Themed
  end

  subgraph Showcase["Showcase / documentation app"]
    App["src/app/*"]
    Pages["src/pages/*"]
    Demos["src/showcase/*"]
    Screens["src/pages/screens/*"]
  end

  Theme --> Showcase
  Themed --> Showcase
  Library --> Dist["dist package artifacts"]
  Showcase --> Static["dist showcase site"]
```

## Package boundary

The public package entry is `src/index.ts`:

```ts
export * from './theme';
export * from './components/themed';
export * from './providers';
```

That means consumers get:

- `inflowTheme`
- `defaultTheme`
- `inflowTokens`, `inflowCustomColors`, `inflowSpacing`
- `InflowProvider`
- `ThemedButton`, `ThemedChip`, `ThemedTextField`, `ThemedCard`, `ThemedDialog`, `ThemedTable`

They should not import from `src/pages`, `src/showcase`, `src/app`, or individual source paths. The library build and declarations are limited by `tsconfig.lib.json` to the package boundary:

```text
src/index.ts
src/theme/**/*
src/components/themed/**/*
src/providers/**/*
```

## Theme source of truth

`src/theme/inflow.ts` is the canonical theme definition. It owns:

```mermaid
flowchart LR
  Tokens["Design tokens"] --> Theme["src/theme/inflow.ts"]
  Theme --> Palette["Palette + Inflow extensions"]
  Theme --> Typography["Typography"]
  Theme --> Shape["Shape + shadows"]
  Theme --> Overrides["MUI component overrides"]
  Theme --> Provider["InflowProvider"]
  Provider --> Baseline["Scoped baseline + --infl-* variables"]
  Provider --> Mui["Plain MUI components"]
  Provider --> Wrappers["Themed wrappers"]
```

- palette and Inflow-specific palette extensions;
- typography and font stack;
- spacing and shape defaults;
- elevation/shadow values;
- MUI component `defaultProps` and `styleOverrides`;
- scoped CSS variables used by themed surfaces.

Most visual consistency should be solved here first. If a style can be expressed as an MUI default or override, prefer the theme over repeating `sx` in individual product apps.

## Microfrontend provider

`InflowProvider` is the preferred consumer entry point. It creates the Inflow
theme, applies `ScopedCssBaseline`, and places the `--infl-*` variables on a
`data-inflow-root` container rather than the host document's `body` or `:root`.
It also uses an Emotion cache with the `inflow` key by default. Independently
deployed microfrontends sharing a page should supply distinct `cacheKey` values.
For a Shadow DOM or iframe, consumers can pass an `emotionCache` configured for
the target container.

MUI portal components render outside the provider root by default. Theme values
continue to flow through React context, but consumer-authored `var(--infl-*)`
styles in dialog, menu, or tooltip content need a matching portal container.

## Token exports

`src/theme/tokens.ts` exports raw token constants. These are useful when:

- building a custom surface that is not a MUI component;
- sharing values outside `sx` or `styled()`;
- documenting exact design-system values.

Do not reach for tokens first when a normal MUI component under `ThemeProvider` can do the job. Theme-first keeps the design system easier to evolve.

## Themed wrappers

`src/components/themed/` contains small wrapper components around MUI primitives. They exist for repeated product patterns that need a stronger shared contract than global theme overrides alone.

Use wrapper components when:

- the same Inflow-specific component pattern appears in multiple apps;
- the component needs a simplified API, such as `ThemedTable` with `columns` and `data`;
- a local app would otherwise copy the same token-heavy `sx` block repeatedly.

Prefer plain MUI components when:

- the global theme already gives the expected look;
- the styling is one-off and local to one app;
- the wrapper would hide useful MUI behavior without adding an Inflow convention.

Wrapper components should preserve MUI ergonomics: forward refs, extend the relevant MUI prop type, and keep `sx` composable.

## Showcase app

The showcase app is the documentation and review surface. It is not the package API.

Important paths:

- `src/app/routes.tsx` - routes for `/`, `/components`, `/tokens`, `/guidelines`, and examples.
- `src/app/ThemeContext.tsx` - wraps the showcase with `ThemeProvider` and allows comparison with the default MUI theme.
- `src/showcase/categories.ts` - component catalog metadata.
- `src/showcase/demos/` - demo implementations for individual MUI components.
- `src/pages/GuidelinesPage.tsx` - live import/versioning guidance.

The showcase should demonstrate how consumers should use the theme, but demos can include explanatory code that should not be copied into production apps unchanged.

### Deployed showcase

The showcase is automatically deployed to **GitHub Pages** on every push to `master`:

- Live URL: `https://inriver.github.io/inflow-react/`
- Workflow: `.github/workflows/deploy-showcase.yml`
- Build command: `npm run build -- --base /inflow-react/`
- Router: `createHashRouter` so deep links work on the static GitHub Pages host.

Because GitHub Pages serves the repo under the `/inflow-react/` subpath, Vite's `base` is set to `/inflow-react/` during the deploy build. `public/404.html` handles hard refreshes on deep routes by redirecting to the hash-based route the SPA can render.

## Build flow

`npm run build` performs three related tasks:

```mermaid
sequenceDiagram
  participant Dev as Developer
  participant TSC as tsc -b
  participant ViteApp as vite build
  participant ViteLib as vite.lib.config.ts
  participant Types as tsconfig.lib.json
  participant Dist as dist/

  Dev->>TSC: npm run build
  TSC->>ViteApp: typecheck passes
  ViteApp->>Dist: showcase HTML/CSS/JS
  ViteApp->>ViteLib: npm run build:lib
  ViteLib->>Dist: ES + CJS package bundles
  Types->>Dist: declaration files
```

1. TypeScript project build with `tsc -b`.
2. Showcase build with the normal Vite config.
3. Library build through `vite.lib.config.ts` plus declaration output from `tsconfig.lib.json`.

`vite.lib.config.ts` externalizes React, React DOM, MUI, and Emotion. This is intentional: consuming apps own those dependencies through peer dependencies, which avoids duplicate React trees and duplicate MUI style engines.

## Change workflow

For theme changes:

1. Start in `src/theme/inflow.ts`.
2. Add token exports only if non-MUI consumers need direct values.
3. Add a themed wrapper only for repeated cross-app patterns.
4. Update showcase demos or `/guidelines` when the intended usage changes.
5. Run `npm run build`.
6. Release through a compatibility checkpoint only after consuming apps validate the change.

## Stability rule

The stable API is the package root export, not the repository structure. Internal files may move as the showcase evolves. Consumers should depend on package exports and compatibility checkpoints, not on source paths or assumptions about the showcase app.
