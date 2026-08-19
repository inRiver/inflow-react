import { screen } from '@testing-library/react';
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

    expect(getComputedStyle(header).backgroundColor).toBe(toRgb(inflowTheme.palette.inflow.surfaceHighest));
    expect(getComputedStyle(header).height).toBe('48px');
    expect(getComputedStyle(row).height).toBe('52px');
    expect(getComputedStyle(cell).color).toBe(toRgb(inflowTheme.palette.text.secondary));
  });
});
