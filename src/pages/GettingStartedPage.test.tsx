import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { GettingStartedPage } from './GettingStartedPage';

describe('GettingStartedPage', () => {
  it('covers installation, scoped setup, optional assets and mode', () => {
    renderWithInflow(<MemoryRouter><GettingStartedPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Getting started' })).toBeInTheDocument();
    expect(screen.getByText(/npm install @inriver\/inflow-react/)).toHaveTextContent('@mui/material');
    expect(screen.getByText(/<InflowProvider cacheKey="product"/)).toHaveTextContent('ThemedChip');
    expect(screen.getByText(/distinct Emotion cacheKey/)).toHaveTextContent('emotionCache');
    expect(screen.getByText(/import '@inriver\/inflow-react\/local-assets.css'/)).toBeInTheDocument();
    expect(screen.getByText(/mode="dark" cacheKey=/)).toHaveTextContent('ThemedChip');
    expect(screen.getByText(/does not select a mode automatically/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Theming' })).toHaveAttribute('href', '/theming');
    expect(screen.getByRole('link', { name: 'Local assets' })).toHaveAttribute('href', '/local-assets');
  });
});
