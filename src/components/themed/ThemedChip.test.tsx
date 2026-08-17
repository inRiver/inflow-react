import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { inflowTheme } from '../../theme';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ThemedChip } from './ThemedChip';

function getChip(label: string) {
  const chip = screen.getByText(label).closest<HTMLElement>('.MuiChip-root');
  if (!chip) throw new Error('Chip root was not rendered');
  return chip;
}

function toCssColor(color: string) {
  const element = document.createElement('span');
  element.style.color = color;
  document.body.appendChild(element);
  const resolvedColor = getComputedStyle(element).color;
  element.remove();
  return resolvedColor;
}

describe('ThemedChip', () => {
  it('keeps the existing default MUI chip behavior', () => {
    renderWithInflow(<ThemedChip label="Default" />);

    expect(getChip('Default')).toHaveClass('MuiChip-filled');
  });

  it('translates filled-primary to the primary filled chip tokens', () => {
    renderWithInflow(<ThemedChip label="Filled primary" variant="filled-primary" />);

    const chip = getChip('Filled primary');
    const style = getComputedStyle(chip);

    expect(style.backgroundColor).toBe(toCssColor(inflowTheme.palette.inflow.primaryTab));
    expect(style.color).toBe(toCssColor(inflowTheme.palette.primary.main));
    expect(style.borderTopWidth).toBe('0px');
  });

  it('translates outlined-primary to transparent primary outline tokens', () => {
    renderWithInflow(<ThemedChip label="Outlined primary" variant="outlined-primary" />);

    const chip = getChip('Outlined primary');
    const style = getComputedStyle(chip);

    expect(style.backgroundColor).toBe(toCssColor('transparent'));
    expect(style.color).toBe(toCssColor(inflowTheme.palette.primary.main));
    expect(style.borderTopWidth).toBe('1px');
    expect(style.borderTopColor).toBe(toCssColor(inflowTheme.palette.primary.main));
  });

  it.each([
    ['small', '24px'],
    ['medium', '32px'],
  ] as const)('uses the MUI %s chip height', (size, expectedHeight) => {
    renderWithInflow(<ThemedChip label={size} size={size} />);

    expect(getComputedStyle(getChip(size)).height).toBe(expectedHeight);
  });

  it.each([
    ['sm', '24px'],
    ['lg', '40px'],
  ] as const)('maps the Inflow %s size to a %s chip', (size, expectedHeight) => {
    renderWithInflow(<ThemedChip label={size} size={size} />);

    expect(getComputedStyle(getChip(size)).height).toBe(expectedHeight);
  });

  it('renders the requested Material Symbols leading icon', () => {
    renderWithInflow(<ThemedChip label="Add item" leadingIcon="add" />);

    const icon = screen.getByText('add');
    expect(icon).toHaveClass('material-icons-outlined');
  });
});
