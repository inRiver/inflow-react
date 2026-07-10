# Local Setup

This guide gets the Inflow showcase running on your machine. It is written for two audiences:

- **Developers** who already have a Node.js toolchain - the whole setup is `npm install` + `npm run dev`.
- **Designers / non-developers** who may be starting from a blank machine - every prerequisite is spelled out step by step.

Covers Windows, macOS, and Linux. If you just want to browse the showcase and don't care about the details, jump to [Quick start](#quick-start) and follow your OS's steps.

> This package is currently in closed beta and hosted as a **private** package on GitHub Packages (see the "Beta status" section in the root [README.md](../README.md)). Local setup requires GitHub repo access and a personal access token in addition to Node.js - this is temporary until the package moves to public npm.

## Prerequisites

You need three things before `npm install` will work:

1. **Node.js 20** (the version this repo's CI and tooling target; Node 18+ likely works, but 20 is what's verified).
2. **Git.**
3. **GitHub access**: you must be added as a collaborator on `richard-orilla_inriver/inflow-react`, and you need a GitHub personal access token (PAT) with `read:packages` scope, because the `@richard-orilla_inriver/inflow` package lives on GitHub Packages, not public npm, during the beta.

If you already have Node 20+, Git, and a GitHub PAT with `read:packages`, skip to [Quick start](#quick-start).

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
brew install node@20 git gh
```

If `node@20` isn't the default after install, follow the `brew` output to link it, or use `brew link node@20 --force`.

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
# Node.js 20 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
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

## For designers / non-developers

If the steps above feel unfamiliar, here's the same thing in plainer terms:

1. **Install the three tools** (Node.js, Git, GitHub CLI) using the installer links in [Installing prerequisites by OS](#installing-prerequisites-by-os) above - just double-click through each installer like any other app, keeping the default options.
2. **Ask for repo access.** Message whoever manages this repo and ask them to add your GitHub username as a collaborator.
3. **Open a terminal.**
   - Windows: search for "PowerShell" in the Start menu.
   - macOS: open "Terminal" from Spotlight (`Cmd+Space`, type "Terminal").
   - Linux: use your distro's terminal app.
4. **Copy-paste the commands** from [GitHub access and authentication](#github-access-and-authentication) one block at a time, pressing Enter after each. When `gh auth login` opens a browser window, just click through the login/authorization prompts.
5. **Create the `.npmrc` file.** If you're not comfortable with a code editor, Notepad (Windows), TextEdit (macOS, plain text mode), or any plain-text editor works - just make sure the file is named exactly `.npmrc` with no `.txt` extension, saved in the folder where you'll put the project.
6. **Copy-paste the commands** from [Quick start](#quick-start) one block at a time.
7. Once `npm run dev` prints a URL, open it in your browser - that's the showcase, running locally on your machine.

If any step produces a red error message, copy the full text and share it with the dev team rather than trying variations - most failures at this stage come from a missed collaborator invite or a mistyped token.

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
