import { describe, expect, it } from 'vitest';
import { darkTokens, lightTokens } from './inflow-tokens';
import { createInflowTheme, getInflowPalette } from './inflow';

// Light and dark are two value sets for one set of names. A token that exists in one mode must exist in the other,
// or a component that reads it breaks in the mode that lacks it.
const shape = (value: unknown): unknown =>
  value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)])) : typeof value;

describe('light and dark token parity', () => {
  it('has the same token names in both modes', () => {
    expect(Object.keys(darkTokens).sort()).toEqual(Object.keys(lightTokens).sort());
  });

  it('has the same value shape for every token in both modes', () => {
    expect(shape(darkTokens)).toEqual(shape(lightTokens));
  });

  it('exposes the same palette.inflow names in both modes', () => {
    expect(Object.keys(getInflowPalette('dark')).sort()).toEqual(Object.keys(getInflowPalette('light')).sort());
  });
});

// The M3-style token names are mapped onto MUI's standard palette slots the same way in both modes.
describe.each([
  ['light', lightTokens],
  ['dark', darkTokens],
] as const)('%s theme maps tokens onto MUI palette slots', (mode, T) => {
  const { palette } = createInflowTheme(mode);

  it('sets the MUI palette mode', () => {
    expect(palette.mode).toBe(mode);
  });

  it('maps surfaces, text and dividers', () => {
    expect(palette.background.paper).toBe(T.surfaceLowest);
    expect(palette.background.default).toBe(T.appBackground);
    expect(palette.text.primary).toBe(T.onSurface);
    expect(palette.text.secondary).toBe(T.onSurfaceVariant);
    expect(palette.divider).toBe(T.outlineVariant);
  });

  it('maps the status colors', () => {
    for (const key of ['error', 'warning', 'info', 'success'] as const) {
      expect(palette[key].main).toBe(T[key].main);
    }
  });

  it('maps the action states', () => {
    expect(palette.action.hover).toBe(T.rowHover);
    expect(palette.action.selected).toBe(T.rowSelected);
  });
});
