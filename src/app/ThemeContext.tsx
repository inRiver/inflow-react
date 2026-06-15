import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { inriverTheme, defaultTheme } from '../theme';

type ThemeType = 'inriver' | 'default';

type ThemeContextType = {
  currentTheme: ThemeType;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a CustomThemeProvider');
  }
  return context;
};

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('showcase-theme');
    return (savedTheme === 'inriver' || savedTheme === 'default') ? savedTheme : 'inriver';
  });

  useEffect(() => {
    localStorage.setItem('showcase-theme', currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === 'inriver' ? 'default' : 'inriver'));
  };

  const themeToApply = currentTheme === 'inriver' ? inriverTheme : defaultTheme;

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      <MuiThemeProvider theme={themeToApply}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
