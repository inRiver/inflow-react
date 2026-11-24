import { describe, expect, it } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithInflow } from '../../test/renderWithInflow';
import { DatePickerDemo } from './DatePickerDemo';

describe('DatePickerDemo', () => {
  it('renders each frame', () => {
    renderWithInflow(<DatePickerDemo />);

    expect(screen.getByText('Date Picker - Interactive')).toBeInTheDocument();
    expect(screen.getByText('All States')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('1/1/2024').length).toBeGreaterThan(0);
  });

  it('keeps the open calendar above page elements that have a z-index', () => {
    renderWithInflow(<DatePickerDemo />);

    fireEvent.click(screen.getAllByRole('button', { name: /choose date/i })[0]);

    const popper = screen.getByRole('dialog').closest('.MuiPopper-root') as HTMLElement;
    expect(getComputedStyle(popper).zIndex).toBe('1300');
  });
});
