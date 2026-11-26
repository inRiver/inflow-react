import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { createInflowTheme } from '../../theme/inflow';
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

  it.each(['light', 'dark'] as const)('renders and invokes action variants in %s mode', (mode) => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    const onOther = vi.fn();
    const theme = createInflowTheme(mode);
    renderWithInflow(
      <ThemedPageHeader
        actions={[
          { label: 'Cancel', onClick: onCancel },
          { label: 'Other', variant: 'outlined', onClick: onOther },
          { label: 'Save', variant: 'filled', onClick: onSave },
        ]}
        title="Product"
      />,
      { providerProps: { mode } },
    );

    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const other = screen.getByRole('button', { name: 'Other' });
    const save = screen.getByRole('button', { name: 'Save' });
    expect(cancel).toHaveClass('MuiButton-outlined');
    expect(other).toHaveClass('MuiButton-outlined');
    expect(save).toHaveClass('MuiButton-contained');

    // Normalize palette hex colors to the same CSS representation as getComputedStyle.
    const color = (value: string) => {
      const swatch = document.createElement('span');
      swatch.style.color = value;
      return swatch.style.color;
    };
    for (const outlined of [cancel, other]) {
      expect(getComputedStyle(outlined).backgroundColor).toBe(color(theme.palette.background.paper));
      expect(getComputedStyle(outlined).color).toBe(color(theme.palette.primary.main));
      expect(getComputedStyle(outlined).borderRadius).toBe(`${theme.shape.borderRadius}px`);
      // jsdom cannot activate :hover, so inspect the generated rule for this button.
      const hoverRules = Array.from(document.querySelectorAll('style'))
        .flatMap((sheet) => Array.from(sheet.sheet?.cssRules ?? []))
        .map((rule) => rule.cssText)
        .filter((rule) => rule.includes(':hover') && Array.from(outlined.classList).some((name) => rule.includes(`.${name}:hover`)));
      expect(hoverRules.at(-1)).toContain(`background-color: ${color(theme.palette.background.paper)}`);
    }
    expect(getComputedStyle(save).backgroundColor).toBe(color(theme.palette.primary.main));
    expect(getComputedStyle(save).color).toBe(color(theme.palette.primary.contrastText));

    fireEvent.click(cancel);
    fireEvent.click(other);
    fireEvent.click(save);
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onOther).toHaveBeenCalledOnce();
    expect(onSave).toHaveBeenCalledOnce();
  });
});
