import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { CapitalizationPage } from './CapitalizationPage';

describe('CapitalizationPage', () => {
  it('lists the capitalization rule for each UI element', () => {
    renderWithInflow(<CapitalizationPage />);

    expect(screen.getByRole('heading', { name: 'Capitalization' })).toBeInTheDocument();
    const table = screen.getByRole('table', { name: 'Capitalization rules by UI element' });
    expect(within(table).getAllByRole('row')).toHaveLength(13);

    const buttons = within(table).getByRole('row', { name: /^Buttons/ });
    expect(buttons).toHaveTextContent('Title Case');
    expect(buttons).toHaveTextContent('Add User');

    const modals = within(table).getByRole('row', { name: /^Modals/ });
    expect(modals).toHaveTextContent('Sentence case');
    expect(modals).toHaveTextContent('Delete items?');
  });
});
