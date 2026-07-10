# Local Setup

This guide gets the Inflow showcase running on your machine. Covers Windows, macOS, and Linux. If you just want to browse the showcase and don't care about the details, jump to [Quick start](#quick-start) and follow your OS's steps.

## Prerequisites

You need two things before `npm install` will work:

1. **Node.js.** This repo's tooling (Vite, ESLint) requires **Node 20.19+, 22.12+, or 24+**. Any current LTS release satisfies this - if you already have a recent Node install (including odd-numbered "Current" releases like Node 25), you're covered. No `.nvmrc` is committed; install whatever your OS's package manager offers as the latest LTS if you're starting fresh.
2. **Git.**

`inriver-inflow` is a public npm package - no GitHub account, token, or `.npmrc` is needed to install it.

If you already have Node 20.19+ (or 22.12+, or 24+) and Git, skip to [Quick start](#quick-start).

---

## Installing prerequisites by OS

### Windows

**Option A - winget (recommended, Windows 10 2004+ / Windows 11):**

```powershell
winget install --id OpenJS.NodeJS.LTS -e
winget install --id Git.Git -e
```

Close and reopen your terminal after installing so `PATH` picks up the new tools.

**Option B - manual installers (if winget isn't available):**

- Node.js: download the LTS installer from [nodejs.org](https://nodejs.org/) and run it (accept defaults).
- Git: download from [git-scm.com](https://git-scm.com/download/win) and run it (accept defaults).

**Verify:**

```powershell
node -v
git --version
```

### macOS

**Option A - Homebrew (recommended):**

```bash
# Install Homebrew first if you don't have it: https://brew.sh
brew install node git
```

Homebrew installs the current stable Node release, which satisfies this repo's requirements.

**Option B - manual installers:**

- Node.js: download the macOS installer from [nodejs.org](https://nodejs.org/) (choose the LTS `.pkg`).
- Git: comes with Xcode Command Line Tools - run `xcode-select --install` in Terminal.

**Verify:**

```bash
node -v
git --version
```

### Linux

Package manager commands vary by distro. Debian/Ubuntu example:

```bash
# Node.js (current LTS) via NodeSource
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs git
```

Fedora/RHEL example:

```bash
sudo dnf install -y nodejs git
```

**Verify:**

```bash
node -v
git --version
```

---

## Quick start

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

## First time using a terminal?

A few notes if any of the tooling above is new to you:

- **Opening a terminal:** Windows - search "PowerShell" in the Start menu. macOS - Spotlight (`Cmd+Space`) → "Terminal". Linux - your distro's terminal app.
- **Installers** for Node.js and Git (linked in [Installing prerequisites by OS](#installing-prerequisites-by-os)) work like any other installer - accept the defaults unless you have a reason not to.
- **Running the commands:** copy each code block from [Quick start](#quick-start) into the terminal and press Enter, one block at a time.

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

**Port already in use / a different URL than expected.**
Vite automatically tries the next available port (`5174`, `5175`, ...) if `5173` is taken by another project. Check the terminal output for the actual URL - it's printed after "Local:".

**Terminal says `node` or `git` is "not recognized" / "command not found" after installing.**
Close and reopen the terminal window so it picks up the updated `PATH`. If it still fails, the installer likely didn't complete - try the installer again.

**React hook errors, or the showcase behaves strangely after linking a local copy of the package into another app.**
Run `npm ls react` in both the theme repo and the consuming app to check for duplicate React installs - see the "Active local theme development" section in the root [README.md](../README.md) for the full `npm link` workflow.

---

## Next steps

Once the showcase is running locally:

- [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) - how the codebase is structured and what belongs in the package vs. the showcase.
- [`docs/VERSIONING.md`](VERSIONING.md) - how releases, compatibility checkpoints, and version tags work.
- [`docs/PUBLISHING.md`](PUBLISHING.md) - the checklist for publishing a new package version (only relevant if you're releasing changes, not just browsing).
- The root [README.md](../README.md) - package usage in consuming apps and peer dependencies.
