/// <reference types="node" />
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Colors come from the tokens (inflow-tokens.ts) through the theme. Light mode is the shipped look and is not being
// reworked, so the literals that already exist are frozen below. This guard only stops NEW ones: a file may not gain
// a color literal, and a file that is not listed may not have any. When you remove one, lower its count (or delete the
// entry); never raise it. For a new color, add a token and reference it, preferring MUI's own palette slots
// (palette.common, palette.action, theme alpha()) over a new custom token.
const EXISTING_LITERALS: Record<string, number> = {
  'src/app/RootLayout.tsx': 1,
  'src/components/NavRail.tsx': 7,
  'src/components/themed/ThemedRightPanel.tsx': 3,
  'src/components/themed/ThemedTable.tsx': 1,
  'src/pages/AccessibilityPage.tsx': 2,
  'src/pages/ComponentPage.tsx': 3,
  'src/pages/PreRenderedPage.tsx': 7,
  'src/pages/PublishersAgGridPage.data.ts': 3,
  'src/showcase/CodeBlock.tsx': 9,
  'src/showcase/ComponentCustomizationPanel.tsx': 2,
  'src/showcase/InlineCustomizationPlayground.tsx': 2,
  'src/showcase/demos/ImageListDemo.tsx': 5,
  'src/showcase/tableReferenceData.ts': 1,
  'src/theme/fileTypes.ts': 9,
  'src/theme/inflow.ts': 17,
};
const TOKEN_FILES = new Set(['src/theme/inflow-tokens.ts', 'src/theme/tokens.ts']);
const SKIPPED_DIRS = new Set(['src/ag-grid', 'src/test']);
const COLOR_LITERAL = /(?<![&\w])#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(/;

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    const rel = relative('.', path).split('\\').join('/');
    if (statSync(path).isDirectory()) return SKIPPED_DIRS.has(rel) ? [] : walk(path);
    return /\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) && !TOKEN_FILES.has(rel) ? [rel] : [];
  });

const countLiterals = (file: string) =>
  readFileSync(file, 'utf8')
    .split('\n')
    .filter((line) => {
      const code = line.trim();
      return !(code.startsWith('//') || code.startsWith('*') || code.startsWith('/*')) && COLOR_LITERAL.test(line);
    }).length;

describe('no new hardcoded colors outside the tokens', () => {
  it('does not add color literals to any source file', () => {
    const grew = walk('src').flatMap((file) => {
      const count = countLiterals(file);
      const allowed = EXISTING_LITERALS[file] ?? 0;
      return count > allowed ? [`${file}: ${count} literals, ${allowed} allowed`] : [];
    });
    expect(grew).toEqual([]);
  });

  it('only lists files that still exist', () => {
    const files = new Set(walk('src'));
    expect(Object.keys(EXISTING_LITERALS).filter((file) => !files.has(file))).toEqual([]);
  });
});
