# Visual Parity Checklist — DS → `@inriver/inflow-react` (MUI 9)

Each ported family was verified against its DS source (`REACT-Inflow-design-system-main/src/components/<Name>/`) via unit tests (prop/variant/interaction/a11y) and a Playwright browser pass on its showcase page (hash route `/#/components/<id>`). "match" = DS contract + visuals reproduced; "deviation" = intentional, logged in `MUI9_TOKEN_MAP.md` §7.

| Family | Showcase route | Tests | Browser QA | Status |
|---|---|---|---|---|
| ThemedAccordion | `/components/accordion` (Themed tab) | ✅ | ✅ 6 accordions, aria-expanded | match |
| ThemedAlert | `/components/alert` (Themed tab) | ✅ | ✅ 4 severities, role=alert | match |
| ThemedAppNav + Placeholder | `/components/appnav` | ✅ | ✅ navy rail, icon+label, pinned footer | match |
| ThemedAvatar + AvatarGroup | `/components/avatar` (Themed tab) | ✅ | ✅ sizes 40/32/24/18, +N overflow | match |
| ThemedBadge | `/components/badge` (Themed tab) | ✅ | ✅ 3 colors, forced geometry | match |
| ThemedBreadcrumbs | `/components/breadcrumbs` (Themed tab) | ✅ | ✅ chevron/slash, maxItems ellipsis | match |
| ThemedChatPanel | `/components/chatpanel` | ✅ | ✅ opens, chips, smart_toy, Me bubble, close | match |
| ThemedChip (extended) | `/components/chip` (Themed tab) | ✅ | ✅ 4 variants × 3 sizes matrix | match + 1 approved deviation |
| ThemedDetailPanel + Section | `/components/detailpanel` | ✅ | ✅ Edit product title, Details/Publication sections, Switch headerAction, close | match |
| ThemedMenu | `/components/menu` (Themed tab) | ✅ | ✅ popup opens, 6 menuitems, dividers/shortcuts | match |
| ThemedPageHeader | `/components/pageheader` | ✅ | ✅ title heading, back + actions | match |
| ThemedRightPanel | `/components/rightpanel` | ✅ | ✅ push sets `--infl-right-panel-width:400px`, overlay, resize | match |
| ThemedTabs + TabPanel | `/components/tabs` (Themed tab) | ✅ | ✅ equal-width, 26px, primary inactive, **keyboard nav** | match + 1 approved deviation |
| ThemedToast | `/components/toast` | ✅ | ✅ 4 severities, info bg `#c9dcff` proven | match |

## Approved deviations (all logged in `MUI9_TOKEN_MAP.md` §7)
- `ThemedTabs`: adds WAI-ARIA keyboard navigation (DS is click-only).
- `ThemedRightPanel`: children own the close control (no panel-owned close button); `--infl-right-panel-width` replaces DS `--right-panel-width`.
- `ThemedAccordion` / `ThemedBreadcrumbs`: additive ARIA relationships.
- `ThemedAvatarGroup`: React `Children.toArray` normalization.
- `ThemedChip`: DS `sm`/`lg` sizes + `leadingIcon` added (ChatPanel dependency).
- `ThemedPageHeader`: title uses `h1` semantics.
- `ThemedChip`: base variants keep MUI `filled`/`medium` defaults; DS parity applies to the added primary variants.
- `ThemedAppNav`: rail uses `palette.inflow.navSurface`; white-alpha overlays derived via `alpha()`.

## Out of scope (by design)
- DS `Button`, `Card`, `Chip`, `Dialog`, `DataTable`, `Stepper` already existed as `Themed*` wrappers.
- DS `GlobalHeader`, `NavRail` — target has private demo versions; promotion decision deferred.
