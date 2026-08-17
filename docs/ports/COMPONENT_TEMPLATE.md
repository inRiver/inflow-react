# Component Port Template — DS → `@inriver/inflow-react` (MUI 9)

**Read this fully before porting any component.** It codifies the 8 mandated rule sets. Every port task (T2.x–T4.x) is judged against §9 Acceptance.

**Source of truth for behavior:** the DS file(s) listed in your task. Treat them as a *spec*, never as code to import.
**Source of truth for values:** `docs/ports/MUI9_TOKEN_MAP.md` (approved Gate G2). Never invent a color/spacing mapping.

---

## 1. File layout

```
src/components/themed/ThemedX.tsx        ← component + prop types + subcomponents
src/components/themed/ThemedX.test.tsx   ← unit + a11y tests
src/showcase/demos/ThemedXDemo.tsx       ← showcase demo (see §8)
src/components/themed/index.ts           ← add `export * from './ThemedX';`
```

- One file per family. Subcomponents (`ThemedAvatarGroup`, `ThemedTabPanel`, `ThemedDetailPanelSection`, `ThemedAppNavPlaceholder`) live in the same file and are exported.
- Use `forwardRef` when the DS component wraps a single MUI/root element consumers would reasonably ref (follow `ThemedChip`/`ThemedStepper` precedent). Set `displayName`.

## 2. Naming

- Public component: `ThemedX` (e.g. DS `Toast` → `ThemedToast`, DS `AppNav` → `ThemedAppNav`).
- Prop types: `ThemedXProps`. Item/child types keep their semantic name prefixed where collision-prone (`ThemedMenuItemDef`, `ThemedBreadcrumbItem`).
- Never export a bare name that collides with an MUI export (`Alert`, `Menu`, `Badge`, `Avatar`, `Tabs`, `Accordion`).

## 3. Token rule (colors, radii, spacing, typography)

**Every value must resolve through the theme or approved tokens. Zero hardcoded hex/rgba in the file.**

Priority order:
1. **`theme.palette.*`** for standard semantic colors (`primary.main`, `text.secondary`, `divider`, `action.hover`, `background.paper`, `error.main`, `success.main`, `common.white`).
2. **`theme.palette.inflow.*`** for Inflow-specific colors (`navy100`, `primaryTab`, `highlightRed/Green/Yellow`, `outlineVariant`, `appBackground`, `toastInfoBg`, etc.) — see the map.
3. **`inflowTokens.radius.*` / spacing / typography** for non-color tokens, or `theme.shape.borderRadius` / `theme.spacing(n)` / `theme.typography.*`.
4. **Literal dimensions** only where the map marks them `literal` (e.g. AppNav pill 56×32, PageHeader height 76). These are pure geometry, not colors.
5. **Alpha-derived** values use MUI `alpha()` (e.g. tab hover = `alpha(theme.palette.inflow.primaryTab, 0.4)`).

The final grep `grep -nE "#[0-9a-fA-F]{3,8}|rgba?\(" src/components/themed/ThemedX.tsx` must return **only** lines explicitly marked `literal` or `alpha-of-token` in the map. Everything else fails.

## 4. CSS-variable rule

- **Do not inject static CSS strings** with `var(--*)` fallbacks (the DS `ensureStyles()` pattern). Rewrite as `sx`/`styled` against the theme.
- If a CSS var is genuinely needed (host-layout contract like RightPanel's width var), use the `--infl-*` namespace: `--infl-right-panel-width`. Available vars are defined in `InflowProvider.tsx`; if you need a new one, it must already exist in the approved map (§2) — do not add vars ad hoc.

## 5. MUI 9 idiom rules

| Forbidden (MUI 6 / DS) | Required (MUI 9) |
|---|---|
| `MenuListProps={{…}}` | `slotProps={{ list: {…} }}` |
| `PaperProps={{…}}` | `slotProps={{ paper: {…} }}` |
| `primaryTypographyProps={{…}}` | `slotProps={{ primary: {…} }}` |
| hardcoded `navy700` for state/selection | color-key-aware via `ownerState.color` / `theme.palette` (follow `inflow.ts` override pattern) |
| `componentsProps` | `slotProps` |
| any `@deprecated` MUI prop | its current replacement (check MUI 9 docs if unsure) |

When the DS component is itself a thin MUI wrapper (Badge, Alert, Accordion, Menu, Breadcrumbs), your port wraps **MUI directly** and styles via `sx`/theme — do not replicate DS's MUI 6 theme overrides.

## 6. Dark-ready rule

- Read all colors from `theme.palette` / `theme.palette.inflow` (these switch with mode). Never a light-only literal.
- Do NOT add a `mode` prop or dark-specific branches to the component — the theme handles it.
- White-alpha overlays on the always-dark AppNav rail (`rgba(255,255,255,0.85/0.08)`) are the sanctioned exception (map G4/G5).

## 7. Behavioral parity rule

- Port the DS component's **documented** props/variants/states — no more, no less. Read the DS file's prop interface as the contract.
- If the DS behavior is thinner than MUI-idiomatic expectation (e.g. Tabs click-only), **parity is the default**; enhancements require an entry in the map's deviation log (§7) approved by the user. Already-approved: `ThemedTabs` keyboard nav.
- If DS behavior seems like a bug, **stop and flag it** in the task — don't silently fix.

## 8. Test + showcase requirements

**Tests (`ThemedX.test.tsx`)** — follow `ThemedStepper.test.tsx` pattern:
- Render inside `<InflowProvider>` (helper from `src/test/` once T1.1 lands; until then inline the provider as the Stepper test does).
- Cover: each variant/size, controlled vs uncontrolled, interactions (click/close/select), token-driven color assertions via `getComputedStyle` where the plan lists them, ref forwarding (if applicable).
- a11y: assert the roles/aria attributes the DS component has (e.g. `role="tablist"`, `aria-selected`, `aria-current`, `aria-label="breadcrumb"`). **NOTE: `jest-axe` is NOT installed — do NOT import it or reference `toHaveNoViolations`.** a11y is verified by (a) explicit aria/role assertions in the unit test and (b) the Playwright browser pass, not an automated axe scan.
- Must pass under `npm run test:run`.

**Showcase (`src/showcase/demos/ThemedXDemo.tsx`)**:
- Follow the existing demo conventions in `src/showcase/demos/` + register per the T1.2 recipe.
- Show the full variant/size matrix and interactive states, mirroring the DS `stories/*.stories.tsx` for that component (your visual-parity reference).

## 9. Acceptance checklist (task is DONE only when ALL true)

1. Files created per §1; `index.ts` barrel exports component + prop types (+ subcomponents).
2. §3 token grep clean (no unsanctioned hex/rgba).
3. §5 MUI 9 idioms only (no `componentsProps`/`PaperProps`/`MenuListProps`/deprecated props).
4. Dark-ready (no light-only literals outside G4/G5).
5. Behavioral parity with DS prop contract (or logged deviation).
6. Tests pass: `npm run test:run` green, incl. new `ThemedX.test.tsx`.
7. Showcase page renders in `npm run dev` at its route.
8. `lsp_diagnostics` clean on new files; `npm run build` exit 0.
9. Deviations (if any) appended to `MUI9_TOKEN_MAP.md` §7 with approval.

## 10. Anti-patterns (instant reject)

- Importing from the DS repo path or copying DS theme overrides wholesale.
- `as any`, `@ts-ignore`, `@ts-expect-error`.
- Reintroducing the DS `ensureStyles()` string-injection pattern.
- Hardcoding `navy700`/hex where a palette color key applies.
- Adding props/features not in the DS contract without a logged, approved deviation.
- **A `ThemedX` that is a hollow re-export of MUI `X` with no added value.** The theme already styles most MUI components. A wrapper is only justified if it adds a *documented* value the theme cannot: a structural API (e.g. Menu's `items[]`, Breadcrumbs' ellipsis-collapse, Accordion's `items[]`+`onChange(id,expanded)`), an ergonomic default, or a forced token. Your task spec states the value-add — implement exactly that, nothing more.

---

## 10b. Shared-file edit policy (CRITICAL — prevents parallel merge conflicts)

Ported-component tasks run **in parallel** and several files are shared across all of them. To avoid 7 agents stomping the same files:

**Agents create/edit ONLY component-owned files:**
- `src/components/themed/ThemedX.tsx` (new)
- `src/components/themed/ThemedX.test.tsx` (new)
- Case A: the existing `src/showcase/demos/XDemo.tsx` (per-component, safe)
- Case B: the new `src/showcase/demos/ThemedXDemo.tsx` (new, safe)

**Agents MUST NOT edit these shared files.** The orchestrator applies them in a single serialized "registration" pass after the parallel wave:
- `src/components/themed/index.ts` (barrel)
- `src/showcase/themedComponentInfo.ts`
- `src/showcase/demos/index.ts`, `src/showcase/demos/registry.tsx`, `src/showcase/categories.ts` (Case B)

Each agent instead **outputs a "registration block"** in its final report: the exact lines to add to each shared file, in **alphabetical order by component id**, so the orchestrator's registration pass is trivial and deterministic.

**Alphabetical insertion is mandatory** wherever a list is edited (barrel exports, `THEMED_COMPONENT_INFO`, `demoRegistry`, category arrays) — this keeps the serialized pass diff-stable and reviewable.

---

## 11. Showcase registration recipe (T1.2)

The showcase uses **`createHashRouter`** (`src/app/routes.tsx`), so routes are hash-based: `/#/components/:componentName` → `normalizeComponentId(componentName)` → looks up `demoRegistry[key]`, `COMPONENT_LABELS[key]`, and category membership. **A page 404s ("Component Not Found", `ComponentPage.tsx`) only when the `demoRegistry` entry is missing.** Missing `COMPONENT_LABELS`/category/`THEMED_COMPONENT_INFO` entries degrade labeling/discoverability but still resolve — so QA must check content, not just non-404.

### Case A — a demo page already exists for the MUI component
Applies to: `ThemedBadge` (badge), `ThemedAvatar` (avatar), `ThemedAlert` (alert), `ThemedAccordion` (accordion), `ThemedMenu` (menu), `ThemedBreadcrumbs` (breadcrumbs), `ThemedTabs` (tabs), `ThemedChip` (chip — already has one).

Do NOT create a new page. Extend the existing demo with a **MUI vs Themed** variant tab, following the `ChipDemo.tsx` *pattern only* (NOT its props — see warning below):
1. In the existing `XDemo.tsx`: add `const [variant, setVariant] = useState<DemoVariant>('mui');`
2. Render `<DemoVariantTabs value={variant} onChange={setVariant} muiLabel="MUI X" themedLabel="ThemedX" themedReason={themedInfo?.reason} />` at the top.
3. Branch the demo body on `variant === 'themed'` to render your `ThemedX` matrix. **This includes BOTH the interactive `DemoFrame` AND any "All States"/variant matrix frame** — do not leave an unconditional MUI-only state matrix visible on the Themed tab (that's the `ChipDemo.tsx` trap: its "All States" frame is not branched). Every MUI-vs-Themed visual difference must be reachable on the Themed tab.
4. Register the wrapper in `THEMED_COMPONENT_INFO` — **per §10b, output the entry in your registration block; the orchestrator applies it.**

> **⚠️ Case A is NOT a copy-Chip recipe.** Only `ThemedBadge`/`ThemedChip` are near-drop-in against their MUI demo. The rest have **incompatible prop contracts** and need an independent `themed` branch (own props, `PropSchema`, state, and `CodeBlock` example) — do not try to reuse the MUI demo's schema/state:
> - `AvatarDemo` uses MUI `variant`; `ThemedAvatar` uses `shape` + numeric `size` + `badge`.
> - `AlertDemo` exposes MUI `variant`; the DS `Alert` contract omits it.
> - `AccordionDemo` uses MUI instance props; `ThemedAccordion` uses an `items[]`/`expanded` model.
> - `MenuDemo` renders inline `MenuList`; `ThemedMenu` is a popup `Menu` needing `anchorEl`/`open`/`items`/`onClose`.
> - `BreadcrumbsDemo` / `TabsDemo` use composed MUI children; the themed versions use an items/tabs array.

### Case B — no demo page exists (net-new component)
Applies to: `ThemedToast`, `ThemedPageHeader`, `ThemedAppNav`, `ThemedRightPanel`, `ThemedChatPanel`, `ThemedDetailPanel`.

Create a new page — per §10b the **orchestrator applies the shared-file edits (#2–#6); you only create the demo file (#1)** and output the rest in your registration block:
1. **(YOU)** `src/showcase/demos/ThemedXDemo.tsx` — new demo component (export function `ThemedXDemo`). Use `DemoFrame`, `CodeBlock`, `PropsPlayground` as in existing demos.
2. **(orchestrator)** `src/showcase/demos/index.ts` — add `export { ThemedXDemo } from './ThemedXDemo';`
3. **(orchestrator)** `src/showcase/demos/registry.tsx` — add `<id>: createEntry(demos.ThemedXDemo, { maturityStatus: 'Beta' }),` to `demoRegistry`. Unique lowercase `<id>`: `toast`, `pageheader`, `appnav`, `rightpanel`, `chatpanel`, `detailpanel`.
4. **(orchestrator)** `src/showcase/categories.ts` — add `"<id>": '<Label>'` to `COMPONENT_LABELS`, and add `'<id>'` to the right category's `components` array (Toast→feedback; AppNav, PageHeader→navigation; RightPanel, ChatPanel, DetailPanel→layout). Note `layout` is `hidden:true` — pages there won't show in the sidebar; flag if the page must be sidebar-visible.
5. **(orchestrator)** `src/showcase/themedComponentInfo.ts` — add `<id>: { themedName: 'ThemedX', reason: '<why the wrapper exists>' }`. `themedComponentInfo.ts` documents **every** Themed wrapper (drives the sidebar badge/reason via `ComponentSidebar.tsx`), so Case B components need an entry too — do not skip this.
6. Sidebar search is driven by categories — no extra step.

**Component-specific notes (from Wave-1 gate review):**
- `ThemedMenu` (DS `Menu`) wraps the **popup `MuiMenu`** (portal), NOT inline `MenuList`. The existing `menu` showcase demo demos `MenuList` in a `Paper` — so `ThemedMenu` extends that page with a popup variant; tests must assert open-state via `screen.getByRole('menu')` (portal escapes `[data-inflow-root]`, so assert theme values not `--infl-*` vars — see helper caveat).
- `ThemedToast` (DS `Toast`) is an **inline persistent banner**, NOT the auto-dismiss overlay MUI `Snackbar`. It gets its own new `toast` page (Case B); do not conflate with the `snackbar` demo. Its per-severity backgrounds come from tokens (`toastInfoBg`, `highlightYellow/Green/Red`), which the theme's single-color `MuiSnackbarContent` override does NOT express.

**Verify (orchestrator's Playwright QA, not the agent):** navigate to the **hash route** `/#/components/<id>`; assert it does NOT render "Component Not Found" AND that the demo's expected content/themed tab is visible (a missing registry entry 404s, but missing label/category metadata does not — so assert the actual demo renders). Agents do NOT run `npm run dev`; browser QA is the wave-level Playwright pass.

