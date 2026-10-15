import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { IntroductionPage } from './IntroductionPage';

describe('IntroductionPage', () => {
  it('links to every documented section', () => {
    renderWithInflow(
      <MemoryRouter>
        <IntroductionPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Introduction' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Design Tokens' })).toHaveAttribute('href', '/tokens');
    expect(screen.getByRole('link', { name: 'Components' })).toHaveAttribute('href', '/components');
    expect(screen.getByRole('link', { name: 'Import Guidelines' })).toHaveAttribute('href', '/guidelines');
  });
});
