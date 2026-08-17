import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { inflowTheme } from '../../theme';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ThemedToast, type ThemedToastSeverity } from './ThemedToast';

function toRgb(color: string) {
  const element = document.createElement('span');
  element.style.color = color;
  document.body.appendChild(element);
  const rgb = getComputedStyle(element).color;
  element.remove();
  return rgb;
}

const severityTokens: Record<ThemedToastSeverity, string> = {
  error: inflowTheme.palette.inflow.highlightRed,
  info: inflowTheme.palette.inflow.toastInfoBg,
  success: inflowTheme.palette.inflow.highlightGreen,
  warning: inflowTheme.palette.inflow.highlightYellow,
};

describe('ThemedToast', () => {
  it.each([
    ['error', 'alert'],
    ['warning', 'alert'],
    ['info', 'status'],
    ['success', 'status'],
  ] as const)('renders the %s severity with the %s role and mapped background', (severity, role) => {
    renderWithInflow(<ThemedToast severity={severity} message={`${severity} message`} />);

    const toast = screen.getByRole(role);
    expect(toast).toHaveTextContent(`${severity} message`);
    expect(getComputedStyle(toast).backgroundColor).toBe(toRgb(severityTokens[severity]));
  });

  it('renders a bold title', () => {
    renderWithInflow(<ThemedToast title="Important update" message="Details are available." />);

    expect(getComputedStyle(screen.getByText('Important update')).fontWeight).toBe('600');
  });

  it('uses the design-system inline banner layout', () => {
    renderWithInflow(<ThemedToast message="Layout message" />);

    const style = getComputedStyle(screen.getByRole('status'));
    expect(style.maxWidth).toBe('560px');
    expect(style.minHeight).toBe('48px');
    expect(style.display).toBe('inline-flex');
  });

  it('renders an action button and invokes its callback', () => {
    const onClick = vi.fn();
    renderWithInflow(
      <ThemedToast message="Item archived." action={{ label: 'Undo', onClick }} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders a dismiss button only when onClose is provided and invokes it', () => {
    const onClose = vi.fn();
    const { rerender } = renderWithInflow(<ThemedToast message="Closable message." />);

    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();

    rerender(<ThemedToast message="Closable message." onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
