import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';
import ts from 'typescript';

let manifest;
const component = (name) => manifest.components.find((entry) => entry.componentName === name);

before(() => {
  const output = execFileSync(process.execPath, ['scripts/generate-cli-manifest.mjs'], {
    cwd: process.cwd(), encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  });
  manifest = JSON.parse(output);
});

describe('CLI manifest generator', () => {
  it('enumerates all Themed runtime exports and accurately labels complete public prop lists', () => {
    const config = ts.readConfigFile('tsconfig.app.json', ts.sys.readFile);
    const options = ts.parseJsonConfigFileContent(config.config, ts.sys, '.').options;
    const program = ts.createProgram(['src/components/themed/index.ts'], options);
    const checker = program.getTypeChecker();
    const barrel = program.getSourceFile('src/components/themed/index.ts');
    const exported = checker.getExportsOfModule(checker.getSymbolAtLocation(barrel))
      .map((entry) => ({ entry, symbol: entry.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(entry) : entry }))
      .filter(({ entry, symbol }) => entry.name.startsWith('Themed') && (symbol.flags & ts.SymbolFlags.Value));
    assert.deepEqual(manifest.components.map((entry) => entry.componentName).sort(), exported.map(({ entry }) => entry.name).sort());
    assert.equal(manifest.counts.failed, 0);
    for (const { entry, symbol } of exported) {
      const result = component(entry.name);
      const type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
      const signature = checker.getSignaturesOfType(type, ts.SignatureKind.Call)[0];
      const parameter = signature.getParameters()[0];
      // React's special `key` is not a prop passed to the implementation.
      const publicNames = checker.getPropertiesOfType(checker.getTypeOfSymbolAtLocation(parameter, symbol.valueDeclaration))
        .map((prop) => prop.name).filter((name) => name !== 'key').sort();
      const extracted = result.props.map((prop) => prop.name).sort();
      for (const prop of extracted) assert.ok(publicNames.includes(prop), `${entry.name}.${prop}`);
      if (result.status === 'ok') assert.deepEqual(extracted, publicNames, entry.name);
    }
  });

  it('extracts Chip own props, docs, description and explicit MUI base', () => {
    const chip = component('ThemedChip');
    assert.equal(chip.propsInterface, 'ThemedChipProps');
    assert.match(chip.description, /Inflow-specific tokens/);
    assert.deepEqual(chip.extends, ["Omit<ChipProps, 'size' | 'variant'>"]);
    assert.equal(chip.status, 'partial');
    assert.deepEqual(chip.props.find((prop) => prop.name === 'leadingIcon'), {
      name: 'leadingIcon', type: 'string', optional: true,
      jsdoc: 'Material Symbols glyph rendered before the label.',
    });
    assert.equal(chip.props.find((prop) => prop.name === 'ref')?.source, 'React RefAttributes');
  });

  it('preserves Table generics, requiredness and source JSDoc', () => {
    const table = component('ThemedTable');
    assert.deepEqual(table.typeParameters, ['T extends TableRowData = TableRowData']);
    assert.deepEqual(table.props.find((prop) => prop.name === 'columns'), {
      name: 'columns', type: 'Column<T>[]', optional: false, jsdoc: 'Array of column definitions',
    });
    assert.deepEqual(table.props.find((prop) => prop.name === 'data'), {
      name: 'data', type: 'T[]', optional: false, jsdoc: 'Array of data objects',
    });
    assert.equal(table.status, 'partial');
  });

  it('resolves a local props alias, uses JSDoc descriptions and avoids a false memo ref', () => {
    assert.deepEqual(component('ThemedPageHeader').props.map((prop) => prop.name),
      ['eyebrow', 'breadcrumbs', 'title', 'onBack', 'actions', 'style', 'ref']);
    assert.match(component('ThemedChatAccordion').description, /Reasoning/);
    assert.equal(component('ThemedChatAccordion').descriptionSource, 'jsdoc');
    assert.equal(component('ThemedTabPanel').descriptionSource, 'fallback');
    assert.equal(component('ThemedButton').deprecated, true);
    assert.equal(component('ThemedTextField').deprecated, true);
    assert.deepEqual(component('ThemedTextField').extends, ['TextFieldProps']);
    assert.equal(component('ThemedFileTypeIcon').props.some((prop) => prop.name === 'ref'), false);
  });
});
