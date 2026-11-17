import { createTheme } from '@mui/material/styles';
import { getInflowPalette, type InflowColorMode } from './inflow';
import { resolveInflowColorMode } from './featureFlags';

/**
 * Default MUI v6 theme - vanilla Material Design
 * Used for side-by-side comparison with the Inflow theme
 *
 * @deprecated The showcase no longer offers an MUI-default comparison. This export is
 * retained only for backward compatibility and will be removed in the next major release.
 * Prefer {@link createInflowTheme}.
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

/**
 * @deprecated The showcase no longer offers an MUI-default comparison. This export is
 * retained only for backward compatibility and will be removed in the next major release.
 * Prefer {@link inflowTheme}.
 */
export const defaultTheme = createDefaultTheme('light');
