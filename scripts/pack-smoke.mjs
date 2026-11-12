import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageName = '@inriver/inflow-react';
const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const smokeRootPrefix = join(tmpdir(), 'inflow-pack-smoke-');
const smokeRoot = await mkdtemp(smokeRootPrefix);
const npmCache = join(smokeRoot, 'npm-cache');
const npmCli = process.env.npm_execpath ?? (process.platform === 'win32'
  ? join(dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js')
  : undefined);
const tar = process.platform === 'win32' ? join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'tar.exe') : 'tar';

function run(command, args, cwd) {
  try {
    return execFileSync(command, args, {
      cwd,
      encoding: 'utf8',
      env: { ...process.env, npm_config_cache: npmCache },
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 120_000,
    });
  } catch (error) {
    const stdout = error.stdout?.toString() ?? '';
    const stderr = error.stderr?.toString() ?? '';
    throw new Error(`${command} ${args.join(' ')} failed in ${cwd}\n${stdout}${stderr}`, { cause: error });
  }
}

function runNpm(args, cwd) {
  return npmCli ? run(process.execPath, [npmCli, ...args], cwd) : run('npm', args, cwd);
}

function assertInsideConsumer(entryPath, consumerRoot) {
  const consumerRelativePath = relative(consumerRoot, entryPath);
  assert.ok(
    !isAbsolute(consumerRelativePath) && consumerRelativePath !== '..' && !consumerRelativePath.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`),
    `resolved outside isolated consumer: ${entryPath}`,
  );
}

const esmSmoke = `
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { realpath } from 'node:fs/promises';
import * as inflow from '${packageName}';
import { inflowGridThemeParams } from '${packageName}/ag-grid';
const entry = fileURLToPath(await import.meta.resolve('${packageName}'));
const root = process.env.INFLOW_PACK_SMOKE_CONSUMER;
// Windows: realpath expands 8.3 short-name segments; canonicalize both sides.
const [canonicalRoot, canonicalEntry] = await Promise.all([realpath(root), realpath(entry)]);
assert.ok(!relative(canonicalRoot, canonicalEntry).startsWith('..'), 'ESM resolved outside isolated consumer: ' + entry);
assert.equal(inflow.createInflowTheme('light').palette.mode, 'light');
assert.ok(Object.keys(inflowGridThemeParams).length > 0);
const markup = renderToString(createElement(inflow.InflowProvider, { mode: 'light' }, [
  createElement(inflow.ThemedButton, { key: 'button' }, 'packed ESM smoke'),
  createElement(inflow.ThemedBadge, { badgeContent: '3', key: 'badge' }, createElement('span', null, 'packed ESM badge')),
]));
assert.match(markup, /data-inflow-root/);
assert.match(markup, /packed ESM smoke/);
assert.match(markup, /packed ESM badge/);
assert.match(markup, />3</);
await assert.rejects(import('${packageName}/src/index.ts'), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
console.log(JSON.stringify({ format: 'esm', entry, render: 'PASS', agGrid: 'PASS', hiddenImport: 'PASS' }));
`;

const cjsSmoke = `
const assert = require('node:assert/strict');
const { createElement } = require('react');
const { renderToString } = require('react-dom/server');
const { realpathSync } = require('node:fs');
const inflow = require('${packageName}');
const { inflowGridThemeParams } = require('${packageName}/ag-grid');
const entry = require.resolve('${packageName}');
const root = process.env.INFLOW_PACK_SMOKE_CONSUMER;
// Windows: realpath expands 8.3 short-name segments; canonicalize both sides.
const canonicalRoot = realpathSync(root);
const canonicalEntry = realpathSync(entry);
assert.ok(!require('node:path').relative(canonicalRoot, canonicalEntry).startsWith('..'), 'CommonJS resolved outside isolated consumer: ' + entry);
assert.equal(inflow.createInflowTheme('light').palette.mode, 'light');
assert.ok(Object.keys(inflowGridThemeParams).length > 0);
const markup = renderToString(createElement(inflow.InflowProvider, { mode: 'light' }, [
  createElement(inflow.ThemedButton, { key: 'button' }, 'packed CommonJS smoke'),
  createElement(inflow.ThemedBadge, { badgeContent: '3', key: 'badge' }, createElement('span', null, 'packed CommonJS badge')),
]));
assert.match(markup, /data-inflow-root/);
assert.match(markup, /packed CommonJS smoke/);
assert.match(markup, /packed CommonJS badge/);
assert.match(markup, />3</);
assert.throws(() => require('${packageName}/src/index.ts'), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
console.log(JSON.stringify({ format: 'cjs', entry, render: 'PASS', agGrid: 'PASS', hiddenImport: 'PASS' }));
`;

try {
  const packOutput = runNpm(['pack', projectRoot, '--json'], smokeRoot);
  const packed = JSON.parse(packOutput);
  assert.equal(packed.length, 1, 'npm pack must produce one tarball');
  const tarball = join(smokeRoot, packed[0].filename);
  const archiveEntries = run(tar, ['-tzf', tarball], smokeRoot).trim().split(/\r?\n/);
  for (const required of [
    'package/dist/index.js',
    'package/dist/index.cjs',
    'package/dist/index.d.ts',
    'package/dist/ag-grid/index.js',
    'package/dist/ag-grid/index.cjs',
    'package/dist/ag-grid/index.d.ts',
    'package/README.md',
    'package/LICENSE',
    'package/THIRD_PARTY_NOTICES.md',
    'package/dist/fonts/local-assets.css',
    'package/dist/fonts/inter.css',
    'package/dist/fonts/material-icons.css',
    'package/dist/fonts/manifest.json',
    'package/dist/fonts/inter/LICENSE',
    'package/dist/fonts/material-icons/LICENSE',
    'package/dist/fonts/material-icons-outlined/LICENSE',
    'package/package.json',
  ]) assert.ok(archiveEntries.includes(required), `tarball missing ${required}`);
  for (const forbidden of ['package/src/', 'package/qa-review/', 'package/.omo/']) {
    assert.ok(!archiveEntries.some((entry) => entry.startsWith(forbidden)), `tarball exposes ${forbidden}`);
  }

  const consumerRoot = join(smokeRoot, 'consumer');
  const packageMetadata = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'));
  await mkdir(consumerRoot);
  await writeFile(join(consumerRoot, 'package.json'), JSON.stringify({
    name: 'inflow-packed-consumer-smoke',
    private: true,
    type: 'module',
    dependencies: {
      [packageName]: `file:${tarball.replaceAll('\\', '/')}`,
      '@emotion/react': packageMetadata.devDependencies['@emotion/react'],
      '@emotion/styled': packageMetadata.devDependencies['@emotion/styled'],
      '@mui/material': packageMetadata.devDependencies['@mui/material'],
      react: packageMetadata.devDependencies.react,
      'react-dom': packageMetadata.devDependencies['react-dom'],
    },
  }, null, 2));
  await writeFile(join(consumerRoot, 'esm.mjs'), `import { fileURLToPath } from 'node:url'; import { relative } from 'node:path';\n${esmSmoke}`);
  await writeFile(join(consumerRoot, 'cjs.cjs'), cjsSmoke);
  runNpm(['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false'], consumerRoot);

  const installedRoot = await realpath(join(consumerRoot, 'node_modules', '@inriver', 'inflow-react'));
  // On Windows, realpath expands 8.3 short-name segments (e.g. RICHAR~1) while
  // consumerRoot retains them from mkdtemp. Canonicalize both sides through
  // realpath before comparing so the assertion is junction- and short-name-safe.
  const canonicalConsumerRoot = await realpath(consumerRoot);
  assertInsideConsumer(installedRoot, canonicalConsumerRoot);
  const consumerRequire = createRequire(join(consumerRoot, 'package.json'));
  const fontRoot = join(installedRoot, 'dist', 'fonts');
  const fontManifest = JSON.parse(await readFile(join(fontRoot, 'manifest.json'), 'utf8'));
  assert.equal(fontManifest.files.length, 16, 'all text subsets/styles and both icon fonts must ship');
  const referencedFonts = new Set();
  for (const stylesheet of ['inter.css', 'material-icons.css']) {
    // Windows: realpath expands 8.3 short-name segments in the resolver's return;
    // canonicalize once so every path derived from cssPath stays comparable.
    const cssPath = await realpath(consumerRequire.resolve(`${packageName}/fonts/${stylesheet}`));
    assert.equal(cssPath, await realpath(join(fontRoot, stylesheet)), 'CSS export must resolve inside the installed package');
    const css = await readFile(cssPath, 'utf8');
    assert.doesNotMatch(css, /https?:|@import/, 'optional CSS must not request external assets');
    for (const [, url] of css.matchAll(/url\(['"]?(\.\/[^)'"\s]+)['"]?\)/g)) {
      const fontPath = resolve(dirname(cssPath), url);
      assertInsideConsumer(fontPath, fontRoot);
      const path = relative(fontRoot, fontPath).replaceAll('\\', '/');
      const expected = fontManifest.files.find(file => file.path === path);
      assert.ok(expected, `CSS references an untracked font: ${path}`);
      const bytes = await readFile(fontPath);
      assert.equal(bytes.subarray(0, 4).toString(), 'wOF2');
      assert.equal(bytes.length, expected.bytes);
      assert.equal(createHash('sha256').update(bytes).digest('hex'), expected.sha256);
      referencedFonts.add(path);
    }
  }
  assert.equal(referencedFonts.size, fontManifest.files.length, 'every bundled font must be reachable from an optional stylesheet');
  for (const family of ['inter', 'material-icons', 'material-icons-outlined']) {
    assert.match(await readFile(join(fontRoot, family, 'LICENSE'), 'utf8'), /SIL OPEN FONT LICENSE Version 1.1/);
  }
  assert.throws(() => consumerRequire.resolve('@mui/icons-material'), { code: 'MODULE_NOT_FOUND' }, 'built-in SVG consumers must not require the icons dev dependency');
  const completeCss = await realpath(consumerRequire.resolve(`${packageName}/local-assets.css`));
  assert.equal(completeCss, await realpath(join(fontRoot, 'local-assets.css')));
  const completeSource = await readFile(completeCss, 'utf8');
  assert.doesNotMatch(completeSource, /https?:/);
  assert.deepEqual([...completeSource.matchAll(/@import '([^']+)'/g)].map(match => match[1]), [
    './inter.css', './material-icons.css',
  ]);

  // Use this repo's build tool, but resolve the app and every library import from
  // the isolated installed consumer. Neither build may reach workspace source.
  async function outputFiles(directory) {
    const files = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      files.push(...(entry.isDirectory() ? await outputFiles(path) : [path]));
    }
    return files;
  }
  const consumerApp = `
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { InflowProvider, ThemedAvatar, ThemedChip } from '${packageName}';
createRoot(document.getElementById('root')).render(createElement(InflowProvider, null,
  createElement('h1', null, 'Packed consumer'),
  createElement(ThemedAvatar),
  createElement(ThemedChip, { label: 'String icon', leadingIcon: 'home' }),
));
`;
  await writeFile(join(consumerRoot, 'index.html'), '<!doctype html><html><head><meta charset="UTF-8"><title>Packed consumer</title></head><body><div id="root"></div><script type="module" src="/main.js"></script></body></html>');
  const consumerBuilds = {};
  for (const setup of ['default', 'local-assets']) {
    const outDir = join(consumerRoot, `built-${setup}`);
    const config = join(consumerRoot, 'vite.config.mjs');
    await writeFile(join(consumerRoot, 'main.js'),
      (setup === 'local-assets' ? `import '${packageName}/local-assets.css';\n` : '') + consumerApp);
    await writeFile(config, `export default ${JSON.stringify({
      root: consumerRoot, base: './', logLevel: 'error',
      build: { outDir, emptyOutDir: true, assetsInlineLimit: 0 },
    })};`);
    run(process.execPath, [join(projectRoot, 'node_modules/vite/bin/vite.js'), 'build', '--config', config], consumerRoot);
    const files = await outputFiles(outDir);
    const fonts = files.filter(file => file.endsWith('.woff2'));
    assert.equal(fonts.length, setup === 'default' ? 0 : 16, `${setup}: unexpected emitted font assets`);
    const styles = (await Promise.all(files.filter(file => file.endsWith('.css')).map(file => readFile(file, 'utf8')))).join('\n');
    assert.doesNotMatch(styles, /https?:|@import/, `${setup}: external or unresolved CSS imports`);
    assert.equal((styles.match(/@font-face/g) ?? []).length, setup === 'default' ? 0 : 16);
    if (setup === 'local-assets') {
      const expectedHashes = new Set(fontManifest.files.map(file => file.sha256));
      for (const font of fonts) {
        const hash = createHash('sha256').update(await readFile(font)).digest('hex');
        assert.ok(expectedHashes.has(hash), `bundler altered or introduced a font: ${font}`);
      }
      assert.match(styles, /Material Icons Outlined/);
      assert.match(styles, /Inter/);
    }
    consumerBuilds[setup] = { status: 'PASS', emittedFonts: fonts.length };
  }

  const environment = { ...process.env, INFLOW_PACK_SMOKE_CONSUMER: consumerRoot };
  for (const script of ['esm.mjs', 'cjs.cjs']) {
    try {
      execFileSync(process.execPath, [script], {
        cwd: consumerRoot,
        encoding: 'utf8',
        env: environment,
        stdio: 'inherit',
        timeout: 120_000,
      });
    } catch (error) {
      throw new Error(`packed ${script} consumer smoke failed`, { cause: error });
    }
  }
  console.log(JSON.stringify({
    status: 'PASS',
    tarball: basename(tarball),
    installedRoot,
    packageFiles: 'PASS',
    isolatedConsumer: 'PASS',
    optionalFonts: 'PASS',
    consumerBuilds,
    fontFiles: referencedFonts.size,
    packedBytes: packed[0].size,
    unpackedBytes: packed[0].unpackedSize,
    formats: ['esm', 'cjs'],
  }));
} finally {
  if (smokeRoot.startsWith(smokeRootPrefix)) {
    await rm(smokeRoot, { force: true, recursive: true });
    console.log(`pack smoke cleanup: ${smokeRoot}`);
  }
}
