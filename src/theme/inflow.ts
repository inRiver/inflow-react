// Canonical source: docs/mui/inflow-theme.js
import { createElement } from 'react';
import { createTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Shadows } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { resolveInflowColorMode } from './featureFlags';
import { darkOnlyTokens, darkTokens, lightTokens, type InflowThemeTokens } from './inflow-tokens';

export type InflowColorMode = 'light' | 'dark';

interface InflowPalette {
  navy900: string;
  navy800: string;
  navy700: string;
  navy100: string;
  surfaceLow: string;
  surfaceHighest: string;
  surfaceVariant: string;
  outline: string;
  outlineVariant: string;
  primaryTab: string;
  appBackground: string;
  navSurface: string;
  rowHover: string;
  rowSelected: string;
  rowSelectedHover: string;
  diffRemovedBg: string;
  diffRemovedText: string;
  diffAddedBg: string;
  diffAddedText: string;
  surfaceLowest: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  primaryFixed: string;
  secondaryFixed: string;
  tertiaryFixed: string;
  inverseSurface: string;
  inverseOnSurface: string;
  certaintyHigh: string;
  certaintyMedium: string;
  highlightGreen: string;
  highlightRed: string;
  highlightYellow: string;
  mandatoryRow: string;
  toastInfoBg: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    inflow: InflowPalette;
  }

  interface PaletteOptions {
    inflow?: InflowPalette;
  }
}

// Dark alert and toast surfaces: a severity color blended into the dark paper. Strong enough to read as that
// severity, still dark enough that on-surface text stays above 6.5:1 and the icon above 3:1. Warning blends a
// golden amber instead of the orange status color, because dark orange turns brown.
export const darkSeverityBase = {
  error: darkTokens.error.main,
  warning: darkOnlyTokens.warningAmber,
  info: darkTokens.info.main,
  success: darkTokens.success.main,
} as const;
export const darkSeverityTint = (severity: keyof typeof darkSeverityBase): string =>
  `color-mix(in srgb, ${darkSeverityBase[severity]} ${severity === 'warning' ? 36 : 34}%, ${darkTokens.surfaceLowest})`;

const E1 = '0 1px 3px 1px rgba(0,0,0,0.15), 0 1px 2px 0 rgba(0,0,0,0.30)';
const E2 = '0 2px 6px 2px rgba(0,0,0,0.15), 0 1px 2px 0 rgba(0,0,0,0.30)';
const E3 = '0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px 0 rgba(0,0,0,0.30)';

const shadows = [
  'none',
  ...Array.from({ length: 2 }, () => E1),
  ...Array.from({ length: 6 }, () => E2),
  ...Array.from({ length: 16 }, () => E3),
] as Shadows;

export const getInflowTokensForMode = (mode: InflowColorMode): InflowThemeTokens =>
  mode === 'dark' ? darkTokens : lightTokens;

export const getInflowPalette = (mode: InflowColorMode): InflowPalette => {
  const T = getInflowTokensForMode(mode);

  return {
    navy900: T.navy900,
    navy800: T.navy800,
    navy700: T.navy700,
    navy100: T.navy100,
    surfaceLow: T.surfaceLow,
    surfaceHighest: T.surfaceHighest,
    surfaceVariant: T.surfaceVariant,
    outline: T.outline,
    outlineVariant: T.outlineVariant,
    primaryTab: T.primaryTab,
    appBackground: T.appBackground,
    navSurface: T.navSurface,
    rowHover: T.rowHover,
    rowSelected: T.rowSelected,
    rowSelectedHover: T.rowSelectedHover,
    diffRemovedBg: T.diffRemovedBg,
    diffRemovedText: T.diffRemovedText,
    diffAddedBg: T.diffAddedBg,
    diffAddedText: T.diffAddedText,
    surfaceLowest: T.surfaceLowest,
    surfaceContainer: T.surfaceContainer,
    surfaceContainerHigh: T.surfaceContainerHigh,
    primaryFixed: T.primaryFixed,
    secondaryFixed: T.secondaryFixed,
    tertiaryFixed: T.tertiaryFixed,
    inverseSurface: T.inverseSurface,
    inverseOnSurface: T.inverseOnSurface,
    certaintyHigh: T.certaintyHigh,
    certaintyMedium: T.certaintyMedium,
    highlightGreen: T.highlightGreen,
    highlightRed: T.highlightRed,
    highlightYellow: T.highlightYellow,
    mandatoryRow: T.mandatoryRow,
    toastInfoBg: T.toastInfoBg,
  };
};

export const createInflowTheme = (requestedMode: InflowColorMode = 'light') => {
  const mode = resolveInflowColorMode(requestedMode);
  const T = getInflowTokensForMode(mode);
  // Dark status colors are light tints, so they take dark text instead of white.
  const statusContrastText = mode === 'dark' ? T.navy900 : '#ffffff';

  return createTheme({
    shape: { borderRadius: T.radiusSm },
    spacing: 8,
    shadows,

    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? T.navy700 : T.navy700,
        dark: mode === 'dark' ? T.navyDark : T.navyDark,
        light: mode === 'dark' ? T.navy600 : T.navy400,
        contrastText: mode === 'dark' ? T.navy900 : '#ffffff',
      },
      secondary: {
        // Dark secondary is a light neutral so it reads as a checkbox, link, outline or text color on dark
        // surfaces; filled secondary buttons carry navy text. Light keeps its dark navy.
        main: mode === 'dark' ? T.onSurfaceVariant : T.navy800,
        dark: mode === 'dark' ? T.outline : '#000000',
        light: mode === 'dark' ? T.onSurface : T.navy800,
        contrastText: mode === 'dark' ? T.navy900 : '#ffffff',
      },
      error: { ...T.error, contrastText: statusContrastText },
      warning: { ...T.warning, contrastText: statusContrastText },
      info: { ...T.info, contrastText: statusContrastText },
      success: { ...T.success, contrastText: statusContrastText },
      text: {
        primary: T.onSurface,
        secondary: T.onSurfaceVariant,
        disabled: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.38)',
      },
      divider: T.outlineVariant,
      action: {
        disabled: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.38)',
        disabledBackground: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
        hover: T.rowHover,
        selected: T.rowSelected,
      },
      background: {
        default: T.appBackground,
        paper: T.surfaceLowest,
      },
      inflow: getInflowPalette(mode),
    },

    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      h1: { fontWeight: 300, fontSize: '6rem', lineHeight: 1.167, letterSpacing: '-0.09375rem' },
      h2: { fontWeight: 300, fontSize: '3.75rem', lineHeight: 1.2, letterSpacing: '-0.03125rem' },
      h3: { fontWeight: 400, fontSize: '3rem', lineHeight: 1.167, letterSpacing: 0 },
      h4: { fontWeight: 400, fontSize: '2.125rem', lineHeight: 1.235, letterSpacing: '0.015625rem' },
      h5: { fontWeight: 400, fontSize: '1.5rem', lineHeight: 1.334, letterSpacing: 0 },
      h6: { fontWeight: 700, fontSize: '1.375rem', lineHeight: '2.25rem', letterSpacing: '0.009375rem' },
      subtitle1: { fontWeight: 400, fontSize: '1rem', lineHeight: 1.5, letterSpacing: '0.009375rem' },
      subtitle2: { fontWeight: 500, fontSize: '0.875rem', lineHeight: '1.25rem', letterSpacing: '0.00625rem' },
      body1: { fontWeight: 400, fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: 0 },
      body2: { fontWeight: 400, fontSize: '0.875rem', lineHeight: '1.25rem', letterSpacing: '0.015625rem' },
      button: { fontWeight: 500, fontSize: '0.875rem', lineHeight: '1.25rem', letterSpacing: '0.00625rem', textTransform: 'capitalize' },
      caption: { fontWeight: 400, fontSize: '0.75rem', lineHeight: '1rem', letterSpacing: '0.025rem' },
      overline: { fontWeight: 400, fontSize: '0.75rem', lineHeight: 1, letterSpacing: '0.0625rem', textTransform: 'uppercase' },
    },

    components: {
      MuiButton: {
        defaultProps: { disableElevation: true, variant: 'contained' },
        styleOverrides: {
          root: {
            borderRadius: T.radiusSm,
            fontWeight: 500,
            letterSpacing: '0.00625rem',
            variants: [
              {
                props: { variant: 'contained', color: 'primary' },
                style: {
                  backgroundColor: T.navy700,
                  color: mode === 'dark' ? T.navy900 : '#ffffff',
                  '&:hover': { backgroundColor: T.navyDark },
                },
              },
              {
                props: { variant: 'outlined', color: 'primary' },
                style: {
                  color: T.navy700,
                  borderColor: T.outlineVariant,
                  backgroundColor: T.surfaceLowest,
                  '&:hover': { borderColor: T.outlineVariant, backgroundColor: T.rowSelected },
                },
              },
              {
                props: { variant: 'text', color: 'primary' },
                style: {
                  color: T.navy700,
                  '&:hover': { backgroundColor: T.rowSelected },
                },
              },
            ],
          },
          sizeSmall: ({ theme }) => ({ height: 30, padding: theme.spacing(0, 2), fontSize: '0.8125rem' }),
          sizeMedium: ({ theme }) => ({ height: 40, padding: theme.spacing(0, 3), fontSize: '0.875rem' }),
          sizeLarge: ({ theme }) => ({ height: 48, padding: theme.spacing(0, 4), fontSize: '1rem' }),
          outlined: { borderColor: T.outlineVariant },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          // Only the default button is grey. primary, secondary, error and the rest keep MUI's palette color, and
          // inherit takes its parent's color (white inside the navy AppBar).
          root: ({ ownerState }) => ({
            ...((ownerState.color ?? 'default') === 'default' && { color: T.onSurfaceVariant }),
            borderRadius: T.radiusFull,
          }),
        },
      },
      MuiButtonGroup: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: T.radiusSm } },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: 'capitalize',
            fontWeight: 500,
            letterSpacing: '0.00625rem',
            borderColor: T.outline,
            '&.Mui-selected': {
              backgroundColor: T.primaryTab,
              color: T.navy700,
              fontWeight: 700,
              '&:hover': { backgroundColor: T.primaryTab },
            },
          },
        },
      },
      // Dark: a shadow alone cannot lift the small action buttons off the page, so they step up a lighter surface with the
      // same surfaceVariant hairline as raised cards, plus the existing shadow token. Light keeps its white circles.
      ...(mode === 'dark' && {
        MuiSpeedDialAction: {
          styleOverrides: {
            fab: {
              backgroundColor: T.surfaceContainerHigh,
              color: T.onSurface,
              border: `1px solid ${T.surfaceVariant}`,
              boxShadow: E2,
              '&:hover': { backgroundColor: T.surfaceHighest },
              '&.Mui-focusVisible': { outline: `2px solid ${T.navy700}`, outlineOffset: 2 },
            },
          },
        },
      }),
      MuiFab: {
        styleOverrides: {
          root: {
            backgroundColor: T.navy700,
            color: mode === 'dark' ? T.navy900 : '#fff',
            '&:hover': { backgroundColor: T.navyDark },
          },
        },
      },

      MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
      // No size default on Select, as in MUI: it takes the size of its FormControl or TextField (small by default here),
      // so size="medium" on a FormControl or TextField reaches the Select instead of being overridden.
      MuiSelect: { defaultProps: { IconComponent: ExpandMoreIcon } },
      MuiFormControl: { defaultProps: { size: 'small' } },
      MuiInputBase: {
        styleOverrides: {
          root: {
            '&.MuiInputBase-sizeSmall': { fontSize: '0.875rem', lineHeight: '1.429' },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: T.radiusXs,
            // Dark fields use the stronger `outline` tone so the border clears the 3:1 minimum for UI shapes.
            '& .MuiOutlinedInput-notchedOutline': { borderColor: mode === 'dark' ? T.outline : T.outlineVariant },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: mode === 'dark' ? T.onSurface : T.outline },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: T.navy700, borderWidth: 2 },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            backgroundColor: T.surfaceHighest,
            borderRadius: `${T.radiusXs}px ${T.radiusXs}px 0 0`,
            '&:hover': { backgroundColor: T.surfaceContainerHigh },
            '&.Mui-focused': { backgroundColor: T.surfaceHighest },
            '&:after': { borderBottomColor: T.navy700 },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            '&.Mui-focused': { color: T.navy700 },
            '&.MuiInputLabel-sizeSmall': { fontSize: '0.875rem' },
          },
        },
      },

      MuiCheckbox: {
        styleOverrides: {
          root: ({ ownerState, theme }) => {
            if (ownerState.disabled) return {};
            const colorKey = ownerState.color;
            const checkedColor =
              colorKey === 'primary'
                ? theme.palette.primary.main
                : colorKey === 'secondary'
                  ? theme.palette.secondary.main
                  : colorKey === 'error'
                    ? theme.palette.error.main
                    : colorKey === 'info'
                      ? theme.palette.info.main
                      : colorKey === 'success'
                        ? theme.palette.success.main
                        : colorKey === 'warning'
                          ? theme.palette.warning.main
                          : T.navy700;
            return { color: T.outline, '&.Mui-checked': { color: checkedColor } };
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: ({ ownerState, theme }) => {
            if (ownerState.disabled) return {};
            const colorKey = ownerState.color;
            const checkedColor =
              colorKey === 'primary'
                ? theme.palette.primary.main
                : colorKey === 'secondary'
                  ? theme.palette.secondary.main
                  : colorKey === 'error'
                    ? theme.palette.error.main
                    : colorKey === 'info'
                      ? theme.palette.info.main
                      : colorKey === 'success'
                        ? theme.palette.success.main
                        : colorKey === 'warning'
                          ? theme.palette.warning.main
                          : T.navy700;
            return { color: T.outline, '&.Mui-checked': { color: checkedColor } };
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          // Off-state track: MUI's default (white at 30%) is about 2.8:1 on dark paper, under the 3:1 minimum.
          ...(mode === 'dark' && { track: { backgroundColor: T.onSurface, opacity: 0.4 } }),
          switchBase: ({ ownerState, theme }) => {
            if (ownerState.disabled) return {};
            const colorKey = ownerState.color;
            const trackColor =
              colorKey === 'primary'
                ? theme.palette.primary.main
                : colorKey === 'secondary'
                  ? theme.palette.secondary.main
                  : colorKey === 'error'
                    ? theme.palette.error.main
                    : colorKey === 'info'
                      ? theme.palette.info.main
                      : colorKey === 'success'
                        ? theme.palette.success.main
                        : colorKey === 'warning'
                          ? theme.palette.warning.main
                          : T.navy700;
            return {
              '&.Mui-checked': {
                // Light: white thumb on the accent track. Dark mirrors it with a light thumb on a deeper accent
                // track (accent blended with navy), because a drop shadow cannot separate the thumb on a dark page.
                color: mode === 'dark' ? T.onSurface : '#fff',
                '& + .MuiSwitch-track': {
                  backgroundColor: mode === 'dark' ? `color-mix(in srgb, ${trackColor} 65%, ${T.navy900})` : trackColor,
                  opacity: 1,
                },
              },
            };
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          colorPrimary: { color: T.navy700 },
          rail: { backgroundColor: T.surfaceVariant, opacity: 1 },
          track: { backgroundColor: 'currentColor', border: 'none' },
          thumb: { backgroundColor: 'currentColor' },
        },
      },
      MuiRating: {
        styleOverrides: {
          iconEmpty: { color: T.outline },
          iconFilled: { color: T.ratingActive },
          iconHover: { color: T.ratingActive },
        },
      },

      MuiAppBar: {
        defaultProps: {
          color: 'primary',
        },
        styleOverrides: {
          root: {
            backgroundColor: T.navSurface,
            color: '#ffffff',
            boxShadow: E1,
          },
          colorPrimary: {
            backgroundColor: T.navSurface,
            color: '#ffffff',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: { borderRadius: T.radiusSm },
          root: ({ ownerState }) => ({
            backgroundImage: 'none',
            // Dark: shadows cannot show on dark surfaces, so raised Paper (cards, menus, dialogs) steps up a lighter surface.
            ...(mode === 'dark' &&
              ownerState.variant !== 'outlined' && {
                backgroundColor:
                  (ownerState.elevation ?? 1) >= 9
                    ? T.surfaceContainerHigh
                    : (ownerState.elevation ?? 1) >= 3
                      ? T.surfaceContainer
                      : (ownerState.elevation ?? 1) >= 1
                        ? T.surfaceLow
                        : undefined,
              }),
          }),
        },
        defaultProps: { elevation: 1 },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            borderRadius: T.radiusSm,
            // Dark: a shadow cannot show, so a raised card gets a soft 1px surfaceVariant hairline (1.8:1 on the page), and sits
            // on the paper surface like flat and outlined cards (as in light, where every card is white) instead of
            // stepping up a lighter surface the way other raised Paper does. The Outlined card keeps its defined
            // outlineVariant line (3:1), so the two still read differently, as shadow against line does in light.
            ...(mode === 'dark' &&
              ownerState.variant !== 'outlined' &&
              (ownerState.elevation ?? 1) >= 1 && {
                border: `1px solid ${T.surfaceVariant}`,
                backgroundColor: T.surfaceLowest,
              }),
          }),
        },
        defaultProps: { elevation: 1 },
      },
      MuiDialog: { defaultProps: { maxWidth: 'xs' }, styleOverrides: { paper: { borderRadius: T.radiusXl, width: 'min(444px, calc(100vw - 32px))' } } },
      MuiDialogTitle: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: T.surfaceHighest,
            padding: theme.spacing(3),
            fontSize: '1.5rem',
            fontWeight: 400,
            lineHeight: 1.334,
            letterSpacing: 0,
          }),
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: theme.spacing(3),
            paddingTop: `${theme.spacing(3)} !important`,
          }),
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: theme.spacing(1, 3, 3),
          }),
        },
      },
      MuiPickerDay: {
        styleOverrides: {
          root: ({ theme }) => ({
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover, &:focus': {
                backgroundColor: theme.palette.primary.dark,
              },
            },
          }),
        },
      },
      MuiAutocomplete: {
        defaultProps: {
          popupIcon: createElement(ExpandMoreIcon),
        },
        styleOverrides: {
          paper: { borderRadius: T.radiusXs },
          option: {
            '&:hover': { backgroundColor: T.rowHover },
            '&.Mui-focused': { backgroundColor: T.rowHover },
            '&[aria-selected="true"]': {
              backgroundColor: T.rowSelected,
              '&:hover, &.Mui-focused': { backgroundColor: T.rowSelectedHover },
            },
          },
          groupLabel: { color: T.onSurfaceVariant, fontWeight: 600 },
        },
      },
      MuiListSubheader: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            // Only recolor the default subheader so color="primary" / "inherit" keep working.
            variants: [{ props: { color: 'default' }, style: { color: T.onSurfaceVariant } }],
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            '&:hover': { backgroundColor: T.rowHover },
            '&.Mui-selected': {
              backgroundColor: T.rowSelected,
              '&:hover': { backgroundColor: T.rowSelectedHover },
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            // Dark tooltips are a muted blue-gray chip (brand hue, low saturation, so it sits calmly next to the bright
            // primary blue) with light text. It is lighter than the page surfaces, so no outline is needed.
            backgroundColor: mode === 'dark' ? darkOnlyTokens.tooltipBg : '#616161',
            color: mode === 'dark' ? T.onSurface : '#ffffff',
            fontSize: '0.75rem',
            borderRadius: T.radiusXs,
            border: '1px solid transparent',
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          badge: ({ ownerState, theme }) => {
            const colorKey = ownerState.color;
            const backgroundColor =
              colorKey === 'primary'
                ? theme.palette.primary.main
                : colorKey === 'secondary'
                  ? theme.palette.secondary.main
                  : colorKey === 'error'
                    ? theme.palette.error.main
                    : colorKey === 'info'
                      ? theme.palette.info.main
                      : colorKey === 'success'
                        ? theme.palette.success.main
                        : colorKey === 'warning'
                          ? theme.palette.warning.main
                          : theme.palette.grey[400];

            return {
              backgroundColor,
              color: mode === 'dark' ? T.navy900 : T.white,
              ...(ownerState.variant === 'dot'
                ? {
                    minWidth: 8,
                    height: 8,
                    borderRadius: 4,
                    padding: 0,
                  }
                : {
                    fontWeight: 500,
                    fontSize: '0.6875rem',
                    lineHeight: '1rem',
                    minWidth: 16,
                    height: 16,
                    padding: theme.spacing(0, 0.5),
                    borderRadius: 8,
                  }),
            };
          },
        },
      },
      MuiDrawer: { styleOverrides: { paper: { borderRight: `1px solid ${T.outlineVariant}` } } },

      MuiChip: {
        defaultProps: {
          size: 'medium',
          deleteIcon: createElement(
            'span',
            { className: 'material-icons-outlined', 'aria-hidden': true },
            'close',
          ),
        },
        styleOverrides: {
          root: {
            borderRadius: T.radiusFull,
            fontWeight: 500,
            letterSpacing: '0.00625rem',
            maxWidth: '100%',
            // Hover tints toward the brand blue, never a grey: default filled chips use the primary tab tint (light) or
            // primaryFixed (dark); default outlined chips use the pale blue row hover.
            '&.MuiChip-colorDefault.MuiChip-filled.MuiChip-clickable:hover, &.MuiChip-colorDefault.MuiChip-filled.MuiChip-deletable:hover': {
              backgroundColor: mode === 'dark' ? T.primaryFixed : T.primaryTab,
            },
            '&.MuiChip-colorDefault.MuiChip-outlined.MuiChip-clickable:hover, &.MuiChip-colorDefault.MuiChip-outlined.MuiChip-deletable:hover': {
              backgroundColor: T.rowHover,
            },
            // The delete "x" matches the chip text color in both modes (MUI defaults to a faint 26% tint).
            '& .MuiChip-deleteIcon': { color: 'inherit', opacity: 1, '&:hover': { color: 'inherit', opacity: 1 } },
            '& .MuiChip-avatar': { color: T.navy900 },
            '&.MuiChip-sizeSmall': {
              height: 24,
              fontSize: '0.75rem',
            },
            '&.MuiChip-sizeMedium': {
              height: 32,
              fontSize: '0.875rem',
            },
            '&.MuiChip-sizeSmall > .MuiChip-label': {
              paddingLeft: '0.5rem',
              paddingRight: '0.5rem',
            },
            '&.MuiChip-sizeMedium > .MuiChip-label': {
              paddingLeft: '0.75rem',
              paddingRight: '0.75rem',
            },
            '&.MuiChip-sizeSmall > .MuiChip-icon, &.MuiChip-sizeSmall > .MuiChip-deleteIcon': {
              fontSize: '0.875rem',
            },
            '&.MuiChip-sizeMedium > .MuiChip-icon, &.MuiChip-sizeMedium > .MuiChip-deleteIcon': {
              fontSize: '1.125rem',
            },
            variants: [
              {
                props: { variant: 'outlined', color: 'primary' },
                style: {
                  borderColor: T.outlineVariant,
                  color: T.navy700,
                  backgroundColor: T.surfaceLowest,
                  '&:hover': { borderColor: T.navy400, backgroundColor: T.rowHover },
                },
              },
              {
                props: { variant: 'filled', color: 'primary' },
                style: {
                  backgroundColor: T.primaryTab,
                  color: mode === 'dark' ? T.navy700 : T.navy700,
                },
              },
            ],
          },
          outlined: { borderColor: T.outlineVariant, color: T.onSurfaceVariant, backgroundColor: T.surfaceLowest },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.grey[400],
            color: T.navy900,
            fontSize: '1.25rem',
            fontWeight: 400,
            letterSpacing: '0.00875rem',
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: T.outlineVariant, fontSize: '0.875rem', letterSpacing: '0.015625rem' },
          head: { fontWeight: 600, color: T.onSurface },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&.MuiTableRow-hover:hover': { backgroundColor: T.rowHover },
            '&.Mui-selected': {
              backgroundColor: T.rowSelected,
              '&:hover': { backgroundColor: T.rowSelectedHover },
            },
          },
        },
      },

      MuiTabs: { styleOverrides: { indicator: { backgroundColor: T.navy700, height: 2 }, list: { gap: 8 } } },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            letterSpacing: '0.00625rem',
            color: T.onSurfaceVariant,
            '&.Mui-selected': { color: T.navy700 },
          },
        },
      },
      MuiPaginationItem: {
        styleOverrides: {
          root: {
            '&&.Mui-selected, &&.Mui-selected:hover, &&.Mui-selected.Mui-focusVisible': {
              backgroundColor: `${T.navy700} !important`,
              border: `1px solid ${T.navy700}`,
              color: `${mode === 'dark' ? T.navy900 : T.white} !important`,
              fontWeight: 600,
            },
          },
        },
      },
      MuiBreadcrumbs: { styleOverrides: { separator: { color: T.onSurfaceVariant } } },
      MuiLink: { defaultProps: { color: 'primary' }, styleOverrides: { root: { textDecorationColor: 'inherit' } } },
      MuiStepIcon: {
        styleOverrides: {
          root: { color: T.outline, '&.Mui-active': { color: T.navy700 }, '&.Mui-completed': { color: T.navy700 } },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            color: T.onSurfaceVariant,
            '& .MuiBottomNavigationAction-label, & .MuiSvgIcon-root': { color: T.onSurfaceVariant },
            '&&.Mui-selected, &&.Mui-selected .MuiBottomNavigationAction-label, &&.Mui-selected .MuiSvgIcon-root': {
              color: `${T.navy700} !important`,
            },
          },
        },
      },

      MuiAlert: {
        defaultProps: {
          iconMapping: {
            error: createElement('span', { className: 'material-icons-outlined' }, 'error_outline'),
            warning: createElement('span', { className: 'material-icons-outlined' }, 'warning_amber'),
            info: createElement('span', { className: 'material-icons-outlined' }, 'info'),
            success: createElement('span', { className: 'material-icons-outlined' }, 'check_circle_outline'),
          },
        },
        styleOverrides: {
          // Standard alerts use the same surfaces as ThemedToast. MUI 9 matches alerts on `colorSeverity`.
          root: {
            variants: (['error', 'warning', 'info', 'success'] as const).map((severity) => {
              const lightSurface = {
                error: T.highlightRed,
                warning: T.highlightYellow,
                info: T.toastInfoBg,
                success: T.highlightGreen,
              }[severity];
              // Light icons use the darker status shade where the main color is under 3:1 on its surface.
              const lightIcon = severity === 'warning' || severity === 'success' ? T[severity].dark : T[severity].main;
              return {
                props: { variant: 'standard' as const, colorSeverity: severity },
                style: {
                  backgroundColor: mode === 'dark' ? darkSeverityTint(severity) : lightSurface,
                  color: T.onSurface,
                  '& .MuiAlert-icon': { color: mode === 'dark' ? darkSeverityBase[severity] : lightIcon },
                },
              };
            }),
          },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: mode === 'dark' ? T.surfaceHighest : T.mandatoryRow,
            color: T.onSurface,
            borderRadius: T.radiusMd,
            boxShadow: 'none',
            minHeight: 48,
            padding: theme.spacing(1.5, 2),
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: '1.25rem',
            letterSpacing: '0.015625rem',
            '& .MuiSnackbarContent-message': {
              padding: 0,
            },
            '& .MuiSnackbarContent-action': {
              marginRight: 0,
              paddingLeft: theme.spacing(2),
            },
            '& .MuiButton-root': {
              color: T.navy700,
              minWidth: 'auto',
              padding: 0,
            },
            '& .MuiIconButton-root': {
              color: T.onSurface,
            },
          }),
        },
      },
      MuiLinearProgress: { styleOverrides: { root: { borderRadius: T.radiusFull } } },
      // The showcase stylesheet gives inline <code> a light cream chip; dark mode needs its own.
      ...(mode === 'dark' && {
        // A shadow cannot show on dark, so the raised menu surface gets a 1px edge (outline is 5.7:1 on the menu, 7.3:1 on the page).
        MuiMenu: { styleOverrides: { paper: { border: `1px solid ${T.outline}` } } },
        MuiScopedCssBaseline: {
          styleOverrides: {
            root: {
              '& code': { backgroundColor: T.surfaceHighest, color: T.onSurface },
              '& pre code': { backgroundColor: 'transparent' },
            },
          },
        },
      }),
      MuiAccordion: { styleOverrides: { root: { borderRadius: 0, '&:before': { display: 'none' } } } },
    },
  });
};

export const inflowTheme = createInflowTheme('light');
