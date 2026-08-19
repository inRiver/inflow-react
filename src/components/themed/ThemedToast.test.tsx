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
    ['error', 'alert', 'error_outline'],
    ['warning', 'alert', 'warning_amber'],
    ['info', 'status', 'info_outline'],
    ['success', 'status', 'check_circle_outline'],
  ] as const)('renders the %s severity with the %s role, background, and outlined icon', (severity, role, icon) => {
    renderWithInflow(<ThemedToast severity={severity} message={`${severity} message`} />);

    const toast = screen.getByRole(role);
    expect(toast).toHaveTextContent(`${severity} message`);
    expect(getComputedStyle(toast).backgroundColor).toBe(toRgb(severityTokens[severity]));
    expect(screen.getByText(icon)).toHaveClass('material-icons-outlined');
  });

  it('renders a bold title', () => {
    renderWithInflow(<ThemedToast title="Important update" message="Details are available." />);

    expect(getComputedStyle(screen.getByText('Important update')).fontWeight).toBe('600');
    expect(getComputedStyle(screen.getByText('Important update').parentElement as HTMLElement).whiteSpace).toBe('nowrap');
  });

  it('uses the design-system inline banner layout', () => {
    renderWithInflow(<ThemedToast message="Layout message" />);

    const style = getComputedStyle(screen.getByRole('status'));
    expect(style.maxWidth).toBe('389px');
    expect(style.height).toBe('39px');
    expect(style.display).toBe('inline-flex');
    expect(style.borderRadius).toBe('5px');
  });

  it('renders an action button and invokes its callback', () => {
    const onClick = vi.fn();
    renderWithInflow(
      <ThemedToast message="Item archived." action={{ label: 'Undo', onClick }} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Undo' })).toHaveStyle({ textDecoration: 'underline' });
  });

  it('renders a dismiss button only when onClose is provided and invokes it', () => {
    const onClose = vi.fn();
    const { rerender } = renderWithInflow(<ThemedToast message="Closable message." />);

    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();

    rerender(<ThemedToast message="Closable message." onClose={onClose} />);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveStyle({ width: '24px', height: '24px' });
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
