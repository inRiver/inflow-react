import createCache, { type EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ScopedCssBaseline } from '@mui/material';
import { ThemeProvider, type SxProps, type Theme } from '@mui/material/styles';
import { useMemo, type ReactNode } from 'react';
import { createInflowTheme, type InflowColorMode } from '../theme/inflow';

export interface InflowProviderProps {
  children: ReactNode;
  /** Color mode used to create the Inflow theme. Defaults to light. */
  mode?: InflowColorMode;
  /** Class name applied to the scoped Inflow root. */
  className?: string;
  /** Additional styles for the scoped Inflow root. */
  sx?: SxProps<Theme>;
  /**
   * Unique key for the Emotion cache created by this provider.
   * Set a distinct value for independently deployed microfrontends sharing a page.
   */
  cacheKey?: string;
  /**
   * Caller-owned Emotion cache, for example one that targets a Shadow DOM or iframe.
   * When supplied, cacheKey is ignored.
   */
  emotionCache?: EmotionCache;
}

const createInflowVariables = (theme: Theme) => ({
  '--infl-surface-container-lowest-color': theme.palette.inflow.surfaceLowest,
  '--infl-surface-container-low-color': theme.palette.inflow.surfaceLow,
  '--infl-surface-container-color': theme.palette.inflow.surfaceContainer,
  '--infl-surface-container-high-color': theme.palette.inflow.surfaceContainerHigh,
  '--infl-surface-container-highest-color': theme.palette.inflow.surfaceHighest,
  '--infl-primary-color': theme.palette.primary.main,
  '--infl-primary-fixed-color': theme.palette.inflow.primaryFixed,
  '--infl-secondary-fixed-color': theme.palette.inflow.secondaryFixed,
  '--infl-tertiary-fixed-color': theme.palette.inflow.tertiaryFixed,
  '--infl-on-surface-color': theme.palette.text.primary,
  '--infl-on-surface-variant-color': theme.palette.text.secondary,
  '--infl-inverse-surface-color': theme.palette.inflow.inverseSurface,
  '--infl-inverse-on-surface-color': theme.palette.inflow.inverseOnSurface,
  '--infl-outline-color': theme.palette.inflow.outline,
  '--infl-outline-variant-color': theme.palette.inflow.outlineVariant,
  '--infl-certainty-high-color': theme.palette.inflow.certaintyHigh,
  '--infl-certainty-medium-color': theme.palette.inflow.certaintyMedium,
  '--infl-highlight-green-color': theme.palette.inflow.highlightGreen,
  '--infl-highlight-red-color': theme.palette.inflow.highlightRed,
  '--infl-highlight-yellow-color': theme.palette.inflow.highlightYellow,
  '--infl-row-hover-color': theme.palette.inflow.rowHover,
  '--infl-row-selected-color': theme.palette.inflow.rowSelected,
  '--infl-mandatory-row-color': theme.palette.inflow.mandatoryRow,
});

/**
 * Provides a scoped Inflow theme for embedded React applications.
 *
 * Baseline styles and `--infl-*` variables are attached to this provider's root,
 * not the host document. Pass emotionCache when styles must target a Shadow DOM
 * or iframe container.
 */
export function InflowProvider({
  children,
  mode = 'light',
  className,
  sx,
  cacheKey = 'inflow',
  emotionCache,
}: InflowProviderProps) {
  const theme = useMemo(() => createInflowTheme(mode), [mode]);
  const internalCache = useMemo(() => createCache({ key: cacheKey }), [cacheKey]);
  const cache = emotionCache ?? internalCache;
  const rootSx = useMemo<SxProps<Theme>>(
    () => [
      createInflowVariables(theme),
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ],
    [sx, theme],
  );

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <ScopedCssBaseline
          data-inflow-root=""
          className={className}
          enableColorScheme
          sx={rootSx}
        >
          {children}
        </ScopedCssBaseline>
      </ThemeProvider>
    </CacheProvider>
  );
}
