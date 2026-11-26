# @inriver/inflow-react

Shared Inflow React and MUI theme, design tokens, and themed components for Inriver product UIs.

[![npm version](https://img.shields.io/npm/v/@inriver/inflow-react.svg)](https://www.npmjs.com/package/@inriver/inflow-react) [![license](https://img.shields.io/npm/l/@inriver/inflow-react.svg)](./LICENSE) [![React 19](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/) [![MUI 9](https://img.shields.io/badge/MUI-9-007fff)](https://mui.com/) [![status: beta](https://img.shields.io/badge/status-beta-blue)](https://github.com/inRiver/inflow-react/issues)

[Live showcase](https://inriver.github.io/inflow-react/) · [npm package](https://www.npmjs.com/package/@inriver/inflow-react)

> **Beta:** Public APIs follow Semantic Versioning: backward-compatible fixes use patch releases, backward-compatible additions use minor releases, and breaking API or peer-baseline changes require a major release. Light and dark modes are both enabled. Report bugs, rough edges, and requests through [GitHub Issues](https://github.com/inRiver/inflow-react/issues).

## Requirements and compatibility

Install a compatible version of each required peer dependency in the consuming application.

| Peer dependency | Compatible version |
| --- | --- |
| `react` | `^19.0.0` |
| `react-dom` | `^19.0.0` |
| `@mui/material` | `>=9.0.0 <10.0.0` |
| `@emotion/react` | `^11.13.0` |
| `@emotion/styled` | `^11.13.0` |

`@mui/x-date-pickers` (`>=9.0.0 <10.0.0`) and `dayjs` (`^1.11.0`) are optional peers: install them only if you import from `@inriver/inflow-react/datetime`. See [Optional date and time setup](#optional-date-and-time-setup).

Import most APIs from the package root; import AG Grid theme parameters from the `@inriver/inflow-react/ag-grid` subpath and the opt-in date and time APIs from the `@inriver/inflow-react/datetime` subpath:

```ts
import { InflowProvider, ThemedButton } from '@inriver/inflow-react';
```

Do not import showcase code, demo components, or internal source paths. The package ships TypeScript declarations and supports both ESM and CommonJS through its `exports` map.

Compatibility is managed through checkpoint tags. The current compatibility target is `react19-mui9.5` (React 19 / MUI 9.5); the prior `react19-mui9.4`, `react19-mui9.3`, and `react19-mui7.3` checkpoints remain available for apps still on MUI 9.4, 9.3, or 7. Use a checkpoint tag or an exact version when you need a known React and MUI contract. The `latest` tag is promoted automatically by CI and is never published to directly. The npm registry is authoritative for published versions and dist-tags.

## Installation

```sh
npm install @inriver/inflow-react@react19-mui9.5
npm install react@^19.0.0 react-dom@^19.0.0 @mui/material@">=9.0.0 <10.0.0" @emotion/react@^11.13.0 @emotion/styled@^11.13.0
```

Use the checkpoint tag instead of `latest` so the installed package stays on the validated React 19 and MUI 9 compatibility channel. If you are still on MUI 9.4, use the `react19-mui9.4` checkpoint tag; for MUI 9.3, use `react19-mui9.3`; for MUI 7, use `react19-mui7.3`.

## Quick start: existing/default setup

The default JavaScript entry does **not** register or download fonts. Existing apps keep their current font setup: the theme uses host-supplied Inter when available and otherwise system fallbacks. Built-in icons are SVG; caller-provided string icons still need a host-supplied Material Icons font or the optional setup below.

```tsx
import { InflowProvider } from '@inriver/inflow-react';
import { Button } from '@mui/material';

export function App() {
  return (
    <InflowProvider mode="light">
      <Button variant="contained">Save</Button>
    </InflowProvider>
  );
}
```

## Optional complete local-assets setup

To use the bundled Inter and legacy icon fonts without Google Fonts, add **one explicit import** to your framework's supported global CSS entry:

```ts
import '@inriver/inflow-react/local-assets.css';
```

Then use `InflowProvider` exactly as above. The showcase makes this choice explicitly; its appearance is **not** evidence that the library imports fonts by default. Existing consumers do not need to opt in or opt out, and no provider prop or JavaScript import has changed behavior.

| Setup | Inter text | Fixed built-in icons | Public string icons |
| --- | --- | --- | --- |
| Default JS entry only | Host Inter, otherwise system fallback | Bundled SVG | Host must supply Material Icons |
| Optional `local-assets.css` | Bundled, self-hosted Inter | Bundled SVG | Bundled, self-hosted Material Icons |
| Existing host font setup | Remains host-owned | Bundled SVG | Remains host-owned |

If your host already supplies one font family, use a narrower import instead of the combined one:

```ts
import '@inriver/inflow-react/fonts/inter.css'; // Text only
// OR, when you only need legacy string-icon support:
import '@inriver/inflow-react/fonts/material-icons.css';
```

The icon stylesheet supports both filled and outlined Material Icons. Public string APIs remain supported, including `ThemedChip.leadingIcon`, breadcrumb/menu/tab item icons and `ThemedAppNav` item icons. Custom React-node icons remain host-owned. Do not import the combined stylesheet and both narrower stylesheets together.

### What is bundled, and what it costs

- Inter ships as unmodified WOFF2 subsets: normal and italic, variable weights 100–900 and optical sizes 14–32; Latin, Latin Extended, Greek, Greek Extended, Cyrillic, Cyrillic Extended and Vietnamese coverage is retained.
- The font binaries add about **994 KB** to every package installation, even if an app never imports the CSS. In the initial implementation, the compressed npm package grew from about **207 KB to 1.22 MB**. These are package sizes, not automatic browser downloads; build/version changes can alter them.
- A bundler copies/rebases the referenced WOFF2 files into the app's output. Browsers request only the font subsets/styles used on the page after the relevant stylesheet is loaded. The combined stylesheet registers both icon fonts; unused faces need not download.
- Fixed icons are bundled SVGs and work without either stylesheet. Their new SVG DOM roots can affect consumer CSS that targeted old built-in font spans; prefer documented component slots or `.MuiSvgIcon-root`.

### Host setup, SSR and compatibility

The CSS registers **global** font families and icon classes, not provider-scoped assets. Import one chosen version at the host boundary, not once per provider or microfrontend. Opting in can change typography metrics and existing `Inter`/Material Icons registrations in a shared document; avoid conflicting versions and validate the host's layouts. Shadow DOM and iframe consumers must arrange styles/assets in the appropriate document or root.

Keep CSS imports in the global-style entry supported by your framework. Raw Node.js does not execute CSS imports; the existing ESM/CommonJS JavaScript entry remains CSS-free and SSR-compatible. A plain `createInflowTheme` plus MUI `ThemeProvider` still requires the host's normal baseline/root setup; font CSS is not a replacement for `InflowProvider` or MUI styling.

Serve the generated font URLs from your app (or your chosen asset CDN), preserve their paths, and allow that origin in your Content Security Policy's `font-src`. Ensure WOFF2 files are deployed with the app; fonts can still fail if the host blocks or omits them. This removes the dependency on external font servers, **not** every network dependency: installation, first app load, custom images/APIs and offline caching remain host responsibilities. A fully offline application still needs its own asset/cache strategy.

React, React DOM, MUI and Emotion remain required peer dependencies; this is not a standalone UI runtime. No `@mui/icons-material` install is required by consumers for the bundled fixed icons.

The main package remains MIT-licensed. Bundled fonts retain SIL Open Font License 1.1 notices under `dist/fonts/*/LICENSE`; provenance and checksums are in `dist/fonts/manifest.json`. See [third-party notices](./THIRD_PARTY_NOTICES.md) and [local-assets integration guide](./docs/LOCAL_ASSETS.md).

## `InflowProvider` props

`InflowProvider` applies `ScopedCssBaseline` and `--infl-*` CSS variables to a `data-inflow-root` container. It does not apply them to `body` or `:root`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | Required | React content rendered inside the scoped Inflow root. |
| `mode` | `InflowColorMode` | `'light'` | Color mode used to create the theme. Pass `'dark'` for dark mode; the consumer controls the mode. See [Color modes](#color-modes). |
| `className` | `string` | `undefined` | Class name applied to the scoped Inflow root. |
| `sx` | `SxProps<Theme>` | `undefined` | Additional styles for the scoped Inflow root. |
| `cacheKey` | `string` | `'inflow'` | Key for the provider-created Emotion cache. Use a distinct key for independently deployed roots sharing a page. |
| `emotionCache` | `EmotionCache` | `undefined` | Caller-owned Emotion cache, for example one targeting a Shadow DOM or iframe. When supplied, it overrides `cacheKey`. |

## API overview

Most public exports are available from `@inriver/inflow-react`; AG Grid theme parameters are available from `@inriver/inflow-react/ag-grid`, and date and time APIs only from `@inriver/inflow-react/datetime`.

| Group | Exports | Import path |
| --- | --- | --- |
| Provider | `InflowProvider`, `InflowProviderProps` | `@inriver/inflow-react` |
| Theme factories | `createInflowTheme`, `getInflowPalette`, `getInflowTokensForMode`, `createDefaultTheme` | `@inriver/inflow-react` |
| Theme instances | `inflowTheme`, `defaultTheme` | `@inriver/inflow-react` |
| Theme tokens | `inflowTokens`, `inflowCustomColors`, `inflowSpacing` | `@inriver/inflow-react` |
| Theme flags & types | `INFLOW_DARK_MODE_ENABLED`, `InflowColorMode` | `@inriver/inflow-react` |
| Components | `ThemedAccordion`, `ThemedAlert`, `ThemedAppNav` (+ `ThemedAppNavPlaceholder`), `ThemedAvatar` (+ `ThemedAvatarGroup`), `ThemedBadge`, `ThemedBreadcrumbs`, `ThemedButton`, `ThemedCard`, `ThemedChatPanel`, `ThemedChip`, `ThemedDetailPanel` (+ `ThemedDetailPanelSection`), `ThemedDialog`, `ThemedFileTypeIcon`, `ThemedMenu`, `ThemedPageHeader`, `ThemedRightPanel`, `ThemedStepper`, `ThemedTable`, `ThemedTabs` (+ `ThemedTabPanel`), `ThemedTextField`, `ThemedToast`, plus their prop types and `Column` | `@inriver/inflow-react` |
| AG Grid theme params | `inflowGridThemeParams`, `inflowGridThemeParamsDark`, `InflowGridThemeParams` | `@inriver/inflow-react/ag-grid` |
| Date and time preferences | `configureDateTime`, `getDateTimeFormats`, `DateTimeOptions`, `DateTimeFormats`, `DateTimeStyle`, `HourCycle` | `@inriver/inflow-react/datetime` |
| Date and time display | `formatDate`, `formatTime`, `formatDateTime`, `dateColumn`, `dateTimeColumn` | `@inriver/inflow-react/datetime` |
| Picker localization | `InflowLocalizationProvider`, `InflowLocalizationProviderProps` | `@inriver/inflow-react/datetime` |
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

## Color modes

Inflow has a light and a dark theme. Dark keeps the same navy brand hue and changes only lightness and saturation. Both modes ship enabled in the published package; the consumer chooses the mode through `InflowProvider`'s `mode` prop.

```tsx
import { InflowProvider } from '@inriver/inflow-react';

// The consumer controls the mode (own toggle, system preference, or fixed).
<InflowProvider mode={prefersDark ? 'dark' : 'light'}>{children}</InflowProvider>;
```

- **Scope:** `InflowProvider` colors only its own container. Set `color-scheme` and the page background on `html` yourself if you want the page edge and native scrollbars to follow the mode.
- **AG Grid:** pick the grid params by mode and add AG Grid's dark scheme part for dark:

```tsx
import { colorSchemeDark, themeQuartz } from 'ag-grid-community';
import { inflowGridThemeParams, inflowGridThemeParamsDark } from '@inriver/inflow-react/ag-grid';

const lightTheme = themeQuartz.withParams(inflowGridThemeParams);
const darkTheme = themeQuartz.withPart(colorSchemeDark).withParams(inflowGridThemeParamsDark);
```

- **Accessibility:** both modes target WCAG 2.2 AA (4.5:1 text, 3:1 meaningful UI); disabled controls are exempt. Dark values are listed in `DESIGN.md`.
- **Your own colors:** read colors from the theme (`theme.palette`, `theme.palette.inflow`) instead of hard-coding hex values, so they follow the active mode. Text placed on a filled color should use that color's `contrastText`.

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

## Optional date and time setup

`@inriver/inflow-react/datetime` provides date and time preferences, display formatters, AG Grid column fragments and localization for MUI X pickers. It needs two optional peers, even if you only use the formatters. The package root never loads them.

```sh
npm install @mui/x-date-pickers@">=9.0.0 <10.0.0" dayjs@^1.11.0
```

Use `InflowProvider` once at the app root and `InflowLocalizationProvider` around MUI X pickers inside it:

```tsx
import { InflowProvider } from '@inriver/inflow-react';
import { configureDateTime, InflowLocalizationProvider } from '@inriver/inflow-react/datetime';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/de.js';

configureDateTime({ locale: 'de', hourCycle: '24' });

export function App() {
  return (
    <InflowProvider>
      <InflowLocalizationProvider>
        <DatePicker label="Due date" />
      </InflowLocalizationProvider>
    </InflowProvider>
  );
}
```

Set shared defaults with `configureDateTime`. Provider props (`locale`, `hourCycle`, `style`) override them for that provider, and a mounted provider follows later configuration changes for the values it does not override. `getDateTimeFormats` returns the Day.js patterns; `formatDate`, `formatTime` and `formatDateTime` return display text, and accept the same options to override the defaults for one call.

- **Tables and pickers.** Table formats always use a Gregorian calendar, Latin digits, English month names and AM/PM. Pickers use the Day.js locale if you load it before rendering (`import 'dayjs/locale/de.js'`; keep the `.js`, which plain Node ESM needs on the server), so a 12-hour clock or the `unambiguous` style can show that locale's words in picker fields while tables stay English.
- **Leading zeros.** Pickers and the built-in field components respect the pattern's leading zeros. A custom `slots.field` replacement receives `shouldRespectLeadingZeros` from the picker, so pass the props on to `useDateField` (or the matching hook). A field you build outside a picker has to set it itself. To turn it off, set `shouldRespectLeadingZeros` in the picker's `slotProps.field`, or set the `MuiDateField`, `MuiTimeField` or `MuiDateTimeField` theme default above `InflowLocalizationProvider`; a theme nested below it that sets only the field default does not reach the pickers.
- **Time zones.** `configureDateTime({ timeZone })` (or the `timeZone` option of a formatter) sets the zone in which table formatters show a moment in time: an ISO string ending in `Z` or an offset, a `Date`, or a millisecond number. ISO values without an offset, such as `2022-03-09T16:33:00` or a date-only `2022-03-09`, are wall-clock values and are shown as written. Any other string that the browser can parse, and any unknown zone name, falls back to the browser's time zone.
  - **Pickers.** The same zone (the `timeZone` prop of `InflowLocalizationProvider`, or else the configured one) becomes the default `timezone` of the MUI X `TimePicker` and `DateTimePicker`, so a picker shows and writes the same wall time as a table. It only applies once your app has registered the Day.js `utc` and then `timezone` plugins (`dayjs.extend(utc); dayjs.extend(timezone)`, with `.js` in the paths for plain Node ESM); without them pickers ignore the zone, because MUI X cannot use one. A `timezone` prop on a picker wins. Unknown names, `default`, `system` and numeric offsets are ignored.
  - **Dates.** Date-only pickers (`DatePicker`, `DateField`) are never converted: converting a date to another zone can show the day before or after.
  - **Values.** `onChange` hands back a Day.js value in the zone of the value you gave the picker, or in the picker's zone when it had none, so persist it with `value.toISOString()`. Build values from an instant (`dayjs.utc(...)` or `dayjs.tz(...)`): `dayjs('2024-01-01T07:30')` is read in the browser's zone, and a table would show that same text unconverted.
  - **Changing the zone.** Pickers that already hold a value update when the zone changes. An empty picker that is already mounted keeps reading what is typed in the zone it mounted with, so set the zone before pickers mount, or give the picker a `key` that includes the zone so it remounts. A provider nested in another one uses its own zone for its pickers.
  - **Limits.** Standalone `TimeField` and `DateTimeField` take no default and need their own `timezone` prop; do not set a `timezone` default for them in the theme, because MUI X applies it to the field after the picker's zone. Pickers use Day.js's `timezone` plugin, which reads wall times in the device's zone: on a device in a daylight-saving zone, a time that falls in that zone's skipped hour on the spring-forward day shows an hour later than the table does.
- **SSR.** Set shared defaults before rendering and use the same values on the server and the client, and load the same Day.js locales before hydration. If you use a time zone for pickers, register the Day.js `utc` and `timezone` plugins before both the server and the client render, or the two render different picker values. `configureDateTime` changes module-wide state, so do not call it per request; pass request-specific preferences as provider props or formatter options.

### AG Grid date columns

Spread `dateColumn` or `dateTimeColumn` into a column definition, for example `{ field: 'createdAt', ...dateTimeColumn }`. They format the cell and the Enterprise Set Filter labels and leave the cell value unchanged. Choose the filter yourself: the default filter works on the raw value, not on the shown text. After `configureDateTime` changes a preference, call `api.refreshCells({ force: true })` and re-apply filters with `api.onFilterChanged()`.

AG Grid normally exports and copies the shown text. Set `useValueFormatterForExport: false` to keep the raw values, or use `processCellCallback` (CSV and Excel) or `processCellForClipboard` to write your own output. For machine timestamps, keep ISO 8601 values with an offset or `Z`: the `iso` style is a `YYYY-MM-DD HH:mm` display pattern, not a machine timestamp.

## SSR and Next.js

For SSR or Next.js, follow the [official MUI Next.js integration guide](https://mui.com/material-ui/integrations/nextjs/).

## Documentation

| Resource | Link |
| --- | --- |
| Live showcase | [inriver.github.io/inflow-react](https://inriver.github.io/inflow-react/) |
| npm package | [npmjs.com/package/@inriver/inflow-react](https://www.npmjs.com/package/@inriver/inflow-react) |
| Local setup | [`docs/LOCAL_SETUP.md`](docs/LOCAL_SETUP.md) |
| Contributing | [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) |
| Architecture | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| Versioning | [`docs/VERSIONING.md`](docs/VERSIONING.md) |
| Publishing | [`docs/PUBLISHING.md`](docs/PUBLISHING.md) |
| Issues | [GitHub Issues](https://github.com/inRiver/inflow-react/issues) |

## Contributing

- Start theme changes in the canonical theme definition.
- Add tokens only for custom or non-MUI surfaces that need direct values.
- Add wrappers only for repeated patterns that need a shared contract.
- Run `npm run build` before handing off a change.

See [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) for the full checklist, including the demo-test rule. For the architecture and package boundary, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## License

MIT. See [`LICENSE`](LICENSE).
