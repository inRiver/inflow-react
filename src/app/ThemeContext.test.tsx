import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CustomThemeProvider, useShowcaseTheme } from './ThemeContext';
import { darkTokens } from '../theme/inflow-tokens';

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

function ModeProbe() {
  const { colorModePreference, resolvedColorMode, cycleColorMode, setColorModePreference } = useShowcaseTheme();
  return (
    <>
      <span data-testid="preference">{colorModePreference}</span>
      <span data-testid="resolved">{resolvedColorMode}</span>
      <button onClick={cycleColorMode}>cycle</button>
      <button onClick={() => setColorModePreference('dark')}>force dark</button>
    </>
  );
}

// jsdom has no matchMedia, so provide one whose system preference the test can flip.
function mockSystemColorScheme(initial: 'light' | 'dark') {
  let dark = initial === 'dark';
  const listeners = new Set<(event: { matches: boolean }) => void>();
  window.matchMedia = ((query: string) => ({
    get matches() {
      return query.includes('dark') ? dark : !dark;
    },
    media: query,
    addEventListener: (_: string, listener: (event: { matches: boolean }) => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: (event: { matches: boolean }) => void) => listeners.delete(listener),
    addListener: (listener: (event: { matches: boolean }) => void) => listeners.add(listener),
    removeListener: (listener: (event: { matches: boolean }) => void) => listeners.delete(listener),
  })) as unknown as typeof window.matchMedia;
  return (next: 'light' | 'dark') => {
    dark = next === 'dark';
    listeners.forEach((listener) => listener({ matches: dark }));
  };
}

const renderProbe = () =>
  render(
    <CustomThemeProvider>
      <ModeProbe />
    </CustomThemeProvider>,
  );
const resolved = () => screen.getByTestId('resolved').textContent;
const preference = () => screen.getByTestId('preference').textContent;

describe('showcase color mode', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('follows the system setting when nothing is saved', () => {
    mockSystemColorScheme('dark');
    renderProbe();
    expect(preference()).toBe('system');
    expect(resolved()).toBe('dark');
  });

  it('stays light when the system is light', () => {
    mockSystemColorScheme('light');
    renderProbe();
    expect(resolved()).toBe('light');
  });

  it('restores a saved preference over the system setting', () => {
    mockSystemColorScheme('light');
    localStorage.setItem('inflow-color-mode', 'dark');
    renderProbe();
    expect(preference()).toBe('dark');
    expect(resolved()).toBe('dark');
  });

  it('ignores a saved value it does not recognise', () => {
    mockSystemColorScheme('light');
    localStorage.setItem('inflow-color-mode', 'sepia');
    renderProbe();
    expect(preference()).toBe('system');
  });

  it('cycles system, light, dark and back, saving each choice', () => {
    mockSystemColorScheme('dark');
    renderProbe();
    const cycle = () => act(() => screen.getByText('cycle').click());

    cycle();
    expect([preference(), resolved(), localStorage.getItem('inflow-color-mode')]).toEqual(['light', 'light', 'light']);
    cycle();
    expect([preference(), resolved(), localStorage.getItem('inflow-color-mode')]).toEqual(['dark', 'dark', 'dark']);
    cycle();
    expect([preference(), resolved(), localStorage.getItem('inflow-color-mode')]).toEqual(['system', 'dark', 'system']);
  });

  it('follows a system change only while the preference is system', () => {
    const setSystem = mockSystemColorScheme('light');
    renderProbe();

    act(() => setSystem('dark'));
    expect(resolved()).toBe('dark');

    act(() => screen.getByText('force dark').click());
    act(() => setSystem('light'));
    expect(resolved()).toBe('dark');
  });

  it('tells the browser the color scheme, paints the page edge in dark, and cleans up on unmount', () => {
    mockSystemColorScheme('light');
    localStorage.setItem('inflow-color-mode', 'dark');
    const { unmount } = renderProbe();
    const root = document.documentElement.style;

    const expected = document.createElement('div');
    expected.style.backgroundColor = darkTokens.appBackground;
    expect(root.colorScheme).toBe('dark');
    expect(root.backgroundColor).toBe(expected.style.backgroundColor);

    unmount();
    expect(root.colorScheme).toBe('');
    expect(root.backgroundColor).toBe('');
  });

  it('leaves the page edge unpainted in light mode', () => {
    mockSystemColorScheme('light');
    renderProbe();
    expect(document.documentElement.style.colorScheme).toBe('light');
    expect(document.documentElement.style.backgroundColor).toBe('');
  });
});
