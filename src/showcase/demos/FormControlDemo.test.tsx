import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { FormControlDemo } from './FormControlDemo';

describe('FormControlDemo', () => {
  it('renders the interactive field and the four state fields', () => {
    renderWithInflow(<FormControlDemo />);

    expect(screen.getByText('Form Control - Interactive')).toBeInTheDocument();
    expect(screen.getByText('All States')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Email/)).toHaveLength(5);
  });

  it('ties each label to its input, so clicking the label focuses the field and screen readers announce it', () => {
    renderWithInflow(<FormControlDemo />);

    const [input] = screen.getAllByLabelText(/Email/);
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAccessibleDescription("We'll never share your email.");
  });

  it('shows the label inside the outlined border like a TextField, not as a separate line above the input', () => {
    renderWithInflow(<FormControlDemo />);

    const [input] = screen.getAllByLabelText(/Email/);
    const label = screen.getAllByText('Email', { selector: 'label' })[0];
    expect(label).toHaveClass('MuiInputLabel-outlined');
    expect(input.closest('.MuiOutlinedInput-root')).not.toBeNull();
    expect(input.closest('.MuiOutlinedInput-root')?.querySelector('legend')).not.toBeNull();
  });

  it('applies required, error and disabled once on the FormControl to the label, input and helper text', () => {
    renderWithInflow(<FormControlDemo />);

    const [, required, error, disabled] = screen.getAllByLabelText(/Email/).slice(1);
    expect(required).toBeRequired();
    expect(error).toHaveAttribute('aria-invalid', 'true');
    expect(disabled).toBeDisabled();
  });

  it('passes the playground switches through to the interactive field', () => {
    renderWithInflow(<FormControlDemo />);

    const [interactive] = screen.getAllByLabelText(/Email/);
    expect(interactive).not.toBeDisabled();

    fireEvent.click(screen.getByRole('checkbox', { name: 'disabled' }));
    expect(screen.getAllByLabelText(/Email/)[0]).toBeDisabled();

    fireEvent.click(screen.getByRole('checkbox', { name: 'error' }));
    expect(screen.getAllByLabelText(/Email/)[0]).toHaveAttribute('aria-invalid', 'true');
  });
});
