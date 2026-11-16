#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { execute } from './cli.js';
import type { Manifest } from './cli.js';

try {
  const manifest = JSON.parse(readFileSync(new URL('./manifest.json', import.meta.url), 'utf8')) as Manifest;
  const output = execute(process.argv.slice(2), manifest);
  if (output.json) console.log(JSON.stringify(output.response));
  else if (output.response.ok) console.log(output.text);
  if (!output.response.ok) {
    console.error(output.text);
    process.exitCode = 1;
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  if (process.argv.includes('--json')) console.log(JSON.stringify({ ok: false, command: 'unknown', error: message }));
  console.error(message);
  process.exitCode = 1;
}
