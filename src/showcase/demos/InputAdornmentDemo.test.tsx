import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { InputAdornmentDemo } from './InputAdornmentDemo';

describe('InputAdornmentDemo', () => {
  it('renders the interactive adornment frame and both combined-field options', () => {
    renderWithInflow(<InputAdornmentDemo />);

    expect(screen.getByText('Combined fields (for review)')).toBeInTheDocument();
    expect(screen.getByText(/^Option A/)).toBeInTheDocument();
    expect(screen.getByText(/^Option B/)).toBeInTheDocument();
  });

  it('Option A puts a unit select inside the number field and changes the unit', () => {
    renderWithInflow(<InputAdornmentDemo />);

    const unit = screen.getByRole('combobox', { name: 'Weight unit' });
    expect(unit).toHaveTextContent('kg');
    fireEvent.mouseDown(unit);
    fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: 'lb' }));

    expect(screen.getByRole('combobox', { name: 'Weight unit' })).toHaveTextContent('lb');
    expect(screen.getByRole('combobox', { name: 'Weight unit with divider' })).toBeInTheDocument();
  });

  it('Option B renders a separate labelled unit select beside the number field', () => {
    renderWithInflow(<InputAdornmentDemo />);

    // One "Weight" number field in Option A and one in Option B.
    expect(screen.getAllByRole('spinbutton', { name: 'Weight' })).toHaveLength(2);
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Unit' }));
    fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: 'g' }));

    expect(screen.getByRole('combobox', { name: 'Unit' })).toHaveTextContent('g');
    expect(screen.getByRole('combobox', { name: 'Unit (joined)' })).toBeInTheDocument();
  });

  it('switches the combined fields between small and medium', () => {
    renderWithInflow(<InputAdornmentDemo />);

    expect(document.querySelectorAll('.MuiInputBase-sizeSmall').length).toBeGreaterThan(0);
    const sizeSelect = screen.getAllByRole('combobox', { name: 'size' })[0];
    fireEvent.mouseDown(sizeSelect);
    fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: 'medium' }));

    const weight = screen.getAllByRole('spinbutton', { name: 'Weight' })[0];
    expect(weight.closest('.MuiInputBase-root')).not.toHaveClass('MuiInputBase-sizeSmall');
    expect(screen.getByRole('combobox', { name: 'Weight unit' }).closest('.MuiInputBase-root')).not.toHaveClass(
      'MuiInputBase-sizeSmall',
    );
  });
});
