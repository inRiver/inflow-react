import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { RightPanelPatternDemo } from './RightPanelPatternDemo';

describe('RightPanelPatternDemo', () => {
  it.each(['light', 'dark'] as const)('demonstrates push, overlay and chat layouts in %s mode', async (mode) => {
    renderWithInflow(<RightPanelPatternDemo />, { providerProps: { mode } });
    expect(screen.getByText('Push, overlay and chat layouts')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open push panel' }));
    let panel = await screen.findByRole('complementary', { name: 'Layout example panel' });
    const host = panel.closest<HTMLElement>('[data-inflow-root]');
    const outerHost = host?.parentElement?.closest<HTMLElement>('[data-inflow-root]');
    expect(within(panel).getByText('Push panel')).toBeInTheDocument();
    expect(screen.queryByTestId('right-panel-backdrop')).not.toBeInTheDocument();
    await waitFor(() => expect(host?.style.getPropertyValue('--infl-right-panel-width')).toBe('520px'));
    expect(outerHost?.style.getPropertyValue('--infl-right-panel-width')).toBe('');
    fireEvent.click(within(panel).getByRole('button', { name: 'Close detail panel' }));
    await waitFor(() => expect(screen.queryByRole('complementary', { name: 'Layout example panel' })).not.toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Open overlay panel' }));
    panel = await screen.findByRole('complementary', { name: 'Layout example panel' });
    expect(within(panel).getByText('Overlay panel')).toBeInTheDocument();
    expect(screen.getByTestId('right-panel-backdrop')).toBeInTheDocument();
    await waitFor(() => expect(host?.style.getPropertyValue('--infl-right-panel-width')).toBe('0px'));
    fireEvent.click(within(panel).getByRole('button', { name: 'Close detail panel' }));
    await waitFor(() => expect(screen.queryByRole('complementary', { name: 'Layout example panel' })).not.toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Open chat panel' }));
    panel = await screen.findByRole('complementary', { name: 'Layout example panel' });
    expect(within(panel).getByText('How can I help with this publisher?')).toBeInTheDocument();
    fireEvent.change(within(panel).getByRole('textbox', { name: 'How can I help?' }), { target: { value: 'Review catalog' } });
    fireEvent.click(within(panel).getByRole('button', { name: 'Send message' }));
    expect(within(panel).getByText('Review catalog')).toBeInTheDocument();
    fireEvent.click(within(panel).getByRole('button', { name: 'Close chat panel' }));
    await waitFor(() => expect(screen.queryByRole('complementary', { name: 'Layout example panel' })).not.toBeInTheDocument());
    expect(document.querySelector('pre')?.textContent).toContain("from '@inriver/inflow-react'");
  });
});
