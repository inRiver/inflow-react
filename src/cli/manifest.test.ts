// @vitest-environment node
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import { beforeAll, describe, expect, it } from 'vitest';
import { THEMED_COMPONENT_INFO } from '../showcase/themedComponentInfo';
import { inflowTokens } from '../theme/tokens';
import { execute } from './cli';
import type { Manifest } from './cli';

let manifest: Manifest;
beforeAll(() => {
  manifest = JSON.parse(execFileSync(process.execPath, ['scripts/generate-cli-manifest.mjs'], {
    cwd: process.cwd(), encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  })) as Manifest;
}, 120_000);

describe('generated CLI manifest', () => {
  it('covers runtime barrel exports and all showcase metadata names', () => {
    const config = ts.readConfigFile('tsconfig.app.json', ts.sys.readFile);
    const options = ts.parseJsonConfigFileContent(config.config, ts.sys, '.').options;
    const program = ts.createProgram(['src/components/themed/index.ts'], options);
    const checker = program.getTypeChecker();
    const barrel = program.getSourceFile('src/components/themed/index.ts')!;
    const exported = checker.getExportsOfModule(checker.getSymbolAtLocation(barrel)!)
      .filter((entry) => {
        const symbol = entry.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(entry) : entry;
        return entry.name.startsWith('Themed') && Boolean(symbol.flags & ts.SymbolFlags.Value);
      }).map((entry) => entry.name).sort();
    const names = manifest.components.map((entry) => entry.componentName).sort();
    expect(names).toEqual(exported);
    for (const info of Object.values(THEMED_COMPONENT_INFO)) {
      expect(manifest.components.find((entry) => entry.componentName === info.themedName)?.description).toBe(info.reason);
    }
    expect(manifest.tokens).toEqual(inflowTokens);
  }, 120_000);

  it('serves list, detail, tokens and guides', () => {
    const list = execute(['component', '--list', '--json'], manifest);
    expect(list.json).toBe(true);
    expect(list.response.data).toEqual(manifest.components);
    const chip = execute(['component', 'ThemedChip'], manifest);
    expect(chip.text).toContain("Omit<ChipProps, 'size' | 'variant'>");
    expect(chip.text).toContain('leadingIcon?: string');
    expect((chip.response.data as { usageExample: string | null }).usageExample).toBeNull();
    expect(execute(['component', 'ThemedButton'], manifest).text).toContain('Deprecated: yes');
    expect(execute(['tokens', '--json'], manifest).response.data).toEqual(inflowTokens);
    for (const topic of ['setup', 'theming', 'migration']) {
      expect(execute(['docs', topic], manifest).response.ok).toBe(true);
    }
    expect(execute([], manifest).text).toContain('Usage:');
  });

  it('ranks matches and reports errors for unknown or invalid input', () => {
    const found = execute(['search', 'chip', '--json'], manifest).response.data as {
      query: string; matchCount: number; results: { type: string; name: string; command: string }[];
    };
    expect(found.query).toBe('chip');
    expect((execute(['search', 'thmdchp'], manifest).response.data as typeof found).results.some((item) => item.name === 'ThemedChip')).toBe(true);
    expect(found.matchCount).toBe(found.results.length);
    expect(found.results.find((item) => item.name === 'ThemedChip')).toMatchObject({ type: 'component', command: 'inflow component ThemedChip' });
    expect((execute(['search', 'surface', '--json'], manifest).response.data as typeof found).results.some((item) => item.type === 'token')).toBe(true);
    expect((execute(['search', 'theming', '--json'], manifest).response.data as typeof found).results.some((item) => item.type === 'doc')).toBe(true);
    for (const args of [['bogus', '--json'], ['component', 'missing'], ['docs', 'missing'], ['search'], ['tokens', '--list']]) {
      expect(execute(args, manifest).response).toMatchObject({ ok: false, error: expect.any(String) });
    }
  });
});
