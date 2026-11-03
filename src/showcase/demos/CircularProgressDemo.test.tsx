import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { CircularProgressDemo } from './CircularProgressDemo';

describe('CircularProgressDemo', () => {
  it('captions every example and names each spinner for screen readers', () => {
    renderWithInflow(<CircularProgressDemo />);

    expect(screen.getByText('Loading products (ongoing)')).toBeInTheDocument();
    expect(screen.getByText('Upload failed: retry')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Import progress' })).toHaveAttribute('aria-valuenow', '75');
    expect(screen.getByRole('progressbar', { name: 'Upload failed, retry' })).toBeInTheDocument();
  });
});
