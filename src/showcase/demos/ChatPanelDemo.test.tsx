import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ChatPanelDemo } from './ChatPanelDemo';

describe('ChatPanelDemo', () => {
  it('starts with the input hint turned off', () => {
    renderWithInflow(<ChatPanelDemo />);

    expect(screen.getByRole('checkbox', { name: 'Show input hint' })).not.toBeChecked();
  });

  it('documents active and completed assistant reasoning states', () => {
    renderWithInflow(<ChatPanelDemo />);

    expect(screen.getByText('While processing')).toBeInTheDocument();
    expect(screen.getByText('After completion')).toBeInTheDocument();
    const activeStep = screen.getByRole('list').querySelector("[aria-current='step']");
    expect(activeStep).toHaveTextContent('Using tool: Extracting data');
    expect(screen.getByRole('button', { name: 'Reasoning' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Tool used: Extracting data')).toBeInTheDocument();
  });
});
