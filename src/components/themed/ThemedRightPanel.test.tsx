import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ThemedRightPanel } from './ThemedRightPanel';

const onClose = vi.fn();

function renderPanel(props: Partial<React.ComponentProps<typeof ThemedRightPanel>> = {}) {
  return renderWithInflow(
    <ThemedRightPanel open onClose={onClose} aria-label="Product details" {...props}>
      <div>Composed panel content</div>
    </ThemedRightPanel>,
  );
}

describe('ThemedRightPanel', () => {
  it('toggles visibility and moves focus into the panel', async () => {
    const { rerender } = renderPanel({ open: false });
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();

    rerender(
      <ThemedRightPanel open onClose={onClose} aria-label="Product details">
        <div>Composed panel content</div>
      </ThemedRightPanel>,
    );

    const panel = await screen.findByRole('complementary', { name: 'Product details' });
    await waitFor(() => expect(panel).toHaveFocus());
  });

  it('sets the push width variable and does not push in overlay mode', async () => {
    const { rerender } = renderPanel({ mode: 'push', width: 'wide' });
    const host = document.querySelector<HTMLElement>('[data-inflow-root]');

    await waitFor(() => expect(host?.style.getPropertyValue('--infl-right-panel-width')).toBe('520px'));

    rerender(
      <ThemedRightPanel open mode="overlay" onClose={onClose} aria-label="Product details">
        <div>Composed panel content</div>
      </ThemedRightPanel>,
    );

    await waitFor(() => expect(host?.style.getPropertyValue('--infl-right-panel-width')).toBe('0px'));
  });

  it.each([
    ['narrow', '320px'],
    ['medium', '400px'],
    ['wide', '520px'],
  ] as const)('applies the %s width variant', async (width, expectedWidth) => {
    renderPanel({ width });
    const panel = await screen.findByRole('complementary');
    expect(panel).toHaveStyle({ width: expectedWidth });
  });

  it('calls onClose from Escape without rendering a panel-owned close button', async () => {
    renderPanel();
    await screen.findByRole('complementary');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'Close panel' })).not.toBeInTheDocument();
  });

  it('resizes from the pointer drag handle', async () => {
    renderPanel({ width: 'medium' });
    const panel = await screen.findByRole('complementary');
    const handle = screen.getByTestId('right-panel-resize-handle');

    fireEvent.pointerDown(handle, { clientX: 900, pointerId: 1 });
    fireEvent.pointerMove(document, { clientX: 800, pointerId: 1 });
    fireEvent.pointerUp(document, { pointerId: 1 });

    await waitFor(() => expect(panel).toHaveStyle({ width: '500px' }));
  });

  it('stops resizing when a pointer is cancelled', async () => {
    renderPanel({ width: 'medium' });
    const panel = await screen.findByRole('complementary');
    const handle = screen.getByTestId('right-panel-resize-handle');

    fireEvent.pointerDown(handle, { clientX: 900, pointerId: 1 });
    fireEvent.pointerCancel(document, { pointerId: 1 });
    fireEvent.pointerMove(document, { clientX: 800, pointerId: 1 });

    expect(panel).toHaveStyle({ width: '400px' });
  });

  it('keeps creation-style modal panels fixed-width unless resizing is explicitly enabled', async () => {
    renderPanel({ mode: 'overlay', variant: 'modal' });
    await screen.findByRole('complementary');

    expect(screen.queryByTestId('right-panel-resize-handle')).not.toBeInTheDocument();
  });

  it('uses the specified half-opacity overlay backdrop', async () => {
    renderPanel({ mode: 'overlay' });

    const backdrop = await screen.findByTestId('right-panel-backdrop');
    expect(getComputedStyle(backdrop).backgroundColor).toBe('rgba(0, 0, 0, 0.5)');
  });

  it('keeps editing as the primary action and discard as the secondary action', async () => {
    renderPanel({ hasUnsavedChanges: true });
    await screen.findByRole('complementary');

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(await screen.findByRole('button', { name: 'Discard' })).toHaveClass('MuiButton-outlined');
    expect(screen.getByRole('button', { name: 'Keep Editing' })).toHaveClass('MuiButton-contained');
  });

  it('renders children through its composition slot', async () => {
    renderPanel();
    expect(await screen.findByText('Composed panel content')).toBeInTheDocument();
  });
});
