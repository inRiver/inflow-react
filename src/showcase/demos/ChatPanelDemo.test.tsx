import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('embeds collapsed history and streaming reasoning in the chat thread', async () => {
    const user = userEvent.setup();
    renderWithInflow(<ChatPanelDemo />);

    await user.click(screen.getByRole('button', { name: 'Open chat assistant' }));

    const historyButtons = screen.getAllByRole('button', { name: 'Reasoning' });
    expect(historyButtons.length).toBeGreaterThan(0);
    historyButtons.forEach((button) => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    const activeSteps = screen.getAllByRole('list')
      .flatMap((list) => Array.from(list.querySelectorAll("[aria-current='step']")));
    const inChatActive = activeSteps.find((el) => el.textContent?.includes('Extracting data'));
    expect(inChatActive).toBeDefined();

    expect(screen.getByText('Show the missing fields first.')).toBeInTheDocument();
    expect(screen.getByText('Update my prompt from remembered preferences')).toBeInTheDocument();
    expect(screen.getByText(/Classifying document type/)).toBeInTheDocument();
  });
});
