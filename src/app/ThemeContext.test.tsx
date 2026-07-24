import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CustomThemeProvider, useShowcaseTheme } from './ThemeContext';

function Probe() {
  const { currentTheme, toggleTheme, colorModePreference, resolvedColorMode, setColorModePreference, cycleColorMode } =
    useShowcaseTheme();

  return (
    <div>
      <span data-testid="current-theme">{currentTheme}</span>
      <span data-testid="color-mode-preference">{colorModePreference}</span>
      <span data-testid="resolved-color-mode">{resolvedColorMode}</span>
      <span data-testid="has-toggle">{typeof toggleTheme === 'function' ? 'yes' : 'no'}</span>
      <span data-testid="has-set-color-mode-preference">{typeof setColorModePreference === 'function' ? 'yes' : 'no'}</span>
      <span data-testid="has-cycle-color-mode">{typeof cycleColorMode === 'function' ? 'yes' : 'no'}</span>
    </div>
  );
}

describe('CustomThemeProvider', () => {
  it('renders the canonical InflowProvider boundary (data-inflow-root) when currentTheme is inflow', () => {
    const { container } = render(
      <CustomThemeProvider>
        <Probe />
      </CustomThemeProvider>,
    );

    // Default currentTheme is 'inflow' (see ThemeContext.tsx initial state).
    expect(container.querySelector('[data-inflow-root]')).not.toBeNull();
  });

  it('exposes all 6 useShowcaseTheme context fields', () => {
    render(
      <CustomThemeProvider>
        <Probe />
      </CustomThemeProvider>,
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('inflow');
    expect(screen.getByTestId('has-toggle')).toHaveTextContent('yes');
    expect(screen.getByTestId('has-set-color-mode-preference')).toHaveTextContent('yes');
    expect(screen.getByTestId('has-cycle-color-mode')).toHaveTextContent('yes');
    expect(screen.getByTestId('color-mode-preference')).not.toBeEmptyDOMElement();
    expect(screen.getByTestId('resolved-color-mode')).not.toBeEmptyDOMElement();
  });
});
