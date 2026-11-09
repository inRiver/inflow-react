import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { AutocompleteDemo } from './AutocompleteDemo';

describe('AutocompleteDemo', () => {
  it('renders the interactive autocomplete with its clear icon by default', () => {
    renderWithInflow(<AutocompleteDemo />);

    const interactive = screen.getByText('Autocomplete - Interactive').closest('section, div') as HTMLElement;
    expect(within(interactive.parentElement as HTMLElement).getAllByRole('combobox')[0]).toHaveValue('The Shawshank Redemption');
    expect(screen.getAllByTitle('Clear').length).toBeGreaterThan(0);
  });

  it('hides the clear icon on the interactive autocomplete when disableClearable is on', () => {
    renderWithInflow(<AutocompleteDemo />);

    const before = screen.getAllByTitle('Clear').length;
    fireEvent.click(screen.getByRole('checkbox', { name: 'disableClearable' }));

    expect(screen.getAllByTitle('Clear').length).toBe(before - 1);
  });

  it('shows a fixed "No clear icon" example in All States', () => {
    renderWithInflow(<AutocompleteDemo />);

    expect(screen.getByLabelText('No clear icon')).toHaveValue('The Shawshank Redemption');
  });

  it('keeps individual chip removal when multiple and disableClearable are both on', () => {
    renderWithInflow(<AutocompleteDemo />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'multiple' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'disableClearable' }));

    expect(screen.getAllByText('The Dark Knight').length).toBeGreaterThan(0);
  });
});
