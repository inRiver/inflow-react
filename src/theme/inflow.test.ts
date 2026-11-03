import { describe, expect, it } from 'vitest';
import { createInflowTheme } from './inflow';
import { darkTokens } from './inflow-tokens';

interface ButtonVariantStyle {
  props: { color?: string; variant?: string };
  style: {
    borderColor?: string;
    backgroundColor?: string;
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

  it.each(['light', 'dark'] as const)('gives the outlined primary button a surface background in %s mode', (mode) => {
    const theme = createInflowTheme(mode);
    const root = theme.components?.MuiButton?.styleOverrides?.root as { variants?: ButtonVariantStyle[] };
    const outlinedPrimary = root.variants?.find(
      ({ props }) => props.variant === 'outlined' && props.color === 'primary',
    );

    expect(outlinedPrimary?.style.backgroundColor).toBe(theme.palette.inflow.surfaceLowest);
  });

  it('restyles inline code chips only in dark mode', () => {
    const dark = createInflowTheme('dark');
    const darkRoot = dark.components?.MuiScopedCssBaseline?.styleOverrides?.root as Record<string, Record<string, string>>;

    expect(darkRoot['& code']).toEqual({
      backgroundColor: dark.palette.inflow.surfaceHighest,
      color: dark.palette.text.primary,
    });
    expect(darkRoot['& pre code']).toEqual({ backgroundColor: 'transparent' });
    expect(createInflowTheme('light').components?.MuiScopedCssBaseline).toBeUndefined();
  });

  it('keeps native field label and notch geometry intact', () => {
    const theme = createInflowTheme('light');
    const labelRoot = theme.components?.MuiInputLabel?.styleOverrides?.root as Record<string, unknown>;

    expect(labelRoot).not.toHaveProperty('lineHeight');
    expect(labelRoot).not.toHaveProperty('&.MuiInputLabel-outlined.MuiInputLabel-shrink');
    expect(theme.components?.MuiOutlinedInput?.styleOverrides).not.toHaveProperty('notchedOutline');
  });

  it('provides outlined stock icons', () => {
    const theme = createInflowTheme('light');
    const alertIcons = theme.components?.MuiAlert?.defaultProps?.iconMapping as Record<string, { props: { children: string } }>;
    const chipDeleteIcon = theme.components?.MuiChip?.defaultProps?.deleteIcon as { props: { children: string; className: string } };

    expect(alertIcons.error.props.children).toBe('error_outline');
    expect(alertIcons.success.props.children).toBe('check_circle_outline');
    expect(chipDeleteIcon.props.children).toBe('close');
    expect(chipDeleteIcon.props.className).toBe('material-icons-outlined');
  });

  it('leaves light menus on MUI defaults, so they keep the elevation shadow and rounded corners', () => {
    // Square, shadowless menus left no visible edge over same-colored content (white on white in light).
    expect(createInflowTheme('light').components?.MuiMenu).toBeUndefined();
  });

  it('gives dark menus a 1px outline edge, because a shadow cannot show on a dark page', () => {
    const paper = createInflowTheme('dark').components?.MuiMenu?.styleOverrides?.paper as Record<string, unknown>;
    expect(paper).toEqual({ border: `1px solid ${darkTokens.outline}` });
  });

  it('uses the ExpandMore chevron for both Select and Autocomplete dropdowns', () => {
    const theme = createInflowTheme('light');
    const selectIcon = theme.components?.MuiSelect?.defaultProps?.IconComponent;
    const autocompleteIcon = theme.components?.MuiAutocomplete?.defaultProps?.popupIcon as { type: unknown };

    expect(selectIcon).toBe(autocompleteIcon.type);
  });
});

describe('group headings', () => {
  it('styles Select ListSubheader like the Autocomplete group label without overriding color variants', () => {
    const { components } = createInflowTheme('light');
    const subheader = components?.MuiListSubheader?.styleOverrides?.root as {
      fontWeight: number;
      variants: { props: { color: string }; style: { color: string } }[];
    };
    const groupLabel = components?.MuiAutocomplete?.styleOverrides?.groupLabel as { color: string; fontWeight: number };
    expect(subheader.fontWeight).toBe(groupLabel.fontWeight);
    expect(subheader).not.toHaveProperty('color');
    expect(subheader.variants).toEqual([{ props: { color: 'default' }, style: { color: groupLabel.color } }]);
  });
});

describe('select defaults', () => {
  it.each(['light', 'dark'] as const)('keeps TextField and FormControl at the small Inflow size in %s, and lets Select follow them as in MUI', (mode) => {
    const { components } = createInflowTheme(mode);
    expect(components?.MuiTextField?.defaultProps?.size).toBe('small');
    expect(components?.MuiFormControl?.defaultProps?.size).toBe('small');
    // A size default on Select would override the size passed down by its FormControl or TextField.
    expect(components?.MuiSelect?.defaultProps).not.toHaveProperty('size');
  });
});
