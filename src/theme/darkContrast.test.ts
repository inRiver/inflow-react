import { describe, expect, it } from 'vitest';
import { darkTokens as D } from './inflow-tokens';
import { createInflowTheme, darkSeverityBase } from './inflow';

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

// WCAG AA: 4.5:1 for text, 3:1 for UI shapes such as field borders. Disabled controls are exempt.
const surfaces = [D.appBackground, D.surfaceLowest, D.surfaceLow, D.surfaceContainer, D.surfaceContainerHigh, D.surfaceHighest];

describe('dark mode contrast', () => {
  it.each(surfaces)('keeps body and label text readable on %s', (surface) => {
    expect(ratio(D.onSurface, surface)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(D.onSurfaceVariant, surface)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(['main', 'light'] as const)('keeps status and brand %s colors readable on dark paper', (shade) => {
    for (const color of [D.error, D.warning, D.info, D.success]) {
      expect(ratio(color[shade], D.surfaceLowest)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps text on filled status buttons readable', () => {
    const { palette } = createInflowTheme('dark');
    for (const color of [palette.primary, palette.secondary, palette.error, palette.warning, palette.info, palette.success]) {
      expect(ratio(color.contrastText, color.main)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it.each(surfaces)('keeps secondary and primary accents readable as text, checkboxes and outlines on %s', (surface) => {
    const { palette } = createInflowTheme('dark');
    for (const color of [palette.primary, palette.secondary]) {
      expect(ratio(color.main, surface)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps the on-state switch track and thumb distinguishable for every color', () => {
    const { palette } = createInflowTheme('dark');
    const mix = (accent: string) =>
      '#' + [1, 3, 5].map((i) => Math.round(0.65 * parseInt(accent.slice(i, i + 2), 16) + 0.35 * parseInt(D.navy900.slice(i, i + 2), 16)).toString(16).padStart(2, '0')).join('');
    for (const color of [palette.primary, palette.secondary, palette.error, palette.info, palette.success, palette.warning]) {
      const track = mix(color.main);
      expect(ratio(track, D.surfaceLowest)).toBeGreaterThanOrEqual(3);
      expect(ratio(D.onSurface, track)).toBeGreaterThanOrEqual(3);
    }
  });

  it('keeps the off-state switch track visible against dark paper', () => {
    // The off track is on-surface drawn at 40% opacity over paper.
    const track = '#' + [1, 3, 5].map((i) => Math.round(0.4 * parseInt(D.onSurface.slice(i, i + 2), 16) + 0.6 * parseInt(D.surfaceLowest.slice(i, i + 2), 16)).toString(16).padStart(2, '0')).join('');
    expect(ratio(track, D.surfaceLowest)).toBeGreaterThanOrEqual(3);
  });

  it('keeps alert and toast text and icons readable on their severity surfaces', () => {
    // Surface is the severity color blended into dark paper (see darkSeverityTint): warning 36%, others 34%.
    const blend = (base: string, pct: number) =>
      '#' + [1, 3, 5].map((i) => Math.round((pct / 100) * parseInt(base.slice(i, i + 2), 16) + (1 - pct / 100) * parseInt(D.surfaceLowest.slice(i, i + 2), 16)).toString(16).padStart(2, '0')).join('');
    for (const [severity, base] of Object.entries(darkSeverityBase)) {
      const surface = blend(base, severity === 'warning' ? 36 : 34);
      expect(ratio(D.onSurface, surface)).toBeGreaterThanOrEqual(4.5);
      expect(ratio(base, surface)).toBeGreaterThanOrEqual(3);
    }
  });

  it('keeps the menu edge visible against the menu surface and the page behind it', () => {
    const paper = createInflowTheme('dark').components?.MuiMenu?.styleOverrides?.paper as { border: string };
    const edge = paper.border.split(' ').pop() as string;
    for (const behind of [D.surfaceContainer, D.appBackground, D.surfaceLowest]) {
      expect(ratio(edge, behind)).toBeGreaterThanOrEqual(3);
    }
  });

  it('keeps the outlined card line defined and the raised card hairline visible but softer', () => {
    // Outlined card: outlineVariant (the divider color), a defined line. Raised card: surfaceVariant, a soft hairline.
    expect(ratio(D.outlineVariant, D.appBackground)).toBeGreaterThanOrEqual(3);
    expect(ratio(D.surfaceVariant, D.appBackground)).toBeGreaterThanOrEqual(1.5);
    expect(ratio(D.surfaceVariant, D.appBackground)).toBeLessThan(ratio(D.outlineVariant, D.appBackground));
  });

  it('keeps tooltip text readable on the tooltip chip', () => {
    const tooltip = createInflowTheme('dark').components?.MuiTooltip?.styleOverrides?.tooltip as { backgroundColor: string };
    expect(ratio(D.onSurface, tooltip.backgroundColor)).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps field borders visible against dark paper', () => {
    expect(ratio(D.outline, D.surfaceLowest)).toBeGreaterThanOrEqual(3);
  });
  // WCAG exempts disabled controls, but a disabled value that fades into the surface reads as missing, not off.
  // MUI's dark disabled color (white at 50%) measures about 5:1 on dark paper in the browser, and 4.2:1 on the lightest
  // raised surface. Hold the floor at 4:1 (not 4.5, which does not apply to disabled controls).
  it.each(surfaces)('keeps disabled text, labels and borders readable on %s', (surface) => {
    const { palette } = createInflowTheme('dark');
    const [r, g, b, a] = palette.text.disabled.match(/[\d.]+/g)!.map(Number);
    const over = '#' + [r, g, b].map((v, i) => Math.round(a * v + (1 - a) * parseInt(surface.slice(1 + i * 2, 3 + i * 2), 16)).toString(16).padStart(2, '0')).join('');
    expect(palette.action.disabled).toBe(palette.text.disabled);
    expect(ratio(over, surface)).toBeGreaterThanOrEqual(4);
  });
});
