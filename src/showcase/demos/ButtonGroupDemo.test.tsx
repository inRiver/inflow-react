import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ButtonGroupDemo } from './ButtonGroupDemo';

describe('ButtonGroupDemo', () => {
  it('renders the interactive group and every variant frame', () => {
    renderWithInflow(<ButtonGroupDemo />);

    expect(screen.getByText('Button Group - Interactive')).toBeInTheDocument();
    expect(screen.getByText('All Variants')).toBeInTheDocument();
    for (const name of ['Contained button group', 'Outlined button group', 'Text button group', 'Disabled button group']) {
      expect(screen.getByRole('group', { name })).toBeInTheDocument();
    }
  });

  it('changes the interactive group orientation from the playground', () => {
    renderWithInflow(<ButtonGroupDemo />);

    expect(document.querySelector('.MuiButtonGroup-vertical')).toBeNull();
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'orientation' }));
    fireEvent.click(screen.getByRole('option', { name: 'vertical' }));

    expect(document.querySelector('.MuiButtonGroup-vertical')).not.toBeNull();
  });
});
