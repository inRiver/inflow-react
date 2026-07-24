import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ScopedCssBaseline } from '@mui/material';
import {
  createDefaultTheme,
  INFLOW_DARK_MODE_ENABLED,
  type InflowColorMode,
} from '../theme';
import { InflowProvider } from '../providers';

type ThemeType = 'inflow' | 'default';
type ColorModePreference = InflowColorMode | 'system';

const THEME_STORAGE_KEY = 'showcase-theme';
const COLOR_MODE_STORAGE_KEY = 'inflow-color-mode';

const getSystemColorMode = (): InflowColorMode => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

type ThemeContextType = {
  currentTheme: ThemeType;
  toggleTheme: () => void;
  colorModePreference: ColorModePreference;
  resolvedColorMode: InflowColorMode;
  setColorModePreference: (mode: ColorModePreference) => void;
  cycleColorMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export { INFLOW_DARK_MODE_ENABLED as DARK_MODE_ENABLED };

// eslint-disable-next-line react-refresh/only-export-components
export const useShowcaseTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a CustomThemeProvider');
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = useShowcaseTheme;

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    if (typeof window === 'undefined') {
      return 'inflow';
    }

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return (savedTheme === 'inflow' || savedTheme === 'default') ? savedTheme : 'inflow';
  });
  const [colorModePreference, setColorModePreference] = useState<ColorModePreference>(() => {
    if (typeof window === 'undefined') {
      return 'system';
    }

    const savedMode = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    return savedMode === 'light' || savedMode === 'dark' || savedMode === 'system' ? savedMode : 'system';
  });
  const [systemColorMode, setSystemColorMode] = useState<InflowColorMode>(getSystemColorMode);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, colorModePreference);
  }, [colorModePreference]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemColorMode(event.matches ? 'dark' : 'light');
    };

    setSystemColorMode(mediaQuery.matches ? 'dark' : 'light');

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === 'inflow' ? 'default' : 'inflow'));
  };

  const cycleColorMode = () => {
    if (!INFLOW_DARK_MODE_ENABLED) return; // No-op when dark mode is disabled
    setColorModePreference((previousMode) => {
      if (previousMode === 'system') return 'light';
      if (previousMode === 'light') return 'dark';
      return 'system';
    });
  };

  const resolvedColorMode: InflowColorMode = INFLOW_DARK_MODE_ENABLED
    ? colorModePreference === 'system'
      ? systemColorMode
      : colorModePreference
    : 'light'; // Always light when dark mode is disabled

  // Only the 'default' comparison branch needs a locally-created theme;
  // the 'inflow' branch's theme is created internally by InflowProvider
  // (see render below) - this keeps the canonical InflowProvider as the
  // single source of truth for the Inflow theme, rather than duplicating
  // createInflowTheme(...) here as well.
  const defaultThemeToApply = useMemo(
    () => createDefaultTheme(resolvedColorMode),
    [resolvedColorMode],
  );

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        toggleTheme,
        colorModePreference,
        resolvedColorMode,
        setColorModePreference,
        cycleColorMode,
      }}
    >
      {currentTheme === 'inflow' ? (
        <InflowProvider mode={resolvedColorMode}>
          {children}
        </InflowProvider>
      ) : (
        <MuiThemeProvider theme={defaultThemeToApply}>
          <ScopedCssBaseline>
            {children}
          </ScopedCssBaseline>
        </MuiThemeProvider>
      )}
    </ThemeContext.Provider>
  );
};
