import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemedChatAccordion, type ThemedChatAccordionStep } from './ThemedChatAccordion';
import { renderWithInflow } from '../../test/renderWithInflow';

const steps: ThemedChatAccordionStep[] = [
  { id: '1', label: 'Tool used: Creating session' },
  { id: '2', label: 'Tool used: Loading file' },
  { id: '3', label: 'Extracting data', isActive: true },
];

describe('ThemedChatAccordion', () => {
  it('renders steps inline as a list while streaming', () => {
    renderWithInflow(<ThemedChatAccordion title="Reasoning" steps={steps} isStreaming />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('marks the active step and shows a decorative spinner', () => {
    renderWithInflow(<ThemedChatAccordion title="Reasoning" steps={steps} isStreaming />);

    const active = screen.getByText('Extracting data').closest('li');
    expect(active).toHaveAttribute('aria-current', 'step');
    const toolIcon = active?.querySelector('.material-icons-outlined');
    expect(toolIcon).toHaveTextContent('build');
    expect(toolIcon).toHaveAttribute('aria-hidden', 'true');
    expect(active?.querySelector('.MuiCircularProgress-root')).not.toBeNull();
    expect(active?.querySelector('.MuiCircularProgress-root')).toHaveAttribute('aria-hidden', 'true');
    expect(active?.lastElementChild).toHaveClass('MuiCircularProgress-root');

    const done = screen.getByText('Tool used: Creating session').closest('li');
    expect(done).not.toHaveAttribute('aria-current');
    expect(done?.querySelector('.MuiCircularProgress-root')).toBeNull();
  });

  it('uses only the latest active step as the current progress row', () => {
    renderWithInflow(
      <ThemedChatAccordion
        title="Reasoning"
        isStreaming
        steps={[
          { id: '1', label: 'Using tool: First', isActive: true },
          { id: '2', label: 'Using tool: Second', isActive: true },
        ]}
      />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(document.querySelectorAll("[aria-current='step']")).toHaveLength(1);
    expect(document.querySelector("[aria-current='step']")).toHaveTextContent('Using tool: Second');
    expect(document.querySelectorAll('.MuiCircularProgress-root')).toHaveLength(1);
  });

  it('collapses into an accordion labelled by title when not streaming', () => {
    renderWithInflow(<ThemedChatAccordion title="Reasoning" steps={steps} />);

    const summary = screen.getByRole('button', { name: 'Reasoning' });
    expect(summary).toHaveAttribute('aria-expanded', 'false');
    expect(summary).toHaveAttribute('aria-controls');
    expect(summary.closest('.MuiAccordion-root')).not.toHaveClass('MuiPaper-outlined');
    expect(screen.getByText('Tool used: Creating session')).not.toBeVisible();
  });

  it('toggles expansion and reports state through onChange', () => {
    const onChange = vi.fn();
    renderWithInflow(<ThemedChatAccordion title="Reasoning" steps={steps} onChange={onChange} />);

    const summary = screen.getByRole('button', { name: 'Reasoning' });
    fireEvent.click(summary);
    expect(summary).toHaveAttribute('aria-expanded', 'true');
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByText('Tool used: Creating session')).toBeInTheDocument();
  });

  it('supports controlled expansion', () => {
    const { rerender } = renderWithInflow(<ThemedChatAccordion title="Reasoning" steps={steps} expanded />);
    expect(screen.getByRole('button', { name: 'Reasoning' })).toHaveAttribute('aria-expanded', 'true');

    rerender(<ThemedChatAccordion title="Reasoning" steps={steps} expanded={false} />);
    expect(screen.getByRole('button', { name: 'Reasoning' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('starts collapsed after streaming ends (streaming -> completed remount)', () => {
    const { rerender } = renderWithInflow(<ThemedChatAccordion title="Reasoning" steps={steps} isStreaming />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(<ThemedChatAccordion title="Reasoning" steps={steps} isStreaming={false} />);
    expect(screen.getByRole('button', { name: 'Reasoning' })).toHaveAttribute('aria-expanded', 'false');
  });
});
