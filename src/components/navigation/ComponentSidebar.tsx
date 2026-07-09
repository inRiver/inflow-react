import React, { useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Icon,
  Typography,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
  TextField,
  InputAdornment
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  COMPONENT_CATEGORIES,
  getComponentLabel,
  normalizeComponentId,
} from '../../showcase/categories';
import { useComponentSearch } from '../../hooks/useComponentSearch';

export interface ComponentSidebarProps {
  open: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}

const getIconName = (name: string) => {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
};

export const ComponentSidebar: React.FC<ComponentSidebarProps> = ({
  open,
  onClose,
  searchQuery,
  onSearchQueryChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [manualExpanded, setManualExpanded] = useState<Set<string>>(new Set());
  const filteredComponents = useComponentSearch(searchQuery);

  const activeComponentId = useMemo(() => {
    const compMatch = location.pathname.match(/\/components\/([^/]+)/);
    return compMatch ? normalizeComponentId(compMatch[1]) : null;
  }, [location.pathname]);

  const autoExpanded = useMemo(() => {
    const nextExpanded = new Set<string>();

    if (searchQuery && filteredComponents.length > 0) {
      Object.values(COMPONENT_CATEGORIES).forEach((category) => {
        const hasMatch = category.components.some((component) => filteredComponents.includes(component));
        if (hasMatch) {
          nextExpanded.add(category.id);
        }
      });
    }

    if (activeComponentId) {
      const activeCategory = Object.values(COMPONENT_CATEGORIES).find((category) =>
        category.components.includes(activeComponentId)
      );

      if (activeCategory) {
        nextExpanded.add(activeCategory.id);
      }
    }

    return nextExpanded;
  }, [activeComponentId, filteredComponents, searchQuery]);

  const expanded = useMemo(() => {
    const nextExpanded = new Set(manualExpanded);
    autoExpanded.forEach((categoryId) => nextExpanded.add(categoryId));
    return nextExpanded;
  }, [autoExpanded, manualExpanded]);

  const toggleCategory = (id: string) => {
    setManualExpanded((previousExpanded) => {
      const nextExpanded = new Set(previousExpanded);

      if (nextExpanded.has(id)) {
        nextExpanded.delete(id);
      } else {
        nextExpanded.add(id);
      }

      return nextExpanded;
    });
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && open) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent, path: string) => {
    if (e.key === 'Enter') {
      handleNavigate(path);
    }
  };

  const sidebarWidth = 280;

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant={isMobile ? "temporary" : "persistent"}
      sx={{
        flexShrink: 0,
        width: open ? sidebarWidth : 0,
        '& .MuiDrawer-paper': {
          width: sidebarWidth,
          boxSizing: 'border-box',
          overflowX: 'hidden',
        },
      }}
    >
      <Box sx={{ width: sidebarWidth, pt: '20px', pb: '12px' }}>
        <List disablePadding>
          {/* Home/Overview link */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigate('/')}
              selected={location.pathname === '/'}
              sx={{
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: 'center',
                }}
              >
                <Icon baseClassName="material-icons-outlined">home</Icon>
              </ListItemIcon>
              <ListItemText primary="Overview" primaryTypographyProps={{ fontWeight: 'bold' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigate('/guidelines')}
              selected={location.pathname === '/guidelines'}
              sx={{
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: 'center',
                }}
              >
                <Icon baseClassName="material-icons-outlined">integration_instructions</Icon>
              </ListItemIcon>
              <ListItemText primary="Import Guidelines" primaryTypographyProps={{ fontWeight: 'bold' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigate('/tokens')}
              selected={location.pathname === '/tokens'}
              sx={{
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: 'center',
                }}
              >
                <Icon baseClassName="material-icons-outlined">palette</Icon>
              </ListItemIcon>
              <ListItemText primary="Design Tokens" primaryTypographyProps={{ fontWeight: 'bold' }} />
            </ListItemButton>
          </ListItem>
          <Divider sx={{ my: 1 }} />
        </List>

        {open && (
          <>
            <Typography variant="h6" sx={{ px: 2, pb: 1, fontWeight: 'bold', color: 'primary.main' }}>
              Components
            </Typography>
            <Box sx={{ px: 2, pb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search components"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.palette.inflow.surfaceHighest,
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                       <Icon baseClassName="material-icons-outlined">search</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </>
        )}
        <List>
          {Object.values(COMPONENT_CATEGORIES).filter(c => !c.hidden || searchQuery).map((category) => {
            // Filter category components based on search
            const visibleComponents = searchQuery
              ? category.components.filter(comp => filteredComponents.includes(comp))
              : category.components;
            
            // Skip category if no matching components
            if (searchQuery && visibleComponents.length === 0) return null;

            return (
              <React.Fragment key={category.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => toggleCategory(category.id)}
                    sx={{
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 2,
                        justifyContent: 'center',
                      }}
                    >
                      <Icon baseClassName="material-icons-outlined">{getIconName(category.icon)}</Icon>
                    </ListItemIcon>
                    <ListItemText
                      primary={category.label}
                      primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.05rem' }}
                    />
                    <Icon baseClassName="material-icons-outlined">{expanded.has(category.id) ? 'expand_less' : 'expand_more'}</Icon>
                  </ListItemButton>
                </ListItem>
                <Collapse in={expanded.has(category.id)} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {visibleComponents.map((component) => {
                      const path = `/components/${component}`;
                      const isActive = activeComponentId === component;

                      return (
                        <ListItemButton
                          key={component}
                          sx={{
                            pl: 4,
                            bgcolor: isActive ? 'primary.main' : 'transparent',
                            color: isActive ? 'primary.contrastText' : 'inherit',
                            '&:hover': {
                              bgcolor: isActive ? 'primary.dark' : 'action.hover',
                            },
                          }}
                          onClick={() => handleNavigate(path)}
                          onKeyDown={(e) => handleKeyDown(e, path)}
                          tabIndex={0}
                        >
                          <ListItemText
                            primary={getComponentLabel(component)}
                            primaryTypographyProps={{
                              fontWeight: isActive ? 'bold' : 'normal',
                            }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          })}
          {searchQuery && filteredComponents.length === 0 && open && (
            <ListItem>
              <ListItemText 
                primary="No results found" 
                secondary={`No components match "${searchQuery}"`}
                primaryTypographyProps={{ 
                  color: 'text.secondary',
                  fontStyle: 'italic',
                  textAlign: 'center',
                }} 
                secondaryTypographyProps={{
                  textAlign: 'center',
                }}
              />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );
};
