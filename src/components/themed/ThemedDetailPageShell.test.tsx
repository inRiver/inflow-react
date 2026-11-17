import { fireEvent, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ThemedDetailPageShell } from '../../index';
import { renderWithInflow } from '../../test/renderWithInflow';

describe('ThemedDetailPageShell', () => {
  it.each(['light', 'dark'] as const)('renders page and controlled panel in %s mode', async (mode) => {
    const onClose = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const panel = {
      panelProps: { open: false, onClose, mode: 'push' as const, 'aria-label': 'Product editor' },
      detailProps: { title: 'Edit product', children: <button>Save</button> },
    };
    const { rerender } = renderWithInflow(
      <ThemedDetailPageShell ref={ref} panel={panel} sx={[{ maxWidth: '100%' }]}>
        <main aria-label="Product"><h1>Product details</h1></main>
      </ThemedDetailPageShell>,
      { providerProps: { mode } },
    );
    expect(screen.getByRole('main', { name: 'Product' })).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    expect(ref.current).toContainElement(screen.getByRole('main'));

    rerender(
      <ThemedDetailPageShell panel={{ ...panel, panelProps: { ...panel.panelProps, open: true } }}>
        <main aria-label="Product"><h1>Product details</h1></main>
      </ThemedDetailPageShell>,
    );
    expect(await screen.findByRole('complementary', { name: 'Product editor' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Edit product' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    const host = document.querySelector<HTMLElement>('[data-inflow-root]');
    await waitFor(() => expect(host?.style.getPropertyValue('--infl-right-panel-width')).toBe('400px'));
    fireEvent.click(screen.getByRole('button', { name: 'Close detail panel' }));
    expect(onClose).toHaveBeenCalledOnce();

    rerender(
      <ThemedDetailPageShell panel={panel}><main>Product details</main></ThemedDetailPageShell>,
    );
    await waitFor(() => expect(screen.queryByRole('complementary')).not.toBeInTheDocument());
    await waitFor(() => expect(host?.style.getPropertyValue('--infl-right-panel-width')).toBe('0px'));
  });

  it('routes detail close through the panel unsaved-changes guard', async () => {
    const onClose = vi.fn();
    renderWithInflow(
      <ThemedDetailPageShell panel={{
        panelProps: { open: true, onClose, mode: 'overlay', hasUnsavedChanges: true },
        detailProps: { title: 'Edit product', children: 'Changes' },
      }}>
        <main>Product details</main>
      </ThemedDetailPageShell>,
    );
    await screen.findByRole('complementary');
    fireEvent.click(screen.getByRole('button', { name: 'Close detail panel' }));
    expect(await screen.findByRole('heading', { name: 'Discard changes?' })).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Discard' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders without a panel', () => {
    renderWithInflow(<ThemedDetailPageShell><main>Details</main></ThemedDetailPageShell>);
    expect(screen.getByRole('main')).toHaveTextContent('Details');
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });
});
