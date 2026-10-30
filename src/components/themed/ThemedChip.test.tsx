import { screen } from '@testing-library/react';
import { Chip } from '@mui/material';
import { describe, expect, it } from 'vitest';
import { createInflowTheme, inflowTheme } from '../../theme';
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

// jsdom cannot simulate :hover, so read the :hover rule the styles generate for this chip.
function hoverBackgrounds(chip: HTMLElement): string[] {
  const classes = Array.from(chip.classList).map((name) => `.${name}`);
  const found: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    for (const rule of Array.from(sheet.cssRules)) {
      const { selectorText, style } = rule as CSSStyleRule;
      if (!selectorText?.includes(':hover') || !style?.backgroundColor) continue;
      if (selectorText.split(',').some((part) => classes.some((c) => part.includes(c)) && part.trim().endsWith(':hover'))) {
        found.push(style.backgroundColor);
      }
    }
  }
  return found;
}

const isGrey = (color: string) => {
  const [r, g, b] = (color.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
  return Math.max(r, g, b) - Math.min(r, g, b) < 12;
};

describe('ThemedChip hover color', () => {
  describe.each(['light', 'dark'] as const)('in %s mode', (mode) => {
    const inflow = () => createInflowTheme(mode).palette.inflow;

    it('tints a default filled chip toward the brand blue, not grey', () => {
      renderWithInflow(<ThemedChip label="Default" onClick={() => undefined} />, { providerProps: { mode } });

      const expected = toCssColor(mode === 'dark' ? inflow().primaryFixed : inflow().primaryTab);
      expect(hoverBackgrounds(getChip('Default'))).toContain(expected);
      expect(isGrey(expected)).toBe(false);
    });

    it('tints a default outlined chip with the pale blue row hover, not grey', () => {
      renderWithInflow(<ThemedChip label="Outlined" variant="outlined" onClick={() => undefined} />, { providerProps: { mode } });

      expect(hoverBackgrounds(getChip('Outlined'))).toContain(toCssColor(inflow().rowHover));
    });
  });
});

describe('MUI Chip hover color (theme override)', () => {
  describe.each(['light', 'dark'] as const)('in %s mode', (mode) => {
    it.each([
      ['filled', 'Plain filled'],
      ['outlined', 'Plain outlined'],
    ] as const)('tints a clickable default %s chip toward blue, not grey', (variant, label) => {
      renderWithInflow(<Chip label={label} variant={variant} onClick={() => undefined} />, { providerProps: { mode } });

      const inflow = createInflowTheme(mode).palette.inflow;
      const expected = variant === 'outlined' ? inflow.rowHover : mode === 'dark' ? inflow.primaryFixed : inflow.primaryTab;
      expect(hoverBackgrounds(getChip(label))).toContain(toCssColor(expected));
    });
  });
});

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

  it('uses the design-system surface and text tokens for outlined chips, with the delete icon matching the text', () => {
    renderWithInflow(<ThemedChip label="Nike" variant="outlined" onDelete={() => undefined} />);

    const chip = getChip('Nike');
    const deleteIcon = screen.getByText('close');

    expect(getComputedStyle(chip).backgroundColor).toBe(
      toCssColor(inflowTheme.palette.inflow.surfaceLowest),
    );
    expect(getComputedStyle(chip).color).toBe(toCssColor(inflowTheme.palette.text.primary));
    expect(getComputedStyle(deleteIcon).color).toBe(getComputedStyle(chip).color);
  });

  describe.each(['light', 'dark'] as const)('delete icon in %s mode', (mode) => {
    it.each([
      ['default', undefined, 'filled'],
      ['outlined', undefined, 'outlined'],
      ['primary', 'primary', 'filled'],
      ['error', 'error', 'filled'],
      ['success', 'success', 'filled'],
    ] as const)('matches the text color of the %s chip at full opacity', (label, color, variant) => {
      renderWithInflow(
        <ThemedChip label={label} color={color} variant={variant} onDelete={() => undefined} />,
        { providerProps: { mode } },
      );

      const deleteIcon = screen.getByText('close');
      expect(getComputedStyle(deleteIcon).color).toBe(getComputedStyle(getChip(label)).color);
      expect(getComputedStyle(deleteIcon).opacity).toBe('1');
    });
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
