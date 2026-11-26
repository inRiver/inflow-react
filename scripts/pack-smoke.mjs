import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { execFileSync, spawnSync } from 'node:child_process';
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
const ts = createRequire(join(projectRoot, 'package.json'))('typescript');

function run(command, args, cwd, timeout = 120_000) {
  try {
    return execFileSync(command, args, {
      cwd,
      encoding: 'utf8',
      env: { ...process.env, npm_config_cache: npmCache },
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout,
    });
  } catch (error) {
    const stdout = error.stdout?.toString() ?? '';
    const stderr = error.stderr?.toString() ?? '';
    throw new Error(`${command} ${args.join(' ')} failed in ${cwd}\n${stdout}${stderr}`, { cause: error });
  }
}

function runNpm(args, cwd, timeout) {
  return npmCli ? run(process.execPath, [npmCli, ...args], cwd, timeout) : run('npm', args, cwd, timeout);
}

function assertInsideConsumer(entryPath, consumerRoot) {
  const consumerRelativePath = relative(consumerRoot, entryPath);
  assert.ok(
    !isAbsolute(consumerRelativePath) && consumerRelativePath !== '..' && !consumerRelativePath.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`),
    `resolved outside isolated consumer: ${entryPath}`,
  );
}

// Resolve from the extracted tarball, not from the workspace or installed consumer.
function isInside(root, path) {
  const rel = relative(root, path);
  return !isAbsolute(rel) && rel !== '..' && !rel.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`);
}

async function checkDeclarations(packageRoot, archiveEntries) {
  const options = { module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler };
  const declarations = archiveEntries.filter(entry => /\.d\.[cm]?ts$/.test(entry));
  assert.ok(declarations.length, 'tarball contains no declarations');
  for (const entry of declarations) {
    const path = join(packageRoot, entry.slice('package/'.length));
    const parsed = ts.preProcessFile(await readFile(path, 'utf8'), true, true);
    for (const { fileName: specifier } of [...parsed.importedFiles, ...parsed.referencedFiles, ...parsed.typeReferenceDirectives]) {
      if (!/^\.\.?\//.test(specifier)) continue;
      const target = ts.resolveModuleName(specifier, path, options, ts.sys).resolvedModule?.resolvedFileName;
      assert.ok(
        target && isInside(packageRoot, resolve(target)) && /\.d\.[cm]?ts$/.test(target),
        `declaration ${entry} has missing or unpacked relative target ${specifier}`,
      );
    }
  }
}

// Every file path in an `exports` or `bin` value, whatever the nesting of conditions.
function targetsOf(value) {
  return typeof value === 'string' ? [value] : Object.values(value ?? {}).flatMap(targetsOf);
}

function javascriptSpecifiers(text, path) {
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const specifiers = [];
  function visit(node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteralLike(node.moduleSpecifier)) {
      specifiers.push(node.moduleSpecifier.text);
    } else if (ts.isCallExpression(node) && node.arguments.length === 1 && ts.isStringLiteralLike(node.arguments[0]) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === 'require'))) {
      specifiers.push(node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return specifiers;
}

async function javascriptGraph(packageRoot, archiveEntries, entry) {
  const packedFiles = new Set(archiveEntries.filter(path => !path.endsWith('/')).map(path => resolve(packageRoot, path.slice('package/'.length))));
  const pending = [join(packageRoot, entry)];
  const files = new Set();
  const externals = new Set();
  while (pending.length) {
    const path = pending.pop();
    if (files.has(path)) continue;
    assert.ok(isInside(packageRoot, path) && packedFiles.has(path), `JS graph ${entry} references missing or unpacked file ${path}`);
    files.add(path);
    const text = await readFile(path, 'utf8');
    for (const specifier of javascriptSpecifiers(text, path)) {
      if (!/^\.\.?\//.test(specifier)) {
        externals.add(specifier);
        continue;
      }
      const base = resolve(dirname(path), specifier);
      const target = [base, `${base}.js`, `${base}.cjs`, `${base}.mjs`, join(base, 'index.js'), join(base, 'index.cjs'), join(base, 'index.mjs')]
        .find(candidate => packedFiles.has(candidate));
      assert.ok(target && isInside(packageRoot, target), `JS graph ${entry}: ${relative(packageRoot, path)} references missing or unpacked ${specifier}`);
      pending.push(target);
    }
  }
  return { files, externals };
}

async function checkJavascriptGraphs(packageRoot, archiveEntries) {
  const jsEntries = archiveEntries.filter(entry => /\.(?:js|cjs|mjs)$/.test(entry));
  for (const entry of jsEntries) {
    const text = await readFile(join(packageRoot, entry.slice('package/'.length)), 'utf8');
    if (text.includes('_chunks')) {
      assert.ok(archiveEntries.some(path => path.startsWith('package/dist/_chunks/')), `${entry} references _chunks but no chunks were packed`);
      break;
    }
  }
  const manifest = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
  // A declared peer belongs to the host app, so no entry may inline it. Every entry `exports` points at is checked, so a
  // new one is covered without being added here.
  const peers = Object.keys(manifest.peerDependencies ?? {}).map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const bundledPeer = new RegExp(`(?:^|/)node_modules/(?:${peers.join('|')})(?:/|$)`);
  const exportedScripts = targetsOf(manifest.exports).filter(target => /^\.\/dist\/.*\.c?js$/.test(target));
  for (const extension of ['js', 'cjs']) {
    const root = await javascriptGraph(packageRoot, archiveEntries, `dist/index.${extension}`);
    const datetime = await javascriptGraph(packageRoot, archiveEntries, `dist/datetime/index.${extension}`);
    for (const pattern of [/^@mui\/x-date-pickers/, /^dayjs/]) {
      assert.ok(![...root.externals].some(specifier => pattern.test(specifier)), `root ${extension} graph unexpectedly imports ${pattern}`);
      assert.ok([...datetime.externals].some(specifier => pattern.test(specifier)), `datetime ${extension} graph must externalize ${pattern}`);
    }
    const graphFiles = new Set();
    const entryFiles = new Set(exportedScripts.filter(script => script.endsWith(`.${extension}`)).map(script => join(packageRoot, script.slice(2))));
    for (const target of exportedScripts.filter(script => script.endsWith(`.${extension}`))) {
      for (const path of (await javascriptGraph(packageRoot, archiveEntries, target.slice(2))).files) graphFiles.add(path);
    }
    for (const path of graphFiles) {
      const text = await readFile(path, 'utf8');
      const maps = new Set([`${path}.map`]);
      for (const [, url] of text.matchAll(/[#@] sourceMappingURL=([^\s]+)/g)) {
        if (url.endsWith('.map')) maps.add(resolve(dirname(path), url));
      }
      // The bundled-peer check reads source maps, so an entry without a packed one cannot be checked. Helper chunks may
      // lack one (the bundler's runtime chunk has none).
      let checked = 0;
      for (const mapPath of maps) {
        assert.ok(isInside(packageRoot, mapPath), `source map outside package: ${mapPath}`);
        if (!archiveEntries.includes(`package/${relative(packageRoot, mapPath).replaceAll('\\', '/')}`)) continue;
        checked += 1;
        const map = JSON.parse(await readFile(mapPath, 'utf8'));
        assert.ok(Array.isArray(map.sources), `invalid source map ${mapPath}: missing sources`);
        for (const source of map.sources) {
          assert.doesNotMatch(source.replaceAll('\\', '/'), bundledPeer, `inlined peer dependency in ${mapPath}: ${source}`);
        }
      }
      if (entryFiles.has(path)) {
        assert.ok(checked > 0, `no source map is packed for ${relative(packageRoot, path)}, so peers bundled into it cannot be detected`);
      }
    }
  }
}

async function checkHoistedPeers(consumerRoot) {
  const copies = new Map([['@mui/x-date-pickers', new Set()], ['dayjs', new Set()]]);
  const visited = new Set();
  async function visitModules(directory) {
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      if (error.code === 'ENOENT') return;
      throw error;
    }
    for (const entry of entries) {
      if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
      if (entry.name.startsWith('.')) continue;
      const path = join(directory, entry.name);
      if (entry.name.startsWith('@')) {
        for (const child of await readdir(path, { withFileTypes: true })) {
          if (child.isDirectory() || child.isSymbolicLink()) await visitPackage(join(path, child.name), `${entry.name}/${child.name}`);
        }
      } else {
        await visitPackage(path, entry.name);
      }
    }
  }
  async function visitPackage(path, name) {
    const canonical = await realpath(path);
    if (copies.has(name)) copies.get(name).add(canonical);
    if (visited.has(canonical)) return;
    visited.add(canonical);
    await visitModules(join(path, 'node_modules'));
  }
  await visitModules(join(consumerRoot, 'node_modules'));
  for (const [name, paths] of copies) {
    const hoisted = await realpath(join(consumerRoot, 'node_modules', ...name.split('/')));
    assert.deepEqual([...paths], [hoisted], `expected one hoisted copy of ${name}, found ${[...paths].join(', ')}`);
  }
}

function typecheckConsumer(consumerRoot) {
  const result = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.json', '--pretty', 'false'], {
    cwd: consumerRoot, encoding: 'utf8', timeout: 120_000,
  });
  if (result.error) throw result.error;
  assert.equal(result.signal, null, `consumer tsc terminated by signal ${result.signal}`);
  assert.equal(result.stderr, '', `consumer tsc stderr: ${result.stderr}`);
  const blocks = [];
  for (const line of result.stdout.split(/\r?\n/)) {
    if (/^.+\(\d+,\d+\): error TS\d+:/.test(line) || /^error TS\d+:/.test(line)) blocks.push(line);
    else if (line && blocks.length) blocks[blocks.length - 1] += `\n${line}`;
    else if (line) blocks.push(line);
  }
  const nodeModules = join(consumerRoot, 'node_modules');
  const installedLibrary = join(nodeModules, '@inriver', 'inflow-react');
  const ignored = [];
  const failures = [];
  for (const block of blocks) {
    const match = /^(.+)\(\d+,\d+\): error TS\d+:/.exec(block);
    const path = match && resolve(consumerRoot, match[1]);
    if (path && isInside(nodeModules, path) && !isInside(installedLibrary, path)) ignored.push(block);
    else failures.push(block);
  }
  console.log(`typecheck ignored third-party diagnostics: ${ignored.length}`);
  assert.ok(result.status === 0 || ([1, 2].includes(result.status) && blocks.length), `consumer tsc exited ${result.status} without diagnostics`);
  assert.equal(failures.length, 0, `consumer or packed library type errors:\n${failures.join('\n')}`);
}

// During SSR the picker has no anchor element, so keepMounted renders its popper
// (hidden) and layout. Inspect its actual modifiers for defaults and overrides.
const pickerSlotsSmoke = String.raw`
function PickerSlotProbe() {
  const components = useTheme().components;
  const layoutSlots = components?.MuiPickersLayout?.defaultProps?.slots;
  const pickerSlots = components?.MuiDesktopTimePicker?.defaultProps?.slots;
  assert.equal(typeof layoutSlots?.actionBar, 'function', 'picker layout action bar slot must be configured');
  assert.equal(pickerSlots?.popper, undefined, 'desktop picker must not replace the popper slot');
  return null;
}
function renderTimePicker(modifiers) {
  let popperModifiers;
  const popperProps = {
    disablePortal: true,
    keepMounted: true,
    slotProps: { root: ownerState => { popperModifiers = ownerState.modifiers; return {}; } },
  };
  if (modifiers !== undefined) popperProps.modifiers = modifiers;
  const markup = renderToString(createElement(inflow.InflowProvider, { mode: 'light' },
    createElement(InflowLocalizationProvider, { locale: 'en' },
      createElement(PickerSlotProbe),
      createElement(DesktopTimePicker, {
        open: true,
        defaultValue: dayjs('2024-01-01T07:30:00'),
        slotProps: { popper: popperProps },
      }))));
  const popper = markup.match(/<div[^>]*role="dialog"[^>]*>/)?.[0];
  assert.ok(popper, 'desktop time picker popper must render');
  assert.match(popper, /\bMuiPopper-root\b/);
  assert.ok(Array.isArray(popperModifiers), 'desktop picker popper modifiers must be present');
  return { markup, popperModifiers };
}
const defaultPicker = renderTimePicker();
const offset = defaultPicker.popperModifiers.find(modifier => modifier.name === 'offset')?.options?.offset;
assert.equal(typeof offset, 'function', 'default picker popper must have its offset modifier');
assert.deepEqual(offset({ placement: 'bottom-start' }), [0, 0]);
const topOffset = offset({ placement: 'top-start' });
assert.ok(Array.isArray(topOffset) && topOffset.length === 2, 'top offset must be a two-element tuple');
assert.equal(topOffset[0], 0);
assert.ok(topOffset[1] > 0, 'flipped popper must leave a gap above the field');
const consumerPicker = renderTimePicker([{ name: 'smoke-sentinel', enabled: false }]);
assert.ok(consumerPicker.popperModifiers.some(modifier => modifier.name === 'smoke-sentinel'), 'consumer popper modifier must be present');
assert.ok(!consumerPicker.popperModifiers.some(modifier => modifier.name === 'offset'), 'consumer popper modifiers must replace the default');
const cancel = defaultPicker.markup.match(/<button\b[^>]*>Cancel<\/button>/)?.[0];
const ok = defaultPicker.markup.match(/<button\b[^>]*>OK<\/button>/)?.[0];
assert.ok(cancel, 'desktop time picker Cancel button must render');
assert.ok(ok, 'desktop time picker OK button must render');
assert.match(cancel, /\bMuiButton-outlined\b/);
assert.match(cancel, /\bMuiButton-sizeSmall\b/);
assert.match(ok, /\bMuiButton-contained\b/);
assert.match(ok, /\bMuiButton-sizeSmall\b/);
assert.match(defaultPicker.markup, /<div[^>]*\bMuiPickersLayout-actionBar\b[^>]*>/);
assert.match(defaultPicker.markup, /<style[^>]*MuiPickersLayout-actionBar[^>]*>[^<]*padding:4px 8px 8px;gap:8px;[^<]*<\/style>/);

function ConsumerActionBar() { return createElement('div', null, 'Consumer layout action bar'); }
const consumerTheme = inflow.createInflowTheme('light');
consumerTheme.components = {
  ...consumerTheme.components,
  MuiPickersLayout: { defaultProps: { slots: { actionBar: ConsumerActionBar } } },
};
const customBarMarkup = renderToString(createElement(inflow.InflowProvider, { mode: 'light' },
  createElement(ThemeProvider, { theme: consumerTheme },
    createElement(InflowLocalizationProvider, { locale: 'en' },
      createElement(DesktopTimePicker, {
        open: true,
        defaultValue: dayjs('2024-01-01T07:30:00'),
        slotProps: { popper: { disablePortal: true, keepMounted: true } },
      })))));
assert.match(customBarMarkup, /Consumer layout action bar/);
assert.doesNotMatch(customBarMarkup, /<button\b[^>]*>Cancel<\/button>/);
`;

// Register both hooks in each process: ESM resolve hooks do not cover every
// CommonJS require made by dependencies, and vice versa.
const optionalPeerEsmHook = `
export function resolve(specifier, context, nextResolve) {
  if (['@mui/x-date-pickers', 'dayjs'].some(name => specifier === name || specifier.startsWith(name + '/'))) {
    throw Object.assign(new Error('optional peer blocked: ' + specifier), { code: 'ERR_OPTIONAL_PEER_BLOCKED' });
  }
  return nextResolve(specifier, context);
}
`;
const registerOptionalPeerHook = `
import { register } from 'node:module';
register('./optional-peer-hook.mjs', import.meta.url);
`;
const optionalPeerCjsHook = `
const Module = require('node:module');
const original = Module._resolveFilename;
Module._resolveFilename = function (specifier, ...args) {
  if (['@mui/x-date-pickers', 'dayjs'].some(name => specifier === name || specifier.startsWith(name + '/'))) {
    throw Object.assign(new Error('optional peer blocked: ' + specifier), { code: 'ERR_OPTIONAL_PEER_BLOCKED' });
  }
  return original.call(this, specifier, ...args);
};
`;
const rootOnlyRender = `
const markup = renderToString(createElement(inflow.InflowProvider, { mode: 'light' }, [
  createElement(inflow.ThemedButton, { key: 'button' }, 'root without optional peers'),
  createElement(inflow.ThemedBadge, { badgeContent: '3', key: 'badge' }, createElement('span', null, 'root badge')),
]));
assert.match(markup, /data-inflow-root/);
assert.match(markup, /root without optional peers/);
assert.match(markup, /root badge/);
assert.match(markup, />3</);
`;
const rootOnlyEsm = `
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import * as inflow from '${packageName}';
const require = createRequire(import.meta.url);
for (const specifier of ['dayjs', 'dayjs/plugin/utc.js', '@mui/x-date-pickers', '@mui/x-date-pickers/DatePicker']) {
  await assert.rejects(import(specifier), { code: 'ERR_OPTIONAL_PEER_BLOCKED' });
  assert.throws(() => require(specifier), { code: 'ERR_OPTIONAL_PEER_BLOCKED' });
}
${rootOnlyRender}
console.log(JSON.stringify({ format: 'esm', rootWithoutOptionalPeers: 'PASS' }));
`;
const rootOnlyCjs = `
const assert = require('node:assert/strict');
const { createElement } = require('react');
const { renderToString } = require('react-dom/server');
const inflow = require('${packageName}');
(async () => {
  for (const specifier of ['dayjs', 'dayjs/plugin/utc.js', '@mui/x-date-pickers', '@mui/x-date-pickers/DatePicker']) {
    await assert.rejects(import(specifier), { code: 'ERR_OPTIONAL_PEER_BLOCKED' });
    assert.throws(() => require(specifier), { code: 'ERR_OPTIONAL_PEER_BLOCKED' });
  }
  ${rootOnlyRender}
  console.log(JSON.stringify({ format: 'cjs', rootWithoutOptionalPeers: 'PASS' }));
})().catch(error => { console.error(error); process.exitCode = 1; });
`;

const esmSmoke = `
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { realpath } from 'node:fs/promises';
import * as inflow from '${packageName}';
import { inflowGridThemeParams } from '${packageName}/ag-grid';
import { InflowLocalizationProvider, formatDateTime } from '${packageName}/datetime';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import timezonePlugin from 'dayjs/plugin/timezone.js';
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
assert.equal(formatDateTime('2022-03-09T16:33:00', { locale: 'en' }), '3/9/2022 4:33 PM');
assert.equal(formatDateTime('2022-03-09T16:33:00', { locale: 'de' }), '09.03.2022 16:33');
const pickerMarkup = renderToString(createElement(inflow.InflowProvider, { mode: 'light' },
  createElement(InflowLocalizationProvider, { locale: 'en' },
    createElement(DatePicker, { label: 'Appointment date', defaultValue: dayjs('2024-01-01T00:00:00') }))));
assert.match(pickerMarkup, /Appointment date/);
assert.match(pickerMarkup, /<input[^>]*value="1\\/1\\/2024"/);
const timePickerMarkup = renderToString(createElement(inflow.InflowProvider, { mode: 'light' },
  createElement(InflowLocalizationProvider, { locale: 'en' },
    createElement(TimePicker, { label: 'Appointment time', defaultValue: dayjs('2024-01-01T07:30:00') }))));
assert.match(timePickerMarkup, /Appointment time/);
assert.match(timePickerMarkup, /<input[^>]*value="7:30 AM"/);
${pickerSlotsSmoke}
// A zone only reaches the time pickers once the app has registered the dayjs plugins, and never reaches a date picker.
const zoneProbe = (timeZone) => renderToString(createElement(inflow.InflowProvider, { mode: 'light' },
  createElement(InflowLocalizationProvider, { locale: 'en', hourCycle: '24', timeZone },
    createElement(TimePicker, { label: 'Zoned time', defaultValue: dayjs.utc('2024-01-01T10:30:00Z') }),
    createElement(DatePicker, { label: 'Zoned date', defaultValue: dayjs('2024-01-01T00:00:00') }))));
assert.match(zoneProbe('Pacific/Kiritimati'), /<input[^>]*value="10:30"/, 'a zone is ignored until the dayjs timezone plugin is registered');
dayjs.extend(timezonePlugin);
const zonedMarkup = zoneProbe('Pacific/Kiritimati');
assert.match(zonedMarkup, /<input[^>]*value="00:30"/, 'time picker must show the provider zone');
assert.match(zonedMarkup, /<input[^>]*value="1\\/1\\/2024"/, 'date picker must not be converted');
assert.match(zoneProbe('Mars/Olympus'), /<input[^>]*value="10:30"/, 'an unknown zone must be ignored');
await assert.rejects(import('${packageName}/src/index.ts'), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
console.log(JSON.stringify({ format: 'esm', entry, render: 'PASS', pickerSsr: 'PASS', pickerZone: 'PASS', pickerSlots: 'PASS', agGrid: 'PASS', hiddenImport: 'PASS' }));
`;

const cjsSmoke = `
const assert = require('node:assert/strict');
const { createElement } = require('react');
const { renderToString } = require('react-dom/server');
const { realpathSync } = require('node:fs');
const inflow = require('${packageName}');
const { inflowGridThemeParams } = require('${packageName}/ag-grid');
const { InflowLocalizationProvider, formatDateTime } = require('${packageName}/datetime');
const { DatePicker } = require('@mui/x-date-pickers/DatePicker');
const { TimePicker } = require('@mui/x-date-pickers/TimePicker');
const { DesktopTimePicker } = require('@mui/x-date-pickers/DesktopTimePicker');
const { ThemeProvider, useTheme } = require('@mui/material/styles');
const dayjs = require('dayjs');
const timezonePlugin = require('dayjs/plugin/timezone');
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
assert.equal(formatDateTime('2022-03-09T16:33:00', { locale: 'en' }), '3/9/2022 4:33 PM');
assert.equal(formatDateTime('2022-03-09T16:33:00', { locale: 'de' }), '09.03.2022 16:33');
const pickerMarkup = renderToString(createElement(inflow.InflowProvider, { mode: 'light' },
  createElement(InflowLocalizationProvider, { locale: 'en' },
    createElement(DatePicker, { label: 'Appointment date', defaultValue: dayjs('2024-01-01T00:00:00') }))));
assert.match(pickerMarkup, /Appointment date/);
assert.match(pickerMarkup, /<input[^>]*value="1\\/1\\/2024"/);
const timePickerMarkup = renderToString(createElement(inflow.InflowProvider, { mode: 'light' },
  createElement(InflowLocalizationProvider, { locale: 'en' },
    createElement(TimePicker, { label: 'Appointment time', defaultValue: dayjs('2024-01-01T07:30:00') }))));
assert.match(timePickerMarkup, /Appointment time/);
assert.match(timePickerMarkup, /<input[^>]*value="7:30 AM"/);
${pickerSlotsSmoke}
// A zone only reaches the time pickers once the app has registered the dayjs plugins, and never reaches a date picker.
const zoneProbe = (timeZone) => renderToString(createElement(inflow.InflowProvider, { mode: 'light' },
  createElement(InflowLocalizationProvider, { locale: 'en', hourCycle: '24', timeZone },
    createElement(TimePicker, { label: 'Zoned time', defaultValue: dayjs.utc('2024-01-01T10:30:00Z') }),
    createElement(DatePicker, { label: 'Zoned date', defaultValue: dayjs('2024-01-01T00:00:00') }))));
assert.match(zoneProbe('Pacific/Kiritimati'), /<input[^>]*value="10:30"/, 'a zone is ignored until the dayjs timezone plugin is registered');
dayjs.extend(timezonePlugin);
const zonedMarkup = zoneProbe('Pacific/Kiritimati');
assert.match(zonedMarkup, /<input[^>]*value="00:30"/, 'time picker must show the provider zone');
assert.match(zonedMarkup, /<input[^>]*value="1\\/1\\/2024"/, 'date picker must not be converted');
assert.match(zoneProbe('Mars/Olympus'), /<input[^>]*value="10:30"/, 'an unknown zone must be ignored');
assert.throws(() => require('${packageName}/src/index.ts'), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
console.log(JSON.stringify({ format: 'cjs', entry, render: 'PASS', pickerSsr: 'PASS', pickerZone: 'PASS', pickerSlots: 'PASS', agGrid: 'PASS', hiddenImport: 'PASS' }));
`;

try {
  const packOutput = runNpm(['pack', projectRoot, '--json'], smokeRoot);
  const packed = JSON.parse(packOutput);
  assert.equal(packed.length, 1, 'npm pack must produce one tarball');
  const tarball = join(smokeRoot, packed[0].filename);
  const archiveEntries = run(tar, ['-tzf', tarball], smokeRoot).trim().split(/\r?\n/);
  for (const required of [
    'package/dist/cli/inflow.js',
    'package/dist/cli/cli.js',
    'package/dist/cli/manifest.json',
    'package/dist/index.js',
    'package/dist/index.cjs',
    'package/dist/index.d.ts',
    'package/dist/ag-grid/index.js',
    'package/dist/ag-grid/index.cjs',
    'package/dist/ag-grid/index.d.ts',
    'package/dist/datetime/index.js',
    'package/dist/datetime/index.cjs',
    'package/dist/datetime/index.d.ts',
    'package/dist/datetime/InflowLocalizationProvider.d.ts',
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
  // Every file that `exports` and `bin` point at must be in the tarball, so a new entry missing from `files` fails here
  // without anyone having to add it to the list above.
  const manifest = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'));
  for (const target of [...targetsOf(manifest.exports), ...targetsOf(manifest.bin)]) {
    assert.ok(archiveEntries.includes(`package/${target.replace(/^\.\//, '')}`), `tarball missing ${target}, which package.json points at`);
  }

  const extractRoot = join(smokeRoot, 'extracted');
  await mkdir(extractRoot);
  run(tar, ['-xzf', tarball, '-C', extractRoot], smokeRoot);
  const packageRoot = join(extractRoot, 'package');
  await checkDeclarations(packageRoot, archiveEntries);
  await checkJavascriptGraphs(packageRoot, archiveEntries);

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
      '@mui/x-date-pickers': packageMetadata.devDependencies['@mui/x-date-pickers'],
      '@types/react': packageMetadata.devDependencies['@types/react'],
      '@types/react-dom': packageMetadata.devDependencies['@types/react-dom'],
      dayjs: packageMetadata.devDependencies.dayjs,
      typescript: packageMetadata.devDependencies.typescript,
      react: packageMetadata.devDependencies.react,
      'react-dom': packageMetadata.devDependencies['react-dom'],
    },
  }, null, 2));
  await writeFile(join(consumerRoot, 'esm.mjs'), `import { fileURLToPath } from 'node:url'; import { relative } from 'node:path';\n${esmSmoke}`);
  await writeFile(join(consumerRoot, 'cjs.cjs'), cjsSmoke);
  await writeFile(join(consumerRoot, 'optional-peer-hook.mjs'), optionalPeerEsmHook);
  await writeFile(join(consumerRoot, 'register-optional-peer-hook.mjs'), registerOptionalPeerHook);
  await writeFile(join(consumerRoot, 'block-optional-peers.cjs'), optionalPeerCjsHook);
  await writeFile(join(consumerRoot, 'root-only-esm.mjs'), rootOnlyEsm);
  await writeFile(join(consumerRoot, 'root-only-cjs.cjs'), rootOnlyCjs);
  await writeFile(join(consumerRoot, 'types-check.tsx'), `
import { InflowProvider, createInflowTheme, ThemedChip } from '${packageName}';
import { InflowLocalizationProvider, formatDateTime, getDateTimeFormats, dateTimeColumn, type InflowLocalizationProviderProps } from '${packageName}/datetime';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
// @ts-expect-error datetime APIs are only exported by the datetime subpath
import { InflowLocalizationProvider as RootLocalizationProvider } from '${packageName}';
// @ts-expect-error date formatters are only exported by the datetime subpath
import { formatDate as RootFormatDate } from '${packageName}';
const props: InflowLocalizationProviderProps = { locale: 'en', children: null };
const theme = createInflowTheme('light');
const formatted: string = formatDateTime('2022-03-09T16:33:00', { locale: 'en' });
const pattern: string = getDateTimeFormats({ locale: 'en' }).dateTime;
const cell: string = dateTimeColumn.valueFormatter({ value: new Date() });
const app = <InflowProvider mode="light"><InflowLocalizationProvider locale="en">
  <DatePicker label="Appointment date" defaultValue={dayjs('2024-01-01T00:00:00')} />
  <ThemedChip label={formatted} />
</InflowLocalizationProvider></InflowProvider>;
const zoned = <InflowLocalizationProvider timeZone="Pacific/Kiritimati">{null}</InflowLocalizationProvider>;
// @ts-expect-error a time zone is a name such as "Europe/Stockholm", not a number
const wrongZone = <InflowLocalizationProvider timeZone={5}>{null}</InflowLocalizationProvider>;
void [props, theme, pattern, cell, app, RootLocalizationProvider, RootFormatDate, zoned, wrongZone];
`);
  await writeFile(join(consumerRoot, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      target: 'ES2022', module: 'ESNext', moduleResolution: 'bundler', jsx: 'react-jsx',
      strict: true, noEmit: true, skipLibCheck: false, lib: ['ES2022', 'DOM'], types: [],
    },
    include: ['types-check.tsx'],
  }, null, 2));
  runNpm(['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false'], consumerRoot, 300_000);
  await checkHoistedPeers(consumerRoot);
  typecheckConsumer(consumerRoot);

  const installedRoot = await realpath(join(consumerRoot, 'node_modules', '@inriver', 'inflow-react'));
  // On Windows, realpath expands 8.3 short-name segments (e.g. RICHAR~1) while
  // consumerRoot retains them from mkdtemp. Canonicalize both sides through
  // realpath before comparing so the assertion is junction- and short-name-safe.
  const canonicalConsumerRoot = await realpath(consumerRoot);
  assertInsideConsumer(installedRoot, canonicalConsumerRoot);
  const installedMetadata = JSON.parse(await readFile(join(installedRoot, 'package.json'), 'utf8'));
  assert.equal(installedMetadata.bin.inflow, './dist/cli/inflow.js', 'inflow bin must point to the installed CLI');
  assert.match(await readFile(join(installedRoot, 'dist/cli/inflow.js'), 'utf8'), /^#!\/usr\/bin\/env node/);
  const cliOutput = JSON.parse(run(process.execPath, [join(installedRoot, 'dist/cli/inflow.js'), 'component', '--list', '--json'], consumerRoot));
  assert.equal(cliOutput.ok, true, 'installed CLI must succeed');
  assert.equal(cliOutput.command, 'component');
  assert.ok(Array.isArray(cliOutput.data) && cliOutput.data.some(entry => entry.componentName === 'ThemedChip'));
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
  for (const script of ['root-only-esm.mjs', 'root-only-cjs.cjs']) {
    try {
      execFileSync(process.execPath, ['--require', './block-optional-peers.cjs', '--import', './register-optional-peer-hook.mjs', script], {
        cwd: consumerRoot,
        encoding: 'utf8',
        env: environment,
        stdio: 'inherit',
        timeout: 120_000,
      });
    } catch (error) {
      throw new Error(`packed ${script} without optional peers failed`, { cause: error });
    }
  }
  console.log(JSON.stringify({
    status: 'PASS',
    tarball: basename(tarball),
    installedRoot,
    packageFiles: 'PASS',
    declarations: 'PASS',
    jsGraph: 'PASS',
    typecheck: 'PASS',
    pickerSsr: 'PASS',
    pickerSlots: 'PASS',
    rootWithoutOptionalPeers: 'PASS',
    hoistedPeers: 'PASS',
    cli: 'PASS',
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
