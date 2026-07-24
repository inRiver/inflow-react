# First Public npm Publish Checklist

This checklist is for the **first-ever** public npm publish of `@inriver/inflow-react`.

Use it once to establish the public package correctly, then use [`docs/VERSIONING.md`](./VERSIONING.md) as the normal ongoing release guide.

**Status: complete.** `@inriver/inflow-react@0.1.0` published successfully on
2026-07-10 (source tag `theme/react19-mui6.3/v0.1.0-npm`). The package was
later renamed from the unscoped `inriver-inflow` to the scoped
`@inriver/inflow-react` and relicensed to MIT; `0.1.3` (InflowProvider +
Themed component showcase updates, source tag
`theme/react19-mui6.3/v0.1.3`) published on the `react19-mui6.3` checkpoint
tag on 2026-07-24. `0.1.2` (README + org rename, docs-only) remains the
current `latest` on npm as of 2026-07-24 - `0.1.3` has not been promoted to
`latest` yet, pending adoption verification per `docs/VERSIONING.md`. The
sections below are kept for the next release and for anyone who needs to
understand what was actually required.

## Why this package is public

This package is being made public so external Inriver partners can consume the shared Inflow theme package without requiring Azure AD guest access.

Because the package is public, review the repository `LICENSE` and `README.md` with legal/brand before or shortly after the first publish so the intended usage scope is explicit. Do not invent new legal text during release preparation; treat that as a separate review item.

## One-time prerequisites

Complete these manual setup steps before attempting the first publish:

- [ ] Confirm the scoped name `@inriver/inflow-react` is unclaimed under the `@inriver` npm org (a live registry check during planning confirmed this).
- [ ] Run `npm login` locally using an account that can publish `@inriver/inflow-react`.

## Publishing on this GitHub Enterprise: known blockers and what actually works

This repository lives under a GitHub Enterprise Managed Users (EMU) account
and org, which turned out to block several approaches that would normally be
straightforward. In case any of this resurfaces on a future release:

- **GitHub Actions hosted runners are disabled enterprise-wide.** Any
  workflow using `runs-on: ubuntu-latest` (or similar Microsoft-hosted
  runners) fails immediately with "GitHub Actions hosted runners are
  disabled for this repository." There were 0 self-hosted runners
  registered either. This ruled out CI/CD publishing (including npm
  Trusted Publishing via OIDC, which requires Actions to run at all) for
  this repo. If self-hosted runners get provisioned later, CI/CD publishing
  and Trusted Publishing become viable again and are the better long-term
  setup - ask a GitHub Enterprise admin.
- **npm 2FA with a hardware security key has no OTP path through the CLI.**
  If the npm account's 2FA is WebAuthn/security-key only (not an
  authenticator app), `npm publish` fails with `EOTP` and there is no code
  to type in - security keys require an interactive browser challenge the
  CLI doesn't trigger in this npm version.
- **Granular Access Tokens have their own per-token 2FA requirement,
  independent of the account-wide 2FA mode.** Even after switching the
  account's 2FA mode from `auth-and-writes` to `auth-only` (Profile →
  Two-Factor Authentication), a token created with that per-token 2FA
  requirement still enabled continued to trigger `EOTP` on publish. The fix
  that worked: generate the Granular Access Token, then explicitly confirm
  (or re-generate) it without its own 2FA requirement - this is a separate
  toggle from the account-wide setting, easy to miss.
- **What actually worked**: account 2FA mode set to `auth-only`, plus a
  Granular Access Token generated with its per-token 2FA requirement
  disabled, used directly on the local machine via a temporary `.npmrc`
  (`//registry.npmjs.org/:_authToken=<token>`), deleted immediately after
  the publish command completed. No GitHub Actions, no CI, no
  Trusted Publishing - a fully local, manual `npm publish`.
- **GitHub Packages billing limit** was hit before this pivot - private
  packages on GitHub Packages count against the account's storage/billing
  quota, which was already exhausted. Public npm has no such limit; this is
  part of why the package moved off GitHub Packages entirely (see the
  "scoped `@inriver/inflow-react`" rename in git history) rather than just
  requesting a billing increase.
- **Public repos are permanently disallowed** on this account and org (EMU
  policy, confirmed via API on both the personal account and the
  `inriver-copilots-enterprise` org) - this also means GitHub Pages is
  never available here, independent of the npm publish question.

## First-publish verification checklist

Before the first public publish, confirm all of the following:

- [ ] Confirm `package.json` declares `"private": false` so the package is publishable.
- [ ] Confirm `package.json` still declares `"name": "@inriver/inflow-react"`.
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
# in @inriver/inflow-react
npm install
npm run build
npm link

# in the consuming app
npm link @inriver/inflow-react
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

- `@inriver/inflow-react` is a scoped package name, so it is private by default on npm; `--access public` (also set in `publishConfig`) is required to publish it as a public package.
- Do **not** publish directly to `latest`. The checkpoint tag is the release channel.

After the package publish succeeds, create the immutable source Git tag that matches the existing release convention (pick a tag name that doesn't collide with any prior release tag for the same version - e.g. append `-npm` if a same-version tag already exists from an earlier registry):

```bash
git tag -a theme/react19-mui6.3/v0.1.0-npm -m "@inriver/inflow-react 0.1.0 - React 19 / MUI 6.3 (public npm)"
git push origin theme/react19-mui6.3/v0.1.0-npm
```

## Post-publish verification

Immediately verify the published result:

- [ ] Open `https://www.npmjs.com/package/@inriver/inflow-react` and confirm the package page renders correctly.
- [ ] Confirm the README, version, and published file list look correct.
- [ ] In a fresh throwaway project, test install from the checkpoint tag:

```bash
npm install @inriver/inflow-react@react19-mui6.3
```

- [ ] Verify the expected exports work in a consumer:

```ts
import { InflowProvider, ThemedButton } from '@inriver/inflow-react';
```

- [ ] Promote to `latest` only after adoption verification, per [`docs/VERSIONING.md`](./VERSIONING.md).
- [ ] Never publish directly to `latest`.

## Ongoing releases

After the first public publish is complete, use [`docs/VERSIONING.md`](./VERSIONING.md) for the normal checkpoint-tag release model, source-tag convention, and `latest` promotion policy.
