import { useState } from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@mui/material';
import { describe, expect, it, vi } from 'vitest';
import { createInflowTheme, inflowTheme } from '../../theme';
import { darkTokens } from '../../theme/inflow-tokens';
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

const keyboardItems: ThemedMenuItemDef[] = [
  { id: 'alpha', label: 'Alpha' },
  { id: 'premium', label: 'Premium', locked: true, lockedTooltip: 'Upgrade to enable this action.' },
  { id: 'disabled', label: 'Disabled item', disabled: true },
  { id: 'omega', label: 'Omega' },
];

function InteractiveMenuHarness({
  menuItems = keyboardItems,
  ctaDisabled = false,
  onCta = vi.fn(),
  onSelect = vi.fn(),
  onClose = vi.fn(),
}: {
  menuItems?: ThemedMenuItemDef[];
  ctaDisabled?: boolean;
  onCta?: () => void;
  onSelect?: (id: string) => void;
  onClose?: () => void;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  return (
    <>
      <button type="button" aria-haspopup="menu" aria-expanded={!!anchorEl} onClick={(event) => setAnchorEl(event.currentTarget)}>
        Open keyboard menu
      </button>
      <ThemedMenu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => { onClose(); setAnchorEl(null); }}
        items={menuItems}
        onSelect={onSelect}
        header="Review menu"
        cta={{ label: 'Upgrade account', onClick: onCta, disabled: ctaDisabled }}
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

  it('shows a locked item with a lock icon, full-strength text and no selection', () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    renderWithInflow(
      <ThemedMenu
        anchorEl={document.body}
        open
        onClose={onClose}
        onSelect={onSelect}
        items={[{ id: 'projects', label: 'Projects', locked: true, lockedTooltip: 'Enable Orchestrate.' }]}
      />,
    );

    const item = screen.getByText('Projects').closest<HTMLElement>('[role="menuitem"]') as HTMLElement;
    expect(screen.getByText('lock')).toBeInTheDocument();
    expect(item).toHaveAttribute('aria-disabled', 'true');
    expect(getComputedStyle(screen.getByText('Projects')).color).not.toBe(toRgb(inflowTheme.palette.text.disabled));
    fireEvent.click(item);
    expect(onSelect).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('reveals the locked tooltip on hover', async () => {
    renderWithInflow(
      <ThemedMenu
        anchorEl={document.body}
        open
        onClose={vi.fn()}
        items={[{ id: 'projects', label: 'Projects', locked: true, lockedTooltip: 'Enable Orchestrate.' }]}
      />,
    );

    fireEvent.mouseOver(screen.getByText('Projects').closest('[role="menuitem"]') as HTMLElement);
    expect(await screen.findByText('Enable Orchestrate.')).toBeInTheDocument();
  });

  it('renders a header row and a CTA that fires onClick and closes the menu', () => {
    const onCta = vi.fn();
    const onClose = vi.fn();
    renderWithInflow(
      <ThemedMenu
        anchorEl={document.body}
        open
        onClose={onClose}
        header="Orchestrate"
        items={[{ id: 'projects', label: 'Projects', locked: true }]}
        cta={{ label: 'Enable Orchestrate', onClick: onCta }}
      />,
    );

    expect(screen.getByText('Orchestrate')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Enable Orchestrate' }));
    expect(onCta).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('includes locked options and the CTA in arrow, Home and End keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithInflow(<InteractiveMenuHarness />);
    await user.tab();
    await user.keyboard('{Enter}');
    const alpha = screen.getByRole('menuitem', { name: 'Alpha' });
    const premium = screen.getByRole('menuitem', { name: 'Premium' });
    const disabled = screen.getByRole('menuitem', { name: 'Disabled item' });
    const omega = screen.getByRole('menuitem', { name: 'Omega' });
    const cta = screen.getByRole('menuitem', { name: 'Upgrade account' });
    await waitFor(() => expect(alpha).toHaveFocus());
    expect(cta).toHaveAttribute('tabindex', '-1');

    // jsdom does not model keyboard-driven :focus-visible, which MUI Tooltip checks.
    // Keep real keyboard focus/navigation and supply only the missing browser pseudo-class.
    const matches = premium.matches.bind(premium);
    const focusVisible = vi.spyOn(premium, 'matches').mockImplementation((selector) => selector === ':focus-visible' || matches(selector));
    await user.keyboard('{ArrowDown}');
    focusVisible.mockRestore();
    expect(premium).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Upgrade to enable this action.');
    expect(premium).toHaveAccessibleName('Premium');
    expect(premium).toHaveAccessibleDescription('Upgrade to enable this action.');
    expect(premium).toHaveAttribute('aria-disabled', 'true');

    // MUI's disabledItemsFocusable applies to the entire menu when it contains locked options.
    await user.keyboard('{ArrowDown}');
    expect(disabled).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(omega).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(cta).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(alpha).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(cta).toHaveFocus();
    await user.keyboard('{Home}');
    expect(alpha).toHaveFocus();
    await user.keyboard('{End}');
    expect(cta).toHaveFocus();
    expect(cta.tagName).toBe('BUTTON');
    expect(cta.querySelector('button, [role="menuitem"]')).toBeNull();
    expect(cta.parentElement).toHaveAttribute('role', 'presentation');
  });

  it('blocks locked and disabled activation but invokes the CTA once with Enter and Space after reopening', async () => {
    const user = userEvent.setup();
    const onCta = vi.fn();
    const onSelect = vi.fn();
    const onClose = vi.fn();
    renderWithInflow(<InteractiveMenuHarness onCta={onCta} onSelect={onSelect} onClose={onClose} />);
    await user.tab();
    await user.keyboard('{Enter}{ArrowDown}{Enter} ');
    expect(onSelect).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    await user.keyboard('{ArrowDown}{Enter} ');
    expect(onSelect).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();

    await user.keyboard('{End}{Enter}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(onCta).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Open keyboard menu' })).toHaveFocus();
    await user.keyboard('{Enter}{End} ');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(onCta).toHaveBeenCalledTimes(2);
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('opens an all-locked upsell menu on its first option and reaches its CTA', async () => {
    const user = userEvent.setup();
    renderWithInflow(<InteractiveMenuHarness menuItems={[
      { id: 'projects', label: 'Projects', locked: true },
      { id: 'signals', label: 'Signals', locked: true },
    ]} />);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('menuitem', { name: 'Projects' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Signals' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Upgrade account' })).toHaveFocus();
  });

  it.each(['{Enter}', ' '])('selects an enabled item once with %s and restores trigger focus', async (key) => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onClose = vi.fn();
    renderWithInflow(<InteractiveMenuHarness onSelect={onSelect} onClose={onClose} />);
    await user.tab();
    await user.keyboard('{Enter}');
    await user.keyboard(key);
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('alpha');
    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Open keyboard menu' })).toHaveFocus();
  });

  it.each(['{Tab}', '{Shift>}{Tab}{/Shift}', '{Escape}'])('closes and restores trigger focus with %s', async (key) => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithInflow(<InteractiveMenuHarness onClose={onClose} />);
    await user.tab();
    await user.keyboard('{Enter}');
    await user.keyboard(key);
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Open keyboard menu' })).toHaveFocus();
  });

  it('does not activate a disabled CTA with Enter, Space or a click', async () => {
    const user = userEvent.setup();
    const onCta = vi.fn();
    const onClose = vi.fn();
    renderWithInflow(<InteractiveMenuHarness ctaDisabled onCta={onCta} onClose={onClose} />);
    await user.tab();
    await user.keyboard('{Enter}{End}');
    const cta = screen.getByRole('menuitem', { name: 'Upgrade account' });
    expect(cta).toHaveFocus();
    expect(cta).toHaveAttribute('aria-disabled', 'true');
    await user.keyboard('{Enter} ');
    fireEvent.click(cta);
    expect(onCta).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('keeps disabled items out of keyboard navigation in menus without locked options', async () => {
    const user = userEvent.setup();
    renderWithInflow(<InteractiveMenuHarness menuItems={keyboardItems.filter((item) => !item.locked)} ctaDisabled />);
    await user.tab();
    await user.keyboard('{Enter}{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Omega' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Omega' })).toHaveFocus();
  });

  it.each(['light', 'dark'] as const)('preserves the contained Button appearance of the %s CTA', (mode) => {
    renderWithInflow(
      <>
        <Button fullWidth variant="contained">Reference CTA</Button>
        <ThemedMenu anchorEl={document.body} open onClose={vi.fn()} items={[]} cta={{ label: 'Menu CTA', onClick: vi.fn() }} />
      </>,
      { providerProps: { mode } },
    );
    const reference = getComputedStyle(screen.getByText('Reference CTA'));
    const cta = getComputedStyle(screen.getByRole('menuitem', { name: 'Menu CTA' }));
    for (const property of ['backgroundColor', 'color', 'borderRadius', 'fontSize', 'fontWeight', 'lineHeight', 'fontFamily', 'textTransform', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'height', 'minHeight', 'minWidth', 'alignItems', 'justifyContent', 'boxShadow'] as const) {
      expect(cta[property], property).toBe(reference[property]);
    }
  });

  it('keeps MUI\'s 36px row height when not dense', () => {
    renderWithInflow(<MenuHarness />);

    expect(getComputedStyle(screen.getByRole('menuitem', { name: /Edit profile/ })).minHeight).toBe('36px');
  });

  it('reduces menu item minHeight when dense', () => {
    renderWithInflow(<MenuHarness dense />);

    expect(getComputedStyle(screen.getByRole('menuitem', { name: /Edit profile/ })).minHeight).toBe('32px');
  });

  it.each(['light', 'dark'] as const)('draws the %s menu as a raised surface with MUI\'s elevation shadow and rounded corners', (mode) => {
    renderWithInflow(<MenuHarness />, { providerProps: { mode } });

    const paper = screen.getByRole('menu').closest<HTMLElement>('.MuiPaper-root');
    expect(paper).not.toBeNull();
    const style = getComputedStyle(paper as HTMLElement);
    expect(style.boxShadow).not.toBe('none');
    // MUI 9 applies the Paper shadow through --paper-shadow, which jsdom cannot resolve; the value comes from the theme.
    expect(createInflowTheme(mode).shadows[8]).not.toBe('none');
    expect(style.borderRadius).toBe('5px');
  });

  it('draws no border on the light menu, and a 1px outline edge on the dark one', () => {
    const { unmount } = renderWithInflow(<MenuHarness />);
    const light = getComputedStyle(screen.getByRole('menu').closest('.MuiPaper-root') as HTMLElement);
    expect(light.borderTopStyle).toBe('none');
    unmount();

    renderWithInflow(<MenuHarness />, { providerProps: { mode: 'dark' } });
    const dark = getComputedStyle(screen.getByRole('menu').closest('.MuiPaper-root') as HTMLElement);
    const swatch = document.createElement('div');
    swatch.style.borderColor = darkTokens.outline;
    expect(dark.borderTopWidth).toBe('1px');
    expect(dark.borderTopColor).toBe(swatch.style.borderColor);
  });

  it('steps the dark menu up to a lighter surface than the page, since a shadow alone cannot show on dark', () => {
    renderWithInflow(<MenuHarness />, { providerProps: { mode: 'dark' } });

    const paper = screen.getByRole('menu').closest<HTMLElement>('.MuiPaper-root') as HTMLElement;
    const swatch = document.createElement('div');
    swatch.style.backgroundColor = darkTokens.surfaceContainer;
    expect(getComputedStyle(paper).backgroundColor).toBe(swatch.style.backgroundColor);
  });
});
