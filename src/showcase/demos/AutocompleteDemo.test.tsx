import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { AutocompleteDemo } from './AutocompleteDemo';

describe('AutocompleteDemo', () => {
  it('renders the interactive, all-states, and grouped frames', () => {
    renderWithInflow(<AutocompleteDemo />);

    expect(screen.getByText('Autocomplete - Interactive')).toBeInTheDocument();
    expect(screen.getByText('All States')).toBeInTheDocument();
    expect(screen.getByText('Grouped Options')).toBeInTheDocument();
  });

  it('shows group headings when the grouped autocomplete opens', () => {
    renderWithInflow(<AutocompleteDemo />);

    const input = screen.getByRole('combobox', { name: 'Movie by decade' });
    fireEvent.mouseDown(input);

    const listbox = screen.getByRole('listbox');
    for (const decade of ['1970s', '1990s', '2000s']) {
      expect(within(listbox).getByText(decade)).toBeInTheDocument();
    }
  });
});
