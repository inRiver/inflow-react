import { useState } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { inflowTheme } from '../../theme';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ThemedTabPanel, ThemedTabs, type ThemedTabItem } from './ThemedTabs';

const tabs: ThemedTabItem[] = [
  { label: 'Recent orders', id: 'orders-tab' },
  { label: 'Saved items', icon: 'bookmark' },
  { label: 'Account settings' },
  { label: 'Disabled tab', disabled: true },
];

describe('ThemedTabs', () => {
  it('renders the DS tab and panel accessibility contract with custom IDs, aria label, and styles', () => {
    renderWithInflow(
      <>
        <ThemedTabs tabs={tabs} ariaLabel="Orders navigation" style={{ marginTop: 12 }} />
        <ThemedTabPanel value={0} index={0} id="orders-tab" style={{ marginBottom: 8 }}>Orders panel</ThemedTabPanel>
      </>,
    );

    const tablist = screen.getByRole('tablist', { name: 'Orders navigation' });
    const tab = screen.getByRole('tab', { name: 'Recent orders' });
    const panel = screen.getByRole('tabpanel');

    expect(tablist).toHaveStyle({ marginTop: '12px' });
    expect(tab).toHaveAttribute('id', 'orders-tab');
    expect(tab).toHaveAttribute('aria-controls', 'orders-tab-panel');
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(panel).toHaveAttribute('id', 'orders-tab-panel');
    expect(panel).toHaveAttribute('aria-labelledby', 'orders-tab');
    expect(panel).toHaveStyle({ marginBottom: '8px' });
  });

  it('uses index-based uncontrolled selection and sends the event and index to onChange', () => {
    const onChange = vi.fn();
    renderWithInflow(<ThemedTabs tabs={tabs} onChange={onChange} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Saved items' }));

    expect(onChange).toHaveBeenCalledWith(expect.any(Object), 1);
    expect(screen.getByRole('tab', { name: 'Saved items' })).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps controlled index selection until the parent updates it', () => {
    const onChange = vi.fn();
    const { rerender } = renderWithInflow(<ThemedTabs tabs={tabs} value={0} onChange={onChange} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Saved items' }));
    expect(onChange).toHaveBeenCalledWith(expect.any(Object), 1);
    expect(screen.getByRole('tab', { name: 'Recent orders' })).toHaveAttribute('aria-selected', 'true');

    rerender(<ThemedTabs tabs={tabs} value={1} onChange={onChange} />);
    expect(screen.getByRole('tab', { name: 'Saved items' })).toHaveAttribute('aria-selected', 'true');
  });

  it('does not select disabled tabs', () => {
    const onChange = vi.fn();
    renderWithInflow(<ThemedTabs tabs={tabs} onChange={onChange} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Disabled tab' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('tab', { name: 'Recent orders' })).toHaveAttribute('aria-selected', 'true');
  });

  it('uses DS tab and panel chrome, including a full active background on hover', () => {
    renderWithInflow(
      <>
        <ThemedTabs tabs={tabs} />
        <ThemedTabPanel value={0} index={0}>Orders panel</ThemedTabPanel>
      </>,
    );
    const activeTab = screen.getByRole('tab', { name: 'Recent orders' });
    const panel = screen.getByRole('tabpanel');
    const probe = document.createElement('div');
    probe.style.backgroundColor = inflowTheme.palette.inflow.primaryTab;
    document.body.append(probe);

    fireEvent.mouseEnter(activeTab);
    expect(getComputedStyle(activeTab).backgroundColor).toBe(getComputedStyle(probe).backgroundColor);
    expect(activeTab).toHaveStyle({ flex: '1 1 0', minHeight: '26px' });
    expect(panel).toHaveStyle({ padding: '24px', borderTopWidth: '0px' });
    probe.remove();
  });

  it('applies the DS focus-visible outline', () => {
    renderWithInflow(<ThemedTabs tabs={tabs} />);
    const tab = screen.getByRole('tab', { name: 'Recent orders' });

    tab.focus();
    expect(tab).toHaveFocus();
  });

  it('supports automatic index-based arrow, Home, End, and Enter keyboard navigation', () => {
    function Example() {
      const [active, setActive] = useState(0);
      return <ThemedTabs tabs={tabs} value={active} onChange={(_, index) => setActive(index)} />;
    }

    renderWithInflow(<Example />);
    const orders = screen.getByRole('tab', { name: 'Recent orders' });
    const saved = screen.getByRole('tab', { name: 'Saved items' });
    const settings = screen.getByRole('tab', { name: 'Account settings' });

    orders.focus();
    fireEvent.keyDown(orders, { key: 'ArrowRight' });
    expect(saved).toHaveFocus();
    expect(saved).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(saved, { key: 'End' });
    expect(settings).toHaveFocus();
    expect(settings).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(settings, { key: 'Home' });
    expect(orders).toHaveFocus();
    expect(orders).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(orders, { key: 'Enter' });
    expect(orders).toHaveAttribute('aria-selected', 'true');
  });
});
