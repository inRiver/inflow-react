import { forwardRef, Fragment } from 'react';
import {
  Box,
  Divider,
  Icon,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import type { ReactNode } from 'react';

export interface ThemedMenuItemDef {
  id: string;
  label: ReactNode;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  selected?: boolean;
  /** Renders a divider before this item. */
  dividerBefore?: boolean;
}

export interface ThemedMenuProps {
  anchorEl: Element | null;
  open: boolean;
  onClose: () => void;
  items: ThemedMenuItemDef[];
  onSelect?: (id: string) => void;
  dense?: boolean;
}

export const ThemedMenu = forwardRef<HTMLDivElement, ThemedMenuProps>(
  ({ anchorEl, open, onClose, items, onSelect, dense = false }, ref) => (
    <Menu
      ref={ref}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        list: { dense },
        paper: {
          elevation: 2,
          sx: {
            minWidth: 200,
            borderRadius: (theme) => theme.shape.borderRadius,
          },
        },
      }}
    >
      {items.map((item) => (
        <Fragment key={item.id}>
          {item.dividerBefore && <Divider />}
          <MenuItem
            disabled={item.disabled}
            selected={item.selected}
            onClick={() => {
              onSelect?.(item.id);
              onClose();
            }}
            sx={{
              px: 2,
              minHeight: dense ? 36 : 48,
              gap: 1,
            }}
          >
            {item.icon && (
              <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
                <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 20 }}>
                  {item.icon}
                </Icon>
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: {
                  variant: 'body2',
                  sx: { fontWeight: item.selected ? 500 : 400 },
                },
              }}
            />
            {item.shortcut && (
              <Box
                component="span"
                sx={{
                  fontSize: '0.75rem',
                  color: (theme) => theme.palette.inflow.outline,
                  ml: 2,
                  flexShrink: 0,
                }}
              >
                {item.shortcut}
              </Box>
            )}
          </MenuItem>
        </Fragment>
      ))}
    </Menu>
  ),
);

ThemedMenu.displayName = 'ThemedMenu';
