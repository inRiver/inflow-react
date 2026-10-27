import { describe, expect, it } from 'vitest';
import { INFLOW_DARK_MODE_ENABLED, resolveInflowColorMode } from './featureFlags';

describe('dark mode feature flag', () => {
  it('follows the Vite dev flag so dark mode is reviewable locally but off in production builds', () => {
    expect(INFLOW_DARK_MODE_ENABLED).toBe(import.meta.env.DEV);
  });

  it('keeps light mode as light regardless of the flag', () => {
    expect(resolveInflowColorMode('light')).toBe('light');
  });

  it('honors a dark request only when the flag is on', () => {
    expect(resolveInflowColorMode('dark')).toBe(INFLOW_DARK_MODE_ENABLED ? 'dark' : 'light');
  });
});
