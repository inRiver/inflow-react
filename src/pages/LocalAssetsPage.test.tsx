import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { LocalAssetsPage } from './LocalAssetsPage';

describe('LocalAssetsPage', () => {
  it.each(['light', 'dark'] as const)('distinguishes the unchanged library default from the showcase opt-in in %s mode', (mode) => {
    renderWithInflow(<MemoryRouter><LocalAssetsPage /></MemoryRouter>, { providerProps: { mode } });
    expect(screen.getByRole('heading', { name: 'Local assets' })).toBeInTheDocument();
    expect(screen.getByText('Default: unchanged')).toBeInTheDocument();
    expect(screen.getByText('Optional: explicit import')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('This showcase opts in to local assets');
    expect(screen.getByRole('alert')).toHaveTextContent('not the library default');
    expect(screen.getByText(/does not load or register fonts/)).toBeInTheDocument();
    expect(screen.getByText(/icon names may appear as text/)).toBeInTheDocument();
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Import Guidelines' }).style.color).toBe('inherit');
  });

  it('documents complete and selective imports with deployment tradeoffs', () => {
    renderWithInflow(<MemoryRouter><LocalAssetsPage /></MemoryRouter>);
    expect(screen.getByText(/import '@inriver\/inflow-react\/local-assets.css'/)).toBeInTheDocument();
    expect(screen.getByText(/import '@inriver\/inflow-react\/fonts\/inter.css'/)).toBeInTheDocument();
    expect(screen.getByText(/import '@inriver\/inflow-react\/fonts\/material-icons.css'/)).toBeInTheDocument();
    expect(screen.getByText(/about 1.22 MB compressed/)).toBeInTheDocument();
    expect(screen.getByText(/raw Node.js cannot execute a CSS import/)).toBeInTheDocument();
    expect(screen.getByText(/Coordinate font versions across microfrontends/)).toBeInTheDocument();
    expect(screen.getByText(/Offline installation, app caching/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Import Guidelines' })).toHaveAttribute('href', '/guidelines');
  });
});
