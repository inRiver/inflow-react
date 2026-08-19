import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

function PanelPair({ firstUnsaved = false }: { firstUnsaved?: boolean }) {
  const [firstOpen, setFirstOpen] = useState(true);
  const [secondOpen, setSecondOpen] = useState(false);

  return (
    <>
      <button onClick={() => setSecondOpen(true)}>Open second panel</button>
      <ThemedRightPanel
        open={firstOpen}
        hasUnsavedChanges={firstUnsaved}
        onClose={() => setFirstOpen(false)}
        aria-label="First panel"
      >
        First panel content
      </ThemedRightPanel>
      <ThemedRightPanel open={secondOpen} onClose={() => setSecondOpen(false)} aria-label="Second panel">
        Second panel content
      </ThemedRightPanel>
    </>
  );
}

describe('ThemedRightPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it.each([
    ['assistant', '400px'],
    ['editor', '520px'],
    ['modal', '520px'],
  ] as const)('uses the specification default width for the %s variant', async (variant, expectedWidth) => {
    renderPanel({ variant });
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

  it('closes query editors on navigation while assistants remain open', async () => {
    const { rerender } = renderPanel({ variant: 'assistant' });
    await screen.findByRole('complementary');

    window.dispatchEvent(new Event('hashchange'));
    expect(onClose).not.toHaveBeenCalled();

    rerender(
      <ThemedRightPanel open variant="editor" onClose={onClose} aria-label="Product details">
        <div>Composed panel content</div>
      </ThemedRightPanel>,
    );

    window.dispatchEvent(new Event('hashchange'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('routes navigation through the unsaved-changes confirmation', async () => {
    renderPanel({ variant: 'editor', hasUnsavedChanges: true });
    await screen.findByRole('complementary');

    act(() => window.dispatchEvent(new Event('popstate')));

    expect(await screen.findByRole('heading', { name: 'Discard changes?' })).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
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

  it('lets composed close controls use the guarded close behavior', async () => {
    renderWithInflow(
      <ThemedRightPanel open hasUnsavedChanges onClose={onClose}>
        {({ requestClose }) => <button onClick={requestClose}>Cancel</button>}
      </ThemedRightPanel>,
    );

    fireEvent.click(await screen.findByRole('button', { name: 'Cancel' }));

    expect(await screen.findByRole('heading', { name: 'Discard changes?' })).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('replaces the active panel when a second panel opens', async () => {
    renderWithInflow(<PanelPair />);
    expect(await screen.findByRole('complementary', { name: 'First panel' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open second panel' }));

    expect(await screen.findByRole('complementary', { name: 'Second panel' })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('complementary', { name: 'First panel' })).not.toBeInTheDocument());
  });

  it('keeps the active panel when replacement is cancelled and replaces it after discard', async () => {
    renderWithInflow(<PanelPair firstUnsaved />);
    expect(await screen.findByRole('complementary', { name: 'First panel' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open second panel' }));
    await act(async () => fireEvent.click(await screen.findByRole('button', { name: 'Keep Editing' })));

    expect(await screen.findByRole('complementary', { name: 'First panel' })).toBeInTheDocument();
    expect(screen.queryByRole('complementary', { name: 'Second panel' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open second panel' }));
    await act(async () => fireEvent.click(await screen.findByRole('button', { name: 'Discard' })));

    expect(await screen.findByRole('complementary', { name: 'Second panel' })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('complementary', { name: 'First panel' })).not.toBeInTheDocument());
  });

  it('renders children through its composition slot', async () => {
    renderPanel();
    expect(await screen.findByText('Composed panel content')).toBeInTheDocument();
  });
});
