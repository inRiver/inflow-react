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
    expect(screen.getByRole('group', { name: 'Button group' })).toBeInTheDocument();
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
    const weight = screen.getByRole('spinbutton', { name: 'Weight' });
    expect(weight.closest('.MuiInputBase-root')).not.toHaveClass('MuiInputBase-sizeSmall');
    expect(screen.getByRole('combobox', { name: 'Weight unit' }).closest('.MuiInputBase-root')).not.toHaveClass(
      'MuiInputBase-sizeSmall',
    );
  });

  it('disables every example from the playground', () => {
    renderWithInflow(<GroupedInputsDemo />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'disabled' }));

    expect(screen.getByRole('button', { name: 'One' })).toBeDisabled();
    expect(screen.getByRole('spinbutton', { name: 'Weight' })).toBeDisabled();
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

  it('shows the unit select inside the number field by default and lets you change it', () => {
    renderWithInflow(<GroupedInputsDemo />);

    expect(screen.queryByRole('combobox', { name: 'Unit' })).toBeNull();
    chooseOption(screen.getByRole('combobox', { name: 'Weight unit' }), 'lb');

    expect(screen.getByRole('combobox', { name: 'Weight unit' })).toHaveTextContent('lb');
  });

  it('adds a divider before the unit when the divider control is on', () => {
    renderWithInflow(<GroupedInputsDemo />);

    expect(document.querySelector('.MuiInputAdornment-root .MuiDivider-root')).toBeNull();
    fireEvent.click(screen.getByRole('checkbox', { name: 'divider (unit inside field)' }));

    expect(document.querySelector('.MuiInputAdornment-root .MuiDivider-root')).not.toBeNull();
  });

  it('switches to side-by-side fields and joins their borders', () => {
    renderWithInflow(<GroupedInputsDemo />);

    chooseOption(screen.getByRole('combobox', { name: 'number with unit' }), 'side by side');

    expect(screen.queryByRole('combobox', { name: 'Weight unit' })).toBeNull();
    expect(screen.getByRole('spinbutton', { name: 'Weight' })).toBeInTheDocument();
    chooseOption(screen.getByRole('combobox', { name: 'Unit' }), 'g');
    expect(screen.getByRole('combobox', { name: 'Unit' })).toHaveTextContent('g');

    const field = screen.getByRole('spinbutton', { name: 'Weight' }).closest('.MuiTextField-root') as HTMLElement;
    const radiusBefore = getComputedStyle(field.querySelector('.MuiOutlinedInput-root') as HTMLElement).borderTopRightRadius;
    fireEvent.click(screen.getByRole('checkbox', { name: 'joined borders (side by side)' }));
    const radiusAfter = getComputedStyle(field.querySelector('.MuiOutlinedInput-root') as HTMLElement).borderTopRightRadius;
    expect(radiusAfter).not.toBe(radiusBefore);
  });

  it('changes the button group variant and orientation', () => {
    renderWithInflow(<GroupedInputsDemo />);

    chooseOption(screen.getByRole('combobox', { name: 'button group variant' }), 'contained');
    expect(document.querySelector('.MuiButtonGroup-contained')).not.toBeNull();

    expect(document.querySelector('.MuiButtonGroup-vertical')).toBeNull();
    chooseOption(screen.getByRole('combobox', { name: 'button group orientation' }), 'vertical');
    expect(document.querySelector('.MuiButtonGroup-vertical')).not.toBeNull();
  });
});
