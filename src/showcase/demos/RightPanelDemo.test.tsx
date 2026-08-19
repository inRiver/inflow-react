import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { RightPanelDemo } from './RightPanelDemo';

function selectScenario(name: string) {
  fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Scenario' }));
  fireEvent.click(screen.getByRole('option', { name }));
}

describe('RightPanelDemo', () => {
  it('demonstrates a fixed wide creation overlay and its inherited secondary view', async () => {
    renderWithInflow(<RightPanelDemo />);

    selectScenario('Create signal');
    fireEvent.click(screen.getByRole('button', { name: 'Open create signal' }));

    const panel = await screen.findByRole('complementary', { name: 'Right panel example' });
    expect(panel).toHaveStyle({ width: '520px' });
    expect(screen.getByTestId('right-panel-backdrop')).toBeInTheDocument();
    expect(screen.queryByTestId('right-panel-resize-handle')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open Query Assistant' }));

    expect(screen.getByRole('button', { name: 'Back to create signal' })).toBeInTheDocument();
    expect(screen.getByText(/inherits the same 520px panel width/i)).toBeInTheDocument();
    expect(panel).toHaveStyle({ width: '520px' });
  });

  it('demonstrates the query editor navigation-close behavior', async () => {
    renderWithInflow(<RightPanelDemo />);

    selectScenario('Query editor');
    fireEvent.click(screen.getByRole('button', { name: 'Open query editor' }));
    expect(await screen.findByRole('complementary', { name: 'Right panel example' })).toHaveStyle({ width: '520px' });

    act(() => window.dispatchEvent(new Event('hashchange')));

    await waitFor(() => expect(screen.queryByRole('complementary', { name: 'Right panel example' })).not.toBeInTheDocument());
  });
});
