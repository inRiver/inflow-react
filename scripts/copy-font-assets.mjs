import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../src/fonts/', import.meta.url));
const target = fileURLToPath(new URL('../dist/fonts/', import.meta.url));
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
// Keep tests out of the published assets. Both stylesheets remain opt-in; the JS
// entry points deliberately do not import them or inject font faces globally.
for (const entry of await readdir(source, { withFileTypes: true })) {
  if (entry.isDirectory() || /\.(css|json)$/.test(entry.name)) {
    await cp(`${source}/${entry.name}`, `${target}/${entry.name}`, { recursive: true });
  }
}
