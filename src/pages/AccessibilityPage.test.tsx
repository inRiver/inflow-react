import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { AccessibilityPage } from './AccessibilityPage';

describe('AccessibilityPage', () => {
  it('states the WCAG target and the known contrast gaps', () => {
    renderWithInflow(<AccessibilityPage />);

    expect(screen.getByRole('heading', { name: 'Accessibility' })).toBeInTheDocument();
    expect(screen.getByText('Target WCAG 2.2 AA.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Known Gaps' })).toBeInTheDocument();
    expect(screen.getByText('White text on success green')).toBeInTheDocument();
    expect(screen.getByText('White text on warning orange')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Scope and Limitations' })).toBeInTheDocument();
  });
});
