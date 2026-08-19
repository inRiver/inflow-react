import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ThemedBreadcrumbs } from './ThemedBreadcrumbs';
import type { ThemedBreadcrumbItem } from './ThemedBreadcrumbs';

const items: ThemedBreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Catalog', href: '/catalog', icon: 'category' },
  { label: 'Accessories' },
];

describe('ThemedBreadcrumbs', () => {
  it('renders all items in order', () => {
    renderWithInflow(<ThemedBreadcrumbs items={items} />);

    const breadcrumbText = screen.getByRole('navigation', { name: 'breadcrumb' }).textContent ?? '';
    expect(breadcrumbText.indexOf('Home')).toBeLessThan(breadcrumbText.indexOf('Catalog'));
    expect(breadcrumbText.indexOf('Catalog')).toBeLessThan(breadcrumbText.indexOf('Accessories'));
  });

  it.each([
    ['bar', '|'],
    ['chevron', 'chevron_right'],
    ['slash', '/'],
  ] as const)('renders the %s separator', (separator, expected) => {
    renderWithInflow(<ThemedBreadcrumbs items={items} separator={separator} />);

    expect(screen.getAllByText(expected).length).toBeGreaterThan(0);
  });

  it('uses vertical bars by default', () => {
    renderWithInflow(<ThemedBreadcrumbs items={items} />);

    expect(screen.getAllByText('|')).toHaveLength(items.length - 1);
  });

  it('marks the last item as the current non-link page', () => {
    renderWithInflow(<ThemedBreadcrumbs items={items} />);

    const currentPage = screen.getByText('Accessories');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
    expect(currentPage.closest('a')).toBeNull();
  });

  it('renders intermediate items as clickable links', () => {
    const onClick = vi.fn();
    renderWithInflow(
      <ThemedBreadcrumbs items={[{ label: 'Home', href: '/', onClick }, ...items.slice(1)]} />,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Home' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('collapses items into an ellipsis button and expands them on click', () => {
    const longItems: ThemedBreadcrumbItem[] = [
      { label: 'Home', href: '/' },
      { label: 'Catalog', href: '/catalog' },
      { label: 'Accessories', href: '/accessories' },
      { label: 'Audio', href: '/audio' },
      { label: 'Headphones' },
    ];
    renderWithInflow(<ThemedBreadcrumbs items={longItems} maxItems={3} />);

    expect(screen.getByRole('button', { name: 'Show all breadcrumbs' })).toBeInTheDocument();
    expect(screen.queryByText('Catalog')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Show all breadcrumbs' }));
    expect(screen.getByText('Catalog')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Show all breadcrumbs' })).not.toBeInTheDocument();
  });

  it('provides breadcrumb navigation semantics', () => {
    renderWithInflow(<ThemedBreadcrumbs items={items} />);

    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
    expect(screen.getByText('Accessories')).toHaveAttribute('aria-current', 'page');
  });
});
