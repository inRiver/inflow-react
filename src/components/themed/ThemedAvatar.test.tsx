import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import {
  ThemedAvatar,
  ThemedAvatarGroup,
} from './ThemedAvatar';

function getRoot(container: HTMLElement): HTMLElement {
  const root = container.querySelector<HTMLElement>('[data-inflow-root] > div');
  if (!root) throw new Error('ThemedAvatar root was not rendered.');
  return root;
}

describe('ThemedAvatar', () => {
  it.each([
    [40, '40px'],
    [32, '32px'],
    [24, '24px'],
    [18, '18px'],
  ] as const)('renders size %i at %s square dimensions', (size, expectedDimension) => {
    const { container } = renderWithInflow(<ThemedAvatar size={size}>IR</ThemedAvatar>);
    const style = getComputedStyle(getRoot(container));

    expect(style.width).toBe(expectedDimension);
    expect(style.height).toBe(expectedDimension);
  });

  it.each([
    ['circular', '100px'],
    ['rounded', '5px'],
    ['square', '0px'],
  ] as const)('applies the %s shape radius', (shape, expectedRadius) => {
    const { container } = renderWithInflow(<ThemedAvatar shape={shape}>IR</ThemedAvatar>);

    expect(getComputedStyle(getRoot(container)).borderRadius).toBe(expectedRadius);
  });

  it('renders an image with its alt text when src is provided', () => {
    renderWithInflow(<ThemedAvatar src="/portrait.png" alt="Ada Lovelace">AL</ThemedAvatar>);

    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveAttribute('src', '/portrait.png');
    expect(screen.queryByText('AL')).not.toBeInTheDocument();
  });

  it('renders initials when no src is provided', () => {
    renderWithInflow(<ThemedAvatar>IR</ThemedAvatar>);

    expect(screen.getByText('IR')).toBeInTheDocument();
  });

  it('renders the status dot when badge is enabled', () => {
    const { container } = renderWithInflow(<ThemedAvatar badge>IR</ThemedAvatar>);
    const avatar = getRoot(container);
    const badge = avatar.lastElementChild;

    if (!(badge instanceof HTMLSpanElement)) throw new Error('Status badge was not rendered.');
    expect(getComputedStyle(badge).width).toBe('10px');
    expect(getComputedStyle(badge).height).toBe('10px');
  });
});

describe('ThemedAvatarGroup', () => {
  it('clamps visible avatars and renders the overflow count when max is exceeded', () => {
    renderWithInflow(
      <ThemedAvatarGroup max={2} size={32}>
        <ThemedAvatar key="a">AA</ThemedAvatar>
        <ThemedAvatar key="b">BB</ThemedAvatar>
        <ThemedAvatar key="c">CC</ThemedAvatar>
        <ThemedAvatar key="d">DD</ThemedAvatar>
      </ThemedAvatarGroup>,
    );

    expect(screen.getByText('AA')).toBeInTheDocument();
    expect(screen.getByText('BB')).toBeInTheDocument();
    expect(screen.queryByText('CC')).not.toBeInTheDocument();
    expect(screen.queryByText('DD')).not.toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('stacks visible avatars with paper rings', () => {
    const { container } = renderWithInflow(
      <ThemedAvatarGroup>
        <ThemedAvatar>AA</ThemedAvatar>
        <ThemedAvatar>BB</ThemedAvatar>
      </ThemedAvatarGroup>,
    );
    const group = getRoot(container);
    const [firstWrapper, lastWrapper] = Array.from(group.children) as HTMLElement[];

    expect(Number(getComputedStyle(firstWrapper).zIndex)).toBeGreaterThan(
      Number(getComputedStyle(lastWrapper).zIndex),
    );
    expect(getComputedStyle(firstWrapper).borderTopWidth).toBe('2px');
    expect(getComputedStyle(lastWrapper).borderTopWidth).toBe('2px');
  });
});
