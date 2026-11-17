import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ThemedPageHeader } from './ThemedPageHeader';

describe('ThemedPageHeader', () => {
  it('renders the eyebrow and title as a page heading', () => {
    renderWithInflow(<ThemedPageHeader eyebrow="Product information" title="Winter collection" />);

    expect(screen.getByText('Product information')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Winter collection' })).toBeInTheDocument();
  });

  it('renders breadcrumbs in place of the eyebrow', () => {
    renderWithInflow(
      <ThemedPageHeader
        eyebrow="Product information"
        breadcrumbs={<nav aria-label="Breadcrumb">Catalog</nav>}
        title="Winter collection"
      />,
    );

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.queryByText('Product information')).not.toBeInTheDocument();
  });

  it('renders a named back button only when onBack is provided and invokes it', () => {
    const onBack = vi.fn();
    const { rerender } = renderWithInflow(<ThemedPageHeader title="Product" />);

    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();

    rerender(<ThemedPageHeader title="Product" onBack={onBack} />);
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));

    expect(onBack).toHaveBeenCalledOnce();
  });

  it('renders the title with a non-h1 element when titleComponent is set', () => {
    renderWithInflow(<ThemedPageHeader title="Embedded surface" titleComponent="p" />);

    // Not a heading anymore; rendered as a paragraph so it can sit inside a card/region
    // without competing with the page's top-level heading.
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    const title = screen.getByText('Embedded surface');
    expect(title.tagName).toBe('P');
  });

  it('merges sx over the header defaults', () => {
    renderWithInflow(
      <ThemedPageHeader
        title="Compact"
        titleComponent="h2"
        sx={{ minHeight: 0, padding: 0 }}
      />,
    );

    const header = screen.getByRole('heading', { level: 2, name: 'Compact' }).closest('div')!;
    // The default padding is spacing(1.25, 3); the sx override must win (jsdom reports '0').
    expect(getComputedStyle(header).padding).toBe('0');
  });

  it('renders each action as a button and invokes its callback', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    renderWithInflow(
      <ThemedPageHeader
        actions={[
          { label: 'Cancel', onClick: onCancel },
          { label: 'Save', variant: 'filled', onClick: onSave },
        ]}
        title="Product"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onSave).toHaveBeenCalledOnce();
  });
});
