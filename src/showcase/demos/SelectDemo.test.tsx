import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { SelectDemo } from './SelectDemo';

describe('SelectDemo', () => {
  it('renders the interactive, all-states, and grouped frames', () => {
    renderWithInflow(<SelectDemo />);

    expect(screen.getByText('Select - Interactive')).toBeInTheDocument();
    expect(screen.getByText('All States')).toBeInTheDocument();
    expect(screen.getByText('Grouped Options')).toBeInTheDocument();
  });

  it('shows group subheaders when the grouped select opens', () => {
    renderWithInflow(<SelectDemo />);

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Grouping' }));

    const listbox = screen.getByRole('listbox');
    expect(within(listbox).getByText('Category 1')).toBeInTheDocument();
    expect(within(listbox).getByText('Category 2')).toBeInTheDocument();
    expect(within(listbox).getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
  });
});
