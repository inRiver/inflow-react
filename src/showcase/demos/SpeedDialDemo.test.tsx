import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { darkTokens } from '../../theme/inflow-tokens';
import { SpeedDialDemo } from './SpeedDialDemo';

function toRgb(color: string) {
  const element = document.createElement('span');
  element.style.color = color;
  document.body.appendChild(element);
  const rgb = getComputedStyle(element).color;
  element.remove();
  return rgb;
}

describe('SpeedDialDemo', () => {
  it('renders the action buttons', () => {
    renderWithInflow(<SpeedDialDemo />);

    expect(screen.getAllByRole('menuitem', { name: 'Save' }).length).toBeGreaterThan(0);
  });

  it('lifts the small action buttons off the dark background with a raised surface and hairline', () => {
    renderWithInflow(<SpeedDialDemo />, { providerProps: { mode: 'dark' } });

    const style = getComputedStyle(screen.getAllByRole('menuitem', { name: 'Save' })[0]);
    expect(style.backgroundColor).toBe(toRgb(darkTokens.surfaceContainerHigh));
    expect(style.borderTopColor).toBe(toRgb(darkTokens.surfaceVariant));
    expect(style.borderTopWidth).toBe('1px');
  });

  it('keeps the light action buttons unchanged', () => {
    renderWithInflow(<SpeedDialDemo />, { providerProps: { mode: 'light' } });

    const style = getComputedStyle(screen.getAllByRole('menuitem', { name: 'Save' })[0]);
    expect(style.backgroundColor).not.toBe(toRgb(darkTokens.surfaceContainerHigh));
    expect(style.borderTopWidth).not.toBe('1px');
  });
});
