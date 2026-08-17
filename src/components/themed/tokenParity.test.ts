import { describe, expect, it } from 'vitest';
import inflowSource from '../../theme/inflow.ts?raw';
import { darkTokens, lightTokens } from '../../theme/inflow-tokens';

const themedSources = import.meta.glob<string>('./*.tsx', {
  eager: true,
  import: 'default',
  query: '?raw',
});

describe('Themed component Inflow palette parity', () => {
  it('references only palette keys defined by InflowPalette and both color-mode token sets', () => {
    const interfaceMatch = inflowSource.match(/interface InflowPalette \{([\s\S]*?)\n\}/);
    if (!interfaceMatch) throw new Error('Could not find InflowPalette.');

    const paletteKeys = new Set([...interfaceMatch[1].matchAll(/^\s{2}(\w+):/gm)].map(([, key]) => key));
    const referencedKeys = new Set(
      Object.values(themedSources)
        .flatMap((source) => [...source.matchAll(/palette\.inflow\.(\w+)/g)])
        .map(([, key]) => key),
    );
    const lightTokenKeys = new Set(Object.keys(lightTokens));
    const darkTokenKeys = new Set(Object.keys(darkTokens));

    expect([...referencedKeys].filter((key) => !paletteKeys.has(key))).toEqual([]);
    expect([...referencedKeys].filter((key) => !lightTokenKeys.has(key))).toEqual([]);
    expect([...referencedKeys].filter((key) => !darkTokenKeys.has(key))).toEqual([]);
  });
});
