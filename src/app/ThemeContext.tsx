import React, { createContext, useContext, useEffect, useState } from 'react';
import { INFLOW_DARK_MODE_ENABLED, type InflowColorMode } from '../theme';
import { InflowProvider } from '../providers';
import { darkTokens } from '../theme/inflow-tokens';

type ColorModePreference = InflowColorMode | 'system';

const COLOR_MODE_STORAGE_KEY = 'inflow-color-mode';

const getSystemColorMode = (): InflowColorMode => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

type ThemeContextType = {
  colorModePreference: ColorModePreference;
  resolvedColorMode: InflowColorMode;
  setColorModePreference: (mode: ColorModePreference) => void;
  cycleColorMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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
  const [colorModePreference, setColorModePreference] = useState<ColorModePreference>(() => {
    if (typeof window === 'undefined') {
      return 'system';
    }

    const savedMode = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    return savedMode === 'light' || savedMode === 'dark' || savedMode === 'system' ? savedMode : 'system';
  });
  const [systemColorMode, setSystemColorMode] = useState<InflowColorMode>(getSystemColorMode);

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

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

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

  // The scoped baseline only paints the app area. Tell the browser about the mode too, so the page
  // edge, overscroll and native scrollbars are dark instead of white. Light keeps its original styles.
  useEffect(() => {
    const root = document.documentElement;
    root.style.colorScheme = resolvedColorMode;
    root.style.backgroundColor = resolvedColorMode === 'dark' ? darkTokens.appBackground : '';
    return () => {
      root.style.colorScheme = '';
      root.style.backgroundColor = '';
    };
  }, [resolvedColorMode]);

  return (
    <ThemeContext.Provider
      value={{
        colorModePreference,
        resolvedColorMode,
        setColorModePreference,
        cycleColorMode,
      }}
    >
      <InflowProvider mode={resolvedColorMode}>
        {children}
      </InflowProvider>
    </ThemeContext.Provider>
  );
};
