# Inflow React Design System

## 1. Atmosphere & Identity

Inflow is a calm, operational product-information workspace: dense enough for catalog work, but visually quiet so data and task state remain primary. Its signature is the deep navy application chrome framing pale blue work surfaces, with focused and selected data expressed through the same restrained blue ramp.

## 2. Color

### Palette

| Role | Source token | Light value | Dark value | Usage |
|---|---|---:|---:|---|
| Application background | `theme.palette.inflow.appBackground` | `#ebf1fc` | `#0b1220` | Page canvas and structural headers |
| Navigation surface | `theme.palette.inflow.navSurface` | `#0b2d6e` | `#16243d` | Primary application rail |
| Primary action | `theme.palette.primary.main` | `#0b2d6e` | `#91c2fd` | Buttons, links, active navigation, focus |
| Primary hover | `theme.palette.primary.dark` | `#003687` | `#6fa8ff` | Primary-action hover |
| Surface | `theme.palette.background.paper` | `#ffffff` | `#111a2c` | Grids, cards, panels, inputs |
| Surface low | `theme.palette.inflow.surfaceLow` | `#f1f6fe` | `#162036` | Quiet contextual regions and hover |
| Surface highest | `theme.palette.inflow.surfaceHighest` | `#e3e9f8` | `#283a5c` | Inline code chips, strongest tonal step |
| Text primary | `theme.palette.text.primary` | `#191b24` | `#f0f4fb` | Headings and values |
| Text secondary | `theme.palette.text.secondary` | `#424655` | `#c2cad8` | Supporting copy and metadata |
| Outline | `theme.palette.inflow.outlineVariant` | `#c2c6d8` | `#4f6089` | Dividers, card borders, grid rows |
| Field border | `theme.palette.inflow.outline` (dark) | `#c2c6d8` | `#98a2b8` | Input borders; dark uses the stronger tone to clear 3:1 |
| Selection | `theme.palette.inflow.rowSelected` | `rgba(11,45,110,0.08)` | `rgba(145,194,253,0.16)` | Selected rows and focused context |
| Success | `theme.palette.success.main` | `#2c9b4b` | `#6fcf8a` | Confirmed/active state |
| Warning | `theme.palette.warning.main` | `#ff6424` | `#ff8a50` | Pending/caution state |
| Info | `theme.palette.info.main` | `#0057cf` | `#7db3ff` | Informational state |
| Error | `theme.palette.error.main` | `#ba1a1a` | `#f2685f` | Destructive and error state |

### Dark mode

Dark mode keeps the brand's navy hue (about 219°) and changes only lightness and saturation. It is in development: it is on in the local dev server and off in the published package and deployed showcase until the `INFLOW_DARK_MODE_ENABLED` flag is flipped deliberately. Light values are the shipped look and are locked by `lightModeGuard.test.ts`.

- Surfaces get lighter as they rise: app background `#0b1220`, then surface low, paper, container, container high and highest. Elevation is expressed by these tonal steps, not shadows.
- Avoid pure black and pure white. Text is `#f0f4fb` and `#c2cad8`.
- Accents are lifted and slightly desaturated so they read on dark surfaces. Primary becomes `#91c2fd` and carries navy (`#101a2b`) text. Status colors keep their hue and carry navy text when filled.
- AG Grid receives `inflowGridThemeParamsDark` with the dark color scheme part; consumers pick it by mode.
- Alerts and toasts blend the status color 34% into the dark surface, with on-surface text and a status-colored icon (at least 3:1).
- `darkContrast.test.ts` fails if text, filled-status text or field borders fall below AA on any dark surface.

### Rules

- React components consume semantic MUI/Inflow theme tokens; raw colors remain confined to token-definition files.
- The navy accent communicates action, active navigation, focus, and selection, not decoration.
- AG Grid receives the dependency-free `inflowGridThemeParams` values (light) or `inflowGridThemeParamsDark` (dark) and optional selection/header-action recipes from `@inriver/inflow-react/ag-grid`.

## 3. Typography

### Scale

| Level | MUI variant / size | Weight | Usage |
|---|---|---:|---|
| Page title | `h4` / theme-defined | 700 | Standalone example titles |
| Structural title | `h6` / theme-defined | 500-700 | Page headers and panel titles |
| Section title | `h5` / theme-defined | 500-700 | Component guidance sections |
| Body | `body1` / `1rem` | 400 | Explanatory copy |
| Body small | `body2` / `0.875rem` | 400-500 | Operational copy and controls |
| Caption | `caption` / `0.75rem` | 400-500 | Context and metadata |
| Grid | `inflowTokens.grid.fontSize` / `0.875rem` | 400 | Cell values |

The table above lists the levels Inflow screens use most. The Tokens page in the showcase documents all 13 MUI variants (`h1`–`h6`, `subtitle1/2`, `body1/2`, `button`, `caption`, `overline`) straight from `theme.typography`. The CSS `--text-*` tokens follow Material 3 role names; the theme variant they map to is listed in `docs/ports/MUI9_TOKEN_MAP.md`.

### Font Stack

- Primary: `inflowTokens.typography.fontFamily` (`Inter`, then system UI fallbacks).
- Mono: platform UI monospace only for identifiers where required.

### Rules

- Use MUI typography variants instead of ad-hoc font sizes for page copy.
- Data may truncate with an accessible full value where the grid owns overflow; headings and instructions must wrap naturally.

## 4. Spacing & Layout

### Base Unit

All spacing is derived from the existing 4px Inflow scale and MUI `theme.spacing()`.

| Token | Value | Usage |
|---|---:|---|
| `inflowTokens.spacing.xxs` | 4px | Tight icon/label relationships |
| `inflowTokens.spacing.xs` | 8px | Compact control groups |
| `inflowTokens.spacing.s` | 16px | Standard component padding |
| `inflowTokens.spacing.m` | 24px | Page and section padding |
| `inflowTokens.spacing.l` | 48px | Major section separation |
| `inflowTokens.spacing.xl` | 96px | Maximum layout separation |

### Grid

- Product examples use an application shell: 72px themed navigation rail, fluid main workspace, and optional 320/400/520px right panel.
- The main workspace owns horizontal overflow; AG Grid owns column scrolling and virtualized row scrolling.
- At narrow widths, secondary controls wrap and the assistant switches from push to overlay behavior so primary content remains usable.

## 5. Components

### AG Grid Data Surface

- **Structure**: themed toolbar/context strip, `AgGridReact`, optional focused-cell context.
- **Variants**: comfortable and compact density; product-owned column definitions.
- **Spacing**: grid values come from `inflowGridThemeParams`; local density overrides remain multiples of 4px.
- **States**: default, row hover, row selected, cell focus, cell editing, filtered, empty.
- **Accessibility**: AG Grid owns grid roles, keyboard navigation, focus, selection, sorting, filtering, and editing announcements.
- **Motion**: only the existing 120ms opacity treatment for contextual selection/header controls.
- **Layout**: the grid is the scroll owner inside a min-height-safe flex workspace.
- **Usage rule**: use AG Grid with the Inflow theme for every single or focused product data table. Use MUI `Table` only for compact, read-only summaries embedded in composite surfaces such as chat. Keep the legacy `ThemedTable` as a showcase comparison, not a recommendation for new product work.

### ThemedAppNav

- **Structure**: fixed 72px `nav` rail with primary items and optional pinned footer items.
- **States**: default, hover, active, keyboard focus.
- **Accessibility**: labeled navigation landmark and `aria-current="page"` for the active item.
- **Layout**: left edge of the application-shell sample.

### ThemedPageHeader

- **Structure**: optional back action, eyebrow/title cluster, and page actions.
- **States**: standard themed button states for actions.
- **Accessibility**: one visible page heading and named actions.
- **Layout**: fixed structural row above the workspace content.

### ThemedRightPanel + ThemedChatPanel

- **Structure**: push or overlay panel containing assistant selector, message thread, composer, and close/expand controls.
- **Variants**: assistant panel at narrow, medium, or wide width.
- **States**: closed, opening, open, focused, typing/streaming, disabled composer.
- **Accessibility**: complementary landmark, named controls, keyboard-close behavior, visible focus, and labeled composer.
- **Motion**: MUI slide/fade transitions; reduced-motion behavior follows the theme and platform preference.
- **Layout**: right-side panel; push on desktop, overlay on narrow viewports.

### ThemedChatAccordion

- **Structure**: product-owned reasoning labels rendered by a shared ordered-step shell.
- **States**: completed steps remain quiet inline text while streaming; the sole active step is an outlined row with a tool glyph and trailing progress indicator; finalized steps move into a borderless accordion that starts collapsed.
- **Accessibility**: streaming updates use a polite live region, the active row exposes `aria-current="step"`, decorative activity icons stay hidden from assistive technology, and the completed summary is a named keyboard control.
- **Usage**: hosts own step wording and lifecycle state; the design system owns spacing, current-step emphasis, and collapse behavior.

### Overview navigation groups

- **Structure**: one outlined surface with a descriptive header and a flush, segmented grid of `CardActionArea` links.
- **Variants**: product-screen links use vertical tiles; frequently used component links use compact horizontal rows.
- **States**: default, quiet tonal hover, keyboard focus, and pressed feedback from the themed MUI interaction layer.
- **Accessibility**: every destination is one named link with supporting copy; icons and arrows are decorative.
- **Layout**: one column at narrow widths, two at tablet widths, then five screen links or three component links at desktop widths.
- **Depth**: segmentation uses `outlineVariant` and `surfaceLow`; static navigation groups do not use shadows.

### ThemedToast guidance banner

- **Structure**: persistent severity icon, short semibold title, and regular-weight explanatory copy.
- **Variants**: single-line notification by default; full-width multiline guidance within documentation surfaces.
- **States**: informational guidance has no action or dismiss control unless the product flow explicitly requires one.
- **Accessibility**: informational guidance uses a polite status role; warning and error variants use an alert role.
- **Usage**: use the shared `ThemedToast` for prominent documentation guidance instead of recreating an MUI `Alert` treatment.

## 6. Motion & Interaction

| Type | Duration | Source | Usage |
|---|---:|---|---|
| Micro | 120-150ms | component/token recipe | Contextual grid controls and nav feedback |
| Standard | MUI theme duration | `theme.transitions` | Right-panel open/close and layout response |

- Motion communicates hover, selection, focus, or panel state only.
- Prefer opacity and transform. Avoid decorative animation and layout-property animation.
- Honor `prefers-reduced-motion` in custom animation and transforms. MUI's `theme.motion.reducedMotion` defaults to `'never'` and the theme does not override it, so MUI's own transitions do not currently follow the setting.
- Overview navigation adapts beui.dev's `shared-layout-bg` affordance to a 120ms tonal hover plus a short directional-arrow transform; reduced motion keeps the tonal state and removes the transform.

## 7. Depth & Surface

The existing system uses a mixed but restrained strategy: tonal surface shifts and 1px outlines separate most work areas; shadows are reserved for overlays, menus, dialogs, and elevated transient UI. Do not add shadows to static grid or navigation surfaces. In dark mode, shadows cannot show, so raised surfaces step lighter: elevation 1–2 uses surface low, 3–8 (menus, popovers) surface container, and 9 and above (dialogs) surface container high. Outlined papers keep the base surface. Cards are the exception: in dark they sit on the base surface, as in light, and a raised card gets a soft 1px `surfaceVariant` hairline (the outlined card keeps its defined `outlineVariant` line) instead of a lighter surface; menus get a 1px `outline` edge.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- Target WCAG 2.2 AA: 4.5:1 body-text contrast, 3:1 large text and meaningful non-text UI. This holds in both modes, except the item under Accepted Debt below; disabled controls are exempt.
- Every control is keyboard reachable and has a visible focus state and accessible name.
- AG Grid remains the semantic and keyboard owner for all data-table examples.
- The focused-cell assistant context must be visible in text, not conveyed by color alone.
- At 375px, primary content remains readable without page-level horizontal scrolling; the grid may scroll within its own region.

### Accepted Debt

| Item | Location | Why accepted | Owner / Exit |
|---|---|---|---|
| Light outlined field border is 1.70:1 on white, under the 3:1 non-text guideline (dark is 6.8:1) | `outlineVariant` (`#c2c6d8`) on `OutlinedInput`, light mode | Matches stock MUI's own default (`rgba(0,0,0,0.23)`, 1.74:1) and the shipped light look, which is not being reworked | Design. Exit: switch the light field border to `outline` (`#727787`, 4.46:1), a visible change to every field |
| Outlined button border is 1.70:1 on white (light) and 2.79:1 on dark paper (dark), under the 3:1 non-text guideline; the label passes AA in both modes | `outlineVariant` on the outlined `Button` variants, light and dark | The label identifies the control, so the border is decorative under the stricter reading of WCAG 1.4.11; matches the shipped look | Design. Exit: switch the border to `outline` (`#727787` light, 4.46:1; `#98a2b8` dark, 6.8:1), a visible change to every outlined button |
