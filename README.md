# @inriver/inflow-react

[![npm version](https://img.shields.io/npm/v/@inriver/inflow-react.svg)](https://www.npmjs.com/package/@inriver/inflow-react)
[![npm downloads](https://img.shields.io/npm/dm/@inriver/inflow-react.svg)](https://www.npmjs.com/package/@inriver/inflow-react)
[![license](https://img.shields.io/npm/l/@inriver/inflow-react.svg)](./LICENSE)

**Shared Inflow React/MUI design-system: canonical theme, design tokens, and themed wrapper components.**

> **Status: Alpha.** APIs may still change between minor versions. Early adopters and feedback are very welcome - please open a [GitHub issue](https://github.com/inriver-ux-team/inflow-react/issues) with bugs, rough edges, or requests.

Gives Inriver product teams one shared theme contract with versioned compatibility checkpoints, so theme changes can be validated before other apps depend on them.

> Previously known internally as `inriver-react-theme`.

## Installation

```sh
npm install @inriver/inflow-react
```

## Usage

```tsx
import { CssBaseline, ThemeProvider } from '@mui/material';
import { inflowTheme, ThemedButton } from '@inriver/inflow-react';

export function App() {
  return (
    <ThemeProvider theme={inflowTheme}>
      <CssBaseline />
      <ThemedButton variant="contained">Save</ThemedButton>
    </ThemeProvider>
  );
}
```

Peer dependencies: `react` `^19.0.0`, `react-dom` `^19.0.0`, `@mui/material` `>=6.3.0 <6.4.0`, `@emotion/react` `^11.13.0`, `@emotion/styled` `^11.13.0`. You own the installed versions - this package only declares compatible ranges.

Import from the package root only (`@inriver/inflow-react`) - not showcase pages, demo components, or internal source paths. Those are documentation/demo code, not the stable package surface.

## What's included

- **Canonical MUI theme** - `src/theme/inflow.ts`
- **Design tokens** - `src/theme/tokens.ts`, for custom surfaces that can't use MUI directly
- **Themed wrapper components** - `ThemedButton`, `ThemedChip`, `ThemedDialog`, `ThemedTable`, `ThemedTextField`, `ThemedCard`
- **Live showcase** - a Vite app in this repo for design review and examples; not part of the published package

## Documentation

| Resource | Link |
| --- | --- |
| Package on npm | [npmjs.com/package/@inriver/inflow-react](https://www.npmjs.com/package/@inriver/inflow-react) |
| Local setup (Windows/macOS/Linux) | [`docs/LOCAL_SETUP.md`](docs/LOCAL_SETUP.md) |
| Architecture | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| Versioning & release model | [`docs/VERSIONING.md`](docs/VERSIONING.md) |
| Publishing checklist | [`docs/PUBLISHING.md`](docs/PUBLISHING.md) |
| Live usage & migration guidance | `/guidelines` in the showcase |
| Issues | [GitHub Issues](https://github.com/inriver-ux-team/inflow-react/issues) |

## Versioning

| Mechanism | Example | Purpose |
| --- | --- | --- |
| Exact version | `@inriver/inflow-react@0.1.0` | Immutable artifact, no movement. |
| Compatibility checkpoint tag | `@inriver/inflow-react@react19-mui6.3` | Moving channel for the same React/MUI contract; patch fixes land here after validation. |
| Patch range | `~0.1.0` | Accepts `0.1.x` fixes, blocks `0.2.0`+. |
| `latest` | `@inriver/inflow-react@latest` | Only promoted after adoption verification - never published to directly. |

`scripts/guard-publish.cjs` enforces this at publish time. Full model: [`docs/VERSIONING.md`](docs/VERSIONING.md).

## Local development

```sh
npm install
npm run dev    # showcase at http://localhost:5173/
npm run build  # builds the showcase app and the importable package
```

Full setup, prerequisites, and `npm link` workflow for local theme iteration: [`docs/LOCAL_SETUP.md`](docs/LOCAL_SETUP.md).

## Contributing

1. Update `src/theme/inflow.ts` first for palette, typography, and MUI overrides.
2. Update `src/theme/tokens.ts` only when custom/non-MUI surfaces need direct token access.
3. Add to `src/components/themed/*` only when a repeated component pattern deserves a shared wrapper.
4. Keep showcase examples aligned with real usage; showcase-only components are not package API.
5. Run `npm run build` before publishing or handing off a change.
6. Publish only through an approved checkpoint tag - never directly to `latest`.

## License

`MIT`. See [`LICENSE`](./LICENSE).
