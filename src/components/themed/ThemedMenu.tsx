import { forwardRef, Fragment } from 'react';
import {
  Box,
  Button,
  Divider,
  Icon,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Tooltip,
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
  /**
   * Item is visible but not available to the user yet (for example a feature outside their plan). It cannot be
   * selected and shows a lock icon; unlike `disabled`, it keeps full-strength text so the option stays discoverable.
   */
  locked?: boolean;
  /** Tooltip shown on hover when the item is locked. Use it to explain what the user gets by unlocking. */
  lockedTooltip?: string;
}

export interface ThemedMenuCta {
  label: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export interface ThemedMenuProps {
  anchorEl: Element | null;
  open: boolean;
  onClose: () => void;
  items: ThemedMenuItemDef[];
  onSelect?: (id: string) => void;
  dense?: boolean;
  /**
   * Non-interactive label row above the items. Use it when the menu is scoped to a product or feature group and the
   * user needs to know which one the items (especially locked ones) belong to, e.g. "Orchestrate". Omit it for
   * general-purpose menus such as an account menu.
   */
  header?: ReactNode;
  /** Full-width call-to-action button pinned below the items, e.g. an upgrade or enable action. */
  cta?: ThemedMenuCta;
}

export const ThemedMenu = forwardRef<HTMLDivElement, ThemedMenuProps>(
  ({ anchorEl, open, onClose, items, onSelect, dense = false, header, cta }, ref) => (
    <Menu
      ref={ref}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        list: {
          dense,
          subheader: header ? (
            <ListSubheader
              color="primary"
              sx={(theme) => ({ borderBottom: `1px solid ${theme.palette.inflow.surfaceVariant}` })}
            >
              {header}
            </ListSubheader>
          ) : undefined,
        },
        paper: {
          sx: { minWidth: 200 },
        },
      }}
    >
      {items.map((item) => (
        <Fragment key={item.id}>
          {item.dividerBefore && <Divider />}
          <Tooltip
            title={item.locked ? (item.lockedTooltip ?? '') : ''}
            placement="right-start"
            disableHoverListener={!item.locked}
            disableFocusListener={!item.locked}
            disableTouchListener={!item.locked}
          >
            <MenuItem
              disabled={item.disabled}
              disableRipple={item.locked}
              aria-disabled={item.locked || item.disabled || undefined}
              selected={item.selected}
              onClick={item.locked ? undefined : () => {
                onSelect?.(item.id);
                onClose();
              }}
              sx={(theme) => ({
                // MUI's desktop row height (6px padding + 24px line); body2 text alone would make rows 32px. MenuItem
                // resets min-height to auto from the sm breakpoint up, so the value is repeated there.
                ...(!dense && { minHeight: 36, [theme.breakpoints.up('sm')]: { minHeight: 36 } }),
                ...(item.locked && { cursor: 'default' }),
              })}
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
                    sx: {
                      fontWeight: item.selected ? 500 : 400,
                    },
                  },
                }}
              />
              {item.locked && (
                <Icon
                  baseClassName="material-icons-outlined"
                  sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }}
                >
                  lock
                </Icon>
              )}
              {!item.locked && item.shortcut && (
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
          </Tooltip>
        </Fragment>
      ))}
      {cta && (
        <Box key="cta" sx={{ px: 2, py: 1 }}>
          <Button
            fullWidth
            variant="contained"
            disabled={cta.disabled}
            onClick={() => {
              cta.onClick();
              onClose();
            }}
          >
            {cta.label}
          </Button>
        </Box>
      )}
    </Menu>
  ),
);

ThemedMenu.displayName = 'ThemedMenu';
