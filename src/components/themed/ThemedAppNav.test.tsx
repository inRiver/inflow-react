import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ThemedAppNav, ThemedAppNavPlaceholder, type ThemedAppNavItem } from './ThemedAppNav';

const items: ThemedAppNavItem[] = [
  { label: 'Products', icon: 'inventory_2', active: true },
  { label: 'Catalogs', icon: 'category' },
];

describe('ThemedAppNav', () => {
  it('renders every item with its icon and accessible label', () => {
    renderWithInflow(<ThemedAppNav items={items} />);

    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Catalogs' })).toBeInTheDocument();
    expect(screen.getByText('inventory_2')).toBeInTheDocument();
    expect(screen.getByText('category')).toBeInTheDocument();
  });

  it('highlights the active item with a white pill and current-page semantics', () => {
    renderWithInflow(<ThemedAppNav items={items} />);

    const activeItem = screen.getByRole('button', { name: 'Products' });
    const indicator = activeItem.querySelector('.ThemedAppNav-indicator');

    expect(activeItem).toHaveAttribute('aria-current', 'page');
    expect(indicator).not.toBeNull();
    expect(getComputedStyle(indicator!).backgroundColor).toBe('rgb(255, 255, 255)');
  });

  it('invokes an item callback and renders href items as links', () => {
    const onClick = vi.fn();
    renderWithInflow(
      <ThemedAppNav
        items={[
          { label: 'Products', icon: 'inventory_2', onClick },
          { label: 'Documentation', icon: 'help', href: '/help' },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Products' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', '/help');
  });

  it('pins footer items after the flexible primary-items section', () => {
    renderWithInflow(<ThemedAppNav items={items} footer={[{ label: 'Settings', icon: 'settings' }]} />);

    const navigation = screen.getByRole('navigation');
    const [primarySection, footerSection] = Array.from(navigation.children);
    expect(getComputedStyle(primarySection).flexGrow).toBe('1');
    expect(footerSection).toContainElement(screen.getByRole('button', { name: 'Settings' }));
  });

  it('renders a non-interactive placeholder skeleton', () => {
    renderWithInflow(<ThemedAppNavPlaceholder count={3} />);

    const navigation = screen.getByRole('navigation', { name: 'Primary' });
    expect(navigation.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
