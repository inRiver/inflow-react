import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { AppBar, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Toolbar } from '@mui/material';
import { ThemedButton } from '../components/themed/ThemedButton';
import { ThemedCard } from '../components/themed/ThemedCard';
import { ThemedDialog } from '../components/themed/ThemedDialog';
import { ThemedTextField } from '../components/themed/ThemedTextField';
import { darkTokens, lightTokens } from './inflow-tokens';
import { createInflowTheme } from './inflow';
import { INFLOW_DARK_MODE_ENABLED } from './featureFlags';

// Renders the themed components in light and dark mode and checks what the browser actually resolves, not just the
// tokens. Needs the dark flag on (it is on under Vitest, as in dev).
type Rgba = [number, number, number, number];

const parse = (css: string): Rgba => {
  const hex = css.match(/^#([0-9a-f]{6})$/i);
  if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16)).concat(1) as Rgba;
  const rgb = css.match(/rgba?\(([^)]+)\)/);
  if (!rgb) throw new Error(`Cannot parse color: ${css}`);
  const [r, g, b, a = 1] = rgb[1].split(/[,/ ]+/).filter(Boolean).map(Number);
  return [r, g, b, a];
};
// Source-over compositing of a translucent color on an opaque one.
const over = (top: string, bottom: string): Rgba => {
  const [tr, tg, tb, ta] = parse(top);
  const [br, bg, bb] = parse(bottom);
  return [tr * ta + br * (1 - ta), tg * ta + bg * (1 - ta), tb * ta + bb * (1 - ta), 1];
};
const channel = (v: number) => ((v / 255) <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4);
const luminance = ([r, g, b]: Rgba) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
const ratio = (a: Rgba, b: Rgba) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const style = (el: Element) => getComputedStyle(el);

describe.each([
  ['light', lightTokens],
  ['dark', darkTokens],
] as const)('%s mode render', (mode, D) => {
  const solid = (css: string) => over(css, D.surfaceLowest);
  const dark = { providerProps: { mode } };

  it('has the dark flag on, otherwise the rest of this file proves nothing', () => {
    expect(INFLOW_DARK_MODE_ENABLED).toBe(true);
  });

  it('tells the browser which color scheme to draw native controls and scrollbars in', () => {
    const { container } = renderWithInflow(<div>content</div>, dark);
    expect(style(container.querySelector('[data-inflow-root]')!).colorScheme).toBe(mode);
  });

  describe('ThemedButton', () => {
    it('keeps the filled primary label readable on its fill', () => {
      renderWithInflow(<ThemedButton variant="contained">Save</ThemedButton>, dark);
      const button = screen.getByRole('button', { name: 'Save' });
      expect(parse(style(button).backgroundColor)).toEqual(parse(D.navy700));
      expect(ratio(solid(style(button).color), solid(style(button).backgroundColor))).toBeGreaterThanOrEqual(4.5);
    });

    it('keeps text and outlined primary buttons readable on paper', () => {
      renderWithInflow(
        <>
          <ThemedButton variant="text">Text</ThemedButton>
          <ThemedButton variant="outlined">Outlined</ThemedButton>
        </>,
        dark,
      );
      for (const name of ['Text', 'Outlined']) {
        expect(ratio(solid(style(screen.getByRole('button', { name })).color), parse(D.surfaceLowest))).toBeGreaterThanOrEqual(4.5);
      }
    });

    it('keeps the secondary accent, which text and outlined secondary buttons use, readable on paper', () => {
      // jsdom cannot resolve MUI's per-variant CSS variables, so read the palette the variants take it from.
      expect(ratio(parse(createInflowTheme(mode).palette.secondary.main), parse(D.surfaceLowest))).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('IconButton', () => {
    it('keeps the default icon button grey, from the theme', () => {
      renderWithInflow(<IconButton aria-label="plain">x</IconButton>, dark);
      expect(parse(style(screen.getByLabelText('plain')).color)).toEqual(parse(D.onSurfaceVariant));
    });

    it.each(['primary', 'secondary', 'error'] as const)('lets a %s icon button use its palette color', (color) => {
      renderWithInflow(<IconButton color={color} aria-label={color}>x</IconButton>, dark);
      const expected = document.createElement('div');
      expected.style.color = createInflowTheme(mode).palette[color].main;
      expect(style(screen.getByLabelText(color)).color).toBe(expected.style.color);
    });

    it('keeps primary and error icon buttons distinct from the default grey', () => {
      renderWithInflow(
        <>
          <IconButton aria-label="plain">x</IconButton>
          <IconButton color="primary" aria-label="primary">x</IconButton>
          <IconButton color="error" aria-label="error">x</IconButton>
        </>,
        dark,
      );
      const plain = style(screen.getByLabelText('plain')).color;
      expect(style(screen.getByLabelText('primary')).color).not.toBe(plain);
      expect(style(screen.getByLabelText('error')).color).not.toBe(plain);
    });

    it('lets an inherit icon button take the AppBar color, so it stays readable on the bar', () => {
      renderWithInflow(
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" aria-label="menu">x</IconButton>
          </Toolbar>
        </AppBar>,
        dark,
      );
      const bar = screen.getByRole('banner');
      const button = screen.getByLabelText('menu');
      expect(style(button).color).toBe(style(bar).color);
      expect(ratio(solid(style(button).color), solid(style(bar).backgroundColor))).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('field sizes', () => {
    // MUI gives every field type the same height at a given size. jsdom cannot measure layout, so check the size class.
    const sized = (el: HTMLElement) => (el.closest('.MuiInputBase-root') as HTMLElement).classList.contains('MuiInputBase-sizeSmall');

    it.each(['small', 'medium'] as const)('gives TextField, select TextField and Select the same %s size', (size) => {
      renderWithInflow(
        <>
          <TextField size={size} label="Text" defaultValue="x" />
          <TextField size={size} select label="Pick" defaultValue="a">
            <MenuItem value="a">A</MenuItem>
          </TextField>
          <FormControl size={size}>
            <InputLabel id="s">Sel</InputLabel>
            <Select labelId="s" label="Sel" defaultValue="a" data-testid="plain-select">
              <MenuItem value="a">A</MenuItem>
            </Select>
          </FormControl>
        </>,
        dark,
      );
      const expectSmall = size === 'small';
      expect(sized(screen.getByDisplayValue('x'))).toBe(expectSmall);
      expect(sized(screen.getByRole('combobox', { name: /Pick/ }))).toBe(expectSmall);
      expect(sized(screen.getByRole('combobox', { name: /Sel/ }))).toBe(expectSmall);
    });

    it('keeps the Inflow small default when no size is given', () => {
      renderWithInflow(
        <>
          <TextField label="Text" defaultValue="x" />
          <FormControl>
            <InputLabel id="d">Sel</InputLabel>
            <Select labelId="d" label="Sel" defaultValue="a"><MenuItem value="a">A</MenuItem></Select>
          </FormControl>
        </>,
        dark,
      );
      expect(sized(screen.getByDisplayValue('x'))).toBe(true);
      expect(sized(screen.getByRole('combobox', { name: /Sel/ }))).toBe(true);
    });
  });

  describe('ThemedTextField', () => {
    it('keeps the typed value and the label readable', () => {
      renderWithInflow(<ThemedTextField label="Name" defaultValue="Ada" />, dark);
      expect(ratio(solid(style(screen.getByDisplayValue('Ada')).color), parse(D.surfaceLowest))).toBeGreaterThanOrEqual(4.5);
      expect(ratio(solid(style(screen.getByText('Name', { selector: 'label' })).color), parse(D.surfaceLowest))).toBeGreaterThanOrEqual(4.5);
    });

    it('keeps the focused field border distinguishable from paper', () => {
      const focusedBorder = createInflowTheme(mode).components?.MuiOutlinedInput?.styleOverrides?.root as Record<string, Record<string, unknown>>;
      const border = focusedBorder['&.Mui-focused .MuiOutlinedInput-notchedOutline'].borderColor as string;
      expect(ratio(solid(border), parse(D.surfaceLowest))).toBeGreaterThanOrEqual(3);
    });
  });

  describe('ThemedCard and ThemedDialog', () => {
    it('lifts the card off the page and keeps its text readable', () => {
      renderWithInflow(<ThemedCard title="Card title">Body</ThemedCard>, dark);
      const card = screen.getByText('Card title').closest('.MuiCard-root')!;
      const bg = parse(style(card).backgroundColor);
      expect(bg).not.toEqual(parse(D.appBackground));
      expect(ratio(solid(style(screen.getByText('Card title')).color), bg)).toBeGreaterThanOrEqual(4.5);
    });

    it('draws a raised card on the same surface as flat and outlined cards, with a soft hairline in dark that differs from the outlined card line', () => {
      renderWithInflow(
        <>
          <ThemedCard title="Raised">x</ThemedCard>
          <ThemedCard title="Flat" elevation={0}>x</ThemedCard>
          <ThemedCard title="Outlined" variant="outlined">x</ThemedCard>
        </>,
        dark,
      );
      const card = (title: string) => style(screen.getByText(title).closest('.MuiCard-root')!);
      const color = (value: string) => {
        const swatch = document.createElement('div');
        swatch.style.borderColor = value;
        return swatch.style.borderColor;
      };
      // Every card sits on the same surface in both modes (white in light), whatever its elevation or variant.
      expect(card('Raised').backgroundColor).toBe(card('Outlined').backgroundColor);
      expect(card('Flat').backgroundColor).toBe(card('Outlined').backgroundColor);
      if (mode === 'dark') {
        expect(card('Raised').borderTopWidth).toBe('1px');
        expect(card('Raised').borderTopColor).toBe(color(D.surfaceVariant));
        expect(card('Outlined').borderTopColor).toBe(color(D.outlineVariant));
        expect(card('Raised').borderTopColor).not.toBe(card('Outlined').borderTopColor);
        expect(card('Flat').borderTopStyle).toBe('none');
      } else {
        expect(card('Raised').borderTopStyle).toBe('none');
      }
    });

    it('draws the dialog on a dark surface with readable title text', () => {
      renderWithInflow(<ThemedDialog open title="Dialog title">Body</ThemedDialog>, dark);
      const paper = screen.getByRole('dialog').querySelector('.MuiDialog-paper') ?? screen.getByRole('dialog');
      const bg = parse(style(paper).backgroundColor);
      if (mode === 'dark') expect(luminance(bg)).toBeLessThan(0.1);
      else expect(luminance(bg)).toBeGreaterThan(0.8);
      expect(ratio(solid(style(screen.getByText('Dialog title')).color), bg)).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('row overlays on translucent tokens', () => {
    it('keeps text readable on hover and selected rows', () => {
      for (const overlay of [D.rowHover, D.rowSelected, D.rowSelectedHover]) {
        const surface = over(overlay, D.surfaceLowest);
        expect(ratio(parse(D.onSurface), surface)).toBeGreaterThanOrEqual(4.5);
        expect(ratio(parse(D.onSurfaceVariant), surface)).toBeGreaterThanOrEqual(4.5);
      }
    });

    it('lets the selected row stand out from the plain row', () => {
      expect(ratio(over(D.rowSelected, D.surfaceLowest), parse(D.surfaceLowest))).toBeGreaterThan(1.1);
    });
  });
});
