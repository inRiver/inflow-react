import { screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { GuidelinesPage } from './GuidelinesPage';

describe('GuidelinesPage', () => {
  it('makes optional local assets and current peer setup discoverable', () => {
    renderWithInflow(<MemoryRouter><GuidelinesPage /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Local assets setup and tradeoffs' })).toHaveAttribute('href', '/local-assets');
    expect(screen.getByRole('link', { name: 'Local assets setup and tradeoffs' }).style.color).toBe('inherit');
    expect(screen.getByText(/The library and InflowProvider do not import font CSS by default/)).toBeInTheDocument();
    expect(screen.getByText(/This theme showcase imports and uses the bundled local assets by default/))
      .toHaveTextContent('Exception: This theme showcase imports and uses the bundled local assets by default.');
    expect(screen.getByText(/npm install @inriver\/inflow-react@react19-mui9.6/)).toBeInTheDocument();
  });

  it('documents the opt-in datetime subpath and its optional peers', () => {
    renderWithInflow(<MemoryRouter><GuidelinesPage /></MemoryRouter>);

    expect(screen.getByText(/npm install @mui\/x-date-pickers/)).toHaveTextContent('dayjs@^1.11.0');
    expect(screen.getByText(/Date and time preferences, formatters, and grid column fragments/)).toHaveTextContent(
      '@inriver/inflow-react/datetime/client',
    );
    expect(screen.getByText(/The server-safe/)).toHaveTextContent('only dayjs');
    expect(screen.getByText(/Light and dark mode ship enabled/)).toHaveTextContent('INFLOW_DARK_MODE_ENABLED remains true');
    expect(screen.queryByText(/Dark mode is currently disabled/)).not.toBeInTheDocument();
    expect(screen.getByText(/current compatibility target is React 19/)).toHaveTextContent('MUI 9.6');
    expect(screen.queryByText(/createDefaultTheme|defaultTheme/)).not.toBeInTheDocument();
  });

  it('uses persistent themed guidance for the release checkpoint', () => {
    renderWithInflow(
      <MemoryRouter>
        <GuidelinesPage />
      </MemoryRouter>,
    );

    const guidance = screen.getByRole('status');
    expect(guidance).toHaveTextContent('Publish through a compatibility checkpoint');
    expect(guidance).toHaveTextContent('This repo is package-ready, not publish-by-default.');
    expect(within(guidance).queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows a complete color mode setup example', () => {
    renderWithInflow(
      <MemoryRouter>
        <GuidelinesPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/A complete setup: follow the system/)).toBeInTheDocument();
    expect(screen.getAllByText(/prefers-color-scheme: dark/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/goes back to following the OS/).length).toBeGreaterThan(0);
  });
});
