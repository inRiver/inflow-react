import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { inflowTheme } from '../../theme';
import { ThemedTable } from './ThemedTable';

function toRgb(color: string) {
  const element = document.createElement('span');
  element.style.color = color;
  document.body.appendChild(element);
  const rgb = getComputedStyle(element).color;
  element.remove();
  return rgb;
}

describe('ThemedTable', () => {
  it('matches the AG Grid header and row geometry tokens', () => {
    renderWithInflow(
      <ThemedTable
        columns={[{ id: 'dessert', label: 'Dessert' }, { id: 'calories', label: 'Calories' }]}
        data={[{ dessert: 'Frozen yoghurt', calories: 159 }]}
      />,
    );

    const header = screen.getByRole('columnheader', { name: 'Dessert' });
    const row = screen.getByRole('row', { name: /Frozen yoghurt 159/ });
    const cell = screen.getByRole('cell', { name: 'Frozen yoghurt' });

    expect(getComputedStyle(header).backgroundColor).toBe(toRgb(inflowTheme.palette.background.paper));
    expect(getComputedStyle(header).height).toBe('48px');
    expect(getComputedStyle(row).height).toBe('52px');
    expect(getComputedStyle(cell).color).toBe(toRgb(inflowTheme.palette.text.secondary));
  });

  it('supports selectable rows and container-level styling', async () => {
    const user = userEvent.setup();
    let selected = false;
    const { rerender } = renderWithInflow(
      <ThemedTable
        columns={[{ id: 'name', label: 'Name' }]}
        data={[{ name: 'Selectable row' }]}
        containerSx={{ borderRadius: 0 }}
        isRowSelected={() => selected}
        onRowClick={() => {
          selected = !selected;
        }}
      />,
    );

    await user.click(screen.getByRole('row', { name: 'Selectable row' }));
    rerender(
      <ThemedTable
        columns={[{ id: 'name', label: 'Name' }]}
        data={[{ name: 'Selectable row' }]}
        containerSx={{ borderRadius: 0 }}
        isRowSelected={() => selected}
      />,
    );

    expect(screen.getByRole('row', { name: 'Selectable row' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('table').parentElement).toHaveStyle({ borderRadius: '0' });
  });
});
