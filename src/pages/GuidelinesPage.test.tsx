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
});
