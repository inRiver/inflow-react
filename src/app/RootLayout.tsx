import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ComponentSidebar } from '../components/navigation/ComponentSidebar';

export function RootLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [componentSearchQuery, setComponentSearchQuery] = useState('');

  const handleDrawerToggle = () => {
    if (!isMobile && sidebarOpen && componentSearchQuery) {
      setComponentSearchQuery('');
    }

    setSidebarOpen((previousOpen) => !previousOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
          <Toolbar>
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
                flexGrow: 1, 
                cursor: 'pointer',
                color: 'inherit',
                textAlign: 'center',
                '&:hover': { opacity: 0.8 }
              }} 
              noWrap
              onClick={() => navigate('/')}
            >
              Inriver MUI Theme Showcase
            </Typography>
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
