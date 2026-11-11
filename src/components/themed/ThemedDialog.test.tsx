import { createRef } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { SxProps, Theme } from '@mui/material/styles';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ThemedDialog } from './ThemedDialog';

describe('ThemedDialog', () => {
  it.each(['light', 'dark'] as const)('keeps the default paper geometry in %s mode', (mode) => {
    renderWithInflow(<ThemedDialog open title="Edit profile">Content</ThemedDialog>, {
      providerProps: { mode },
    });

    expect(getComputedStyle(screen.getByRole('dialog')).borderRadius).toBe('28px');
  });

  it('preserves caller paper props, refs, other slots, and root sx', () => {
    const paperRef = createRef<HTMLDivElement>();
    const rootRef = createRef<HTMLDivElement>();
    const onPaperClick = vi.fn();
    renderWithInflow(
      <ThemedDialog
        ref={rootRef}
        open
        title="Edit profile"
        sx={{ zIndex: 1500 }}
        slotProps={{
          paper: { id: 'custom-paper', className: 'consumer-paper', ref: paperRef, onClick: onPaperClick },
          backdrop: { className: 'consumer-backdrop' },
          container: { className: 'consumer-container' },
        }}
      >
        Content
      </ThemedDialog>,
    );

    const paper = screen.getByRole('dialog');
    expect(paper).toHaveAttribute('id', 'custom-paper');
    expect(paper).toHaveClass('consumer-paper');
    expect(paperRef.current).toBe(paper);
    expect(document.querySelector('.consumer-backdrop')).toBeInTheDocument();
    expect(document.querySelector('.consumer-container')).toContainElement(paper);
    expect(rootRef.current).toContainElement(paper);
    expect(getComputedStyle(rootRef.current!).zIndex).toBe('1500');
    fireEvent.click(paper);
    expect(onPaperClick).toHaveBeenCalledOnce();
  });

  const paperStyles: Array<[string, SxProps<Theme>]> = [
    ['object', { borderRadius: '12px', p: 2 }],
    ['callback', (theme) => ({ borderRadius: '12px', padding: theme.spacing(2) })],
    ['array', [false, { borderRadius: '8px' }, (theme) => ({ borderRadius: '12px', padding: theme.spacing(2) })]],
  ];

  it.each(paperStyles)('merges %s paper sx after wrapper defaults', (_name, sx) => {
    renderWithInflow(<ThemedDialog open slotProps={{ paper: { sx } }}>Content</ThemedDialog>);

    const style = getComputedStyle(screen.getByRole('dialog'));
    expect(style.borderRadius).toBe('12px');
    expect(style.paddingTop).toBe('16px');
  });

  it('resolves callback slot props with the Dialog owner state', () => {
    const paperProps = vi.fn((ownerState) => ({
      className: ownerState.fullWidth ? 'consumer-full-width' : 'consumer-narrow',
      sx: [(theme: Theme) => ({ padding: theme.spacing(2) })],
    }));
    renderWithInflow(
      <ThemedDialog open fullWidth slotProps={{ paper: paperProps, backdrop: () => ({ className: 'callback-backdrop' }) }}>
        Content
      </ThemedDialog>,
    );

    expect(paperProps).toHaveBeenCalledWith(expect.objectContaining({ open: true, fullWidth: true }));
    expect(screen.getByRole('dialog')).toHaveClass('consumer-full-width');
    expect(getComputedStyle(screen.getByRole('dialog')).borderRadius).toBe('28px');
    expect(getComputedStyle(screen.getByRole('dialog')).paddingTop).toBe('16px');
    expect(document.querySelector('.callback-backdrop')).toBeInTheDocument();
  });

  it('preserves close-button, Escape, and backdrop onClose reasons', () => {
    const onClose = vi.fn();
    renderWithInflow(<ThemedDialog open title="Edit profile" onClose={onClose}>Content</ThemedDialog>);

    fireEvent.click(screen.getByRole('button', { name: 'close' }));
    expect(onClose).toHaveBeenLastCalledWith(expect.anything(), 'closeButtonClick');
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenLastCalledWith(expect.anything(), 'escapeKeyDown');
    const container = document.querySelector('.MuiDialog-container')!;
    fireEvent.mouseDown(container);
    fireEvent.click(container);
    expect(onClose).toHaveBeenLastCalledWith(expect.anything(), 'backdropClick');
  });
});
