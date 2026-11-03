import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Production builds ship with dark mode off. Whatever was saved or the system asks for, the app stays light.
vi.mock('../theme', async (importOriginal) => ({ ...(await importOriginal<typeof import('../theme')>()), INFLOW_DARK_MODE_ENABLED: false }));

import { CustomThemeProvider, useShowcaseTheme } from './ThemeContext';

function Probe() {
  const { resolvedColorMode, colorModePreference, cycleColorMode } = useShowcaseTheme();
  return (
    <>
      <span data-testid="resolved">{resolvedColorMode}</span>
      <span data-testid="preference">{colorModePreference}</span>
      <button onClick={cycleColorMode}>cycle</button>
    </>
  );
}

describe('showcase color mode with dark mode switched off', () => {
  it('stays light even when dark is saved', () => {
    localStorage.setItem('inflow-color-mode', 'dark');
    render(<CustomThemeProvider><Probe /></CustomThemeProvider>);
    expect(screen.getByTestId('resolved').textContent).toBe('light');
  });

  it('ignores the cycle button', () => {
    localStorage.clear();
    render(<CustomThemeProvider><Probe /></CustomThemeProvider>);
    act(() => screen.getByText('cycle').click());
    expect(screen.getByTestId('preference').textContent).toBe('system');
    expect(screen.getByTestId('resolved').textContent).toBe('light');
  });
});
