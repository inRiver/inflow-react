// Canonical source: docs/mui/inriver-theme.js
import { createTheme } from '@mui/material/styles';
import type { Shadows } from '@mui/material/styles';

interface InriverPalette {
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
}

declare module '@mui/material/styles' {
  interface Palette { inriver: InriverPalette; }
  interface PaletteOptions { inriver?: InriverPalette; }
}

const T = {
  navy900: '#16243d',
  navy800: '#22243d',
  navy700: '#0b2d6e',
  navy600: '#0057cf',
  navy400: '#485d92',
  navyDark: '#003687',
  navy100: '#ebf1fc',

  error: { main: '#ba1a1a', dark: '#c62828', light: '#ef5350' },
  warning: { main: '#ff6424', dark: '#e65100', light: '#ff9800' },
  info: { main: '#0057cf', dark: '#00419f', light: '#2067cc' },
  success: { main: '#2c9b4b', dark: '#1b5e20', light: '#4caf50' },

  onSurface: '#191b24',
  onSurfaceVariant: '#424655',
  surfaceVariant: '#d8e0f4',
  surfaceLow: '#f1f6fe',
  surfaceHighest: '#e3e9f8',
  outline: '#727787',
  outlineVariant: '#c2c6d8',
  primaryTab: '#c3defe',
  white: '#ffffff',

  rowHover: '#f1f6fe',
  rowSelected: 'rgba(11,45,110,0.08)',
  rowSelectedHover: 'rgba(11,45,110,0.14)',

  diffRemovedBg: '#f4d9d9',
  diffRemovedText: '#5f2120',
  diffAddedBg: '#d6efdd',
  diffAddedText: '#1e4620',

  radiusXs: 4,
  radiusSm: 5,
  radiusMd: 8,
  radiusLg: 10,
  radiusXl: 28,
  radiusFull: 9999,
} as const;

const E1 = '0 1px 3px 1px rgba(0,0,0,0.15), 0 1px 2px 0 rgba(0,0,0,0.30)';
const E2 = '0 2px 6px 2px rgba(0,0,0,0.15), 0 1px 2px 0 rgba(0,0,0,0.30)';
const E3 = '0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px 0 rgba(0,0,0,0.30)';

const shadows = [
  'none',
  ...Array.from({ length: 2 }, () => E1),
  ...Array.from({ length: 6 }, () => E2),
  ...Array.from({ length: 16 }, () => E3),
] as Shadows;

export const theme = createTheme({
  shape: { borderRadius: T.radiusSm },
  spacing: 8,
  shadows,

  palette: {
    mode: 'light',
    primary: { main: T.navy700, dark: T.navyDark, light: T.navy400, contrastText: '#ffffff' },
    secondary: { main: T.navy800, dark: '#000000', light: T.navy800, contrastText: '#ffffff' },
    error: { ...T.error, contrastText: '#ffffff' },
    warning: { ...T.warning, contrastText: '#ffffff' },
    info: { ...T.info, contrastText: '#ffffff' },
    success: { ...T.success, contrastText: '#ffffff' },
    text: {
      primary: T.onSurface,
      secondary: T.onSurfaceVariant,
      disabled: 'rgba(0,0,0,0.38)',
    },
    divider: T.outlineVariant,
    action: { disabled: 'rgba(0,0,0,0.38)', disabledBackground: 'rgba(0,0,0,0.12)' },
    background: { default: T.navy100, paper: '#ffffff' },
    inriver: {
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
      appBackground: T.navy100,
      navSurface: T.navy800,
      rowHover: T.rowHover,
      rowSelected: T.rowSelected,
      rowSelectedHover: T.rowSelectedHover,
      diffRemovedBg: T.diffRemovedBg,
      diffRemovedText: T.diffRemovedText,
      diffAddedBg: T.diffAddedBg,
      diffAddedText: T.diffAddedText,
    },
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
    h6: { fontWeight: 700, fontSize: '1.25rem', lineHeight: '24px', letterSpacing: '0.15px' },
    subtitle1: { fontWeight: 400, fontSize: '1rem', lineHeight: 1.5, letterSpacing: '0.15px' },
    subtitle2: { fontWeight: 500, fontSize: '0.875rem', lineHeight: '20px', letterSpacing: '0.1px' },
    body1: { fontWeight: 400, fontSize: '1rem', lineHeight: '24px', letterSpacing: '0.5px' },
    body2: { fontWeight: 400, fontSize: '0.875rem', lineHeight: '20px', letterSpacing: '0.25px' },
    button: { fontWeight: 500, fontSize: '0.875rem', lineHeight: '20px', letterSpacing: '0.1px', textTransform: 'capitalize' },
    caption: { fontWeight: 400, fontSize: '0.75rem', lineHeight: '16px', letterSpacing: '0.4px' },
    overline: { fontWeight: 400, fontSize: '0.75rem', lineHeight: 1, letterSpacing: '1px', textTransform: 'uppercase' },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: T.navy100, color: T.onSurface },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true, variant: 'contained' },
      styleOverrides: {
        root: { borderRadius: T.radiusSm, fontWeight: 500, letterSpacing: '0.1px' },
        sizeSmall: { height: 30, padding: '0 16px', fontSize: '0.8125rem' },
        sizeMedium: { height: 40, padding: '0 24px', fontSize: '0.875rem' },
        sizeLarge: { height: 40, padding: '0 24px', fontSize: '0.875rem' },
        containedPrimary: {
          backgroundColor: T.navy700,
          '&:hover': { backgroundColor: T.navyDark },
        },
        outlined: { borderColor: T.outline },
        outlinedPrimary: {
          color: T.navy700,
          borderColor: T.outline,
          '&:hover': { borderColor: T.navy700, backgroundColor: 'rgba(11,45,110,0.08)' },
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
            '&:hover': { backgroundColor: T.primaryTab },
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: T.navy700,
          color: '#fff',
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
          '&:hover': { backgroundColor: '#dbe2f4' },
          '&.Mui-focused': { backgroundColor: T.surfaceHighest },
          '&:after': { borderBottomColor: T.navy700 },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { '&.Mui-focused': { color: T.navy700 } } } },

    MuiCheckbox: { styleOverrides: { root: { color: T.outline, '&.Mui-checked': { color: T.navy700 } } } },
    MuiRadio: { styleOverrides: { root: { color: T.outline, '&.Mui-checked': { color: T.navy700 } } } },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: '#fff',
            '& + .MuiSwitch-track': { backgroundColor: T.navy700, opacity: 1 },
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: T.navy400 },
        rail: { backgroundColor: T.surfaceVariant, opacity: 1 },
        track: { backgroundColor: T.navy400, border: 'none' },
        thumb: { backgroundColor: T.navy400 },
      },
    },

    MuiAppBar: {
      defaultProps: {
        color: 'primary',
      },
      styleOverrides: {
        root: {
          backgroundColor: T.navy700,
          color: '#ffffff',
          boxShadow: E1,
        },
        colorPrimary: {
          backgroundColor: T.navy700,
          color: '#ffffff',
        },
      },
    },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: T.radiusSm } }, defaultProps: { elevation: 1 } },
    MuiCard: { styleOverrides: { root: { borderRadius: T.radiusSm } }, defaultProps: { elevation: 1 } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: T.radiusXl } } },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: T.surfaceHighest,
          padding: 24,
          fontSize: '1.25rem',
          fontWeight: 700,
          lineHeight: 1.334,
          letterSpacing: 0,
        },
      },
    },
    MuiDialogContent: { styleOverrides: { root: { padding: '24px' } } },
    MuiDialogActions: { styleOverrides: { root: { padding: '8px 24px 24px' } } },
    MuiMenu: { styleOverrides: { paper: { borderRadius: T.radiusXs } } },
    MuiAutocomplete: {
      styleOverrides: {
        paper: { borderRadius: T.radiusXs },
        option: {
          '&:hover': { backgroundColor: `${T.rowHover} !important` },
          '&.Mui-focused': { backgroundColor: `${T.rowHover} !important` },
          '&[aria-selected="true"]': {
            backgroundColor: `${T.rowSelected} !important`,
            '&:hover, &.Mui-focused': { backgroundColor: `${T.rowSelectedHover} !important` },
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
      styleOverrides: { tooltip: { backgroundColor: '#616161', fontSize: '0.75rem', borderRadius: T.radiusXs } },
    },
    MuiDrawer: { styleOverrides: { paper: { borderRight: `1px solid ${T.outlineVariant}` } } },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: T.radiusFull, fontWeight: 500, letterSpacing: '0.1px' },
        outlined: { borderColor: T.outlineVariant, color: T.onSurfaceVariant },
        filledPrimary: { backgroundColor: T.primaryTab, color: T.navy700 },
      },
    },
    MuiAvatar: { styleOverrides: { root: { backgroundColor: T.navy700, fontSize: '0.875rem' } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: T.outlineVariant, fontSize: '0.875rem', letterSpacing: '0.25px' },
        head: { fontWeight: 600, color: T.navy800 },
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
      styleOverrides: { root: { '&.Mui-selected': { backgroundColor: T.primaryTab, color: T.navy700 } } },
    },
    MuiBreadcrumbs: { styleOverrides: { separator: { color: T.onSurfaceVariant } } },
    MuiLink: { defaultProps: { color: 'primary' }, styleOverrides: { root: { textDecorationColor: 'inherit' } } },
    MuiStepIcon: {
      styleOverrides: {
        root: { '&.Mui-active': { color: T.navy700 }, '&.Mui-completed': { color: T.navy700 } },
      },
    },

    MuiAlert: {
      styleOverrides: {
        standardError: { backgroundColor: '#fdeded', color: '#5f2120' },
        standardWarning: { backgroundColor: '#fff4e5', color: '#663c00' },
        standardInfo: { backgroundColor: '#e5f6fd', color: '#014361' },
        standardSuccess: { backgroundColor: '#edf7ed', color: '#1e4620' },
      },
    },
    MuiSnackbarContent: { styleOverrides: { root: { backgroundColor: '#323232', borderRadius: T.radiusSm } } },
    MuiLinearProgress: { styleOverrides: { root: { borderRadius: T.radiusFull } } },
    MuiAccordion: { styleOverrides: { root: { borderRadius: 0, '&:before': { display: 'none' } } } },
  },
});
