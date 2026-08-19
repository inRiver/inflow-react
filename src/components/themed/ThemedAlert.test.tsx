import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ThemedAlert } from './ThemedAlert';

describe('ThemedAlert', () => {
  it.each([
    ['error', 'error_outline'],
    ['warning', 'warning_amber'],
    ['info', 'info_outline'],
    ['success', 'check_circle_outline'],
  ] as const)('renders the %s outlined icon', (severity, icon) => {
    renderWithInflow(<ThemedAlert severity={severity}>Alert message</ThemedAlert>);

    expect(screen.getByText(icon)).toHaveClass('material-icons-outlined');
  });

  it('renders its title with AlertTitle', () => {
    const { container } = renderWithInflow(
      <ThemedAlert title="Connection issue">Alert message</ThemedAlert>,
    );

    expect(screen.getByText('Connection issue')).toHaveClass('MuiAlertTitle-root');
    expect(container.querySelector('.MuiAlertTitle-root')).toBeInTheDocument();
    expect(getComputedStyle(screen.getByText('Connection issue')).display).toBe('inline');
    expect(getComputedStyle(container.querySelector('.MuiAlert-message') as HTMLElement).whiteSpace).toBe('nowrap');
  });

  it('renders children and exposes the alert role', () => {
    renderWithInflow(<ThemedAlert>Alert message</ThemedAlert>);

    expect(screen.getByText('Alert message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders a close button only with onClose and calls it when clicked', () => {
    const onClose = vi.fn();
    const { rerender } = renderWithInflow(<ThemedAlert>Alert message</ThemedAlert>);

    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();

    rerender(<ThemedAlert onClose={onClose}>Alert message</ThemedAlert>);
    fireEvent.click(screen.getByLabelText('Close'));

    expect(onClose).toHaveBeenCalledOnce();
  });
});
