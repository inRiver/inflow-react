import { describe, expect, it } from 'vitest';
import { fireEvent, screen, within } from '@testing-library/react';
import { renderWithInflow } from '../../test/renderWithInflow';
import { TimePickerDemo } from './TimePickerDemo';

const codeExample = () => document.querySelector('pre code') as HTMLElement;

describe('TimePickerDemo', () => {
  it('renders each frame with times in the shared Inflow time format', () => {
    renderWithInflow(<TimePickerDemo />);

    expect(screen.getByText('Time Picker - Interactive')).toBeInTheDocument();
    expect(screen.getByText('All States')).toBeInTheDocument();
    expect(codeExample()).toHaveTextContent("import { InflowLocalizationProvider } from '@inriver/inflow-react/datetime/client';");
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

  it('applies the disabled playground control to the interactive picker and the code example', () => {
    renderWithInflow(<TimePickerDemo />);
    const frame = screen.getByText('Time Picker - Interactive').parentElement as HTMLElement;

    expect(within(frame).getByRole('button', { name: /choose time/i })).toBeEnabled();
    expect(codeExample()).toHaveTextContent('disabled={false}');

    fireEvent.click(screen.getByRole('checkbox', { name: 'disabled' }));

    expect(within(frame).getByRole('button', { name: /choose time/i })).toBeDisabled();
    within(frame)
      .getAllByRole('spinbutton')
      .forEach((section) => expect(section).toHaveAttribute('aria-disabled', 'true'));
    expect(codeExample()).toHaveTextContent('disabled={true}');
  });

  it('applies the size playground control to the interactive picker and the code example', () => {
    renderWithInflow(<TimePickerDemo />);
    const frame = screen.getByText('Time Picker - Interactive').parentElement as HTMLElement;

    expect(frame.querySelector('.MuiPickersInputBase-inputSizeSmall')).not.toBeNull();
    expect(codeExample()).toHaveTextContent("size: 'small'");

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'size' }));
    fireEvent.click(screen.getByRole('option', { name: 'medium' }));

    expect(frame.querySelector('.MuiPickersInputBase-inputSizeSmall')).toBeNull();
    expect(codeExample()).toHaveTextContent("size: 'medium'");
  });
});
