import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { DetailPagePatternDemo } from './DetailPagePatternDemo';

describe('DetailPagePatternDemo', () => {
  it.each(['light', 'dark'] as const)('opens and closes the detail panel in %s mode', async (mode) => {
    renderWithInflow(<DetailPagePatternDemo />, { providerProps: { mode } });
    expect(screen.getByText('Detail page with a push panel')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Northstar' })).toBeInTheDocument();
    expect(screen.queryByRole('complementary', { name: 'Publisher details panel' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open publisher panel' }));
    const panel = await screen.findByRole('complementary', { name: 'Publisher details panel' });
    expect(within(panel).getByText('Publisher information')).toBeInTheDocument();
    expect(within(panel).getByText('catalog@example.com')).toBeInTheDocument();
    const host = panel.closest<HTMLElement>('[data-inflow-root]');
    const outerHost = host?.parentElement?.closest<HTMLElement>('[data-inflow-root]');
    await waitFor(() => expect(host?.style.getPropertyValue('--infl-right-panel-width')).toBe('520px'));
    expect(outerHost?.style.getPropertyValue('--infl-right-panel-width')).toBe('');
    fireEvent.click(within(panel).getByRole('button', { name: 'Close detail panel' }));
    await waitFor(() => expect(screen.queryByRole('complementary', { name: 'Publisher details panel' })).not.toBeInTheDocument());
    expect(document.querySelector('pre')?.textContent).toContain("from '@inriver/inflow-react'");
  });
});
