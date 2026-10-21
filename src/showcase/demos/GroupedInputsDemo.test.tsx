import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { GroupedInputsDemo } from './GroupedInputsDemo';

const chooseOption = (combobox: HTMLElement, option: string) => {
  fireEvent.mouseDown(combobox);
  fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: option }));
};

// Each section has its own controls, in page order: button group, grouped options, number with unit.
const [BUTTON_GROUP, GROUPED_OPTIONS, UNIT, FIELD_ROW] = [0, 1, 2, 3];
const sizeSelect = (section: number) => screen.getAllByRole('combobox', { name: 'size' })[section];
const disabledBox = (section: number) => screen.getAllByRole('checkbox', { name: 'disabled' })[section];

describe('GroupedInputsDemo', () => {
  it('renders every grouped-input section on one page, with controls inside each frame', () => {
    renderWithInflow(<GroupedInputsDemo />);

    expect(screen.getByText('Button group')).toBeInTheDocument();
    expect(screen.getByText('Grouped options')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Number with unit' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Button group' })).toBeInTheDocument();
    expect(screen.getAllByRole('combobox', { name: 'size' })).toHaveLength(4);
    expect(document.querySelector('#props')).toBeNull();
  });

  it('defaults every section to the small Inflow size', () => {
    renderWithInflow(<GroupedInputsDemo />);

    for (const section of [BUTTON_GROUP, GROUPED_OPTIONS, UNIT]) {
      expect(sizeSelect(section)).toHaveTextContent('small');
    }
    expect(screen.getByRole('spinbutton', { name: 'Weight' }).closest('.MuiInputBase-root')).toHaveClass(
      'MuiInputBase-sizeSmall',
    );
  });

  it('switches the button group between small and medium without touching the other sections', () => {
    renderWithInflow(<GroupedInputsDemo />);

    expect(document.querySelector('.MuiButtonGroup-root .MuiButton-sizeSmall')).not.toBeNull();
    chooseOption(sizeSelect(BUTTON_GROUP), 'medium');

    expect(document.querySelector('.MuiButtonGroup-root .MuiButton-sizeSmall')).toBeNull();
    expect(sizeSelect(UNIT)).toHaveTextContent('small');
    expect(screen.getByRole('spinbutton', { name: 'Weight' }).closest('.MuiInputBase-root')).toHaveClass(
      'MuiInputBase-sizeSmall',
    );
  });

  it('switches the number-with-unit field to medium', () => {
    renderWithInflow(<GroupedInputsDemo />);

    chooseOption(sizeSelect(UNIT), 'medium');

    expect(screen.getByRole('spinbutton', { name: 'Weight' }).closest('.MuiInputBase-root')).not.toHaveClass(
      'MuiInputBase-sizeSmall',
    );
    expect(screen.getByRole('combobox', { name: 'Unit' }).closest('.MuiInputBase-root')).not.toHaveClass(
      'MuiInputBase-sizeSmall',
    );
  });

  it('switches the grouped Autocomplete and Select to medium together', () => {
    renderWithInflow(<GroupedInputsDemo />);

    const root = (name: string) => screen.getByRole('combobox', { name }).closest('.MuiInputBase-root');
    expect(root('Movie by decade')).toHaveClass('MuiInputBase-sizeSmall');
    expect(root('Grouping')).toHaveClass('MuiInputBase-sizeSmall');

    chooseOption(sizeSelect(GROUPED_OPTIONS), 'medium');

    expect(root('Movie by decade')).not.toHaveClass('MuiInputBase-sizeSmall');
    expect(root('Grouping')).not.toHaveClass('MuiInputBase-sizeSmall');
  });

  it('disables each section from its own control', () => {
    renderWithInflow(<GroupedInputsDemo />);

    fireEvent.click(disabledBox(BUTTON_GROUP));
    expect(screen.getByRole('button', { name: 'One' })).toBeDisabled();
    expect(screen.getByRole('spinbutton', { name: 'Weight' })).not.toBeDisabled();

    fireEvent.click(disabledBox(UNIT));
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

  it('changes the button group variant and orientation', () => {
    renderWithInflow(<GroupedInputsDemo />);

    chooseOption(screen.getByRole('combobox', { name: 'variant' }), 'contained');
    expect(document.querySelector('.MuiButtonGroup-contained')).not.toBeNull();

    expect(document.querySelector('.MuiButtonGroup-vertical')).toBeNull();
    chooseOption(screen.getByRole('combobox', { name: 'orientation' }), 'vertical');
    expect(document.querySelector('.MuiButtonGroup-vertical')).not.toBeNull();
  });

  it('splits a field group evenly or by ratio, for two to five fields', () => {
    renderWithInflow(<GroupedInputsDemo />);

    expect(screen.getByRole('spinbutton', { name: 'Min' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'Max' })).toBeInTheDocument();
    expect(screen.getAllByText('50%')).toHaveLength(2);

    chooseOption(screen.getByRole('combobox', { name: 'fields' }), '5');
    expect(screen.getByRole('spinbutton', { name: 'Extra' })).toBeInTheDocument();
    expect(screen.getAllByText('20%')).toHaveLength(5);

    chooseOption(screen.getByRole('combobox', { name: 'split' }), 'first wider (2:1)');
    expect(screen.getByText('33%')).toBeInTheDocument();

    chooseOption(sizeSelect(FIELD_ROW), 'medium');
    expect(screen.getByRole('spinbutton', { name: 'Min' }).closest('.MuiInputBase-root')).not.toHaveClass(
      'MuiInputBase-sizeSmall',
    );
  });

  it('switches the field group separator between icon, word and none', () => {
    renderWithInflow(<GroupedInputsDemo />);

    expect(document.querySelector('[data-testid="ArrowForwardIcon"]')).not.toBeNull();
    chooseOption(screen.getByRole('combobox', { name: 'separator' }), 'word');
    expect(screen.getByText('to', { selector: 'p' })).toBeInTheDocument();
    chooseOption(screen.getByRole('combobox', { name: 'separator' }), 'none');
    expect(screen.queryByText('to', { selector: 'p' })).toBeNull();
  });

  it('offers more splits for a field group', () => {
    renderWithInflow(<GroupedInputsDemo />);

    chooseOption(screen.getByRole('combobox', { name: 'fields' }), '3');
    chooseOption(screen.getByRole('combobox', { name: 'split' }), 'middle wider');
    expect(screen.getAllByText('25%')).toHaveLength(2);
    expect(screen.getByText('50%')).toBeInTheDocument();

    chooseOption(screen.getByRole('combobox', { name: 'split' }), 'last much wider (1:3)');
    expect(screen.getAllByText('20%')).toHaveLength(2);
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('turns field group fields into dropdowns', () => {
    renderWithInflow(<GroupedInputsDemo />);

    expect(screen.queryByRole('combobox', { name: 'Max' })).toBeNull();
    chooseOption(screen.getByRole('combobox', { name: 'content' }), 'last is a dropdown');
    expect(screen.getByRole('spinbutton', { name: 'Min' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Max' })).toHaveTextContent('Option 1');

    chooseOption(screen.getByRole('combobox', { name: 'content' }), 'all dropdowns');
    expect(screen.queryByRole('spinbutton', { name: 'Min' })).toBeNull();
    expect(screen.getByRole('combobox', { name: 'Min' })).toBeInTheDocument();
  });

  it('shows the number with unit side by side with joined borders', () => {
    renderWithInflow(<GroupedInputsDemo />);

    const number = screen.getByRole('spinbutton', { name: 'Weight' }).closest('.MuiOutlinedInput-root') as HTMLElement;
    const unit = screen.getByRole('combobox', { name: 'Unit' }).closest('.MuiOutlinedInput-root') as HTMLElement;
    expect(getComputedStyle(number).borderTopRightRadius).toBe('0px');
    expect(getComputedStyle(unit).borderTopLeftRadius).toBe('0px');

    chooseOption(screen.getByRole('combobox', { name: 'Unit' }), 'lb');
    expect(screen.getByRole('combobox', { name: 'Unit' })).toHaveTextContent('lb');
  });

  it('applies the field group size to every field, dropdowns included', () => {
    renderWithInflow(<GroupedInputsDemo />);

    chooseOption(screen.getByRole('combobox', { name: 'content' }), 'alternate');
    chooseOption(sizeSelect(FIELD_ROW), 'medium');

    for (const name of ['Min', 'Max']) {
      const role = name === 'Min' ? 'spinbutton' : 'combobox';
      expect(screen.getByRole(role, { name }).closest('.MuiInputBase-root')).not.toHaveClass('MuiInputBase-sizeSmall');
    }
  });
});
