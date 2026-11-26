import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import ts from 'typescript';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

// MUI component subpath defaults can break the library's CJS bundle.
function muiSubpathDefaultImports(path, text) {
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true,
    path.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  return source.statements.flatMap((statement) => {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)
      || !statement.moduleSpecifier.text.startsWith('@mui/material/')) return [];
    const clause = statement.importClause;
    if (!clause || clause.isTypeOnly) return [];
    const named = clause.namedBindings;
    const hasNamedDefault = named && ts.isNamedImports(named) && named.elements.some((element) =>
      !element.isTypeOnly && (element.propertyName ?? element.name).text === 'default');
    if (!clause.name && !hasNamedDefault) return [];
    const { line, character } = source.getLineAndCharacterOfPosition(statement.getStart(source));
    return [`${path}:${line + 1}:${character + 1} ${statement.moduleSpecifier.text}`];
  });
}

function librarySources(directory) {
  return readdirSync(join(root, directory), { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return librarySources(path);
    return entry.isFile() && /\.tsx?$/.test(entry.name) && !/\.(?:test|spec)\.tsx?$/.test(entry.name)
      ? [path] : [];
  });
}

describe('repository guardrails', () => {
  it('detects only default value imports from MUI material subpaths', () => {
    const source = `
      import SvgIcon from '@mui/material/SvgIcon';
      import Button, { type ButtonProps } from '@mui/material/Button';
      import { default as Input } from '@mui/material/Input';
      import { type default as IconType } from '@mui/material/Icon';
      import type DefaultTheme from '@mui/material/styles';
      import type { default as ButtonType } from '@mui/material/Button';
      import { useDefaultProps } from '@mui/material/DefaultPropsProvider';
      import { type Theme } from '@mui/material/styles';
      import { SvgIcon as NamedIcon } from '@mui/material';
      import Other from '@mui/materiality/Button';
      // import Fake from '@mui/material/Fake';
      const example = "import Fake from '@mui/material/Fake'";
    `;
    assert.deepEqual(muiSubpathDefaultImports('example.ts', source), [
      'example.ts:2:7 @mui/material/SvgIcon',
      'example.ts:3:7 @mui/material/Button',
      'example.ts:4:7 @mui/material/Input',
    ]);
  });

  it('avoids MUI material subpath default value imports in shipped library sources', () => {
    const files = ['src/index.ts', ...[
      'src/theme', 'src/providers', 'src/components/themed', 'src/datetime', 'src/ag-grid',
    ].flatMap(librarySources)];
    const violations = files.flatMap((file) => muiSubpathDefaultImports(file, read(file)));
    assert.deepEqual(violations, [], `Use named imports from @mui/material for CJS compatibility:\n${violations.join('\n')}`);
  });

  it('points every CODEOWNERS rule at an existing path and a valid owner', () => {
    const owner = /^@[\w.-]+(\/[\w.-]+)?$|^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const rules = read('.github/CODEOWNERS')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));
    assert.ok(rules.length > 0, 'CODEOWNERS has no rules');

    for (const rule of rules) {
      const [pattern, ...owners] = rule.split(/\s+/);
      assert.ok(owners.length > 0 && owners.every((name) => owner.test(name)), `${pattern} has no valid owner`);
      assert.ok(existsSync(join(root, pattern.replace(/^\//, ''))), `${pattern} matches nothing`);
    }
  });

  it('documents only npm scripts that exist', () => {
    const { scripts } = JSON.parse(read('package.json'));
    for (const file of ['AGENTS.md', 'docs/CONTRIBUTING.md', '.github/pull_request_template.md']) {
      for (const [, run, shorthand] of read(file).matchAll(/npm run ([\w:-]+)|npm (test|start)\b/g)) {
        const name = run ?? shorthand;
        assert.ok(name in scripts, `${file} mentions "npm ${name}", which package.json does not define`);
      }
    }
  });
});
