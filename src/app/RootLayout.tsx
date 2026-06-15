import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { CategoryNav } from '../components/CategoryNav';
import { ThemeToggle } from '../components/ThemeToggle';

export function RootLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setMobileOpen(true)} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Inriver MUI Theme Showcase</Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>
      
      <CategoryNav mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
