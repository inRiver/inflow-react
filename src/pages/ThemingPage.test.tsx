import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { ThemingPage } from './ThemingPage';

describe('ThemingPage', () => {
  it('explains token sources, scoped overrides, mode and portal limits', () => {
    renderWithInflow(<MemoryRouter><ThemingPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Theming' })).toBeInTheDocument();
    expect(screen.getByText(/112 resolved --infl-/)).toHaveTextContent('88 colors');
    expect(screen.getByText(/const radius = inflowTokens.radius.md/)).toBeInTheDocument();
    expect(screen.getByText(/sx=\{\{ '--infl-radius-md'/)).toBeInTheDocument();
    expect(screen.getByText(/\.product-root\[data-inflow-root\]/)).toHaveTextContent('var(--infl-radius-md)');
    expect(screen.getByText(/Never put Inflow overrides on :root/)).toBeInTheDocument();
    expect(screen.getByText(/does not change the JavaScript tokens/)).toBeInTheDocument();
    expect(screen.getByText(/Changing mode from light to dark/)).toBeInTheDocument();
    expect(screen.getByText(/React theme context still reaches them/)).toHaveTextContent('scoped CSS variables do not');
    expect(screen.getByRole('link', { name: 'Design Tokens' })).toHaveAttribute('href', '/tokens');
  });
});
