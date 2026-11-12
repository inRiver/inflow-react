import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const directory = dirname(fileURLToPath(import.meta.url));
const read = (file: string) => readFileSync(resolve(directory, file), 'utf8');
const manifest = JSON.parse(read('manifest.json')) as {
  sources: { package: string; version: string; license: { type: string } }[];
  files: { path: string; sha256: string; bytes: number }[];
};

describe('optional self-hosted font assets', () => {
  it('keeps all original WOFF2 bytes and OFL notices', () => {
    expect(manifest.files).toHaveLength(16);
    for (const font of manifest.files) {
      const bytes = readFileSync(resolve(directory, font.path));
      expect(bytes.subarray(0, 4).toString()).toBe('wOF2');
      expect(bytes.length).toBe(font.bytes);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(font.sha256);
    }
    for (const family of ['inter', 'material-icons', 'material-icons-outlined']) {
      expect(read(`${family}/LICENSE`)).toContain('SIL OPEN FONT LICENSE Version 1.1');
    }
    expect(manifest.sources.every(source => source.version === '5.3.0' && source.license.type === 'OFL-1.1')).toBe(true);
  });

  it('registers both variable Inter styles for all seven script subsets', () => {
    const css = read('inter.css');
    expect(css.match(/@font-face/g)).toHaveLength(14);
    expect(css.match(/font-family: 'Inter'/g)).toHaveLength(14);
    expect(css.match(/font-weight: 100 900/g)).toHaveLength(14);
    expect(css.match(/font-style: normal/g)).toHaveLength(7);
    expect(css.match(/font-style: italic/g)).toHaveLength(7);
    expect(css.match(/unicode-range:/g)).toHaveLength(14);
    for (const subset of ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext', 'greek', 'greek-ext', 'vietnamese']) {
      expect(css).toContain(`inter-${subset}-standard-normal.woff2`);
      expect(css).toContain(`inter-${subset}-standard-italic.woff2`);
    }
  });

  it('uses only local URLs and includes both legacy ligature classes', () => {
    for (const name of ['inter.css', 'material-icons.css']) {
      const css = read(name);
      expect(css).not.toMatch(/https?:|@import/);
      const urls = [...css.matchAll(/url\(['"]?(\.\/[^)'"\s]+)['"]?\)/g)];
      expect(urls.length).toBeGreaterThan(0);
      for (const [, url] of urls) expect(existsSync(resolve(directory, url))).toBe(true);
    }
    const css = read('material-icons.css');
    expect(css).toContain('.material-icons {');
    expect(css).toContain('.material-icons-outlined {');
    expect(css.match(/font-feature-settings: 'liga'/g)).toHaveLength(4);
  });

  it('offers one explicit local-assets import without changing narrower exports', () => {
    const css = read('local-assets.css');
    expect(css).not.toMatch(/https?:|url\(/);
    expect([...css.matchAll(/@import '([^']+)'/g)].map(match => match[1])).toEqual([
      './inter.css', './material-icons.css',
    ]);
    const metadata = JSON.parse(read('../../package.json'));
    expect(metadata.exports['./local-assets.css']).toBe('./dist/fonts/local-assets.css');
    expect(metadata.exports['./fonts/inter.css']).toBe('./dist/fonts/inter.css');
    expect(metadata.exports['./fonts/material-icons.css']).toBe('./dist/fonts/material-icons.css');
  });

  it('keeps font loading out of the JS entry and removes external showcase links', () => {
    expect(read('../index.ts')).not.toMatch(/fonts\/|local-assets\.css/);
    expect(read('../providers/InflowProvider.tsx')).not.toMatch(/fonts\/|local-assets\.css/);
    expect(read('../../index.html')).not.toMatch(/fonts\.googleapis|fonts\.gstatic/);
    expect(read('../main.tsx')).toContain("import './fonts/local-assets.css'");
  });
});
