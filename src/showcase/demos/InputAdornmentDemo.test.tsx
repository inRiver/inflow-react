import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { InputAdornmentDemo } from './InputAdornmentDemo';

describe('InputAdornmentDemo', () => {
  it('renders the interactive and all-states frames with small adornment icons', () => {
    renderWithInflow(<InputAdornmentDemo />);

    expect(screen.getByText('Input Adornment - Interactive')).toBeInTheDocument();
    expect(screen.getByText('All States')).toBeInTheDocument();
    expect(document.querySelectorAll('.MuiInputAdornment-root .MuiSvgIcon-fontSizeSmall').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('.MuiInputAdornment-root .MuiSvgIcon-fontSizeMedium')).toHaveLength(0);
  });

  it('disables the interactive fields from the playground', () => {
    renderWithInflow(<InputAdornmentDemo />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'disabled' }));

    expect(screen.getAllByRole('textbox', { name: 'Username' })[0]).toBeDisabled();
  });

  it('switches the interactive variant from the playground', () => {
    renderWithInflow(<InputAdornmentDemo />);

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'variant' }));
    fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: 'filled' }));

    expect(document.querySelector('.MuiFilledInput-root')).not.toBeNull();
  });
});
