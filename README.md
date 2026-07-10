# Inflow Design System

[![npm version](https://img.shields.io/npm/v/inriver-inflow.svg)](https://www.npmjs.com/package/inriver-inflow)
[![npm downloads](https://img.shields.io/npm/dm/inriver-inflow.svg)](https://www.npmjs.com/package/inriver-inflow)
[![license](https://img.shields.io/npm/l/inriver-inflow.svg)](./LICENSE)

Shared React/MUI design-system package and live showcase for Inflow product UIs, published on public npm as **`inriver-inflow`**.

> Previously known internally as `inriver-react-theme`.

```bash
npm install inriver-inflow
```

```tsx
import { CssBaseline, ThemeProvider } from '@mui/material';
import { inflowTheme, ThemedButton } from 'inriver-inflow';

export function App() {
  return (
    <ThemeProvider theme={inflowTheme}>
      <CssBaseline />
      <ThemedButton variant="contained">Save</ThemedButton>
    </ThemeProvider>
  );
}
```

Peer dependencies (you own the versions, this package just declares compatible ranges): `react` `^19.0.0`, `react-dom` `^19.0.0`, `@mui/material` `>=6.3.0 <6.4.0`, `@emotion/react` `^11.13.0`, `@emotion/styled` `^11.13.0`.

## Why this repo exists

Every app doesn't need to move onto the newest design work immediately. This repo gives teams a shared theme contract, versioned compatibility checkpoints, and a local development workflow so theme changes can be validated before other apps depend on them. See [`docs/VERSIONING.md`](docs/VERSIONING.md) for the full model - short version below.

## What's included

- **Canonical MUI theme** - `src/theme/inflow.ts`
- **Design token exports** - `src/theme/tokens.ts`, for custom surfaces that can't use MUI directly
- **Themed wrapper components** - `src/components/themed/` (`ThemedButton`, `ThemedChip`, `ThemedDialog`, `ThemedTable`, `ThemedTextField`, `ThemedCard`)
- **Live showcase** - `src/pages`, `src/showcase`, `src/app` (not part of the published package - see [Architecture](#architecture))

Import from the package root only:

```ts
import { inflowTheme, ThemedButton, inflowTokens } from 'inriver-inflow';
```

Do not import showcase pages, demo components, or internal source paths - those are documentation/demo code, not the stable package surface.

## Versioning at a glance

| Mechanism | Example | Purpose |
| --- | --- | --- |
| Exact version | `inriver-inflow@0.1.0` | Immutable artifact. Use when an app wants no movement. |
| Compatibility checkpoint tag | `inriver-inflow@react19-mui6.3` | Moving channel for the same React/MUI contract. Patch fixes move here after validation. |
| Patch range | `~0.1.0` | Accepts `0.1.x` fixes, blocks `0.2.0`+. |
| `latest` | `inriver-inflow@latest` | Only promoted after adoption verification. Never published to directly. |

The publish guard in `scripts/guard-publish.cjs` enforces this: releases must use an approved checkpoint tag, and direct publishing to `latest` is blocked.

```bash
npm install inriver-inflow@react19-mui6.3   # follow the validated checkpoint
npm install inriver-inflow@0.1.0            # pin an exact, frozen version
```

Full release model, fragmentation rationale, and diagrams: [`docs/VERSIONING.md`](docs/VERSIONING.md).

## Architecture

```text
inriver-inflow/
├── src/
│   ├── index.ts                  # Public package entry: theme + themed components only
│   ├── theme/
│   │   ├── inflow.ts             # Canonical MUI createTheme source
│   │   ├── tokens.ts             # Raw design tokens for custom surfaces
│   │   ├── default.ts            # Vanilla MUI comparison theme
│   │   └── index.ts              # Theme barrel exports
│   ├── components/themed/        # Public wrapper components
│   ├── app/                      # Showcase shell, router, theme toggle
│   ├── pages/                    # Showcase pages such as /guidelines and /tokens
│   ├── showcase/                 # Component catalog and demos
│   └── styles/                   # Showcase/global token CSS
├── vite.lib.config.ts            # Library build config
├── tsconfig.lib.json             # Declaration output limited to public package files
└── scripts/guard-publish.cjs     # Release-channel guard
```

The library build intentionally includes only `src/index.ts`, `src/theme/**/*`, and `src/components/themed/**/*`. Showcase pages and demos are useful examples, but they are not package API.

Full breakdown with diagrams: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Local development

```bash
npm install
npm run dev
```

Open the printed Vite URL (commonly `http://localhost:5173/`, or `5174` if another Vite app is already running). Useful routes: `/guidelines`, `/tokens`, `/components`, `/examples/*`.

```bash
npm run build   # builds both the showcase app and the importable package
```

Full setup (Windows/macOS/Linux, prerequisites, troubleshooting): [`docs/LOCAL_SETUP.md`](docs/LOCAL_SETUP.md).

### Active local theme development: `npm link`

Use this when changing the theme and testing against a consuming app without publishing.

```bash
# in inriver-inflow
npm install && npm run build && npm link

# in the consuming app
npm link inriver-inflow
npm ls react   # check for duplicate React installs if hook errors appear
```

```bash
# when finished
npm unlink inriver-inflow
npm install
```

Do not commit `file:` paths or local-link-only dependency changes.

### Publishing a checkpoint

```bash
npm version patch
npm run build
INFLOW_THEME_RELEASE_TAG=react19-mui6.3 npm publish --tag react19-mui6.3
```

Promote to `latest` only after adoption verification:

```bash
npm dist-tag add inriver-inflow@0.1.1 latest
```

Full checklist: [`docs/PUBLISHING.md`](docs/PUBLISHING.md).

## Feature flags

Dark-mode availability is controlled by `INFLOW_DARK_MODE_ENABLED`, exported from `src/theme/featureFlags.ts`. Check the live package value rather than relying on this README to stay current:

```ts
import { INFLOW_DARK_MODE_ENABLED } from 'inriver-inflow';
```

As of this writing the flag is `false` - the published package is light-mode only. The code is the source of truth, not this note.

## Contribution rules

1. Update `src/theme/inflow.ts` first for palette, typography, component defaults, and MUI overrides.
2. Update `src/theme/tokens.ts` only when custom/non-MUI surfaces need direct token access.
3. Add or change `src/components/themed/*` only when a repeated component pattern deserves a shared wrapper.
4. Keep showcase examples aligned with real usage, but don't treat showcase-only components as package API.
5. Run `npm run build` before publishing or handing off a theme change.
6. Publish only through an approved checkpoint tag; never publish directly to `latest`.

## Documentation map

- [`docs/LOCAL_SETUP.md`](docs/LOCAL_SETUP.md) - install prerequisites and run the showcase locally (Windows/macOS/Linux).
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) - how the theme codebase works, with diagrams.
- [`docs/PUBLISHING.md`](docs/PUBLISHING.md) - first public npm publish checklist and known environment blockers.
- [`docs/VERSIONING.md`](docs/VERSIONING.md) - release channels, fragmentation control, and adoption guidance, with diagrams.
- `/guidelines` in the showcase - live import, migration, and usage guidance.
