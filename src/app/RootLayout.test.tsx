import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { CustomThemeProvider } from './ThemeContext';
import { RootLayout } from './RootLayout';

// jsdom has no matchMedia, so provide one with a fixed system preference.
function mockSystemColorScheme(scheme: 'light' | 'dark') {
  window.matchMedia = ((query: string) => ({
    matches: query.includes('dark') ? scheme === 'dark' : scheme === 'light',
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
}

const renderLayout = () =>
  render(
    <MemoryRouter>
      <CustomThemeProvider>
        <RootLayout />
      </CustomThemeProvider>
    </MemoryRouter>,
  );

const group = () => screen.getByRole('group', { name: 'Color mode' });
const selected = () =>
  Array.from(group().querySelectorAll<HTMLElement>('button[aria-pressed="true"]')).map((b) => b.textContent);

describe('RootLayout color mode switch', () => {
  beforeEach(() => {
    localStorage.clear();
    mockSystemColorScheme('dark');
  });

  it('offers System, Light and Dark, with System selected by default and the active mode shown', () => {
    renderLayout();

    expect(screen.getByRole('button', { name: /System mode, currently dark/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Light mode' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dark mode' })).toBeInTheDocument();
    expect(selected()).toEqual(['System (dark)']);
  });

  it('can go System -> Light -> Dark -> System, saving the choice', () => {
    renderLayout();

    fireEvent.click(screen.getByRole('button', { name: 'Light mode' }));
    expect(selected()).toEqual(['Light']);
    expect(localStorage.getItem('inflow-color-mode')).toBe('light');

    fireEvent.click(screen.getByRole('button', { name: 'Dark mode' }));
    expect(selected()).toEqual(['Dark']);
    expect(localStorage.getItem('inflow-color-mode')).toBe('dark');

    fireEvent.click(screen.getByRole('button', { name: /System mode/ }));
    expect(selected()).toEqual(['System (dark)']);
    expect(localStorage.getItem('inflow-color-mode')).toBe('system');
  });

  it('restores a saved choice after a reload', () => {
    localStorage.setItem('inflow-color-mode', 'light');
    renderLayout();

    expect(selected()).toEqual(['Light']);
  });
});
