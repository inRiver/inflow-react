import { createRef } from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { inflowTheme } from '../../theme';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ThemedBadge } from './ThemedBadge';

function getBadge(container: HTMLElement) {
  const badge = container.querySelector<HTMLElement>('.MuiBadge-badge');
  if (!badge) throw new Error('Badge indicator was not rendered');
  return badge;
}

function toRgb(color: string) {
  const element = document.createElement('span');
  element.style.color = color;
  document.body.appendChild(element);
  const rgb = getComputedStyle(element).color;
  element.remove();
  return rgb;
}

describe('ThemedBadge', () => {
  it('renders badge content', () => {
    renderWithInflow(
      <ThemedBadge badgeContent={4}>
        <span>Inbox</span>
      </ThemedBadge>,
    );

    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('clamps counts above max using the MUI max suffix', () => {
    renderWithInflow(
      <ThemedBadge badgeContent={120} max={99}>
        <span>Inbox</span>
      </ThemedBadge>,
    );

    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('renders a dot without badge text', () => {
    const { container } = renderWithInflow(
      <ThemedBadge variant="dot" badgeContent={4}>
        <span>Inbox</span>
      </ThemedBadge>,
    );

    expect(getBadge(container)).toHaveClass('MuiBadge-dot');
    expect(screen.queryByText('4')).not.toBeInTheDocument();
  });

  it('forces the design-system badge and dot geometry', () => {
    const { container, rerender } = renderWithInflow(
      <ThemedBadge badgeContent={4}>
        <span>Inbox</span>
      </ThemedBadge>,
    );

    let style = getComputedStyle(getBadge(container));
    expect(style.minWidth).toBe('16px');
    expect(style.height).toBe('16px');
    expect(style.borderRadius).toBe('8px');

    rerender(
      <ThemedBadge variant="dot" badgeContent={4}>
        <span>Inbox</span>
      </ThemedBadge>,
    );

    style = getComputedStyle(getBadge(container));
    expect(style.minWidth).toBe('8px');
    expect(style.height).toBe('8px');
    expect(style.borderRadius).toBe('4px');
  });

  it.each(['error', 'primary', 'success'] as const)(
    'uses the mapped %s palette color',
    (color) => {
      const { container } = renderWithInflow(
        <ThemedBadge color={color} badgeContent={4}>
          <span>Inbox</span>
        </ThemedBadge>,
      );

      expect(getComputedStyle(getBadge(container)).backgroundColor).toBe(
        toRgb(inflowTheme.palette[color].main),
      );
    },
  );

  it('forwards its ref to the badge root', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = renderWithInflow(
      <ThemedBadge ref={ref} badgeContent={4}>
        <span>Inbox</span>
      </ThemedBadge>,
    );

    expect(ref.current).toBe(container.querySelector('.MuiBadge-root'));
  });
});
