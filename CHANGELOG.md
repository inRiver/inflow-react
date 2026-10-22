# Changelog

All notable changes to `@inriver/inflow-react` are documented here. This project follows [Semantic Versioning](https://semver.org/).

## [3.10.3] - 2026-10-22

### Added
- Showcase-only: Changelog page in the showcase app renders library-facing changes parsed directly from `CHANGELOG.md`, with version jump-nav, color-coded subsection chips, and per-release cards.

### Changed
- The showcase Changelog page now parses handwritten entries directly from `CHANGELOG.md` (no generator step required for the page).

## [3.10.2] - 2026-10-22

### Added
- Showcase-only: the Tokens page documents spacing units 0.5–10, every MUI typography variant (size, weight, line height, letter spacing, and usage), the full light-mode palette from `theme.palette` including `palette.inflow`, and the three Inflow shadow levels with the MUI elevation ranges they cover.
- CSS tokens for the remaining Material 3 text roles (`display-large/medium/small`, `headline-medium`, `label-medium/small`) with matching `.text-*` utility classes (library-facing).
- Showcase-only: Grouped Inputs demo page that puts button groups, grouped options (Autocomplete `groupBy`, Select `ListSubheader`), and a number-with-unit field (number and unit select side by side with joined borders) on one page with compact controls inside each example (size, disabled, button group variant and orientation) that default to the small Inflow size, plus smoke tests.
- Showcase-only: Grouped Inputs field group section (two to five fields in a row with an icon or word between them, such as min/max) that stacks into one column when its container is narrow, with nine splits (even, first/last wider or narrower, 3:1, middle wider, ends wider), inputs or dropdowns per field, a separate icon/word/none separator for each gap, and a width-percentage readout, to review how a row should divide its space.
- Parity tests that keep `tokens.ts` and the CSS `--text-*` tokens in line with the theme.

### Changed
- Showcase-only: the settings controls (dropdowns and checkboxes) in the props playground, customization playground, and Grouped Inputs are left-aligned instead of centered.
- `ListSubheader` (including Select group headings) now matches Autocomplete group labels: weight 600 on all subheaders, and on-surface-variant color on the default color only (`color="primary"` and `color="inherit"` are unchanged).
- `Select` uses the same `ExpandMore` chevron as `Autocomplete` instead of MUI's stock triangle, set once in the theme (`MuiSelect.defaultProps.IconComponent`). Every `Select` in consuming apps picks this up (library-facing).
- Showcase-only: Input Adornment demo icons are `fontSize="small"` and its wrapped example fields use flex gap so they no longer touch.
- `--font-size-body2` is 14px (was 13px) and `--text-body-large-letter-spacing` is 0 (was 0.5px), matching `theme.typography.body2` and `body1`. Page text set through the base `html, body` styles has slightly tighter letter spacing (library-facing).

## [3.10.1] - 2026-10-19

### Changed
- Promoted `react19-mui9.5` to the current compatibility checkpoint (previously `react19-mui9.4`).
- Bumped `@mui/material` and `@mui/icons-material` to `^9.5.0`, `@mui/x-date-pickers` to `^9.15.0`, `react` and `react-dom` to `^19.3.1`, and refreshed dev dependencies (Vite, Vitest, ESLint, typescript-eslint, Playwright, testing-library, @types/node, globals).

## [3.10.0] - 2026-10-19

### Added
- `ThemedPageHeader` accepts a `breadcrumbs` prop (for example a `ThemedBreadcrumbs`) that renders above the title in place of the `eyebrow` (library-facing).
- Showcase-only: Page Header demo examples for a title-only header and a header with breadcrumbs.
- `ThemedFileTypeIcon`: a file-type icon that renders any extension on a page outline with a folded corner and a label showing the extension. Known formats are colored by family (documents, audio, video, image, compressed) and unknown formats stay neutral. Supports `size` (`sm`, `md`, or a width in px), `tone`, and `decorative` (library-facing).
- `inflowFileTypeColors`, `inflowFileTypeExtensions`, and `normalizeFileExtension` theme exports for the file-type color families and extension parsing (library-facing).
- Showcase-only: File Type Icon demo with a props playground, a format gallery, and a table-row example.

### Changed
- Outlined primary `Button` has a `surfaceLowest` background (white in light mode) instead of a transparent one, so it reads the same on the pale app background. Hover is unchanged (library-facing).
- `ThemedPageHeader` vertical padding is 10px instead of 12px, so the header is 76px tall with or without an eyebrow line. Headers with an eyebrow were 80px; title-only headers are unchanged at 76px (library-facing).

### Security
- Applied `npm audit fix` for `source-map-js` 1.2.1 → 1.2.2 (GHSA-68fv-2mgg-jv7q).

## [3.9.2] - 2026-10-05

### Fixed
- Resolved `npm audit` vulnerabilities by updating the `overrides` for `undici` (`^7.29.1`) and adding `brace-expansion` (`>=5.0.12`).

## [3.9.1] - 2026-10-05

### Deprecated
- `ThemedButton` and `ThemedTextField` are deprecated. The Inflow theme already applies the same styling to MUI's `Button` and `TextField` inside `InflowProvider`, so use those directly. Both remain exported and will be removed in the next major version. See the Migration page in the showcase.

### Changed
- Small inputs (`size="small"`, 40px) use 14px text, and small input labels use 14px (library-facing).
- `Select` and `FormControl` default to `size="small"`, consistent with `TextField` (library-facing).
- `body1` letter spacing is `0` instead of `0.03125rem` (library-facing).
- `Button` `size="large"` is now 48px tall with 1rem text. It was previously identical to `size="medium"` (library-facing).
- `Dialog` defaults to `maxWidth="xs"` and a 444px-wide paper that stays within the viewport on small screens (library-facing).
- `ThemedBreadcrumbs`: every item, including the last, is now a primary-blue link with an always-visible underline. The `bar` separator is a 1px primary-blue line instead of a `|` character, and the current page is no longer rendered as plain text with `aria-current="page"` (library-facing).
- Showcase-only: demos, guidelines, and pre-rendered examples use MUI `Button` and `TextField` in place of the deprecated wrappers, input demos default to `size="small"`, and the dialog Cancel button uses `variant="outlined"`.
- `DESIGN.md` now uses `outlineVariant` for field borders.

## [3.8.1] - 2026-09-30

### Fixed
- `ThemedChatPanel` renders user message text in a `div` instead of a `p` for better semantic structure.

## [3.8.0] - 2026-09-25

### Added
- `ThemedChatPanel` composer variants: a single "add" control, a filled send button, and outlined chip-style action buttons.
- Animated typing indicator in the chat panel.
- `ThemedChatAccordion` reasoning trigger styling and optional per-step status icons for the reasoning-steps disclosure.
- `ThemedRightPanel` push mode now offsets itself below the 64px global header so the panel does not overlap the app chrome (library-facing).
- Showcase-only: per-assistant chat fixtures, playground toggles, and multi-stage expand examples.
- Showcase-only: components and demos aligned with the latest design-system guidance.

### Changed
- Updated `AGENTS.md` and Copilot instructions to clarify build and test expectations.

### Fixed
- Corrected the MUI style-override key from `MuiPickersDay` to `MuiPickerDay` in the inflow theme (library-facing).
- Showcase-only: updated `RightPanelDemo` `Stack` alignment for visual consistency.

### Tests
- Updated `RightPanelDemo` tests and adjusted dense `ThemedMenu` minimum-height expectations.

## [3.7.2] - 2026-09-21

### Fixed
- Showcase only: the displayed compatibility checkpoint tag is now derived from the installed `react` and `@mui/material` versions instead of a hardcoded value.

## [3.7.1] - 2026-09-21

### Changed
- Promoted `react19-mui9.4` to the current compatibility checkpoint (previously `react19-mui9.3`).
- Bumped the `@mui/material` and `@mui/icons-material` peer-style dependencies to `^9.4.0` to lock in the MUI 9.4 baseline.

### Fixed
- Fixed component-sidebar state handling to reset overrides during render, satisfying the `react-hooks/exhaustive-deps` lint rule.

## [3.7.0] - 2026-09-21

### Added
- Showcase reasoning states are embedded in the chat thread as a multi-turn conversation.
- `ThemedChatPanel` renders assistant content in a `div` so block-level React nodes display correctly.

### Changed
- Bumped many development and peer-aligned dependencies across React, MUI, Vite, Vitest, TypeScript-ESLint, AG Grid, and Playwright.

## [3.6.0] - 2026-09-21

### Added
- New `ThemedChatAccordion` component for chat reasoning steps.
- `ThemedChatPanel` gained a `hideHeader` prop for host-provided headers.
- Showcase demos for `ThemedChatAccordion` in the accordion and chat-panel pages.

### Changed
- `ComponentSidebar` now uses override-driven expansion state instead of manual expanded-state management.
- Updated Vitest and related test packages to 4.1.11.

## [3.5.1] - 2026-09-05

### Security
- Updated the locked Browserslist development dependency from 4.28.2 to 4.28.9 and its supporting browser data packages, resolving the high-severity npm audit finding.

## [3.5.0] - 2026-09-05

### Changed
- Declared the project Beta in the README and release guidance, including the light-only limitation and Semantic Versioning expectations for public APIs.
- Updated the showcase compatibility badge to React 19 / MUI 9.3 while keeping its displayed package version sourced from `package.json`.

### Fixed
- Fixed packaged CommonJS/SSR loading and added `npm run test:pack` as a packed ESM/CommonJS consumer regression gate in CI and the publishing workflow.

## [3.4.1] - 2026-08-19

### Security
- Pin patched floors for vulnerable transitive dev dependencies via `overrides`, resolving 10 open Dependabot alerts (2 high, 8 moderate): `react-router >= 7.18.2` (CSRF bypass, open redirect, constructor injection), `postcss >= 8.5.23` (sourceMappingURL path traversal / arbitrary `.map` disclosure), and `undici >= 7.29.0` (CRLF injection, cache-directive information disclosure, response desynchronization). These are build/test-tooling deps only — none ship in the published package. `npm audit` now reports 0 vulnerabilities and the floors are enforced on every install/CI run.

## [3.4.0] - 2026-08-19

### Added — ThemedChatPanel extended API
- **Streaming:** `isStreaming` + `onStop` props swap the Send control for a Stop control while a response is generating.
- **Typing indicator:** `isTyping` + `renderTypingIndicator` slot, with a default three-dot indicator.
- **Tool-message slot:** `renderToolMessage` renders `kind: 'tool'` messages; `renderMessageThread` lets the host own the full thread while still invoking DS tool/typing slots via `ThemedChatThreadRenderContext`.
- **Controlled composer:** `inputValue` / `onInputChange` / `onSendMessage`, `multiline` + `maxRows`, and `charLimit` enforcement. Plain Enter submits; in multiline mode Ctrl/Meta+Enter inserts a newline.
- **Attachments & tools:** `attachments` with per-item `status`/`progress`, `onAttachFile`, `onRemoveAttachment`, `renderAttachment`, and a `tools` menu with `onToolSelect`. Aggregate `uploadProgress` + `uploadProgressLabel` render a determinate progress bar gated on the `uploadProgress` prop.
- **Composer strings as props:** `inputPlaceholder`, `inputHint`, `creditsLabel` (string or `(used, total) => ReactNode`), `aiDisclaimer`, `userLabel`, `assistantLabel`, and all icon-button ARIA labels.
- **Composer metadata visibility:** new `showCredits` (defaults to whether `credits` is supplied), `showCharCount`, and `showInputHint` toggles let hosts hide the `Credits n/m` block, the `count / limit` counter, and the input hint line without clearing the underlying values.

### Changed
- Themed wrapper components aligned with the current Inflow design specs.
- `ChatPanelDemo` showcase exercises the extended `ThemedChatPanel` API.

### Fixed
- Composer keyboard parity: Shift+Enter submits (only Ctrl/Meta+Enter insert a newline in multiline mode), matching legacy `useSubmitOnEnter` behavior.

### Tests
- New `ThemedTable` and inflow-theme regression tests.

## [3.3.0] - 2026-08-17

### Added
- Interactive `PropsPlayground` on every ported component's showcase page: Badge, Accordion, Alert, Breadcrumbs, Tabs (themed branches) and AppNav, RightPanel, ChatPanel, DetailPanel (Case B pages).
- The panel components (`Right Panel`, `Chat Panel`, `Detail Panel`) now appear in the showcase sidebar under **Navigation** (previously in the hidden `layout` category).

### Fixed
- **Accordion spacing:** uniform 48px summary height and 14px content margin in both collapsed and expanded states (neutralizes MUI's default expanded bump), and details content gets 16px top padding so expanded content no longer sits flush against the header.

## [3.2.0] - 2026-08-17

### Added — 13 component families ported from the Inflow design system (rewritten for MUI 9)

New `Themed*` components, each with unit/a11y tests and a live showcase page. All are token-driven and dark-ready.

- **Feedback:** `ThemedAlert`, `ThemedToast` (per-severity inline banner; new `toastInfoBg` token)
- **Data display:** `ThemedAvatar` + `ThemedAvatarGroup`, `ThemedBadge`, `ThemedChip` (extended with `sm`/`md`/`lg` sizes, `leadingIcon`, and `filled-primary`/`outlined-primary` variants)
- **Navigation:** `ThemedAppNav` + `ThemedAppNavPlaceholder`, `ThemedBreadcrumbs`, `ThemedMenu`, `ThemedPageHeader`, `ThemedTabs` + `ThemedTabPanel` (with WAI-ARIA keyboard navigation)
- **Layout / panels:** `ThemedRightPanel` (push/overlay, resizable, `--infl-right-panel-width` host var), `ThemedChatPanel` (AI assistant), `ThemedDetailPanel` + `ThemedDetailPanelSection`
- **Disclosure:** `ThemedAccordion`

### Added — tokens & provider
- New `toastInfoBg` design token (light `#c9dcff`, dark `rgba(145,194,253,0.16)`), exposed as `--infl-toast-info-bg-color`.
- `renderWithInflow` test helper (`src/test/`) for rendering components under `InflowProvider`.

### Fixed — internal token contradictions
- `certaintyMedium` unified to `#ff9800`.
- `highlightYellow` unified to `#fff2cc`.
- `mandatoryRow`/`rowMandatory` unified to `#e6f1ff`; `MuiSnackbarContent` override now reads the token instead of a hardcoded value.

### Notes
- Ported components are rewritten against MUI 9 idioms (`slotProps`, `ownerState`, current prop names) — the source design-system code is used as a behavioral spec, never imported.
- Documented behavioral deviations from the source DS are logged in `docs/ports/MUI9_TOKEN_MAP.md` §7 (e.g. Tabs keyboard navigation, children-own-close in RightPanel).

## [3.1.0] - prior

Pre-existing release (provider, theme factories, tokens, AG Grid params, and the original Themed* wrappers).
