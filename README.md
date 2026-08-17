# @inriver/inflow-react

Shared Inflow React and MUI theme, design tokens, and themed components for Inriver product UIs.

[![npm version](https://img.shields.io/npm/v/@inriver/inflow-react.svg)](https://www.npmjs.com/package/@inriver/inflow-react) [![license](https://img.shields.io/npm/l/@inriver/inflow-react.svg)](./LICENSE) [![React 19](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/) [![MUI 9](https://img.shields.io/badge/MUI-9-007fff)](https://mui.com/) [![status: alpha](https://img.shields.io/badge/status-alpha-orange)](https://github.com/inRiver/inflow-react/issues)

[Live showcase](https://inriver.github.io/inflow-react/) · [npm package](https://www.npmjs.com/package/@inriver/inflow-react)

> **Alpha:** APIs may change. Only light mode is currently enabled; dark mode is still feature-flagged off. Report bugs, rough edges, and requests through [GitHub Issues](https://github.com/inRiver/inflow-react/issues).

## Requirements and compatibility

Install a compatible version of each peer dependency in the consuming application.

| Peer dependency | Compatible version |
| --- | --- |
| `react` | `^19.0.0` |
| `react-dom` | `^19.0.0` |
| `@mui/material` | `>=9.0.0 <10.0.0` |
| `@emotion/react` | `^11.13.0` |
| `@emotion/styled` | `^11.13.0` |

Import most APIs from the package root; import AG Grid theme parameters from the `@inriver/inflow-react/ag-grid` subpath:

```ts
import { InflowProvider, ThemedButton } from '@inriver/inflow-react';
```

Do not import showcase code, demo components, or internal source paths. The package ships TypeScript declarations and supports both ESM and CommonJS through its `exports` map.

Compatibility is managed through checkpoint tags. The current checkpoint is `react19-mui9.3` (React 19 / MUI 9.3). The previous checkpoint, `react19-mui7.3`, remains available for apps still on MUI 7. Use a checkpoint tag or an exact version when you need a known React and MUI contract. The `latest` tag is promoted automatically by CI and is never published to directly.

## Installation

```sh
npm install @inriver/inflow-react@react19-mui9.3
npm install react@^19.0.0 react-dom@^19.0.0 @mui/material@">=9.0.0 <10.0.0" @emotion/react@^11.13.0 @emotion/styled@^11.13.0
```

Use the checkpoint tag instead of `latest` so the installed package stays on the validated React 19 and MUI 9 compatibility channel. If you are still on MUI 7, use the `react19-mui7.3` checkpoint tag instead.

## Quick start

```tsx
import { InflowProvider, ThemedButton } from '@inriver/inflow-react';

export function App() {
  return (
    <InflowProvider mode="light">
      <ThemedButton>Save</ThemedButton>
    </InflowProvider>
  );
}
```

## `InflowProvider` props

`InflowProvider` applies `ScopedCssBaseline` and `--infl-*` CSS variables to a `data-inflow-root` container. It does not apply them to `body` or `:root`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | Required | React content rendered inside the scoped Inflow root. |
| `mode` | `InflowColorMode` | `'light'` | Color mode used to create the theme. Only light mode is currently enabled; dark mode is still feature-flagged off. |
| `className` | `string` | `undefined` | Class name applied to the scoped Inflow root. |
| `sx` | `SxProps<Theme>` | `undefined` | Additional styles for the scoped Inflow root. |
| `cacheKey` | `string` | `'inflow'` | Key for the provider-created Emotion cache. Use a distinct key for independently deployed roots sharing a page. |
| `emotionCache` | `EmotionCache` | `undefined` | Caller-owned Emotion cache, for example one targeting a Shadow DOM or iframe. When supplied, it overrides `cacheKey`. |

## API overview

Most public exports are available from `@inriver/inflow-react`; AG Grid theme parameters are available from `@inriver/inflow-react/ag-grid`.

| Group | Exports | Import path |
| --- | --- | --- |
| Provider | `InflowProvider`, `InflowProviderProps` | `@inriver/inflow-react` |
| Theme factories | `createInflowTheme`, `getInflowPalette`, `getInflowTokensForMode`, `createDefaultTheme` | `@inriver/inflow-react` |
| Theme instances | `inflowTheme`, `defaultTheme` | `@inriver/inflow-react` |
| Theme tokens | `inflowTokens`, `inflowCustomColors`, `inflowSpacing` | `@inriver/inflow-react` |
| Theme flags & types | `INFLOW_DARK_MODE_ENABLED`, `InflowColorMode` | `@inriver/inflow-react` |
| Components | `ThemedButton`, `ThemedTextField`, `ThemedCard`, `ThemedChip`, `ThemedDialog`, `ThemedTable`, plus their prop types and `Column` | `@inriver/inflow-react` |
| AG Grid theme params | `inflowGridThemeParams`, `InflowGridThemeParams` | `@inriver/inflow-react/ag-grid` |

The components are thin MUI wrappers. See the [live showcase](https://inriver.github.io/inflow-react/) for behavior and props.

## Theming and tokens

Use `inflowTokens` for custom surfaces that are not MUI components. Prefer the MUI theme for normal MUI components.

```ts
import { inflowTokens } from '@inriver/inflow-react';

const customSurface = {
  backgroundColor: inflowTokens.colors.surfaceLow,
  borderRadius: inflowTokens.radius.md,
};
```

## AG Grid theme

Use `@inriver/inflow-react/ag-grid` to theme AG Grid v33+ with `themeQuartz.withParams`. The export is a dependency-free parameter object, so the AG Grid packages remain the consumer&apos;s dependency.

```tsx
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community'; // or 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react';
import { inflowGridThemeParams } from '@inriver/inflow-react/ag-grid';

// Register AG Grid modules once, at app startup.
ModuleRegistry.registerModules([AllCommunityModule]);

// Build the AG Grid theme from the Inflow params.
const theme = themeQuartz.withParams(inflowGridThemeParams);

export function ProductsGrid({ rows, columns }) {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <AgGridReact theme={theme} rowData={rows} columnDefs={columns} />
    </div>
  );
}
```

Override density per grid by spreading the params: `themeQuartz.withParams({ ...inflowGridThemeParams, headerHeight: 36, rowHeight: 35 })`.

Inside an `InflowProvider`, use the scoped CSS variables for CSS authored outside MUI:

```css
.custom-surface {
  background: var(--infl-surface-container-low-color);
  color: var(--infl-on-surface-color);
  border-color: var(--infl-outline-variant-color);
}
```

### Advanced integration

- Use `createInflowTheme(mode)` when you need to construct the theme directly, or use `inflowTheme` for the default light theme.
- For multiple roots or independently deployed microfrontends on one page, pass a distinct `cacheKey` to each provider.
- For a Shadow DOM or iframe, pass an `emotionCache` configured for the target container. It overrides `cacheKey`.
- MUI portal components render outside the provider root by default. Theme values still flow through React context, but consumer-authored `var(--infl-*)` styles in portal content need a matching portal container.

## SSR and Next.js

For SSR or Next.js, follow the [official MUI Next.js integration guide](https://mui.com/material-ui/integrations/nextjs/).

## Documentation

| Resource | Link |
| --- | --- |
| Live showcase | [inriver.github.io/inflow-react](https://inriver.github.io/inflow-react/) |
| npm package | [npmjs.com/package/@inriver/inflow-react](https://www.npmjs.com/package/@inriver/inflow-react) |
| Local setup | [`docs/LOCAL_SETUP.md`](docs/LOCAL_SETUP.md) |
| Architecture | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| Versioning | [`docs/VERSIONING.md`](docs/VERSIONING.md) |
| Publishing | [`docs/PUBLISHING.md`](docs/PUBLISHING.md) |
| Issues | [GitHub Issues](https://github.com/inRiver/inflow-react/issues) |

## Contributing

- Start theme changes in the canonical theme definition.
- Add tokens only for custom or non-MUI surfaces that need direct values.
- Add wrappers only for repeated patterns that need a shared contract.
- Run `npm run build` before handing off a change.

For the full architecture and package boundary, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## License

MIT. See [`LICENSE`](LICENSE).
