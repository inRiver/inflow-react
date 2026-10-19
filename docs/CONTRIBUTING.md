# Contributing

How to change this repo without surprises. This is the contributor-facing summary; the rules AI agents and reviewers enforce live in the root [AGENTS.md](../AGENTS.md), and architecture decisions live in [`docs/ARCHITECTURE.md`](ARCHITECTURE.md). If anything here disagrees with those, those win.

New here? Set up your machine first with [`docs/LOCAL_SETUP.md`](LOCAL_SETUP.md).

## Before you start

- Run `npm install`, then `npm run dev` to browse the showcase locally.
- Look at an existing demo and its test before writing a new one — the established pattern is the spec.
- Big theme or API change? Read [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) ("Package boundary", "Theme source of truth") first so the change lands in the right layer.

## The change checklist

Every change, no matter how small, is done only when all of these are true:

1. `npm run build` is green. This is the type check — Vitest strips types without checking them, so green tests alone prove nothing.
2. `npm run test:run` is green.
3. `npm run lint` is clean on the files you touched.
4. Behavior changes and their test updates are in the same commit — not a follow-up, not "the old test still passes."
5. No hardcoded colors, shadows, radii, or spacing in components. Values come from the theme or tokens; if a value doesn't exist there, add it to `src/theme/` first.
6. `package-lock.json` is only committed when `package.json` actually changed. A big diff of deletions under `node_modules/@esbuild/*` or `node_modules/@rollup/*` is local platform drift — discard it with `git checkout -- package-lock.json`.

## Tests: what to write and when

Tests live next to source as `*.test.tsx` and render through `src/test/renderWithInflow.tsx` (not a bare `render`) so components get the Inflow provider.

**Every showcase demo ships with a test.** Adding a demo, or changing a demo's scenarios, labels, or defaults, means adding or updating `<Name>Demo.test.tsx` in the same commit. The same rule covers pages in `src/pages/` and themed components in `src/components/themed/`.

Demo tests are smoke tests, not pixel-perfect QA. A good demo test:

- Renders the demo through `renderWithInflow`.
- Asserts each scenario/frame and its key content renders (by role or label, not by CSS class).
- Exercises the playground controls that change the output — toggle a checkbox, change a select — and asserts the rendered result follows.
- Avoids asserting exact pixel values or full snapshots; the showcase evolves fast and brittle tests slow it down.

See `src/showcase/demos/ChipDemo.test.tsx` and `src/showcase/demos/PageHeaderDemo.test.tsx` for the pattern.

Watch for name collisions: showcase pages repeat text (page titles also appear in code snippets, playground icons repeat in gallery grids). Prefer role-based queries (`getByRole('heading', ...)`) or scope with `within(...)` when `getByText` matches more than you expect.

If a change breaks a test, decide which side is stale: fix the code if it regressed, or update the test in the same commit if the behavior change is intentional. Never weaken or delete an assertion to get green.

## Commit style

History follows Conventional Commits: `feat(scope): ...`, `fix(scope): ...`, `test: ...`, `docs: ...`, `chore(release): ...`.

## Pull requests

- Keep the PR description honest about what changed and what you need reviewed — reviewers respond to specifics.
- If you used AI assistance heavily, say so; it changes what reviewers look at twice.
- Questions about scope, versioning, or "does this belong in the package?" belong in the PR description or a Teams message before you write code, not after.

## Reference

| Resource | Link |
| --- | --- |
| Repo rules for agents and humans | [AGENTS.md](../AGENTS.md) |
| Local machine setup | [`docs/LOCAL_SETUP.md`](LOCAL_SETUP.md) |
| Architecture and package boundary | [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) |
| Versioning and checkpoints | [`docs/VERSIONING.md`](VERSIONING.md) |
| Publishing | [`docs/PUBLISHING.md`](PUBLISHING.md) |
