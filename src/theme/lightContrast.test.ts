import { describe, expect, it } from 'vitest';
import { lightTokens as L } from './inflow-tokens';
import { createInflowTheme } from './inflow';

const channel = (value: number) => {
  const v = value / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(hex.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// Light mode is the shipped look. These lock in the contrast it has today (WCAG AA: 4.5:1 text, 3:1 large text and
// UI shapes) so a later change cannot quietly lower it. Where light is below AA today, the known gap is asserted at
// its current floor and is documented on the Accessibility page; it is not fixed here.
const surfaces = [L.appBackground, L.surfaceLowest, L.surfaceLow, L.surfaceContainer, L.surfaceContainerHigh, L.surfaceHighest];

describe('light mode contrast', () => {
  it.each(surfaces)('keeps body and label text readable on %s', (surface) => {
    expect(ratio(L.onSurface, surface)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(L.onSurfaceVariant, surface)).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps text on filled primary, secondary, error and info buttons readable', () => {
    const { palette } = createInflowTheme('light');
    for (const color of [palette.primary, palette.secondary, palette.error, palette.info]) {
      expect(ratio(color.contrastText, color.main)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('holds the documented white-on-success and white-on-warning gap at its current floor', () => {
    const { palette } = createInflowTheme('light');
    expect(ratio(palette.success.contrastText, palette.success.main)).toBeGreaterThanOrEqual(3.5);
    expect(ratio(palette.warning.contrastText, palette.warning.main)).toBeGreaterThanOrEqual(2.9);
  });

  it('keeps primary and secondary accents readable as text on white paper', () => {
    const { palette } = createInflowTheme('light');
    for (const color of [palette.primary, palette.secondary]) {
      expect(ratio(color.main, L.surfaceLowest)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps tooltip text readable on the tooltip chip', () => {
    const tooltip = createInflowTheme('light').components?.MuiTooltip?.styleOverrides?.tooltip as { backgroundColor: string; color: string };
    expect(ratio(tooltip.color, tooltip.backgroundColor)).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps the on-state switch thumb distinguishable from its track', () => {
    const { palette } = createInflowTheme('light');
    for (const color of [palette.primary, palette.secondary, palette.error, palette.info, palette.success, palette.warning]) {
      expect(ratio('#ffffff', color.main)).toBeGreaterThanOrEqual(2.9);
    }
  });
});
