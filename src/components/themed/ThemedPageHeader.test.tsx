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

  it('renders a named back button only when onBack is provided and invokes it', () => {
    const onBack = vi.fn();
    const { rerender } = renderWithInflow(<ThemedPageHeader title="Product" />);

    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();

    rerender(<ThemedPageHeader title="Product" onBack={onBack} />);
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));

    expect(onBack).toHaveBeenCalledOnce();
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
