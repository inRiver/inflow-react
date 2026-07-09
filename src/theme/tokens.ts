// Extracted design tokens from Inflow theme
// These tokens are used for documentation and direct access to design system values

// Custom palette extensions for Inflow-specific tokens
export const inflowCustomColors = {
  background: '#EBF1FC',
  buttonHover: '#91C2FD',
  certaintyHigh: '#2C9B4B',
  certaintyMedium: '#FBC02D',
  dialogHeader: '#E3E9F8',
  highlightGreen: '#D6EFDD',
  highlightRed: '#F4D9D9',
  highlightYellow: '#FAEDD1',
  primaryTab: '#C3DEFE',
  rowMandatory: '#C9DCFF',
  search: '#EBF1FC',
} as const;

// Spacing tokens mapped to design system variables
export const inflowSpacing = {
  xxs: 4,  // $spacing-xxs
  xs: 8,   // $spacing-xs
  s: 16,   // $spacing-s
  m: 24,   // $spacing-m
  l: 48,   // $spacing-l
  xl: 96,  // $spacing-xl
} as const;

// Core design tokens extracted from theme
export const inflowTokens = {
  colors: {
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
    ratingActive: '#0b2d6e',
    primaryTab: '#c3defe',
    white: '#ffffff',
    
    rowHover: '#f1f6fe',
    rowSelected: 'rgba(11,45,110,0.08)',
    rowSelectedHover: 'rgba(11,45,110,0.14)',
    
    diffRemovedBg: '#f4d9d9',
    diffRemovedText: '#5f2120',
    diffAddedBg: '#d6efdd',
    diffAddedText: '#1e4620',
  },
  
  radius: {
    xs: 4,
    sm: 5,
    md: 8,
    lg: 10,
    xl: 28,
    full: 9999,
  },
  
  spacing: inflowSpacing,
  
  shadows: {
    e1: '0 1px 3px 1px rgba(0,0,0,0.15), 0 1px 2px 0 rgba(0,0,0,0.30)',
    e2: '0 2px 6px 2px rgba(0,0,0,0.15), 0 1px 2px 0 rgba(0,0,0,0.30)',
    e3: '0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px 0 rgba(0,0,0,0.30)',
  },
  
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
} as const;
