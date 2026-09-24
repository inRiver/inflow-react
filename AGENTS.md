# AGENTS.md

Guidance for AI agents (and humans) working in this repository. Read this before making changes.

This file covers *process and pitfalls*. For architecture and package boundaries, read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — do not duplicate it here. For setup, see [`docs/LOCAL_SETUP.md`](docs/LOCAL_SETUP.md).

## What this repo is

`@inriver/inflow-react` — a published npm library: shared MUI theme, design tokens, and thin themed MUI wrapper components for Inriver product UIs, plus a showcase app used for design review. Two jobs, one repo, intentionally separate public API (see ARCHITECTURE.md).

## Commands

| Task | Command |
| --- | --- |
| Run tests (watch) | `npm test` |
| Run tests once (CI-style) | `npm run test:run` |
| Lint | `npm run lint` |
| Build (library + showcase) | `npm run build` |
| Dev server (showcase) | `npm run dev` |

There is no `typecheck` script — type checking happens through `tsc -b` inside `npm run build`.

## The non-negotiable gate: build and tests must pass before you finish

**Run `npm run build` AND `npm run test:run` before reporting done, and absolutely before any commit.** A change is not complete while either is red.

Both are required because they catch different things: Vitest transpiles with esbuild, which **strips types without checking them** — so green tests do NOT mean the types compile. `tsc -b` inside `npm run build` is the only type check, and it covers the showcase too, not just the library. A commit with green tests and a red build has shipped here before; do not repeat it.

When a change you made breaks a test, first decide which side is stale:

- **The code regressed** → fix the code, not the test.
- **The change is intentional and the test encodes the old behavior** → update the test *in the same commit as the behavior change*, and say so in the commit message.

Never delete or weaken a failing assertion just to make the suite pass. Never commit a behavior change while leaving its tests stale — that is how a red suite slips through review (this has happened here).

Tests live next to source as `*.test.tsx`. Render through `src/test/renderWithInflow.tsx`, not a bare `render`, so components get the Inflow provider.

## MUI 9 layout props

MUI 9 removed system props from `Stack` — it accepts only `direction`, `spacing`, `divider`, `useFlexGap`, and `sx`. Put `alignItems`, `justifyContent`, `flexWrap`, etc. in `sx` (the codebase standard: `sx={{ alignItems: 'center' }}`). This compiles fine through Vite dev (esbuild strips types) but fails `tsc -b` — another reason the build gate above is mandatory.

## Theme changes start in the canonical theme definition

`src/theme/inflow.ts` is the single source of truth for palette, typography, shape, **elevation/shadow values**, and MUI `defaultProps` / `styleOverrides`. Tokens for custom surfaces live in `src/theme/inflow-tokens.ts` / `src/theme/tokens.ts`.

- **Do not hardcode visual literals** (colors, shadows, radii, spacing) inside components. If a value isn't in the theme or tokens, add it there first, then reference it. Hardcoded `rgba(...)` literals in a component are a defect, not pragmatism.
- If a style can be an MUI default or override, put it in the theme rather than repeating `sx` across apps.
- Dark mode tokens exist but are feature-flagged off. Keep light/dark parity in tokens even when dark is not shipping.
- Styling `@mui/x-date-pickers` components through the theme requires the key from **that** package (e.g. `MuiPickerDay`, not `MuiPickersDay`) and a one-time `import type {} from '@mui/x-date-pickers/themeAugmentation'` for the keys to type-check.

## Component API discipline

Themed components are thin MUI wrappers with a stable public contract. When adding or changing props:

- Keep **orthogonal concerns on separate props**. Elevation/layering (backdrop, scroll lock, z-index, shadow) belongs to the presentation prop (e.g. `mode`); content/behavior defaults (width, resizable, close-on-navigation) belong to the semantic prop (e.g. `variant`). A style that describes where a surface sits in space must be keyed off a prop that describes where it sits in space — never off a prop that describes what it is for.
- Watch the **state space**: if two props combine into N×M states but only a few are meaningful, the axes are miscut — raise it before adding more prop-driven styling.
- This is a published, versioned package. Changing a prop's meaning or default is a visual/behavioral change for every consumer — treat it with semver care (see `docs/VERSIONING.md`).

## Tests and demos move together

The showcase demos (`src/showcase/demos/`) have their own tests (`*.test.tsx` alongside). If you rewrite a demo's scenarios, labels, or structure, its test drives UI that no longer exists — update both in the same commit.

## package-lock.json — do not commit platform drift

This is a cross-platform repo; CI and most consumers run Linux. If your local `git status` shows `package-lock.json` modified with a large diff of **deletions** to `node_modules/@esbuild/*`, `node_modules/@rollup/*`, or similar platform-keyed optional packages, that is your local npm pruning binaries for other operating systems. **Discard it: `git checkout -- package-lock.json`.** Committing it breaks `npm ci` on other platforms. Only commit lockfile changes that correspond to a real `package.json` dependency change you made.

## Commit conventions

History follows Conventional Commits: `feat(scope): ...`, `fix(scope): ...`, `test: ...`, `chore(release): ...`, `docs: ...`. Match that style. Only commit when explicitly asked.

## Definition of done for any change

1. `npm run build` green (this is the type check — includes the showcase).
2. `npm run test:run` green.
3. `npm run lint` clean on touched files.
4. Behavior changes and their test updates are in the same commit.
5. No new hardcoded theme literals in components.
6. `package-lock.json` only committed when `package.json` actually changed.
