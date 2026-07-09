import { createTheme } from '@mui/material/styles';
import { getInflowPalette, type InflowColorMode } from './inflow';

/**
 * Default MUI v6 theme - vanilla Material Design
 * Used for side-by-side comparison with the Inflow theme
 */
export const createDefaultTheme = (mode: InflowColorMode = 'light') =>
  createTheme({
    palette: {
      mode,
      inflow: getInflowPalette(mode),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': {
            colorScheme: mode,
          },
        },
      },
    },
  });

export const defaultTheme = createDefaultTheme('light');
