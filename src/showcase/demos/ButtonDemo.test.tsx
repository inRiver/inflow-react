import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ButtonDemo } from './ButtonDemo';

describe('ButtonDemo', () => {
  it('shows the removal notice and interactive and state frames', () => {
    renderWithInflow(<ButtonDemo />);

    expect(screen.getByRole('alert')).toHaveTextContent('ThemedButton was removed in 4.0.0.');
    expect(screen.getByRole('alert')).toHaveTextContent('Use MUI Button from @mui/material directly inside InflowProvider');
    expect(screen.getByText('Button - Interactive')).toBeInTheDocument();
    expect(screen.getByText('All States')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Default' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
    for (const name of ['Error', 'Outlined', 'Text']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    }
  });

  it('updates the interactive button from playground controls', () => {
    renderWithInflow(<ButtonDemo />);

    const button = screen.getByRole('button', { name: 'Interactive Button' });
    expect(button).toHaveClass('MuiButton-contained');
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'variant' }));
    fireEvent.click(screen.getByRole('option', { name: 'outlined' }));
    expect(button).toHaveClass('MuiButton-outlined');
    fireEvent.click(screen.getByRole('checkbox', { name: 'disabled' }));
    expect(button).toBeDisabled();
  });
});
