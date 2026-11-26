import { describe, expect, it } from 'vitest';
import { fireEvent, screen, within } from '@testing-library/react';
import { renderWithInflow } from '../../test/renderWithInflow';
import { DatePickerDemo } from './DatePickerDemo';

const codeExample = () => document.querySelector('pre code') as HTMLElement;

describe('DatePickerDemo', () => {
  it('renders each frame', () => {
    renderWithInflow(<DatePickerDemo />);

    expect(screen.getByText('Date Picker - Interactive')).toBeInTheDocument();
    expect(screen.getByText('All States')).toBeInTheDocument();
    expect(codeExample()).toHaveTextContent("import { InflowLocalizationProvider } from '@inriver/inflow-react/datetime/client';");
    expect(screen.getAllByDisplayValue('1/1/2024').length).toBeGreaterThan(0);
  });

  it('keeps the open calendar above page elements that have a z-index', () => {
    renderWithInflow(<DatePickerDemo />);

    fireEvent.click(screen.getAllByRole('button', { name: /choose date/i })[0]);

    const popper = screen.getByRole('dialog').closest('.MuiPopper-root') as HTMLElement;
    expect(getComputedStyle(popper).zIndex).toBe('1300');
  });

  it('applies the disabled playground control to the interactive picker and the code example', () => {
    renderWithInflow(<DatePickerDemo />);
    const frame = screen.getByText('Date Picker - Interactive').parentElement as HTMLElement;

    expect(within(frame).getByRole('button', { name: /choose date/i })).toBeEnabled();
    expect(codeExample()).toHaveTextContent('disabled={false}');

    fireEvent.click(screen.getByRole('checkbox', { name: 'disabled' }));

    expect(within(frame).getByRole('button', { name: /choose date/i })).toBeDisabled();
    within(frame)
      .getAllByRole('spinbutton')
      .forEach((section) => expect(section).toHaveAttribute('aria-disabled', 'true'));
    expect(codeExample()).toHaveTextContent('disabled={true}');
  });

  it('applies the size playground control to the interactive picker and the code example', () => {
    renderWithInflow(<DatePickerDemo />);
    const frame = screen.getByText('Date Picker - Interactive').parentElement as HTMLElement;

    expect(frame.querySelector('.MuiPickersInputBase-inputSizeSmall')).not.toBeNull();
    expect(codeExample()).toHaveTextContent("size: 'small'");

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'size' }));
    fireEvent.click(screen.getByRole('option', { name: 'medium' }));

    expect(frame.querySelector('.MuiPickersInputBase-inputSizeSmall')).toBeNull();
    expect(codeExample()).toHaveTextContent("size: 'medium'");
  });
});
