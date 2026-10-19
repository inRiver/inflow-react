import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { MigrationPage } from './MigrationPage';

describe('MigrationPage', () => {
  it('names the deprecated components and what replaces them', () => {
    renderWithInflow(<MigrationPage />);

    expect(screen.getByRole('heading', { name: 'Migration' })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('removed in the next major release');
    expect(screen.getByText('Use Button from @mui/material.')).toBeInTheDocument();
    expect(screen.getByText('Use TextField from @mui/material.')).toBeInTheDocument();
  });
});
