import { useState } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { inflowTheme } from '../../theme';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ThemedMenu } from './ThemedMenu';
import type { ThemedMenuItemDef } from './ThemedMenu';

const items: ThemedMenuItemDef[] = [
  { id: 'edit', label: 'Edit profile', icon: 'edit', shortcut: '⌘E', selected: true },
  { id: 'delete', label: 'Delete profile', dividerBefore: true },
  { id: 'locked', label: 'Locked action', disabled: true },
];

interface MenuHarnessProps {
  onClose?: () => void;
  onSelect?: (id: string) => void;
  dense?: boolean;
}

function MenuHarness({ onClose = vi.fn(), onSelect, dense = false }: MenuHarnessProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <>
      <button ref={setAnchorEl} type="button">
        Open menu
      </button>
      <ThemedMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        onSelect={onSelect}
        items={items}
        dense={dense}
      />
    </>
  );
}

function toRgb(color: string) {
  const element = document.createElement('span');
  element.style.color = color;
  document.body.appendChild(element);
  const rgb = getComputedStyle(element).color;
  element.remove();
  return rgb;
}

describe('ThemedMenu', () => {
  it('opens a portaled menu when open with an anchor element', () => {
    renderWithInflow(<MenuHarness />);

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(items.length);
  });

  it('renders item labels, icons, shortcuts, and dividers', () => {
    renderWithInflow(<MenuHarness />);

    expect(screen.getByText('Edit profile')).toBeInTheDocument();
    expect(screen.getByText('edit')).toHaveClass('material-icons-outlined');
    const shortcut = screen.getByText('⌘E');
    expect(shortcut).toBeInTheDocument();
    expect(getComputedStyle(shortcut).color).toBe(toRgb(inflowTheme.palette.inflow.outline));
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('renders a divider immediately before an item with dividerBefore', () => {
    renderWithInflow(<MenuHarness />);

    const divider = screen.getByRole('separator');
    const deleteItem = screen.getByRole('menuitem', { name: 'Delete profile' });

    expect(divider.compareDocumentPosition(deleteItem) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(divider.nextElementSibling).toBe(deleteItem);
  });

  it('selects an enabled item and closes the menu', () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    renderWithInflow(<MenuHarness onSelect={onSelect} onClose={onClose} />);

    fireEvent.click(screen.getByRole('menuitem', { name: /Edit profile/ }));

    expect(onSelect).toHaveBeenCalledWith('edit');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not select a disabled item', () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    renderWithInflow(<MenuHarness onSelect={onSelect} onClose={onClose} />);

    fireEvent.click(screen.getByRole('menuitem', { name: 'Locked action' }));

    expect(onSelect).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('reduces menu item minHeight when dense', () => {
    renderWithInflow(<MenuHarness dense />);

    expect(getComputedStyle(screen.getByRole('menuitem', { name: /Edit profile/ })).minHeight).toBe('36px');
  });

  it('uses the square, shadowless design-system menu surface', () => {
    renderWithInflow(<MenuHarness />);

    const paper = screen.getByRole('menu').closest<HTMLElement>('.MuiPaper-root');
    expect(paper).not.toBeNull();
    expect(getComputedStyle(paper as HTMLElement).borderRadius).toBe('0px');
    expect(getComputedStyle(paper as HTMLElement).boxShadow).toBe('none');
  });
});
