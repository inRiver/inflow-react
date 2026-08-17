// Canonical source: docs/mui/inflow-theme.js
import { createTheme } from '@mui/material/styles';
import type { Shadows } from '@mui/material/styles';
import { resolveInflowColorMode } from './featureFlags';
import { darkTokens, lightTokens, type InflowThemeTokens } from './inflow-tokens';

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
      h1: { fontWeight: 300, fontSize: '6rem', lineHeight: 1.167, letterSpacing: '-0.09375rem' },
      h2: { fontWeight: 300, fontSize: '3.75rem', lineHeight: 1.2, letterSpacing: '-0.03125rem' },
      h3: { fontWeight: 400, fontSize: '3rem', lineHeight: 1.167, letterSpacing: 0 },
      h4: { fontWeight: 400, fontSize: '2.125rem', lineHeight: 1.235, letterSpacing: '0.015625rem' },
      h5: { fontWeight: 400, fontSize: '1.5rem', lineHeight: 1.334, letterSpacing: 0 },
      h6: { fontWeight: 700, fontSize: '1.375rem', lineHeight: '2.25rem', letterSpacing: '0.009375rem' },
      subtitle1: { fontWeight: 400, fontSize: '1rem', lineHeight: 1.5, letterSpacing: '0.009375rem' },
      subtitle2: { fontWeight: 500, fontSize: '0.875rem', lineHeight: '1.25rem', letterSpacing: '0.00625rem' },
      body1: { fontWeight: 400, fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '0.03125rem' },
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
                  '&:hover': { borderColor: T.navy700, backgroundColor: T.rowSelected },
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
          sizeLarge: ({ theme }) => ({ height: 40, padding: theme.spacing(0, 3), fontSize: '0.875rem' }),
          outlined: { borderColor: T.outlineVariant },
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
            letterSpacing: '0.00625rem',
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
        defaultProps: { size: 'medium' },
        styleOverrides: {
          root: {
            borderRadius: T.radiusFull,
            fontWeight: 500,
            letterSpacing: '0.00625rem',
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
            color: T.white,
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

      MuiTabs: { styleOverrides: { indicator: { backgroundColor: T.navy700, height: 2 } } },
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
          root: {
            variants: [
              {
                props: { variant: 'standard', color: 'error' },
                style: {
                  backgroundColor: mode === 'dark' ? T.diffRemovedBg : '#fdeded',
                  color: mode === 'dark' ? T.diffRemovedText : '#5f2120',
                },
              },
              {
                props: { variant: 'standard', color: 'warning' },
                style: {
                  backgroundColor: mode === 'dark' ? T.highlightYellow : '#fff4e5',
                  color: mode === 'dark' ? T.onSurface : '#663c00',
                },
              },
              {
                props: { variant: 'standard', color: 'info' },
                style: {
                  backgroundColor: mode === 'dark' ? T.rowSelected : '#e5f6fd',
                  color: mode === 'dark' ? T.onSurface : '#014361',
                },
              },
              {
                props: { variant: 'standard', color: 'success' },
                style: {
                  backgroundColor: mode === 'dark' ? T.diffAddedBg : '#edf7ed',
                  color: mode === 'dark' ? T.diffAddedText : '#1e4620',
                },
              },
            ],
          },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: mode === 'dark' ? T.surfaceHighest : '#c9dcff',
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
      MuiAccordion: { styleOverrides: { root: { borderRadius: 0, '&:before': { display: 'none' } } } },
    },
  });
};

export const inflowTheme = createInflowTheme('light');
