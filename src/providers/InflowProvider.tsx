import { default as createCache, type EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ScopedCssBaseline } from '@mui/material';
import { ThemeProvider, type SxProps, type Theme } from '@mui/material/styles';
import { useMemo, type ReactNode } from 'react';
import { createInflowTheme, createInflowVariables, type InflowColorMode } from '../theme/inflow.js';

type EmotionCacheFactory = (options: Parameters<typeof createCache>[0]) => EmotionCache;
type EmotionCacheFactoryModule = { readonly default: EmotionCacheFactory };

function resolveEmotionCacheFactory(
  factory: EmotionCacheFactory | EmotionCacheFactoryModule,
): EmotionCacheFactory {
  return typeof factory === 'function' ? factory : factory.default;
}

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
  const internalCache = useMemo(() => resolveEmotionCacheFactory(createCache)({ key: cacheKey }), [cacheKey]);
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
