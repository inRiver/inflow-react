# Local Setup

This guide gets the Inflow showcase running on your machine. It is written for two audiences:

- **Developers** who already have a Node.js toolchain - the whole setup is `npm install` + `npm run dev`.
- **Designers / non-developers** who may be starting from a blank machine - every prerequisite is spelled out step by step.

Covers Windows, macOS, and Linux. If you just want to browse the showcase and don't care about the details, jump to [Quick start](#quick-start) and follow your OS's steps.

> This package is currently in closed beta and hosted as a **private** package on GitHub Packages (see the "Beta status" section in the root [README.md](../README.md)). Local setup requires GitHub repo access and a personal access token in addition to Node.js - this is temporary until the package moves to public npm.

## Prerequisites

You need three things before `npm install` will work:

1. **Node.js.** This repo's tooling (Vite, ESLint) requires **Node 20.19+, 22.12+, or 24+**. Any current LTS release satisfies this - if you already have a recent Node install (including odd-numbered "Current" releases like Node 25), you're covered. No `.nvmrc` is committed; install whatever your OS's package manager offers as the latest LTS if you're starting fresh.
2. **Git.**
3. **GitHub access**: you must be added as a collaborator on `richard-orilla_inriver/inflow-react`, and you need a GitHub personal access token (PAT) with `read:packages` scope, because the `@richard-orilla_inriver/inflow` package lives on GitHub Packages, not public npm, during the beta.

If you already have Node 20.19+ (or 22.12+, or 24+), Git, and a GitHub PAT with `read:packages`, skip to [Quick start](#quick-start).

---

## Installing prerequisites by OS

### Windows

**Option A - winget (recommended, Windows 10 2004+ / Windows 11):**

```powershell
winget install --id OpenJS.NodeJS.LTS -e
winget install --id Git.Git -e
winget install --id GitHub.cli -e
```

Close and reopen your terminal after installing so `PATH` picks up the new tools.

**Option B - manual installers (if winget isn't available):**

- Node.js: download the LTS installer from [nodejs.org](https://nodejs.org/) and run it (accept defaults).
- Git: download from [git-scm.com](https://git-scm.com/download/win) and run it (accept defaults).
- GitHub CLI: download the `.msi` from [cli.github.com](https://cli.github.com/) and run it.

**Verify:**

```powershell
node -v
git --version
gh --version
```

### macOS

**Option A - Homebrew (recommended):**

```bash
# Install Homebrew first if you don't have it: https://brew.sh
brew install node git gh
```

Homebrew installs the current stable Node release, which satisfies this repo's requirements.

**Option B - manual installers:**

- Node.js: download the macOS installer from [nodejs.org](https://nodejs.org/) (choose the LTS `.pkg`).
- Git: comes with Xcode Command Line Tools - run `xcode-select --install` in Terminal.
- GitHub CLI: download the `.pkg` from [cli.github.com](https://cli.github.com/).

**Verify:**

```bash
node -v
git --version
gh --version
```

### Linux

Package manager commands vary by distro. Debian/Ubuntu example:

```bash
# Node.js (current LTS) via NodeSource
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs git

# GitHub CLI
sudo apt-get install -y gh
# If `gh` isn't in your distro's repos, follow: https://github.com/cli/cli/blob/trunk/docs/install_linux.md
```

Fedora/RHEL example:

```bash
sudo dnf install -y nodejs git gh
```

**Verify:**

```bash
node -v
git --version
gh --version
```

---

## GitHub access and authentication

The package is private during beta, so `npm install` needs to authenticate against GitHub Packages.

1. **Get added as a collaborator.** Ask the repo owner to add your GitHub account to `richard-orilla_inriver/inflow-react` (Settings → Collaborators). Without this, every step below will fail with a 404/401 no matter how correctly it's configured.

2. **Log in with the GitHub CLI and grant package-read access:**

   ```bash
   gh auth login
   gh auth refresh -h github.com -s read:packages
   gh auth setup-git
   ```

   `gh auth login` walks you through a one-time browser authorization. `gh auth refresh` adds the `read:packages` scope your token needs (a default `gh auth login` token doesn't include it). `gh auth setup-git` wires `git` itself to use this token, which is useful for cloning the repo but not sufficient on its own for `npm install` - see the next step.

3. **Create a project-level `.npmrc`.** In the folder you'll clone the repo into (or directly inside the repo after cloning), create a file named `.npmrc` with:

   ```ini
   @richard-orilla_inriver:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=<your PAT>
   ```

   Replace `<your PAT>` with a token that has `read:packages` scope. You can reuse the CLI token:

   ```bash
   gh auth token
   ```

   Paste that value in place of `<your PAT>`.

   **Do not commit this file.** It already appears in `.gitignore`, so a normal `git add .` will not pick it up - but double-check with `git status` if you're ever unsure.

---

## Quick start

Once prerequisites and GitHub auth are done:

```bash
git clone https://github.com/richard-orilla_inriver/inflow-react.git
cd inflow-react
npm install
npm run dev
```

`npm run dev` starts a local Vite server and prints a URL in the terminal, commonly `http://localhost:5173/` (or `5174` if another Vite app is already using `5173`). Open that URL in your browser.

Useful routes once it's running:

- `/guidelines` - package usage, versioning, and import guidance.
- `/tokens` - design token reference.
- `/components` - component catalog.
- `/examples/*` - full-page implementation examples.

Stop the server with `Ctrl+C` in the terminal.

---

## First time using a terminal or GitHub CLI?

A few notes if any of the tooling above is new to you:

- **Opening a terminal:** Windows - search "PowerShell" in the Start menu. macOS - Spotlight (`Cmd+Space`) → "Terminal". Linux - your distro's terminal app.
- **Installers** for Node.js, Git, and the GitHub CLI (linked in [Installing prerequisites by OS](#installing-prerequisites-by-os)) work like any other installer - accept the defaults unless you have a reason not to.
- **Running the commands:** copy each code block from [GitHub access and authentication](#github-access-and-authentication) and [Quick start](#quick-start) into the terminal and press Enter, one block at a time. `gh auth login` opens a browser window for you to authorize - follow the prompts there.
- **Creating `.npmrc`:** any plain-text editor works (Notepad, TextEdit in plain-text mode, VS Code). The important part is the filename is exactly `.npmrc` - not `.npmrc.txt` - saved in the project folder.
- **Access requests and errors:** repo access has to come from whoever manages this repo - message them if you haven't been added as a collaborator yet. If a command errors out, paste the full output when asking for help; most first-run failures trace back to a missing collaborator invite or a stale token.

---

## Common commands reference

| Command | What it does |
| --- | --- |
| `npm install` | Installs all dependencies. Run this once after cloning, and again any time `package.json` changes. |
| `npm run dev` | Starts the local showcase for browsing/development. |
| `npm run build` | Builds both the showcase app and the importable package. |
| `npm run preview` | Serves the production build locally, for a final check before publishing. |
| `npm run lint` | Runs ESLint checks. Developers should run this before committing changes. |

---

## Troubleshooting

**`npm install` fails with 404 or 401 on `@richard-orilla_inriver/inflow` or a related package.**
Almost always one of: you're not yet added as a collaborator on the repo, your PAT is missing the `read:packages` scope, or `.npmrc` isn't in the folder `npm install` is run from (it must sit next to `package.json`). Re-check [GitHub access and authentication](#github-access-and-authentication).

**Port already in use / a different URL than expected.**
Vite automatically tries the next available port (`5174`, `5175`, ...) if `5173` is taken by another project. Check the terminal output for the actual URL - it's printed after "Local:".

**Terminal says `node`, `git`, or `gh` is "not recognized" / "command not found" after installing.**
Close and reopen the terminal window so it picks up the updated `PATH`. If it still fails, the installer likely didn't complete - try the installer again.

**React hook errors, or the showcase behaves strangely after linking a local copy of the package into another app.**
Run `npm ls react` in both the theme repo and the consuming app to check for duplicate React installs - see the "Active local theme development" section in the root [README.md](../README.md) for the full `npm link` workflow.

---

## Next steps

Once the showcase is running locally:

- [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) - how the codebase is structured and what belongs in the package vs. the showcase.
- [`docs/VERSIONING.md`](VERSIONING.md) - how releases, compatibility checkpoints, and version tags work.
- [`docs/PUBLISHING.md`](PUBLISHING.md) - the checklist for publishing a new package version (only relevant if you're releasing changes, not just browsing).
- The root [README.md](../README.md) - package usage in consuming apps, peer dependencies, and the current beta status.
