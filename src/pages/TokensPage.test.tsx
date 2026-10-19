import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { TokensPage } from './TokensPage';

describe('TokensPage content density', () => {
  it('documents the three density classes for the page header and AG Grid', () => {
    renderWithInflow(<TokensPage />);

    const header = screen.getByRole('table', { name: 'Page header density' });
    expect(within(header).getAllByRole('row')).toHaveLength(4);
    expect(within(header).getByRole('row', { name: /Default \(Comfortable\)/ })).toHaveTextContent('#9.5 (76px)');
    expect(within(header).getByRole('row', { name: /Default \(Comfortable\)/ })).toHaveTextContent('#6 (48px)');

    expect(screen.getByRole('alert')).toHaveTextContent('52px row and a 48px header');

    const grid = screen.getByRole('table', { name: 'AG Grid density' });
    expect(within(grid).getByRole('row', { name: /Compact/ })).toHaveTextContent('12px');
    expect(within(grid).getByRole('row', { name: /Default \(Comfortable\)/ })).toHaveTextContent('#5 (40px)');
  });
});

describe('TokensPage MUI-aligned tokens', () => {
  it('documents shape, breakpoints, z-index, and transitions from the theme', () => {
    renderWithInflow(<TokensPage />);

    const radius = screen.getByRole('table', { name: 'Radius tokens' });
    expect(within(radius).getByRole('row', { name: /^sm/ })).toHaveTextContent('5px');
    expect(within(radius).getByRole('row', { name: /^full/ })).toHaveTextContent('Full (pill)');

    const breakpoints = screen.getByRole('table', { name: 'Breakpoints' });
    expect(within(breakpoints).getByRole('row', { name: /^md/ })).toHaveTextContent('900px');

    const zIndex = screen.getByRole('table', { name: 'Z-index layers' });
    expect(within(zIndex).getByRole('row', { name: /^modal/ })).toHaveTextContent('1300');

    const durations = screen.getByRole('table', { name: 'Transition durations' });
    expect(within(durations).getByRole('row', { name: /^standard/ })).toHaveTextContent('300ms');
  });
});
