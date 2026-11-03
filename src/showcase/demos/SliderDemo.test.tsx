import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { SliderDemo } from './SliderDemo';

describe('SliderDemo', () => {
  it('labels each slider example and gives each slider an accessible name', () => {
    renderWithInflow(<SliderDemo />);

    expect(screen.getByText(/Brightness: 30, disabled/)).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Volume' })).toHaveAttribute('aria-valuenow', '30');
    expect(screen.getByRole('slider', { name: 'Brightness' })).toBeDisabled();
    expect(screen.getByRole('slider', { name: 'Minimum price' })).toHaveAttribute('aria-valuenow', '20');
    expect(screen.getByRole('slider', { name: 'Maximum price' })).toHaveAttribute('aria-valuenow', '37');
  });
});
