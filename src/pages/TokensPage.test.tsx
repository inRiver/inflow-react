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

describe('TokensPage typography, palette, and shadows', () => {
  it('lists every MUI typography variant with its usage', () => {
    renderWithInflow(<TokensPage />);

    for (const variant of ['h1', 'h6', 'subtitle2', 'body2', 'button', 'overline']) {
      expect(screen.getByRole('cell', { name: variant })).toBeInTheDocument();
    }
    expect(screen.getByRole('row', { name: /^body2/ })).toHaveTextContent('0.875rem (14px)');
    expect(screen.getByRole('row', { name: /^h6/ })).toHaveTextContent('Page header and detail panel titles');
  });

  it('shows the full MUI palette shades and the Inflow palette', () => {
    renderWithInflow(<TokensPage />);

    expect(screen.getByText('primary.contrastText')).toBeInTheDocument();
    expect(screen.getByText('success.dark')).toBeInTheDocument();
    expect(screen.getByText('text.secondary')).toBeInTheDocument();
    expect(screen.getByText('surfaceContainer')).toBeInTheDocument();
  });

  it('shows the three Inflow shadow levels', () => {
    renderWithInflow(<TokensPage />);

    expect(screen.getByText('Elevation 1')).toBeInTheDocument();
    expect(screen.getByText('Elevation 2')).toBeInTheDocument();
    expect(screen.getByText('Elevation 3')).toBeInTheDocument();
    expect(screen.queryByText('Shadow 24')).not.toBeInTheDocument();
  });

  it('documents spacing units up to 10 with their CSS tokens', () => {
    renderWithInflow(<TokensPage />);

    const ten = screen.getByText('spacing(10)').parentElement;
    expect(ten).toHaveTextContent('80px');
    expect(ten).toHaveTextContent('--spacing-10');
    expect(screen.getByText('spacing(0.5)').parentElement).toHaveTextContent('4px');
  });
});
