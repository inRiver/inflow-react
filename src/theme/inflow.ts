// Canonical source: docs/mui/inflow-theme.js
import { createTheme } from '@mui/material/styles';
import type { Shadows } from '@mui/material/styles';
import { resolveInflowColorMode } from './featureFlags';

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
}

declare module '@mui/material/styles' {
  interface Palette {
    inflow: InflowPalette;
  }

  interface PaletteOptions {
    inflow?: InflowPalette;
  }
}

const baseTokens = {
  error: { main: '#ba1a1a', dark: '#c62828', light: '#ef5350' },
  warning: { main: '#ff6424', dark: '#e65100', light: '#ff9800' },
  info: { main: '#0057cf', dark: '#00419f', light: '#2067cc' },
  success: { main: '#2c9b4b', dark: '#1b5e20', light: '#4caf50' },
  radiusXs: 4,
  radiusSm: 5,
  radiusMd: 8,
  radiusLg: 10,
  radiusXl: 28,
  radiusFull: 9999,
} as const;

const lightTokens = {
  ...baseTokens,
  navy900: '#16243d',
  navy800: '#22243d',
  navy700: '#0b2d6e',
  navy600: '#0057cf',
  navy400: '#485d92',
  navyDark: '#003687',
  navy100: '#ebf1fc',
  onSurface: '#191b24',
  onSurfaceVariant: '#424655',
  surfaceVariant: '#d8e0f4',
  surfaceLowest: '#ffffff',
  surfaceContainer: '#edf2fb',
  surfaceContainerHigh: '#e8edf7',
  surfaceLow: '#f1f6fe',
  surfaceHighest: '#e3e9f8',
  outline: '#727787',
  outlineVariant: '#c2c6d8',
  primaryTab: '#c3defe',
  primaryFixed: '#dae2ff',
  secondaryFixed: '#dfe2f9',
  tertiaryFixed: '#ffd8e4',
  inverseSurface: '#2e3038',
  inverseOnSurface: '#f0f0f7',
  certaintyHigh: '#2c9b4b',
  certaintyMedium: '#ff9800',
  ratingActive: '#0b2d6e',
  highlightGreen: '#d6efdd',
  highlightRed: '#f4d9d9',
  highlightYellow: '#fff2cc',
  mandatoryRow: '#e6f1ff',
  white: '#ffffff',
  rowHover: '#f1f6fe',
  rowSelected: 'rgba(11,45,110,0.08)',
  rowSelectedHover: 'rgba(11,45,110,0.14)',
  diffRemovedBg: '#f4d9d9',
  diffRemovedText: '#5f2120',
  diffAddedBg: '#d6efdd',
  diffAddedText: '#1e4620',
  appBackground: '#ebf1fc',
  navSurface: '#0b2d6e',
} as const;

const darkTokens = {
  ...baseTokens,
  navy900: '#101a2b',
  navy800: '#16243d',
  navy700: '#91c2fd',
  navy600: '#c3defe',
  navy400: '#dae2ff',
  navyDark: '#6fa8ff',
  navy100: '#0b1220',
  onSurface: '#f0f4fb',
  onSurfaceVariant: '#c2cad8',
  surfaceVariant: '#33415c',
  surfaceLowest: '#0b1220',
  surfaceContainer: '#162033',
  surfaceContainerHigh: '#1e2b43',
  surfaceLow: '#132038',
  surfaceHighest: '#24314a',
  outline: '#98a2b8',
  outlineVariant: '#3b4a66',
  primaryTab: 'rgba(145,194,253,0.18)',
  primaryFixed: '#405d92',
  secondaryFixed: '#404a68',
  tertiaryFixed: '#6c5568',
  inverseSurface: '#f0f4fb',
  inverseOnSurface: '#16243d',
  certaintyHigh: '#4caf50',
  certaintyMedium: '#ff9800',
  ratingActive: '#91c2fd',
  highlightGreen: 'rgba(44,155,75,0.18)',
  highlightRed: 'rgba(239,83,80,0.18)',
  highlightYellow: 'rgba(255,200,64,0.18)',
  mandatoryRow: 'rgba(145,194,253,0.14)',
  white: '#ffffff',
  rowHover: 'rgba(145,194,253,0.08)',
  rowSelected: 'rgba(145,194,253,0.16)',
  rowSelectedHover: 'rgba(145,194,253,0.22)',
  diffRemovedBg: 'rgba(239,83,80,0.18)',
  diffRemovedText: '#ffb4ab',
  diffAddedBg: 'rgba(76,175,80,0.18)',
  diffAddedText: '#9ae6b4',
  appBackground: '#0b1220',
  navSurface: '#16243d',
} as const;

type InflowThemeTokens = typeof lightTokens | typeof darkTokens;

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
  };
};

export const createInflowTheme = (requestedMode: InflowColorMode = 'light') => {
  const mode = resolveInflowColorMode(requestedMode);
  const T = getInflowTokensForMode(mode);

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
        main: mode === 'dark' ? T.surfaceHighest : T.navy800,
        dark: mode === 'dark' ? T.surfaceContainerHigh : '#000000',
        light: mode === 'dark' ? T.surfaceVariant : T.navy800,
        contrastText: mode === 'dark' ? T.onSurface : '#ffffff',
      },
      error: { ...T.error, contrastText: '#ffffff' },
      warning: { ...T.warning, contrastText: '#ffffff' },
      info: { ...T.info, contrastText: '#ffffff' },
      success: { ...T.success, contrastText: '#ffffff' },
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
      h1: { fontWeight: 300, fontSize: '6rem', lineHeight: 1.167, letterSpacing: '-1.5px' },
      h2: { fontWeight: 300, fontSize: '3.75rem', lineHeight: 1.2, letterSpacing: '-0.5px' },
      h3: { fontWeight: 400, fontSize: '3rem', lineHeight: 1.167, letterSpacing: 0 },
      h4: { fontWeight: 400, fontSize: '2.125rem', lineHeight: 1.235, letterSpacing: '0.25px' },
      h5: { fontWeight: 400, fontSize: '1.5rem', lineHeight: 1.334, letterSpacing: 0 },
      h6: { fontWeight: 700, fontSize: '1.375rem', lineHeight: '36px', letterSpacing: '0.15px' },
      subtitle1: { fontWeight: 400, fontSize: '1rem', lineHeight: 1.5, letterSpacing: '0.15px' },
      subtitle2: { fontWeight: 500, fontSize: '0.875rem', lineHeight: '20px', letterSpacing: '0.1px' },
      body1: { fontWeight: 400, fontSize: '1rem', lineHeight: '24px', letterSpacing: '0.5px' },
      body2: { fontWeight: 400, fontSize: '0.875rem', lineHeight: '20px', letterSpacing: '0.25px' },
      button: { fontWeight: 500, fontSize: '0.875rem', lineHeight: '20px', letterSpacing: '0.1px', textTransform: 'capitalize' },
      caption: { fontWeight: 400, fontSize: '0.75rem', lineHeight: '16px', letterSpacing: '0.4px' },
      overline: { fontWeight: 400, fontSize: '0.75rem', lineHeight: 1, letterSpacing: '1px', textTransform: 'uppercase' },
    },

    components: {
      MuiButton: {
        defaultProps: { disableElevation: true, variant: 'contained' },
        styleOverrides: {
          root: { borderRadius: T.radiusSm, fontWeight: 500, letterSpacing: '0.1px' },
          sizeSmall: { height: 30, padding: '0 16px', fontSize: '0.8125rem' },
          sizeMedium: { height: 40, padding: '0 24px', fontSize: '0.875rem' },
          sizeLarge: { height: 40, padding: '0 24px', fontSize: '0.875rem' },
          containedPrimary: {
            backgroundColor: T.navy700,
            color: mode === 'dark' ? T.navy900 : '#ffffff',
            '&:hover': { backgroundColor: T.navyDark },
          },
          outlined: { borderColor: T.outlineVariant },
          outlinedPrimary: {
            color: T.navy700,
            borderColor: T.outlineVariant,
            '&:hover': { borderColor: T.navy700, backgroundColor: T.rowSelected },
          },
          textPrimary: { color: T.navy700 },
        },
      },
      MuiIconButton: {
        styleOverrides: { root: { color: T.onSurfaceVariant, borderRadius: T.radiusFull } },
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
            letterSpacing: '0.1px',
            borderColor: T.outline,
            '&.Mui-selected': {
              backgroundColor: T.primaryTab,
              color: T.navy700,
              fontWeight: 700,
              boxShadow: `inset 0 0 0 1px ${T.navy700}`,
              '&:hover': { backgroundColor: T.primaryTab },
            },
          },
        },
      },
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
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: T.radiusXs,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: T.outline },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: T.onSurface },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: T.navy700, borderWidth: 2 },
          },
          notchedOutline: {
            '& legend span': { paddingRight: 0 },
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
            lineHeight: 1,
            '&.MuiInputLabel-outlined.MuiInputLabel-shrink': {
              transform: 'translate(14px, -6px) scale(0.75)',
            },
            '&.Mui-focused': { color: T.navy700 },
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
                color: '#fff',
                '& + .MuiSwitch-track': { backgroundColor: trackColor, opacity: 1 },
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
          root: {
            backgroundImage: 'none',
          },
        },
        defaultProps: { elevation: 1 },
      },
      MuiCard: { styleOverrides: { root: { borderRadius: T.radiusSm } }, defaultProps: { elevation: 1 } },
      MuiDialog: { styleOverrides: { paper: { borderRadius: T.radiusXl } } },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            backgroundColor: T.surfaceHighest,
            padding: 24,
            fontSize: '1.5rem',
            fontWeight: 400,
            lineHeight: 1.334,
            letterSpacing: 0,
          },
        },
      },
      MuiDialogContent: { styleOverrides: { root: { padding: '24px', paddingTop: '24px !important' } } },
      MuiDialogActions: { styleOverrides: { root: { padding: '8px 24px 24px' } } },
      MuiMenu: { styleOverrides: { paper: { borderRadius: T.radiusXs } } },
      MuiAutocomplete: {
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
            backgroundColor: mode === 'dark' ? T.surfaceHighest : '#616161',
            color: mode === 'dark' ? T.onSurface : '#ffffff',
            fontSize: '0.75rem',
            borderRadius: T.radiusXs,
            border: `1px solid ${mode === 'dark' ? T.outlineVariant : 'transparent'}`,
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
              color: colorKey === 'secondary' && mode === 'dark' ? T.onSurface : T.white,
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
                    lineHeight: '16px',
                    minWidth: 16,
                    height: 16,
                    padding: '0 4px',
                    borderRadius: 8,
                  }),
            };
          },
        },
      },
      MuiDrawer: { styleOverrides: { paper: { borderRight: `1px solid ${T.outlineVariant}` } } },

      MuiChip: {
        defaultProps: { size: 'medium' },
        styleOverrides: {
          root: {
            borderRadius: T.radiusFull,
            fontWeight: 500,
            letterSpacing: '0.1px',
            maxWidth: '100%',
            '&.MuiChip-sizeSmall': {
              height: 24,
              fontSize: '0.75rem',
            },
            '&.MuiChip-sizeMedium': {
              height: 32,
              fontSize: '0.875rem',
            },
            '&.MuiChip-sizeSmall > .MuiChip-label': {
              paddingLeft: 8,
              paddingRight: 8,
            },
            '&.MuiChip-sizeMedium > .MuiChip-label': {
              paddingLeft: 12,
              paddingRight: 12,
            },
            '&.MuiChip-sizeSmall > .MuiChip-icon, &.MuiChip-sizeSmall > .MuiChip-deleteIcon': {
              fontSize: 14,
            },
            '&.MuiChip-sizeMedium > .MuiChip-icon, &.MuiChip-sizeMedium > .MuiChip-deleteIcon': {
              fontSize: 18,
            },
          },
          outlined: { borderColor: T.outlineVariant, color: T.onSurfaceVariant, backgroundColor: T.surfaceLowest },
          outlinedPrimary: {
            borderColor: T.outlineVariant,
            color: T.navy700,
            backgroundColor: T.surfaceLowest,
            '&:hover': { borderColor: T.navy400, backgroundColor: T.rowHover },
          },
          filledPrimary: {
            backgroundColor: T.primaryTab,
            color: mode === 'dark' ? T.navy700 : T.navy700,
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.grey[400],
            color: T.white,
            fontSize: '1.25rem',
            fontWeight: 400,
            letterSpacing: '0.14px',
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: T.outlineVariant, fontSize: '0.875rem', letterSpacing: '0.25px' },
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

      MuiTabs: { styleOverrides: { indicator: { backgroundColor: T.navy700, height: 2 } } },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            letterSpacing: '0.1px',
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
          root: { '&.Mui-active': { color: T.navy700 }, '&.Mui-completed': { color: T.navy700 } },
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
        styleOverrides: {
          standardError: { backgroundColor: mode === 'dark' ? T.diffRemovedBg : '#fdeded', color: mode === 'dark' ? T.diffRemovedText : '#5f2120' },
          standardWarning: { backgroundColor: mode === 'dark' ? T.highlightYellow : '#fff4e5', color: mode === 'dark' ? T.onSurface : '#663c00' },
          standardInfo: { backgroundColor: mode === 'dark' ? T.rowSelected : '#e5f6fd', color: mode === 'dark' ? T.onSurface : '#014361' },
          standardSuccess: { backgroundColor: mode === 'dark' ? T.diffAddedBg : '#edf7ed', color: mode === 'dark' ? T.diffAddedText : '#1e4620' },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? T.surfaceHighest : '#c9dcff',
            color: T.onSurface,
            borderRadius: T.radiusMd,
            boxShadow: 'none',
            minHeight: 48,
            padding: '12px 16px',
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: '20px',
            letterSpacing: '0.25px',
            '& .MuiSnackbarContent-message': {
              padding: 0,
            },
            '& .MuiSnackbarContent-action': {
              marginRight: 0,
              paddingLeft: 16,
            },
            '& .MuiButton-root': {
              color: T.navy700,
              minWidth: 'auto',
              padding: 0,
            },
            '& .MuiIconButton-root': {
              color: T.onSurface,
            },
          },
        },
      },
      MuiLinearProgress: { styleOverrides: { root: { borderRadius: T.radiusFull } } },
      MuiAccordion: { styleOverrides: { root: { borderRadius: 0, '&:before': { display: 'none' } } } },
    },
  });
};

export const inflowTheme = createInflowTheme('light');
