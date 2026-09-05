import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises';
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
import * as inflow from '${packageName}';
import { inflowGridThemeParams } from '${packageName}/ag-grid';
const entry = fileURLToPath(await import.meta.resolve('${packageName}'));
const root = process.env.INFLOW_PACK_SMOKE_CONSUMER;
assert.ok(root && !relative(root, entry).startsWith('..'), 'ESM resolved outside isolated consumer: ' + entry);
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
const inflow = require('${packageName}');
const { inflowGridThemeParams } = require('${packageName}/ag-grid');
const entry = require.resolve('${packageName}');
const root = process.env.INFLOW_PACK_SMOKE_CONSUMER;
assert.ok(root && !require('node:path').relative(root, entry).startsWith('..'), 'CommonJS resolved outside isolated consumer: ' + entry);
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
  assertInsideConsumer(installedRoot, consumerRoot);
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
    formats: ['esm', 'cjs'],
  }));
} finally {
  if (smokeRoot.startsWith(smokeRootPrefix)) {
    await rm(smokeRoot, { force: true, recursive: true });
    console.log(`pack smoke cleanup: ${smokeRoot}`);
  }
}
