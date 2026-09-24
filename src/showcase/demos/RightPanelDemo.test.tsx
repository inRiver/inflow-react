import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { RightPanelDemo } from './RightPanelDemo';

function selectScenario(name: string) {
  fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Scenario' }));
  fireEvent.click(screen.getByRole('option', { name }));
}

describe('RightPanelDemo', () => {
  it('demonstrates a fixed wide modal overlay', async () => {
    renderWithInflow(<RightPanelDemo />);

    selectScenario('Default');
    fireEvent.click(screen.getByRole('button', { name: 'Open default' }));

    const panel = await screen.findByRole('complementary', { name: 'Right panel example' });
    expect(panel).toHaveStyle({ width: '520px' });
    expect(screen.getByTestId('right-panel-backdrop')).toBeInTheDocument();
    expect(screen.queryByTestId('right-panel-resize-handle')).not.toBeInTheDocument();
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
