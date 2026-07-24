#!/usr/bin/env node
/**
 * When this repo is npm-linked into a local sibling consumer app for
 * development (e.g. agent-microfrontend-react), `npm install` here always
 * regenerates this repo's own node_modules/react, node_modules/@mui/*,
 * node_modules/@emotion/* etc as fresh, separate copies - undoing any
 * dedupe fix and reintroducing the classic "npm link duplicate
 * React/MUI instance" bug (Invalid hook call, undefined palette reads)
 * in that consumer app.
 *
 * This repo doesn't know which (if any) consumer has it linked, so this
 * just delegates to the known local dev consumer's own dedupe script if
 * that sibling repo happens to be checked out next to this one. It is a
 * no-op (and does not fail the install) on any other machine, in CI, or
 * during a real `npm publish` - the sibling path simply won't exist there.
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const THEME_REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CONSUMER_DEDUPE_SCRIPT = join(
  THEME_REPO_ROOT,
  "..",
  "agent-microfrontend-react",
  "scripts",
  "dedupe-linked-theme-deps.mjs",
);

if (existsSync(CONSUMER_DEDUPE_SCRIPT)) {
  console.log("[postinstall] Sibling consumer app found - re-running its dependency dedupe fix.");
  const result = spawnSync(process.execPath, [CONSUMER_DEDUPE_SCRIPT], { stdio: "inherit" });
  if (result.status !== 0) {
    console.warn("[postinstall] Consumer dedupe script exited non-zero - continuing anyway (non-fatal).");
  }
} else {
  console.log("[postinstall] No local sibling consumer app checked out - nothing to dedupe.");
}
