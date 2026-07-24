import { createTheme } from '@mui/material/styles';
import { getInflowPalette, type InflowColorMode } from './inflow';
import { resolveInflowColorMode } from './featureFlags';

/**
 * Default MUI v6 theme - vanilla Material Design
 * Used for side-by-side comparison with the Inflow theme
 */
export const createDefaultTheme = (requestedMode: InflowColorMode = 'light') => {
  const mode = resolveInflowColorMode(requestedMode);

  return createTheme({
    palette: {
      mode,
      inflow: getInflowPalette(mode),
    },
  });
};

export const defaultTheme = createDefaultTheme('light');
