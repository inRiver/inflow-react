import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ThemedCard } from './ThemedCard';

describe('ThemedCard', () => {
  it('renders the title with the subtitle1 typography variant', () => {
    renderWithInflow(<ThemedCard title="Product details">Body</ThemedCard>);

    const title = screen.getByText('Product details');
    // CardHeader title slot is pinned to subtitle1 (ThemedCard applies it via slotProps).
    expect(title).toHaveClass('MuiTypography-subtitle1');
  });

  it('renders actions and body content', () => {
    renderWithInflow(
      <ThemedCard title="T" actions={<button type="button">Save</button>}>
        Content here
      </ThemedCard>,
    );

    expect(screen.getByText('Content here')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('omits the header when neither title nor subheader is provided', () => {
    const { container } = render(<ThemedCard>Only body</ThemedCard>);
    expect(container.querySelector('.MuiCardHeader-root')).toBeNull();
  });
});
