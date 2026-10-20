import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { GroupedInputsDemo } from './GroupedInputsDemo';

const chooseOption = (combobox: HTMLElement, option: string) => {
  fireEvent.mouseDown(combobox);
  fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: option }));
};

describe('GroupedInputsDemo', () => {
  it('renders every grouped-input section on one page', () => {
    renderWithInflow(<GroupedInputsDemo />);

    expect(screen.getByText('Button group')).toBeInTheDocument();
    expect(screen.getByText('Grouped options')).toBeInTheDocument();
    expect(screen.getByText('Number with unit (for review)')).toBeInTheDocument();
    expect(screen.getByText(/^Option A/)).toBeInTheDocument();
    expect(screen.getByText(/^Option B/)).toBeInTheDocument();
    for (const name of ['contained button group', 'outlined button group', 'text button group']) {
      expect(screen.getByRole('group', { name })).toBeInTheDocument();
    }
  });

  it('has a single props playground', () => {
    renderWithInflow(<GroupedInputsDemo />);

    expect(document.querySelectorAll('#props')).toHaveLength(1);
  });

  it('switches every example between small and medium', () => {
    renderWithInflow(<GroupedInputsDemo />);

    expect(document.querySelector('.MuiButtonGroup-root .MuiButton-sizeSmall')).not.toBeNull();
    chooseOption(screen.getByRole('combobox', { name: 'size' }), 'medium');

    expect(document.querySelector('.MuiButtonGroup-root .MuiButton-sizeSmall')).toBeNull();
    const weight = screen.getAllByRole('spinbutton', { name: 'Weight' })[0];
    expect(weight.closest('.MuiInputBase-root')).not.toHaveClass('MuiInputBase-sizeSmall');
    expect(screen.getByRole('combobox', { name: 'Weight unit' }).closest('.MuiInputBase-root')).not.toHaveClass(
      'MuiInputBase-sizeSmall',
    );
  });

  it('disables every example from the playground', () => {
    renderWithInflow(<GroupedInputsDemo />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'disabled' }));

    expect(screen.getAllByRole('button', { name: 'One' })[0]).toBeDisabled();
    expect(screen.getAllByRole('spinbutton', { name: 'Weight' })[0]).toBeDisabled();
  });

  it('shows group headings in the grouped Autocomplete and Select', () => {
    renderWithInflow(<GroupedInputsDemo />);

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Movie by decade' }));
    for (const decade of ['1970s', '1990s', '2000s']) {
      expect(within(screen.getByRole('listbox')).getByText(decade)).toBeInTheDocument();
    }
    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Movie by decade' }), { key: 'Escape' });

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Grouping' }));
    const listbox = screen.getByRole('listbox');
    expect(within(listbox).getByText('Category 1')).toBeInTheDocument();
    expect(within(listbox).getByText('Category 2')).toBeInTheDocument();
  });

  it('Option A changes the unit inside the number field', () => {
    renderWithInflow(<GroupedInputsDemo />);

    chooseOption(screen.getByRole('combobox', { name: 'Weight unit' }), 'lb');

    expect(screen.getByRole('combobox', { name: 'Weight unit' })).toHaveTextContent('lb');
    expect(screen.getByRole('combobox', { name: 'Weight unit with divider' })).toBeInTheDocument();
  });

  it('Option B renders a separate labelled unit select beside the number field', () => {
    renderWithInflow(<GroupedInputsDemo />);

    // One "Weight" number field in Option A and one in Option B.
    expect(screen.getAllByRole('spinbutton', { name: 'Weight' })).toHaveLength(2);
    chooseOption(screen.getByRole('combobox', { name: 'Unit' }), 'g');

    expect(screen.getByRole('combobox', { name: 'Unit' })).toHaveTextContent('g');
    expect(screen.getByRole('combobox', { name: 'Unit (joined)' })).toBeInTheDocument();
  });
});
