# First Public npm Publish Checklist

This checklist is for the **first-ever** public npm publish of `@inriver/inflow`.

Use it once to establish the public package correctly, then use [`docs/VERSIONING.md`](./VERSIONING.md) as the normal ongoing release guide.

## Why this package is public

This package is being made public so external Inriver partners can consume the shared Inflow theme package without requiring Azure AD guest access.

Because the package is public, review the repository `LICENSE` and `README.md` with legal/brand before or shortly after the first publish so the intended usage scope is explicit. Do not invent new legal text during release preparation; treat that as a separate review item.

## One-time prerequisites

Complete these manual setup steps before attempting the first publish:

- [ ] Create the `@inriver` npm Organization at npmjs.com using an npm account with org-creation rights.
- [ ] Note that a live registry check during planning confirmed both `@inriver` and `@inriver/inflow` were unclaimed on public npm at that time.
- [ ] Add the appropriate team members to the `@inriver` org with publish access.
- [ ] Run `npm login` locally, or configure CI credentials, using an account that can publish `@inriver/inflow`.

## First-publish verification checklist

Before the first public publish, confirm all of the following:

- [ ] Confirm `package.json` declares `"private": false` so the package is publishable.
- [ ] Confirm `package.json` still declares `"name": "@inriver/inflow"`.
- [ ] Confirm the checkpoint-tag release model in [`docs/VERSIONING.md`](./VERSIONING.md) is understood.
- [ ] Confirm the first release will publish to a checkpoint tag such as `react19-mui6.3`, **not** directly to `latest`.
- [ ] Confirm `scripts/guard-publish.cjs` is enforcing the required `INFLOW_THEME_RELEASE_TAG` environment variable.
- [ ] Run a clean build and confirm it passes:

```bash
npm run build
```

- [ ] Test the packed artifact locally before the real publish.
  - Use `npm pack` and inspect the tarball contents, **or**
  - Use the existing `npm link` workflow from the README in a throwaway consuming app:

```bash
# in @inriver/inflow
npm install
npm run build
npm link

# in the consuming app
npm link @inriver/inflow
npm ls react
```

Linked-package testing is useful for runtime validation, but still inspect the packed artifact as well when possible. `npm link` can hide packaging mistakes.

## First publish command sequence

For the first public release, use the normal checkpoint flow but start from an intentional initial version instead of assuming a patch bump from an already-published package.

Confirm `package.json` is already set to the intended first-release version before publishing. The current planned first public release is `0.1.0`, so do **not** run `npm version patch` before the first publish. Only bump the version for the second and later releases. If the starting version needs to change before first publish, edit `package.json` directly or use `npm version <version> --allow-same-version` as appropriate.

```bash
npm run build
INFLOW_THEME_RELEASE_TAG=react19-mui6.3 npm publish --access public --tag react19-mui6.3
```

Notes:

- `--access public` is required for the **first publish** of a scoped package such as `@inriver/inflow`.
- Without `--access public`, npm treats scoped packages as restricted/private by default, which will fail unless the org has a paid private-plan setup.
- Do **not** publish directly to `latest`. The checkpoint tag is the release channel.

After the package publish succeeds, create the immutable source Git tag that matches the existing release convention:

```bash
git tag -a theme/react19-mui6.3/v0.1.0 -m "@inriver/inflow 0.1.0 - React 19 / MUI 6.3"
git push origin theme/react19-mui6.3/v0.1.0
```

## Post-publish verification

Immediately verify the published result:

- [ ] Open `https://www.npmjs.com/package/@inriver/inflow` and confirm the package page renders correctly.
- [ ] Confirm the README, version, and published file list look correct.
- [ ] In a fresh throwaway project, test install from the checkpoint tag:

```bash
npm install @inriver/inflow@react19-mui6.3
```

- [ ] Verify the expected exports work in a consumer:

```ts
import { inflowTheme, ThemedButton } from '@inriver/inflow';
```

- [ ] Promote to `latest` only after adoption verification, per [`docs/VERSIONING.md`](./VERSIONING.md).
- [ ] Never publish directly to `latest`.

## Ongoing releases

After the first public publish is complete, use [`docs/VERSIONING.md`](./VERSIONING.md) for the normal checkpoint-tag release model, source-tag convention, and `latest` promotion policy.
