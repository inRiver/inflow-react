import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  useTheme
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InputIcon from '@mui/icons-material/Input';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import FeedbackIcon from '@mui/icons-material/Feedback';
import NavigationIcon from '@mui/icons-material/Navigation';
import LayersIcon from '@mui/icons-material/Layers';
import GridOnIcon from '@mui/icons-material/GridOn';

export interface NavItem {
  label: string;
  path: string;
}

export interface NavCategory {
  title: string;
  icon: ReactNode;
  items: NavItem[];
}

export interface CategoryNavProps {
  categories?: NavCategory[];
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const defaultCategories: NavCategory[] = [
  {
    title: 'Inputs',
    icon: <InputIcon />,
    items: [
      { label: 'Button', path: '/components/button' },
      { label: 'TextField', path: '/components/textfield' },
      { label: 'Select', path: '/components/select' },
      { label: 'Checkbox', path: '/components/checkbox' },
      { label: 'Radio', path: '/components/radio' },
      { label: 'Switch', path: '/components/switch' },
      { label: 'Slider', path: '/components/slider' },
    ]
  },
  {
    title: 'Data Display',
    icon: <ViewModuleIcon />,
    items: [
      { label: 'Typography', path: '/components/typography' },
      { label: 'Chip', path: '/components/chip' },
      { label: 'Badge', path: '/components/badge' },
      { label: 'Avatar', path: '/components/avatar' },
      { label: 'Tooltip', path: '/components/tooltip' },
      { label: 'Table', path: '/components/table' },
      { label: 'Card', path: '/components/card' },
      { label: 'List', path: '/components/list' },
      { label: 'Accordion', path: '/components/accordion' },
    ]
  },
  {
    title: 'Feedback',
    icon: <FeedbackIcon />,
    items: [
      { label: 'Alert', path: '/components/alert' },
      { label: 'Linear Progress', path: '/components/linear-progress' },
      { label: 'Circular Progress', path: '/components/circular-progress' },
      { label: 'Snackbar', path: '/components/snackbar' },
      { label: 'Dialog', path: '/components/dialog' },
      { label: 'Skeleton', path: '/components/skeleton' },
    ]
  },
  {
    title: 'Navigation',
    icon: <NavigationIcon />,
    items: [
      { label: 'Tabs', path: '/components/tabs' },
      { label: 'Breadcrumbs', path: '/components/breadcrumbs' },
      { label: 'Pagination', path: '/components/pagination' },
      { label: 'Stepper', path: '/components/stepper' },
      { label: 'Menu', path: '/components/menu' },
    ]
  },
  {
    title: 'Surfaces',
    icon: <LayersIcon />,
    items: [
      { label: 'Paper', path: '/components/paper' },
      { label: 'AppBar', path: '/components/appbar' },
      { label: 'Drawer', path: '/components/drawer' },
    ]
  },
  {
    title: 'Layout',
    icon: <GridOnIcon />,
    items: [
      { label: 'Container', path: '/components/container' },
      { label: 'Grid', path: '/components/grid' },
      { label: 'Stack', path: '/components/stack' },
    ]
  },
];

export function CategoryNav({
  categories = defaultCategories,
  mobileOpen = false,
  onMobileClose
}: CategoryNavProps) {
  const location = useLocation();
  const theme = useTheme();

  const drawerContent = (
    <Box sx={{ pb: 2 }}>
      {categories.map((category) => (
        <Accordion
          key={category.title}
          disableGutters
          defaultExpanded={category.items.some(item => location.pathname === item.path)}
          sx={{
            boxShadow: 'none',
            '&:before': { display: 'none' },
            bgcolor: 'transparent'
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ListItemIcon sx={{ minWidth: 40 }}>{category.icon}</ListItemIcon>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{category.title}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List disablePadding>
              {category.items.map((item) => {
                const isSelected = location.pathname === item.path;
                return (
                    <ListItemButton
                      key={item.path}
                      selected={isSelected}
                      component={Link}
                      to={item.path}
                      onClick={onMobileClose}
                      sx={{
                        pl: 7,
                        py: 0.5,
                        '&.Mui-selected': {
                          bgcolor: theme.palette.action?.selected || 'action.selected',
                          '&:hover': { bgcolor: theme.palette.action?.hover || 'action.hover' },
                        }
                      }}
                    >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        color: isSelected ? 'primary' : 'text.primary',
                        fontWeight: isSelected ? 600 : 400
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  const drawerWidth = 280;

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            pt: 8,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
