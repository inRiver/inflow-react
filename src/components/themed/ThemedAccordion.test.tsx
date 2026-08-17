import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemedAccordion, type ThemedAccordionItem } from './ThemedAccordion';
import { renderWithInflow } from '../../test/renderWithInflow';

const items: ThemedAccordionItem[] = [
  { id: 'account', summary: 'Account settings', details: 'Account details' },
  { id: 'security', summary: 'Security settings', details: 'Security details' },
  { id: 'disabled', summary: 'Disabled settings', details: 'Disabled details', disabled: true },
];

describe('ThemedAccordion', () => {
  it('renders all items and exposes summary accessibility attributes', () => {
    renderWithInflow(<ThemedAccordion items={items} />);

    for (const name of ['Account settings', 'Security settings', 'Disabled settings']) {
      const summary = screen.getByRole('button', { name });
      expect(summary).toHaveAttribute('aria-expanded', 'false');
      expect(summary).toHaveAttribute('aria-controls');
    }
  });

  it('toggles an uncontrolled panel and reports its expanded state', () => {
    const onChange = vi.fn();
    renderWithInflow(<ThemedAccordion items={items} onChange={onChange} />);

    const summary = screen.getByRole('button', { name: 'Account settings' });
    fireEvent.click(summary);
    expect(summary).toHaveAttribute('aria-expanded', 'true');
    expect(onChange).toHaveBeenLastCalledWith('account', true);

    fireEvent.click(summary);
    expect(summary).toHaveAttribute('aria-expanded', 'false');
    expect(onChange).toHaveBeenLastCalledWith('account', false);
  });

  it('supports controlled single and multiple expanded values', () => {
    const { rerender } = renderWithInflow(<ThemedAccordion items={items} expanded="account" />);

    expect(screen.getByRole('button', { name: 'Account settings' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Security settings' })).toHaveAttribute('aria-expanded', 'false');

    rerender(<ThemedAccordion items={items} expanded={['account', 'security']} multiple />);

    expect(screen.getByRole('button', { name: 'Account settings' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Security settings' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps summary spacing uniform when an item is expanded', () => {
    const { rerender } = renderWithInflow(<ThemedAccordion items={items} expanded={undefined} />);
    const collapsedSummary = screen.getByRole('button', { name: 'Account settings' });
    const collapsedContent = collapsedSummary.querySelector<HTMLElement>('.MuiAccordionSummary-content');

    expect(getComputedStyle(collapsedSummary).minHeight).toBe('48px');
    expect(collapsedContent).not.toBeNull();
    expect(getComputedStyle(collapsedContent!).margin).toBe('14px 0px');

    rerender(<ThemedAccordion items={items} expanded="account" />);

    const expandedSummary = screen.getByRole('button', { name: 'Account settings' });
    const expandedContent = expandedSummary.querySelector<HTMLElement>('.MuiAccordionSummary-content');

    expect(getComputedStyle(expandedSummary).minHeight).toBe('48px');
    expect(expandedContent).not.toBeNull();
    expect(getComputedStyle(expandedContent!).margin).toBe('14px 0px');
  });

  it('gives expanded details 16px of top padding', () => {
    renderWithInflow(<ThemedAccordion items={items} expanded="account" />);

    expect(getComputedStyle(screen.getByText('Account details')).paddingTop).toBe('16px');
  });

  it('does not toggle a disabled item', () => {
    const onChange = vi.fn();
    renderWithInflow(<ThemedAccordion items={items} onChange={onChange} />);

    const summary = screen.getByRole('button', { name: 'Disabled settings' });
    fireEvent.click(summary);

    expect(summary).toHaveAttribute('aria-expanded', 'false');
    expect(onChange).not.toHaveBeenCalled();
  });
});
