import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { COMPONENT_CATEGORIES, getComponentLabel } from '../categories';
import { demoRegistry } from './registry';
import { TablePagePatternDemo } from './TablePagePatternDemo';

describe('TablePagePatternDemo', () => {
  it.each(['light', 'dark'] as const)('shows and filters the list, loading and empty states in %s mode', (mode) => {
    renderWithInflow(<TablePagePatternDemo />, { providerProps: { mode } });
    expect(screen.getByText('List view: data, loading and empty')).toBeInTheDocument();
    const table = () => screen.getByRole('table', { name: 'Publishers' });
    expect(within(table()).getByText('Northstar')).toBeInTheDocument();
    expect(within(table()).getByText('Riverside')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('switch', { name: 'Active only' }));
    expect(within(table()).queryByText('Riverside')).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Search publishers' }), { target: { value: 'absent' } });
    expect(screen.getByRole('status')).toHaveTextContent('No publishers match your filters.');
    fireEvent.click(screen.getByRole('switch', { name: 'Simulate loading' }));
    expect(screen.getByRole('status')).toHaveTextContent('Loading publishers...');
    fireEvent.click(screen.getByRole('switch', { name: 'Simulate loading' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(within(table()).getByText('Riverside')).toBeInTheDocument();
    expect(document.querySelector('pre')?.textContent).toContain("from '@inriver/inflow-react'");
    expect(document.querySelector('pre')?.textContent).not.toContain('../../components/themed');
  });

  it('registers labeled pattern demos under the visible Patterns category', () => {
    const ids = ['tablepagepattern', 'detailpagepattern', 'rightpanelpattern'];
    expect(COMPONENT_CATEGORIES.patterns.components).toEqual(ids);
    expect(COMPONENT_CATEGORIES.patterns.hidden).toBeUndefined();
    ids.forEach((id) => expect(demoRegistry[id]?.component).toBeDefined());
    expect(getComponentLabel(ids[0])).toBe('Table Page Pattern');
    expect(getComponentLabel(ids[1])).toBe('Detail Page Pattern');
    expect(getComponentLabel(ids[2])).toBe('Right Panel Pattern');
  });
});
