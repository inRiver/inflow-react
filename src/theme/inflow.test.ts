import { describe, expect, it } from 'vitest';
import { createInflowTheme } from './inflow';

interface ButtonVariantStyle {
  props: { color?: string; variant?: string };
  style: {
    borderColor?: string;
    '&:hover'?: { borderColor?: string };
  };
}

describe('createInflowTheme', () => {
  it.each(['light', 'dark'] as const)('keeps the outlined primary border color stable on hover in %s mode', (mode) => {
    const theme = createInflowTheme(mode);
    const root = theme.components?.MuiButton?.styleOverrides?.root as { variants?: ButtonVariantStyle[] };
    const outlinedPrimary = root.variants?.find(
      ({ props }) => props.variant === 'outlined' && props.color === 'primary',
    );

    expect(outlinedPrimary?.style.borderColor).toBe(theme.palette.inflow.outlineVariant);
    expect(outlinedPrimary?.style['&:hover']?.borderColor).toBe(theme.palette.inflow.outlineVariant);
  });

  it('keeps native field label and notch geometry intact', () => {
    const theme = createInflowTheme('light');
    const labelRoot = theme.components?.MuiInputLabel?.styleOverrides?.root as Record<string, unknown>;

    expect(labelRoot).not.toHaveProperty('lineHeight');
    expect(labelRoot).not.toHaveProperty('&.MuiInputLabel-outlined.MuiInputLabel-shrink');
    expect(theme.components?.MuiOutlinedInput?.styleOverrides).not.toHaveProperty('notchedOutline');
  });

  it('provides outlined stock icons and a square shadowless menu surface', () => {
    const theme = createInflowTheme('light');
    const alertIcons = theme.components?.MuiAlert?.defaultProps?.iconMapping as Record<string, { props: { children: string } }>;
    const chipDeleteIcon = theme.components?.MuiChip?.defaultProps?.deleteIcon as { props: { children: string; className: string } };
    const menuPaper = theme.components?.MuiMenu?.styleOverrides?.paper as Record<string, unknown>;

    expect(alertIcons.error.props.children).toBe('error_outline');
    expect(alertIcons.success.props.children).toBe('check_circle_outline');
    expect(chipDeleteIcon.props.children).toBe('close');
    expect(chipDeleteIcon.props.className).toBe('material-icons-outlined');
    expect(menuPaper).toMatchObject({ borderRadius: 0, boxShadow: 'none' });
  });
});
