# MUI 9 Port — Token & CSS-Variable Mapping (Gate G2)

**Status:** ✅ APPROVED 2026-08-17 (Gate G2 passed) — decisions recorded in §3/§4/§6.
**Source:** `REACT-Inflow-design-system-main` v2.0.0 (MUI 6, flat `inriverTokens`, static `--*`/`--iv-*`/`--custom-*` vars)
**Target:** `@inriver/inflow-react` v3.1.0 (MUI 9, nested `inflowTokens` + theme palette, runtime `--infl-*` vars)

**How to read this:** Every token / CSS-var actually referenced by the 13 component families is listed below with a concrete target. Anything marked **GAP** needs your decision (column "Resolution"). Nothing is left for port-time guessing.

**Conventions used in the "Target" column:**
- `palette.X` → read from the active MUI theme (`useTheme()` / `theme.palette`) — preferred, dark-ready automatically.
- `tokens.X` → `inflowTokens` / `inflow-tokens.ts` value.
- `var(--infl-*)` → CSS custom property injected by `InflowProvider`.
- `literal` → a fixed value copied as-is (only where it's a pure dimension with no color semantics).

---

## 1. Token mapping — `inriverTokens.*` / `T.*` used by the 13 families

Only **5 files** consume `T.*` directly. Full mapping:

| DS usage (file) | DS value | Target | Resolution |
|---|---|---|---|
| `T.navy700` (AppNav) | `#0b2d6e` | `palette.primary.main` | ✅ map-to-existing |
| `T.navy100` (ChatPanel) | `#ebf1fc` | `palette.inflow.navy100` (via `var(--infl-…)` or theme) | ✅ map-to-existing |
| `T.outline` (Menu) | `#727787` | `palette.inflow.outline` | ✅ map-to-existing |
| `T.onSurfaceVariant` (Breadcrumbs) | `#424655` | `palette.text.secondary` | ✅ map-to-existing |
| `T.radiusFull` (AppNav placeholder) | `9999` | `tokens.radius.full` | ✅ map-to-existing |
| `T.diffRemovedBg` (Toast error) | `#f4d9d9` | `palette.inflow.highlightRed` (`#f4d9d9`) | ✅ map-to-existing (same value) |
| `T.diffAddedBg` (Toast success) | `#d6efdd` | `palette.inflow.highlightGreen` (`#d6efdd`) | ✅ map-to-existing (same value) |
| `T.toastInfoBg` (Toast info) | `#c9dcff` | ✅ **resolved → new token `toastInfoBg`** (`#c9dcff` light / `rgba(145,194,253,0.16)` dark), applied to `inflow-tokens.ts` + `tokens.ts` + `--infl-toast-info-bg-color` | ✅ added (G1) |
| `T.toastWarningBg` (Toast warning) | `#faedd1` | ✅ **resolved → reuse `highlightYellow`** (`#fff2cc`) | ✅ map (G2) |

**Palette-driven components need no token mapping** (Badge, Alert, Accordion, Avatar, DetailPanel read `palette.*` directly and will inherit the Inflow theme automatically): `error.main`, `primary.main`, `success.main`, `grey[400]`, `common.white`, `text.primary/secondary`, `action.hover`, `divider`, `background.paper/default`, `info.main`. These already resolve correctly under `createInflowTheme`.

---

## 2. CSS-variable mapping — `--*` / `--iv-*` / `--custom-*` used by the 13 families

Used by **3 files** with injected CSS strings: `Tabs`, `PageHeader`, `AppNav`. **Decision baked in:** instead of injecting static CSS with `var(--*)` fallbacks, ported components use the **MUI `sx`/styled API against the theme** wherever possible (dark-ready, no string CSS). CSS vars are only used where a value genuinely has no palette home.

| DS CSS var | DS fallback | Used by | Target | Resolution |
|---|---|---|---|---|
| `--color-primary-main` | `#0b2d6e` | Tabs | `palette.primary.main` | ✅ map |
| `--color-on-surface-variant` | `#424655` | Tabs | `palette.text.secondary` | ✅ map |
| `--color-outline-variant` | `#c2c6d8` | Tabs | `palette.divider` | ✅ map |
| `--color-white` | `#fff` | Tabs | `palette.common.white` | ✅ map |
| `--custom-primary-tab` | `#c3defe` | Tabs (active bg) | `palette.inflow.primaryTab` | ✅ map |
| `--custom-primary-tab-hover` | `rgba(195,222,254,0.4)` | Tabs (hover bg) | ✅ **resolved → derive** via `alpha(primaryTab, 0.4)` at port time (G3) | ✅ derived |
| `--font-family-base` | `Inter…` | Tabs, PageHeader | `theme.typography.fontFamily` | ✅ map |
| `--radius-lg` | `10px` | Tabs | `tokens.radius.lg` | ✅ map |
| `--spacing-1/2/3` | `8/16/24px` | Tabs, PageHeader | `theme.spacing(1/2/3)` | ✅ map |
| `--text-label-large-*` (4 vars) | `14px/500/20px/0.1px` | Tabs | `theme.typography.button` (same values) | ✅ map |
| `--text-body-medium-*` (2 vars) | `14px/20px` | Tabs, PageHeader | `theme.typography.body2` | ✅ map |
| `--text-title-large-*` (4 vars) | `22px/700/36px/0.15px` | PageHeader | `theme.typography.h6` (h6 is 22px/700/36px/0.15px in Inflow) | ✅ map |
| `--iv-navy-700` | `#0b2d6e` | PageHeader, AppNav | `palette.primary.main` | ✅ map |
| `--custom-background` | `#ebf1fc` | PageHeader | `palette.inflow.appBackground` | ✅ map |
| `--custom-page-header-height` | `76px` | PageHeader | literal `76` (dimension) | ✅ literal |
| `--custom-page-header-padding` | `12px 24px` | PageHeader | `theme.spacing(1.5, 3)` | ✅ map |
| `--custom-nav-width` | `72px` | AppNav | literal `72` | ✅ literal |
| `--custom-nav-padding-y` | `12px` | AppNav | `theme.spacing(1.5)` | ✅ map |
| `--custom-nav-item-gap` | `4px` | AppNav | `theme.spacing(0.5)` | ✅ map |
| `--custom-nav-item-padding-x/y` | `8px / 4px` | AppNav | `theme.spacing(1, 0.5)` | ✅ map |
| `--custom-nav-pill-width/height` | `56px / 32px` | AppNav | literal `56` / `32` | ✅ literal |
| `--custom-nav-icon-size` | `24px` | AppNav | literal `24` | ✅ literal |
| `--custom-nav-label-size` | `11px` | AppNav | literal `11px` (no Inflow type step at 11px) | ✅ literal |
| `--iv-radius-pill` | `9999px` | AppNav | `tokens.radius.full` | ✅ map |
| `--iv-font-sans` | `Inter…` | AppNav | `theme.typography.fontFamily` | ✅ map |
| `--font-weight-medium` | `500` | AppNav | `theme.typography.fontWeightMedium` | ✅ map |
| `--iv-bg` | `#ffffff` | AppNav (active pill) | `palette.common.white` | ✅ map |
| `--iv-navy-700` (active icon) | `#0b2d6e` | AppNav | `palette.primary.main` | ✅ map |
| `--custom-nav-on-surface` | `rgba(255,255,255,0.85)` | AppNav | ✅ **resolved → literal** `rgba(255,255,255,0.85)` (G4) | ✅ literal |
| `--custom-nav-on-surface-active` | `#ffffff` | AppNav | `palette.common.white` | ✅ map |
| `--custom-nav-item-hover` | `rgba(255,255,255,0.08)` | AppNav | ✅ **resolved → literal** `rgba(255,255,255,0.08)` (G5) | ✅ literal |

**RightPanel note:** it sets a host-layout CSS var `--right-panel-width` (line 25) for push mode. That's a *runtime layout contract*, not a theme token — keep as-is, but rename to `--infl-right-panel-width` for namespace consistency. ✅ no decision needed.

---

## 3. GAP list — DS tokens/vars with no target equivalent

> ✅ **All resolved 2026-08-17 (Gate G2).** The "My recommendation" column was accepted for every row; see "✅ APPROVED RESOLUTIONS" below. This table is kept for the rationale.

| # | DS item | DS value | Options | My recommendation |
|---|---|---|---|---|
| **G1** | `toastInfoBg` (Toast info bg) | `#c9dcff` | (a) use `mandatoryRow #e6f1ff`; (b) add new token `toastInfoBg #c9dcff`; (c) use `palette.inflow.navy100 #ebf1fc` | **(b) add `toastInfoBg`** — `#c9dcff` is a distinct periwinkle; neither `mandatoryRow` nor `navy100` matches, and Toast is a semantic notification color worth its own token. Dark value needed too (propose `rgba(145,194,253,0.16)` to match `rowSelected`). |
| **G2** | `toastWarningBg` (Toast warning bg) | `#faedd1` | (a) use `highlightYellow #fff2cc`; (b) add new token `toastWarningBg #faedd1` | **(a) use `highlightYellow`** — both are warm yellow tints, visually near-identical at banner scale; avoids token sprawl. Dark already handled by `highlightYellow rgba(255,200,64,0.18)`. |
| **G3** | `--custom-primary-tab-hover` | `rgba(195,222,254,0.4)` | (a) add token `primaryTabHover`; (b) compute as `color-mix`/alpha of `primaryTab` at port time | **(b) alpha of `primaryTab`** — `rgba(195,222,254,0.4)` IS `primaryTab` at 40%; derive it (`${primaryTab}66` hex-alpha or MUI `alpha()`) instead of a new token. Dark derives automatically. |
| **G4** | `--custom-nav-on-surface` | `rgba(255,255,255,0.85)` | (a) literal `rgba(255,255,255,0.85)`; (b) add token `navOnSurface` | **(a) literal** — it's a white-alpha on the navy rail, self-evident; AppNav rail is always dark navy so this is not dark-mode-sensitive. |
| **G5** | `--custom-nav-item-hover` | `rgba(255,255,255,0.08)` | (a) literal `rgba(255,255,255,0.08)`; (b) add token | **(a) literal** — same reasoning as G4. |

**All decisions made 2026-08-17.** G1 adds a new token (`toastInfoBg`); G2 reuses `highlightYellow`; G3–G5 resolved per recommendation.

### ✅ APPROVED RESOLUTIONS (2026-08-17)
- **G1 → add new token `toastInfoBg`** = `#c9dcff` (light) / `rgba(145,194,253,0.16)` (dark). Add to both `inflow-tokens.ts` and `tokens.ts`, and expose as `--infl-toast-info-bg-color` in `InflowProvider`.
- **G2 → reuse `highlightYellow`** for Toast warning bg. No new token.
- **G3 → derive tab hover** as `alpha(primaryTab, 0.4)` at port time (MUI `alpha()`). No new token.
- **G4 → literal** `rgba(255,255,255,0.85)` inside ThemedAppNav (dark rail, not dark-mode-sensitive).
- **G5 → literal** `rgba(255,255,255,0.08)` inside ThemedAppNav.

---

## 4. Internal contradictions in the CURRENT project (must resolve — they block clean mapping)

These exist independent of the port, but the port touches these tokens, so resolve now:

| # | Token | `inflow-tokens.ts` | `tokens.ts` | Pick one |
|---|---|---|---|---|
| **C1** | `certaintyMedium` | `#ff9800` (line 40) | `#FBC02D` (line 9) | ✅ **`#ff9800`** — update `tokens.ts` to `#ff9800`. |
| **C2** | `highlightYellow` | `#fff2cc` (line 44) | `#FAEDD1` (line 13) | ✅ **`#fff2cc`** — update `tokens.ts` to `#fff2cc`. |
| **C3** | `mandatoryRow` / `rowMandatory` | `#e6f1ff` (line 45) | `#C9DCFF` (tokens.ts) | ✅ **`#e6f1ff`** — update `tokens.ts`; also update `MuiSnackbarContent` override (inflow.ts:674) from hardcoded `#c9dcff` to the `mandatoryRow` token. |

---

## 5. MUI 6 → 9 prop-drift rewrites required (per component)

Concrete API changes the rewrite must apply (these are NOT optional — MUI 9 removed/renamed them):

| Component | DS (MUI 6) code | MUI 9 rewrite |
|---|---|---|
| `ThemedMenu` | `MenuListProps={{ dense }}` (Menu.tsx:43) | `slotProps={{ list: { dense } }}` |
| `ThemedMenu` | `PaperProps={{ elevation, sx }}` (Menu.tsx:44) | `slotProps={{ paper: { elevation, sx } }}` |
| `ThemedMenu` | `primaryTypographyProps={{…}}` (Menu.tsx:69) | `slotProps={{ primary: {…} }}` |
| `ThemedChatPanel` | `slotProps={{ paper: {…} }}` already used (ChatPanel.tsx:147) — keep, verify against MUI 9 | ✅ already slot-based |
| `ThemedMenu` / `ThemedChatPanel` | DS `Button`/`Chip` imports (`../Button/Button`, `../Chip/Chip`) | use **target's** `ThemedButton`/`ThemedChip`. ChatPanel needs Chip `size="sm"` + `variant="filled-primary"/"outlined-primary"` → **resolved (Q5): extend `ThemedChip`** with these variants (task T2.8) before porting ChatPanel (T4.1). |
| All state styling | DS theme hardcodes `navy700` | rewrite as color-key-aware `ownerState.color` variants per target `inflow.ts` pattern |
| All components | `borderRadius: '4px'/'8px'` literals | use `tokens.radius.*` or `theme.shape.borderRadius` |

---

## 6. Open questions surfaced during mapping

| # | Question | Blocks | Resolution |
|---|---|---|---|
| **Q4** (carried) | Tabs keyboard nav — add WAI-ARIA arrow keys as approved enhancement, or click-parity? | T3.1 | ✅ **Add arrow-key/Home/End nav** as an approved enhancement (logged in §7). |
| **Q5** (new) | `ThemedChatPanel` needs Chip variants (`sm`, `filled-primary`, `outlined-primary`) target lacks. | T4.1 | ✅ **Extend `ThemedChip`** with these variants (they're documented DS variants). New Wave-2 task T2.8. |
| **Q6** (new) | DS `Button` `xs` size needed? | — | ✅ **No** — all DS usages are `size="small"`, which target has. No action. |

---

## 7. Deviation log
*(To be filled during porting — any behavior that intentionally differs from DS.)*

| Component | Deviation | Reason | Approved |
|---|---|---|---|
| `ThemedTabs` | Adds WAI-ARIA arrow-key / Home / End keyboard navigation (DS is click-only) | Accessibility standards; approved enhancement Q4 | ✅ 2026-08-17 |
| `ThemedAccordion` | Adds generated `id`/`aria-controls`/`aria-expanded` relationships between summary and panel (DS relies on MUI defaults) | Accessibility hardening; purely additive, no visual change. Surfaced by Wave 2 Oracle (#4) | ✅ 2026-08-17 |
| `ThemedAccordion` | Forces uniform 48px summary height + 14px content margin in both collapsed and expanded states | DS source has a latent MUI-expanded bump it didn't override; uniform height is the evident intent since DS pins `my: 14px`. | ✅ 2026-08-17 |
| `ThemedAccordion` | Details content gets `pt: 2` (16px) top padding | DS relied on MUI's expanded-summary margin for the gap; after pinning uniform 48px headers, the details need their own top padding to avoid a flush/compressed look. | ✅ 2026-08-17 |
| `ThemedBreadcrumbs` | Adds explicit `aria-label="breadcrumb"` + `aria-current="page"` semantics (DS partially present) | Accessibility hardening; additive. Surfaced by Wave 2 Oracle (#4) | ✅ 2026-08-17 |
| `ThemedAvatarGroup` | Uses React `Children.toArray` for child normalization instead of DS's array-or-single check | React-idiomatic; handles conditional/nested children more robustly. Surfaced by Wave 2 Oracle (#3) | ✅ 2026-08-17 |
| `ThemedChip` | Extends size with DS `sm` (24px) and `lg` (40px) and adds `leadingIcon` beyond the base MUI contract; `filled-primary`/`outlined-primary` variant translation | Gate G2 Q5 + Wave 2 gate BLOCKER F1 — required by ChatPanel (Wave 4) | ✅ 2026-08-17 |
| `ThemedPageHeader` | Uses semantic `h1` for the page title | Improves document-outline semantics without changing visual treatment | ✅ 2026-08-17 |
| `ThemedAppNav` | Includes the item index in navigation keys | Prevents duplicate-label key collisions while preserving item behavior | ✅ 2026-08-17 |
| `ThemedRightPanel` | Delegates the close control to composed children | Matches ChatPanel/DetailPanel ownership and avoids duplicate close controls | ✅ 2026-08-17 |
| `ThemedRightPanel` | Adds auto-focus on open + Fade/Slide transition + provider-scoped `--infl-right-panel-width` host var (set only while open, via the mounted panel's `closest('[data-inflow-root]')`, reset to `0px` on cleanup) | Focus + motion improve a11y/UX; provider-scoped var is the push-mode layout contract. DS uses a global `--right-panel-width` | ✅ 2026-08-17 |
| `ThemedAppNav` | Rail background uses `palette.inflow.navSurface` (navy900); the G4/G5 white-alpha overlays are derived via `alpha(palette.common.white, …)` not raw literals | `navSurface` is the correct rail token (the map's earlier `primary.main` note was superseded); `alpha()` derivation satisfies the zero-hardcoded-color rule | ✅ 2026-08-17 |
| `ThemedChip` | Preserves MUI `filled`/`medium` defaults for the base (non-primary) variants; the DS primary variants are layered on top | Backward compatibility with existing consumers; DS-parity applies to the added primary variants | ✅ 2026-08-17 |

---

## 8. Wrapper value-add justifications (Wave-1 gate, Metis BLOCKER #1)

Every Case A target already has a theme override in `inflow.ts`. A `Themed*` wrapper is only justified by value the theme **cannot** express (per `themedComponentInfo.ts` docblock). This table is the binding rationale each Wave 2/3/4 task implements — no more, no less.

| Component | Theme override exists | Value-add the wrapper provides |
|---|---|---|
| `ThemedBadge` | MuiBadge:469 | Forced token geometry (16px badge, 8px dot, radius, padding) surviving overrides + constrained `error\|primary\|success` color set |
| `ThemedAvatar` | MuiAvatar:565 (bg only) | Structural size system (40/32/24/18 + paired font metrics), shape radius map, status badge, `AvatarGroup` overlap/+N |
| `ThemedAlert` | MuiAlert:637 | Ergonomic default: curated outlined-icon mapping + title slot + radius/alignment |
| `ThemedToast` | none (SnackbarContent is single-color) | Structural + semantic: per-severity tinted banner (`toastInfoBg`/`highlightYellow`/`Green`/`Red`) + `title`/`action`/`onClose`; inline, not MUI Snackbar |
| `ThemedAccordion` | MuiAccordion:705 (minimal) | Structural: `items[]` model + `onChange(id, isExpanded)` + single/multi-expand control |
| `ThemedMenu` | MuiMenu/MuiMenuItem (style) | Structural: `items: MenuItemDef[]` (icon/shortcut/divider/selected/disabled) → rendered popup `Menu` |
| `ThemedBreadcrumbs` | MuiBreadcrumbs:618 (separator) | Structural: `items[]` + chevron/slash separator + `maxItems` ellipsis-collapse with expand-on-click |
| `ThemedChip` (extend) | MuiChip:513 | DS variant coverage: add `sm` size + `filled-primary`/`outlined-primary` variants (ChatPanel dependency, Q5) |
