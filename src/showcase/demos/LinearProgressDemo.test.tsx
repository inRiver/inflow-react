import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { LinearProgressDemo } from './LinearProgressDemo';

describe('LinearProgressDemo', () => {
  it('captions every example with its task, value and status, and names each bar for screen readers', () => {
    renderWithInflow(<LinearProgressDemo />);

    expect(screen.getByText(/Importing catalog: 50% complete/)).toBeInTheDocument();
    expect(screen.getByText(/ongoing loading animation, no percentage yet/)).toBeInTheDocument();
    expect(screen.getByText(/The upload failed, retry it/)).toBeInTheDocument();

    const bar = screen.getByRole('progressbar', { name: /Importing catalog/ });
    expect(bar).toHaveAttribute('aria-valuenow', '50');
    expect(screen.getByRole('progressbar', { name: /Uploading media/ })).toHaveAttribute('aria-valuenow', '70');
  });
});
