import { describe, expect, it } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithInflow } from '../../test/renderWithInflow';
import { TimePickerDemo } from './TimePickerDemo';

describe('TimePickerDemo', () => {
  it('renders each frame with times in the shared Inflow time format', () => {
    renderWithInflow(<TimePickerDemo />);

    expect(screen.getByText('Time Picker - Interactive')).toBeInTheDocument();
    expect(screen.getByText('All States')).toBeInTheDocument();
    expect(screen.getAllByRole('group', { name: /alarm/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByDisplayValue('7:30 AM').length).toBeGreaterThan(0);
    expect(screen.getAllByDisplayValue('2:00 PM').length).toBeGreaterThan(0);
  });

  it('shows compact outlined Cancel and contained OK buttons in the picker popup', () => {
    renderWithInflow(<TimePickerDemo />);

    fireEvent.click(screen.getAllByRole('button', { name: /choose time/i })[0]);

    const cancel = screen.getByRole('button', { name: 'Cancel' });
    expect(cancel).toHaveClass('MuiButton-outlined', 'MuiButton-sizeSmall');
    expect(screen.getByRole('button', { name: 'OK' })).toHaveClass('MuiButton-contained', 'MuiButton-sizeSmall');
  });
});
