# Changelog

All notable changes to `@inriver/inflow-react` are documented here. This project follows [Semantic Versioning](https://semver.org/).

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
