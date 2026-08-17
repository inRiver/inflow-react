import { Button, Switch } from '@mui/material';
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ThemedDetailPanel, ThemedDetailPanelSection } from './ThemedDetailPanel';
import { ThemedRightPanel } from './ThemedRightPanel';

describe('ThemedDetailPanel', () => {
  it('renders its title as an h6 and its children in the panel body', () => {
    renderWithInflow(
      <ThemedDetailPanel title="Edit product">
        <span>Product details</span>
      </ThemedDetailPanel>,
    );

    expect(screen.getByRole('heading', { level: 6, name: 'Edit product' })).toBeInTheDocument();
    expect(screen.getByText('Product details')).toBeInTheDocument();
  });

  it('calls onClose from its accessible close button', () => {
    const onClose = vi.fn();
    renderWithInflow(<ThemedDetailPanel title="Edit product" onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close detail panel' }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('omits the close button when onClose is not provided', () => {
    renderWithInflow(<ThemedDetailPanel title="Edit product" />);

    expect(screen.queryByRole('button', { name: 'Close detail panel' })).not.toBeInTheDocument();
  });

  it('renders footer actions only when actions are provided', () => {
    const { rerender } = renderWithInflow(<ThemedDetailPanel title="Edit product" />);

    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();

    rerender(
      <ThemedDetailPanel title="Edit product" actions={<Button>Save</Button>} />,
    );

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});

describe('ThemedDetailPanelSection', () => {
  it('renders the title, header action, and children', () => {
    renderWithInflow(
      <ThemedDetailPanelSection title="Publication" headerAction={<Switch slotProps={{ input: { 'aria-label': 'Publish product' } }} />}>
        <span>Publication details</span>
      </ThemedDetailPanelSection>,
    );

    expect(screen.getByText('Publication')).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Publish product' })).toBeInTheDocument();
    expect(screen.getByText('Publication details')).toBeInTheDocument();
  });

  it('omits the header row when title and headerAction are not provided', () => {
    renderWithInflow(
      <ThemedDetailPanelSection title={undefined}>
        <span>Section content</span>
      </ThemedDetailPanelSection>,
    );

    const content = screen.getByText('Section content');
    expect(content).toBeInTheDocument();
    expect(content.parentElement?.childElementCount).toBe(1);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});

describe('ThemedDetailPanel composed in ThemedRightPanel', () => {
  it('renders inside the panel with exactly one close control owned by the detail panel', () => {
    const onClose = vi.fn();
    renderWithInflow(
      <ThemedRightPanel open mode="overlay" onClose={onClose}>
        <ThemedDetailPanel title="Edit product" onClose={onClose}>
          <ThemedDetailPanelSection title="Details">
            <span>Body</span>
          </ThemedDetailPanelSection>
        </ThemedDetailPanel>
      </ThemedRightPanel>,
    );

    expect(screen.getByRole('heading', { level: 6, name: 'Edit product' })).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    // RightPanel owns no close button; the only close control is the DetailPanel's.
    const closeButtons = screen
      .getAllByRole('button')
      .filter((el) => /close/i.test(el.getAttribute('aria-label') ?? el.textContent ?? ''));
    expect(closeButtons).toHaveLength(1);
  });
});
