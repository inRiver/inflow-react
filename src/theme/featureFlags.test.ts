import { describe, expect, it } from 'vitest';
import { INFLOW_DARK_MODE_ENABLED, resolveInflowColorMode } from './featureFlags';

describe('dark mode feature flag', () => {
  it('is enabled in every build, so dark mode ships in the published library', () => {
    expect(INFLOW_DARK_MODE_ENABLED).toBe(true);
  });

  it('keeps light mode as light', () => {
    expect(resolveInflowColorMode('light')).toBe('light');
  });

  it('honors a dark request', () => {
    expect(resolveInflowColorMode('dark')).toBe('dark');
  });
});
