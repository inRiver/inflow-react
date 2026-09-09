# Inflow React Design System

## 1. Atmosphere & Identity

Inflow is a calm, operational product-information workspace: dense enough for catalog work, but visually quiet so data and task state remain primary. Its signature is the deep navy application chrome framing pale blue work surfaces, with focused and selected data expressed through the same restrained blue ramp.

## 2. Color

### Palette

| Role | Source token | Light value | Usage |
|---|---|---:|---|
| Application background | `theme.palette.inflow.appBackground` | Inflow surface token | Page canvas and structural headers |
| Navigation surface | `theme.palette.inflow.navSurface` | Inflow navy token | Primary application rail |
| Primary action | `theme.palette.primary.main` | `#0b2d6e` | Buttons, links, active navigation, focus |
| Primary hover | `theme.palette.primary.dark` | `#003687` | Primary-action hover |
| Surface | `theme.palette.background.paper` | `#ffffff` | Grids, cards, panels, inputs |
| Surface low | `theme.palette.inflow.surfaceLow` | `#f1f6fe` | Quiet contextual regions and hover |
| Text primary | `theme.palette.text.primary` | `#191b24` | Headings and values |
| Text secondary | `theme.palette.text.secondary` | `#424655` | Supporting copy and metadata |
| Outline | `theme.palette.inflow.outlineVariant` | `#c2c6d8` | Dividers, fields, grid rows |
| Selection | `theme.palette.inflow.rowSelected` | `rgba(11,45,110,0.08)` | Selected rows and focused context |
| Success | `theme.palette.success.main` | `#2c9b4b` | Confirmed/active state |
| Warning | `theme.palette.warning.main` | `#ff6424` | Pending/caution state |
| Error | `theme.palette.error.main` | `#ba1a1a` | Destructive and error state |

### Rules

- React components consume semantic MUI/Inflow theme tokens; raw colors remain confined to token-definition files.
- The navy accent communicates action, active navigation, focus, and selection, not decoration.
- AG Grid receives the dependency-free `inflowGridThemeParams` values and optional selection/header-action recipes from `@inriver/inflow-react/ag-grid`.

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
- Respect `prefers-reduced-motion` through the platform/MUI transition layer.
- Overview navigation adapts beui.dev's `shared-layout-bg` affordance to a 120ms tonal hover plus a short directional-arrow transform; reduced motion keeps the tonal state and removes the transform.

## 7. Depth & Surface

The existing system uses a mixed but restrained strategy: tonal surface shifts and 1px outlines separate most work areas; shadows are reserved for overlays, menus, dialogs, and elevated transient UI. Do not add shadows to static grid or navigation surfaces.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- Target WCAG 2.2 AA: 4.5:1 body-text contrast, 3:1 large text and meaningful non-text UI.
- Every control is keyboard reachable and has a visible focus state and accessible name.
- AG Grid remains the semantic and keyboard owner for all data-table examples.
- The focused-cell assistant context must be visible in text, not conveyed by color alone.
- At 375px, primary content remains readable without page-level horizontal scrolling; the grid may scroll within its own region.

### Accepted Debt

| Item | Location | Why accepted | Owner / Exit |
|---|---|---|---|
| None | — | — | — |
