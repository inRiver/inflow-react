import { describe, expect, it } from 'vitest';
import { createDefaultTheme, defaultTheme } from './default';
import * as themeBarrel from './index';

// createDefaultTheme/defaultTheme are deprecated but remain published public API
// until the next major release (docs/VERSIONING.md). These tests protect that contract.
describe('deprecated default theme exports', () => {
  it('still exports createDefaultTheme and defaultTheme from the theme barrel', () => {
    expect(themeBarrel.createDefaultTheme).toBe(createDefaultTheme);
    expect(themeBarrel.defaultTheme).toBe(defaultTheme);
  });

  it('createDefaultTheme returns a usable MUI theme for each mode', () => {
    expect(createDefaultTheme('light').palette.mode).toBe('light');
    expect(createDefaultTheme('dark').palette.mode).toBe('dark');
  });

  it('defaultTheme is a light-mode theme instance', () => {
    expect(defaultTheme.palette.mode).toBe('light');
  });
});
