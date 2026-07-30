# npm Publishing Guide

This document originally covered the **first-ever** public npm publish of
`@inriver/inflow-react`. That milestone is long done, and the release
mechanics have changed twice since (a repo move, then a switch to automated
CI/CD). This file now documents the **current, actual publishing setup**,
followed by the historical record kept for context and for anyone who runs
into similar platform blockers elsewhere.

For the day-to-day release model (checkpoint tags, `latest` policy, version
semantics), see [`docs/VERSIONING.md`](./VERSIONING.md). This file is about
the mechanics of how a release actually gets from a git tag to the npm
registry.

**Status.** `@inriver/inflow-react` is published and public. Releases
`0.1.0` through `0.1.8` are live. As of `0.1.8`, `latest` and the
`react19-mui6.3` checkpoint tag both point to the newest published version -
`latest` is auto-promoted by CI immediately after every checkpoint publish
(see "Current publishing setup" below). The repository now lives at
[`github.com/inRiver/inflow-react`](https://github.com/inRiver/inflow-react)
(public, owned by a personal, non-EMU GitHub account), not the original
GitHub Enterprise Managed Users (EMU) org - that move is what unblocked
GitHub Actions and npm Trusted Publishing (see the historical section below
for why).

## Why this package is public

This package is public so external Inriver partners can consume the shared
Inflow theme package without requiring Azure AD guest access.

Because the package is public, review the repository `LICENSE` and
`README.md` with legal/brand if the intended usage scope ever changes. Do not
invent new legal text during release preparation; treat that as a separate
review item.

## Current publishing setup

The repository lives at `github.com/inRiver/inflow-react` (public). Two
GitHub Actions workflows drive everything:

- **`.github/workflows/ci.yml`** - runs on every push and PR to `master`:
  `npm ci` → `lint` → `test:run` → `build` → pack the tarball and verify it
  contains the expected files. This is a general quality gate, independent
  of releases.
- **`.github/workflows/publish.yml`** - runs only when a tag matching
  `theme/*/v*` is pushed (the same source-tag convention documented in
  `docs/VERSIONING.md`):
  1. Derives the checkpoint name and version from the tag, and verifies the
     tag's version matches `package.json`.
  2. `npm ci` → `lint` → `test:run` → `build` (same gate as CI - a lint or
     test failure blocks the release before it ever reaches npm).
  3. `npm publish --tag <checkpoint> --provenance` via **npm Trusted
     Publishing (OIDC)** - no npm token is stored anywhere for this step.
     npm mints a short-lived, workflow-scoped credential via GitHub's OIDC
     identity, and the publish is signed with a provenance attestation
     (visible on the npm package page and in Sigstore's transparency log).
  4. `npm dist-tag add ... latest` to auto-promote the just-published
     version to `latest`.

**Why step 4 needs a stored secret when step 3 doesn't:** npm's Trusted
Publishing only covers two actions - `npm publish` and `npm stage publish`.
It does not extend to `npm dist-tag`, `npm deprecate`, `npm unpublish`, or
`npm trust` management; those all return `401`/`403` for an OIDC-derived
publish token. So the "Promote to latest" step authenticates with a single
scoped npm Granular Access Token, stored as the `NPM_PUBLISH_TOKEN` GitHub
Actions secret (repo → Settings → Secrets and variables → Actions). This is
the **only** stored credential anywhere in the pipeline.

### Ordinary release sequence

For a normal release, see the release workflow steps in
[`docs/VERSIONING.md`](./VERSIONING.md). In short:

```bash
npm version patch
git push origin master
git tag -a theme/react19-mui6.3/v0.1.9 -m "@inriver/inflow-react 0.1.9 - <summary>"
git push origin theme/react19-mui6.3/v0.1.9
```

Pushing that tag is the entire release step. There is no manual `npm
publish` or `npm dist-tag add` for ordinary releases - only run those by
hand when recovering from a failed or partial CI run.

### Setting up Trusted Publishing on a new package (one-time, per package)

If this ever needs to be re-linked (token rotated away, package renamed,
etc.), on npmjs.com under the package's **Settings → Trusted Publishers**:

- Provider: GitHub Actions
- Organization or user: `inRiver`
- Repository: `inflow-react`
- Workflow filename: `publish.yml`
- Environment name: (blank)
- Allowed actions: **Allow `npm publish`**

This action requires live 2FA on npmjs.com (a bypass-2FA token cannot create
or list trust configurations - confirmed via `403` even with a valid
Granular Access Token). It must be done interactively by an npm account
owner in a browser.

## Historical: publishing on the original GitHub Enterprise (EMU) repo

The sections below describe the situation **before** the repo moved to
`inRiver/inflow-react`. They no longer apply to this repository's current
location, but are kept because the same blockers will resurface on any
*other* repo still hosted under a GitHub Enterprise Managed Users (EMU) org.

This repository originally lived under a GitHub Enterprise Managed Users
(EMU) account and org, which blocked several approaches that would normally
be straightforward:

- **GitHub Actions hosted runners were disabled enterprise-wide.** Any
  workflow using `runs-on: ubuntu-latest` (or similar Microsoft-hosted
  runners) failed immediately with "GitHub Actions hosted runners are
  disabled for this repository." There were 0 self-hosted runners
  registered either. This ruled out CI/CD publishing (including npm Trusted
  Publishing via OIDC, which requires Actions to run at all) **for that
  repo**. Moving the repo to a non-EMU personal account (`inRiver/inflow-react`)
  is what actually resolved this - if self-hosted runners ever get
  provisioned on the EMU org instead, CI/CD publishing there becomes viable
  too; ask a GitHub Enterprise admin.
- **npm 2FA with a hardware security key has no OTP path through the CLI.**
  If the npm account's 2FA is WebAuthn/security-key only (not an
  authenticator app), `npm publish` fails with `EOTP` and there is no code
  to type in - security keys require an interactive browser challenge the
  CLI doesn't trigger in this npm version. (This is still true today and
  applies regardless of which repo/org is involved - it's what Trusted
  Publishing via OIDC sidesteps entirely, since no OTP is ever needed for
  an OIDC-authenticated publish.)
- **Granular Access Tokens have their own per-token 2FA requirement,
  independent of the account-wide 2FA mode.** Even after switching the
  account's 2FA mode from `auth-and-writes` to `auth-only` (Profile →
  Two-Factor Authentication), a token created with that per-token 2FA
  requirement still enabled continued to trigger `EOTP` on publish. The fix
  that worked: generate the Granular Access Token, then explicitly confirm
  (or re-generate) it without its own 2FA requirement - this is a separate
  toggle from the account-wide setting, easy to miss. (This detail still
  applies to the current `NPM_PUBLISH_TOKEN` used for the latest-promotion
  step.)
- **What actually worked at the time**: account 2FA mode set to
  `auth-only`, plus a Granular Access Token generated with its per-token 2FA
  requirement disabled, used directly on the local machine via a temporary
  `.npmrc` (`//registry.npmjs.org/:_authToken=<token>`), deleted immediately
  after the publish command completed. No GitHub Actions, no CI, no Trusted
  Publishing - a fully local, manual `npm publish`. This is superseded by
  the automated CI flow described above, now that the repo lives somewhere
  Actions actually runs.
- **GitHub Packages billing limit** was hit before this pivot - private
  packages on GitHub Packages count against the account's storage/billing
  quota, which was already exhausted. Public npm has no such limit; this is
  part of why the package moved off GitHub Packages entirely (see the
  scoped `@inriver/inflow-react` rename in git history) rather than just
  requesting a billing increase.
- **Public repos were permanently disallowed** on the original EMU account
  and org (confirmed via API on both the personal account and the
  `inriver-copilots-enterprise` org) - this also meant GitHub Pages was
  never available there, independent of the npm publish question. This is
  the reason the repo itself had to move to a different, non-EMU GitHub
  account rather than just flipping a visibility setting.

## Historical: first public npm publish checklist

This is kept for reference - it was used once, for the `0.1.0` release, and
is not part of the ongoing release process (see "Ordinary release sequence"
above for that).

### One-time prerequisites

- [x] Confirm the scoped name `@inriver/inflow-react` is unclaimed under the
      `@inriver` npm org.
- [x] Run `npm login` locally using an account that can publish
      `@inriver/inflow-react`.

### First-publish verification checklist

- [x] Confirm `package.json` declares `"private": false` so the package is
      publishable.
- [x] Confirm `package.json` declares `"name": "@inriver/inflow-react"`.
- [x] Confirm the checkpoint-tag release model in
      [`docs/VERSIONING.md`](./VERSIONING.md) is understood.
- [x] Confirm the first release publishes to a checkpoint tag such as
      `react19-mui6.3`, **not** directly to `latest`.
- [x] Confirm `scripts/guard-publish.cjs` enforces the required
      `INFLOW_THEME_RELEASE_TAG` environment variable.
- [x] Clean build passes: `npm run build`.
- [x] Packed artifact tested locally before the real publish (`npm pack` +
      inspect, and/or `npm link` in a throwaway consuming app).

### First publish command sequence (historical - `0.1.0` only)

For the very first release, the normal checkpoint flow was used but started
from an intentional initial version instead of a patch bump from an
already-published package:

```bash
npm run build
INFLOW_THEME_RELEASE_TAG=react19-mui6.3 npm publish --access public --tag react19-mui6.3
```

```bash
git tag -a theme/react19-mui6.3/v0.1.0-npm -m "@inriver/inflow-react 0.1.0 - React 19 / MUI 6.3 (public npm)"
git push origin theme/react19-mui6.3/v0.1.0-npm
```

Every release since has instead gone through the automated CI pipeline
described in "Current publishing setup" above.

## Post-publish verification

Verify a release after CI reports success:

- [ ] Confirm the `publish.yml` workflow run is green, including both the
      `Publish` and `Promote to latest` steps.
- [ ] Open `https://www.npmjs.com/package/@inriver/inflow-react` and confirm
      the version, README, and file list look correct. **The npmjs.com
      website is cached and can lag several minutes behind the registry** -
      if something looks stale, check the registry API directly first
      (`npm view @inriver/inflow-react versions`, or
      `https://registry.npmjs.org/@inriver/inflow-react`) before assuming
      something is wrong.
- [ ] In a fresh throwaway project, test install from the checkpoint tag:

```bash
npm install @inriver/inflow-react@react19-mui6.3
```

- [ ] Verify the expected exports work in a consumer:

```ts
import { InflowProvider, ThemedButton } from '@inriver/inflow-react';
```

- [ ] Confirm `latest` now points at the new version
      (`npm view @inriver/inflow-react dist-tags`).
- [ ] Never publish directly to `latest` (`npm publish --tag latest`) -
      `guard-publish.cjs` blocks this. Releases always publish under a
      checkpoint tag first; only the automated "Promote to latest" step
      moves `latest`.

## Ongoing releases

After the first public publish, use [`docs/VERSIONING.md`](./VERSIONING.md)
for the normal checkpoint-tag release model, source-tag convention, and
`latest` promotion policy, and this file for the CI/CD mechanics behind it.
