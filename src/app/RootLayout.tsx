import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  ButtonBase,
  Stack,
  alpha,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import { ComponentSidebar } from '../components/navigation/ComponentSidebar';
import { ComponentSearchDialog } from '../components/navigation/ComponentSearchDialog';
import { useShowcaseTheme } from './ThemeContext';

export function RootLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentTheme, toggleTheme, colorModePreference, resolvedColorMode, cycleColorMode } = useShowcaseTheme();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [componentSearchQuery, setComponentSearchQuery] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  const nextColorModePreference =
    colorModePreference === 'system' ? 'light' : colorModePreference === 'light' ? 'dark' : 'system';
  const colorModeLabel = colorModePreference === 'system'
    ? `System (${resolvedColorMode})`
    : colorModePreference.charAt(0).toUpperCase() + colorModePreference.slice(1);
  const themeVariantLabel = currentTheme === 'inflow' ? 'Inflow' : 'MUI default';
  const nextThemeVariantLabel = currentTheme === 'inflow' ? 'MUI default' : 'Inflow';
  const ColorModeIcon =
    colorModePreference === 'system'
      ? SettingsBrightnessOutlinedIcon
      : resolvedColorMode === 'dark'
        ? DarkModeOutlinedIcon
        : LightModeOutlinedIcon;

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchDialogOpen(true);
      }
    };

    window.addEventListener('keydown', handleShortcut);

    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, []);

  const handleDrawerToggle = () => {
    if (!isMobile && sidebarOpen && componentSearchQuery) {
      setComponentSearchQuery('');
    }

    setSidebarOpen((previousOpen) => !previousOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <ComponentSearchDialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} />

      <ComponentSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        searchQuery={componentSearchQuery}
        onSearchQueryChange={setComponentSearchQuery}
      />
      
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minWidth: 0, // Prevent flex item from overflowing
          width: '100%',
        }}
      >
        <AppBar 
          position="sticky"
          color="primary"
        >
          <Toolbar sx={{ gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: '#ffffff' }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              sx={{
                cursor: 'pointer',
                color: 'inherit',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                '&:hover': { opacity: 0.8 },
              }}
              noWrap
              onClick={() => navigate('/')}
            >
              Inflow
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="Search components"
                onClick={() => setSearchDialogOpen(true)}
                sx={{
                  border: `1px solid ${alpha(theme.palette.common.white, 0.24)}`,
                  borderRadius: 2,
                }}
              >
                <span className="material-icons-outlined">search</span>
              </IconButton>
            ) : (
              <Stack direction="row" spacing={1.25} alignItems="center">
                <ButtonBase
                  onClick={() => setSearchDialogOpen(true)}
                  sx={{
                    minWidth: 320,
                    borderRadius: 2.5,
                    border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
                    bgcolor: alpha(theme.palette.common.white, 0.08),
                    px: 1.75,
                    py: 1,
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    color: 'inherit',
                    transition: theme.transitions.create(['background-color', 'border-color', 'transform']),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.common.white, 0.12),
                      borderColor: alpha(theme.palette.common.white, 0.28),
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <span className="material-icons-outlined" aria-hidden="true">
                      search
                    </span>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 600 }}>
                        Search components...
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      color: alpha(theme.palette.common.white, 0.9),
                      borderRadius: 1.5,
                      border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
                      px: 0.9,
                      py: 0.45,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {navigator.platform.toUpperCase().includes('MAC') ? '⌘K' : 'Ctrl K'}
                  </Typography>
                </ButtonBase>

                <Tooltip title={`Color mode: ${colorModeLabel}. Click to switch to ${nextColorModePreference}.`}>
                  <ButtonBase
                    onClick={cycleColorMode}
                    aria-label={`Color mode: ${colorModeLabel}. Click to switch to ${nextColorModePreference}.`}
                    sx={{
                      borderRadius: 2.5,
                      border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
                      bgcolor: alpha(theme.palette.common.white, 0.08),
                      px: 1.5,
                      py: 1,
                      color: 'inherit',
                      gap: 1,
                      transition: theme.transitions.create(['background-color', 'border-color', 'transform']),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.common.white, 0.12),
                        borderColor: alpha(theme.palette.common.white, 0.28),
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    <ColorModeIcon fontSize="small" />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {colorModePreference === 'system' ? 'System' : colorModeLabel}
                    </Typography>
                    </ButtonBase>
                  </Tooltip>

                <Tooltip title={`Theme variant: ${themeVariantLabel}. Click to switch to ${nextThemeVariantLabel}.`}>
                  <ButtonBase
                    onClick={toggleTheme}
                    aria-label={`Theme variant: ${themeVariantLabel}. Click to switch to ${nextThemeVariantLabel}.`}
                    sx={{
                      borderRadius: 2.5,
                      border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
                      bgcolor: alpha(theme.palette.common.white, 0.08),
                      px: 1.5,
                      py: 1,
                      color: 'inherit',
                      gap: 1,
                      transition: theme.transitions.create(['background-color', 'border-color', 'transform']),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.common.white, 0.12),
                        borderColor: alpha(theme.palette.common.white, 0.28),
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    <PaletteOutlinedIcon fontSize="small" />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {themeVariantLabel}
                    </Typography>
                  </ButtonBase>
                </Tooltip>
              </Stack>
            )}

            {isMobile && (
              <Tooltip title={`Theme variant: ${themeVariantLabel}. Click to switch to ${nextThemeVariantLabel}.`}>
                <IconButton
                  color="inherit"
                  aria-label={`Theme variant: ${themeVariantLabel}. Click to switch to ${nextThemeVariantLabel}.`}
                  onClick={toggleTheme}
                  sx={{
                    border: `1px solid ${alpha(theme.palette.common.white, 0.24)}`,
                    borderRadius: 2,
                  }}
                >
                  <PaletteOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {isMobile && (
              <Tooltip title={`Color mode: ${colorModeLabel}. Click to switch to ${nextColorModePreference}.`}>
                <IconButton
                  color="inherit"
                  aria-label={`Color mode: ${colorModeLabel}. Click to switch to ${nextColorModePreference}.`}
                  onClick={cycleColorMode}
                  sx={{
                    border: `1px solid ${alpha(theme.palette.common.white, 0.24)}`,
                    borderRadius: 2,
                  }}
                >
                  <ColorModeIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
        </AppBar>
        
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            px: 6,
            py: 4,
            minWidth: 0,
            maxWidth: '100%',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
