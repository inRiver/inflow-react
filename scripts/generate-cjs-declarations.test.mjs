import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { toCjsDeclaration } from './generate-cjs-declarations.mjs';

const input = `import { Foo } from './foo.js';
import type { Bar } from "../bar.js";
import './side-effect.js';
export { Foo } from './foo.js';
export type { Bar } from '../bar.js';
export * from './nested/index.js';
export type Dynamic = import('./dynamic.js').Dynamic;
export type Nested = typeof import('../nested.js');
import type { Theme } from '@mui/material/styles';
import '@mui/x-date-pickers/themeAugmentation';
export type Other = import('dayjs').Dayjs;
export type Literal = './not-a-module.js';
export { Thing } from './unchanged.json';
declare module '@mui/material/styles' { interface Theme { example: string } }
//# sourceMappingURL=index.d.ts.map
`;
const expected = input
  .replaceAll("from './foo.js'", "from './foo.cjs'")
  .replaceAll("from '../bar.js'", "from '../bar.cjs'")
  .replace('from "../bar.js"', 'from "../bar.cjs"')
  .replace("import './side-effect.js'", "import './side-effect.cjs'")
  .replace("from './nested/index.js'", "from './nested/index.cjs'")
  .replace("import('./dynamic.js')", "import('./dynamic.cjs')")
  .replace("import('../nested.js')", "import('../nested.cjs')")
  .replace('//# sourceMappingURL=index.d.ts.map\n', '');

describe('CJS declaration generator', () => {
  it('rewrites only relative JS module edges and strips the trailing source map', () => {
    assert.equal(toCjsDeclaration(input), expected);
    assert.equal(toCjsDeclaration('export type T = "//# sourceMappingURL=keep";\n'),
      'export type T = "//# sourceMappingURL=keep";\n');
    assert.equal(toCjsDeclaration('export {};\r\n//# sourceMappingURL=test.map\r\n'), 'export {};\n');
    assert.equal(toCjsDeclaration(String.raw`export * from './foo\u002ejs';`), 'export * from "./foo.cjs";');
  });

  it('generates sibling declarations recursively without touching originals or CLI declarations', () => {
    const dist = mkdtempSync(join(tmpdir(), 'inflow-cjs-declarations-'));
    try {
      for (const directory of ['ag-grid', 'datetime', 'theme', 'providers', 'components/themed', 'cli']) {
        mkdirSync(join(dist, directory), { recursive: true });
      }
      const files = ['index.d.ts', 'ag-grid/index.d.ts', 'datetime/client.d.ts', 'theme/index.d.ts',
        'providers/index.d.ts', 'components/themed/child.d.ts'];
      for (const file of files) writeFileSync(join(dist, file), input);
      writeFileSync(join(dist, 'cli/index.d.ts'), input);
      execFileSync(process.execPath, [fileURLToPath(new URL('./generate-cjs-declarations.mjs', import.meta.url)), dist]);
      for (const file of files) {
        assert.equal(readFileSync(join(dist, file), 'utf8'), input);
        assert.equal(readFileSync(join(dist, file.replace(/\.d\.ts$/, '.d.cts')), 'utf8'), expected);
      }
      assert.throws(() => readFileSync(join(dist, 'cli/index.d.cts')), { code: 'ENOENT' });
    } finally {
      rmSync(dist, { recursive: true, force: true });
    }
  });
});
