import { ListSubheader } from '@mui/material';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { createInflowTheme } from './inflow';

const colorOf = (text: string) => getComputedStyle(screen.getByText(text)).color;
const toRgb = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
};

describe('ListSubheader theme override', () => {
  const theme = createInflowTheme('light');

  it('uses onSurfaceVariant for the default color, matching the Autocomplete group label', () => {
    renderWithInflow(<ListSubheader>Default</ListSubheader>);
    expect(colorOf('Default')).toBe(toRgb(theme.palette.text.secondary));
  });

  it('keeps the primary and inherit color variants working', () => {
    renderWithInflow(
      <div style={{ color: 'rgb(1, 2, 3)' }}>
        <ListSubheader color="primary">Primary</ListSubheader>
        <ListSubheader color="inherit">Inherit</ListSubheader>
      </div>,
    );
    expect(colorOf('Primary')).toBe(toRgb(theme.palette.primary.main));
    expect(colorOf('Inherit')).toBe('rgb(1, 2, 3)');
  });
});
