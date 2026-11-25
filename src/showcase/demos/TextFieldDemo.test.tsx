import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { TextFieldDemo } from './TextFieldDemo';

describe('TextFieldDemo', () => {
  it('renders the states', () => {
    renderWithInflow(<TextFieldDemo />);

    expect(screen.getByText('Incorrect entry.')).toBeInTheDocument();
  });

  it('renders a read-only field that can be focused and a disabled one that cannot', () => {
    renderWithInflow(<TextFieldDemo />);

    expect(screen.getByLabelText('Read only')).toHaveAttribute('readonly');
    expect(screen.getByLabelText('Disabled with value')).toBeDisabled();
  });

  it('styles read-only fields with a tint and default cursor, and leaves editable ones alone', () => {
    renderWithInflow(<TextFieldDemo />);

    const readOnlyRoot = screen.getByLabelText('Read only').closest('.MuiInputBase-root');
    const editableRoot = screen.getByLabelText('Default').closest('.MuiInputBase-root');
    expect(readOnlyRoot).toHaveStyle({ backgroundColor: 'rgb(241, 246, 254)', cursor: 'default' });
    expect(editableRoot).not.toHaveStyle({ backgroundColor: 'rgb(241, 246, 254)' });
  });

  it('toggles read-only and disabled from the interactive controls', () => {
    renderWithInflow(<TextFieldDemo />);

    const field = screen.getByLabelText('Label');
    expect(field).not.toHaveAttribute('readonly');

    fireEvent.click(screen.getByRole('checkbox', { name: 'readOnly' }));
    expect(field).toHaveAttribute('readonly');

    fireEvent.click(screen.getByRole('checkbox', { name: 'disabled' }));
    expect(field).toBeDisabled();
  });

  it('renders read-only versions of every input type', () => {
    renderWithInflow(<TextFieldDemo />);

    expect(screen.getByLabelText('Multiline')).toHaveAttribute('readonly');
    expect(screen.getByLabelText('Autocomplete')).toHaveAttribute('readonly');
    expect(screen.getByLabelText('Filled')).toHaveAttribute('readonly');
    expect(screen.getByLabelText('Standard')).toHaveAttribute('readonly');
  });

  it('shows a live character count and caps the input at the limit', () => {
    renderWithInflow(<TextFieldDemo />);

    const field = screen.getByLabelText('Description (limit 100)');
    expect(field).toHaveAttribute('maxlength', '100');
    expect(screen.getByText('32/100')).toBeInTheDocument();

    fireEvent.change(field, { target: { value: 'Short' } });
    expect(screen.getByText('5/100')).toBeInTheDocument();
  });

  it('shows no counter and no cap when there is no limit', () => {
    renderWithInflow(<TextFieldDemo />);

    const field = screen.getByLabelText('Notes (no limit)');
    expect(field).not.toHaveAttribute('maxlength');
    expect(screen.getAllByText(/^\d+\/\d+$/)).toHaveLength(1);
  });
});
