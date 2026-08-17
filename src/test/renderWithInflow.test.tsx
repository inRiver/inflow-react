import { Button } from '@mui/material';
import { describe, expect, it } from 'vitest';
import { getInflowCssVar, renderWithInflow } from './renderWithInflow';

describe('renderWithInflow', () => {
  it('renders a child inside the Inflow provider with the scoped root', () => {
    const { getByRole, container } = renderWithInflow(<Button>Save</Button>);

    expect(getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(container.querySelector('[data-inflow-root]')).not.toBeNull();
  });

  it('applies the Inflow theme to the child', () => {
    const { getByRole } = renderWithInflow(<Button variant="contained">Save</Button>);

    expect(getComputedStyle(getByRole('button')).borderRadius).not.toBe('4px');
  });

  it('keeps the provider and theme across rerender', () => {
    const { rerender, getByRole, container } = renderWithInflow(
      <Button variant="contained">First</Button>,
    );

    rerender(<Button variant="contained">Second</Button>);

    expect(getByRole('button', { name: 'Second' })).toBeInTheDocument();
    expect(container.querySelector('[data-inflow-root]')).not.toBeNull();
    expect(getComputedStyle(getByRole('button')).borderRadius).not.toBe('4px');
  });

  it('exposes --infl-* variables on the provider root', () => {
    const { container } = renderWithInflow(<Button>Save</Button>);

    expect(getInflowCssVar(container, '--infl-primary-color')).not.toBe('');
    expect(getInflowCssVar(container, '--infl-toast-info-bg-color')).not.toBe('');
  });
});
