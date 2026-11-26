import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

// Keep declaration text (including documentation and module augmentations) intact apart from module specifiers.
export function toCjsDeclaration(text, filename = 'index.d.ts') {
  const source = ts.createSourceFile(filename, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const replacements = [];
  function visit(node) {
    let specifier;
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
      specifier = node.moduleSpecifier;
    } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
      specifier = node.argument.literal;
    }
    if (specifier && ts.isStringLiteral(specifier) && /^\.\.?\//.test(specifier.text) && specifier.text.endsWith('.js')) {
      const start = specifier.getStart(source);
      const raw = text.slice(start, specifier.end);
      // Preserve the original literal where possible; escaped extensions need a newly encoded literal.
      if (raw.slice(-4, -1) === '.js') {
        replacements.push({ start: specifier.end - 4, end: specifier.end - 1, value: '.cjs' });
      } else {
        replacements.push({ start, end: specifier.end, value: JSON.stringify(specifier.text.slice(0, -3) + '.cjs') });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  let result = text;
  for (const { start, end, value } of replacements.reverse()) result = `${result.slice(0, start)}${value}${result.slice(end)}`;
  return result.replace(/(?:^|\r?\n)[ \t]*\/\/# sourceMappingURL=[^\r\n]*(?:\r?\n)?[ \t\r\n]*$/, '\n');
}

export function generateCjsDeclarations(dist) {
  const files = [];
  function walk(path) {
    if (!existsSync(path)) return;
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const child = join(path, entry.name);
      if (entry.isDirectory()) walk(child);
      else if (entry.isFile() && entry.name.endsWith('.d.ts')) files.push(child);
    }
  }
  const index = join(dist, 'index.d.ts');
  if (existsSync(index)) files.push(index);
  for (const directory of ['ag-grid', 'datetime', 'theme', 'providers', 'components']) walk(join(dist, directory));
  for (const file of files) {
    writeFileSync(file.slice(0, -5) + '.d.cts', toCjsDeclaration(readFileSync(file, 'utf8'), file));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  generateCjsDeclarations(process.argv[2] ? resolve(process.argv[2]) : join(root, 'dist'));
}
