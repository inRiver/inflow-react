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

    const chip = getChip('Default');

    expect(chip).toHaveClass('MuiChip-filled');
    expect(getComputedStyle(chip).backgroundColor).toBe(toCssColor(inflowTheme.palette.grey[300]));
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

    expect(style.backgroundColor).toBe(toCssColor(inflowTheme.palette.inflow.surfaceLowest));
    expect(style.color).toBe(toCssColor(inflowTheme.palette.primary.main));
    expect(style.borderTopWidth).toBe('1px');
    expect(style.borderTopColor).toBe(toCssColor(inflowTheme.palette.primary.main));
  });

  it('uses the design-system surface, text, and outline-icon tokens for outlined chips', () => {
    renderWithInflow(<ThemedChip label="Nike" variant="outlined" onDelete={() => undefined} />);

    const chip = getChip('Nike');
    const deleteIcon = screen.getByText('close');

    expect(getComputedStyle(chip).backgroundColor).toBe(
      toCssColor(inflowTheme.palette.inflow.surfaceLowest),
    );
    expect(getComputedStyle(chip).color).toBe(toCssColor(inflowTheme.palette.text.primary));
    expect(getComputedStyle(deleteIcon).color).toBe(toCssColor(inflowTheme.palette.inflow.outline));
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
    renderWithInflow(<ThemedChip label="Suggested" leadingIcon="auto_awesome" />);

    const chip = getChip('Suggested');
    const icon = screen.getByText('auto_awesome');
    const label = screen.getByText('Suggested');

    expect(icon).toHaveClass('material-icons-outlined');
    expect(getComputedStyle(chip).paddingLeft).toBe('12px');
    expect(getComputedStyle(chip).paddingRight).toBe('12px');
    expect(getComputedStyle(chip).gap).toBe('8px');
    expect(getComputedStyle(icon).marginLeft).toBe('0px');
    expect(getComputedStyle(icon).marginRight).toBe('0px');
    expect(getComputedStyle(label).paddingLeft).toBe('0px');
  });

  it('uses an outlined close icon for deletable chips', () => {
    renderWithInflow(<ThemedChip label="Deletable" onDelete={() => undefined} />);

    expect(screen.getByText('close')).toHaveClass('material-icons-outlined');
  });
});
