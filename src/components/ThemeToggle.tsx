import React from 'react';
import { FormControlLabel, Switch, Box, Typography } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import { useTheme } from '../app/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { currentTheme, toggleTheme } = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {currentTheme === 'inriver' ? (
        <PaletteIcon color="primary" />
      ) : (
        <InvertColorsIcon color="action" />
      )}
      <FormControlLabel
        control={
          <Switch
            checked={currentTheme === 'inriver'}
            onChange={toggleTheme}
            color="primary"
            inputProps={{ 'aria-label': 'Toggle Theme' }}
          />
        }
        label={
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {currentTheme === 'inriver' ? 'Inriver Theme' : 'Default MUI'}
          </Typography>
        }
      />
    </Box>
  );
};
