import { screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { GuidelinesPage } from './GuidelinesPage';

describe('GuidelinesPage', () => {
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
