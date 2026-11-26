import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { forwardRef, Fragment } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Icon,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Radio,
  Tooltip,
} from '@mui/material';
import type { ReactNode } from 'react';
import type { MenuItemProps, MenuProps } from '@mui/material';

// Keep Button's visual styling while MenuItem owns roving focus and keyboard activation.
// A non-native root stays focusable when aria-disabled, unlike a native disabled button.
// Clear Button's forwarded keyboard handlers so Enter/Space are synthesized only once.
const MenuCtaItem = forwardRef<HTMLDivElement, MenuItemProps<'div'>>((props, ref) => (
  <MenuItem
    {...props}
    component="div"
    nativeButton={false}
    tabIndex={undefined}
    onKeyDown={undefined}
    onKeyUp={undefined}
    ref={ref}
  />
));
MenuCtaItem.displayName = 'MenuCtaItem';

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
   * Renders a group heading before this item, to split a long menu into named sections. Put it on the first item of
   * each group. It is not interactive. Pair it with `dividerBefore` to also draw a line above the heading.
   */
  groupLabel?: ReactNode;
  /**
   * Item is visible but not available to the user yet (for example a feature outside their plan). It cannot be
   * selected and shows a lock icon; unlike `disabled`, it keeps full-strength text so the option stays discoverable.
   */
  locked?: boolean;
  /** Tooltip shown on hover or keyboard focus when locked. Use it to explain what the user gets by unlocking. */
  lockedTooltip?: string;
}

export interface ThemedMenuCta {
  label: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export interface ThemedMenuProps {
  anchorEl: Element | null;
  /**
   * Forwards to MUI Menu's portal container, e.g. to inherit `--infl-*` variables in nested providers.
   * Locked-item tooltips still use their own popper portal.
   */
  container?: MenuProps['container'];
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
  /**
   * Multi-select menu. Each item shows a checkbox that reflects its `selected` value, and choosing an item keeps the
   * menu open so several can be toggled. Toggle `selected` in your `onSelect` handler; the menu closes from outside
   * click, Escape or `onClose`.
   */
  multiple?: boolean;
  /**
   * Pick-one menu. Each item shows a radio button that reflects its `selected` value; choosing an item calls
   * `onSelect` and closes the menu. Ignored when `multiple` is set. Items use `role="menuitemradio"`.
   */
  radio?: boolean;
}

export const ThemedMenu = forwardRef<HTMLDivElement, ThemedMenuProps>(
  ({ anchorEl, container, open, onClose, items, onSelect, dense = false, header, cta, multiple = false, radio = false }, ref) => (
    <Menu
      ref={ref}
      anchorEl={anchorEl}
      container={container}
      open={open}
      onClose={onClose}
      slotProps={{
        list: {
          dense,
          // Locked options must remain discoverable by keyboard so their explanation can be read.
          // MUI applies this to the whole menu: disabled options can receive focus in these menus,
          // but retain their disabled behavior. Menus without locked options keep MUI's default.
          disabledItemsFocusable: items.some((item) => item.locked),
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
          {item.groupLabel && <ListSubheader>{item.groupLabel}</ListSubheader>}
          <Tooltip
            title={item.locked ? (item.lockedTooltip ?? '') : ''}
            describeChild
            placement="right-start"
            disableHoverListener={!item.locked}
            disableFocusListener={!item.locked}
            disableTouchListener={!item.locked}
          >
            <MenuItem
              disabled={item.disabled}
              disableRipple={item.locked}
              aria-disabled={item.locked || item.disabled || undefined}
              // The checkbox or radio shows the state, so the row is not also highlighted.
              selected={multiple || radio ? undefined : item.selected}
              {...(multiple && { role: 'menuitemcheckbox', 'aria-checked': Boolean(item.selected) })}
              {...(!multiple && radio && { role: 'menuitemradio', 'aria-checked': Boolean(item.selected) })}
              onClick={item.locked ? undefined : () => {
                onSelect?.(item.id);
                if (!multiple) onClose();
              }}
              sx={(theme) => ({
                // MUI's desktop row height (6px padding + 24px line); body2 text alone would make rows 32px. MenuItem
                // resets min-height to auto from the sm breakpoint up, so the value is repeated there.
                ...(!dense && { minHeight: 36, [theme.breakpoints.up('sm')]: { minHeight: 36 } }),
                ...(item.locked && { cursor: 'default' }),
              })}
            >
              {(multiple || radio) && (
                <ListItemIcon sx={{ '&&&': { minWidth: 30 } }}>
                  {/* The row owns the click and the menuitemcheckbox or menuitemradio role; the control only shows the
                      state. The '&&&' beats MenuItem's own 36px icon width, so it sits 10px from the label like in
                      Autocomplete. */}
                  {multiple ? (
                    <Checkbox
                      size="small"
                      checked={Boolean(item.selected)}
                      disabled={item.disabled}
                      disableRipple
                      tabIndex={-1}
                      slotProps={{ input: { 'aria-hidden': true, tabIndex: -1 } }}
                      sx={{ p: 0, pointerEvents: 'none' }}
                    />
                  ) : (
                    <Radio
                      size="small"
                      checked={Boolean(item.selected)}
                      disabled={item.disabled}
                      disableRipple
                      tabIndex={-1}
                      slotProps={{ input: { 'aria-hidden': true, tabIndex: -1 } }}
                      sx={{ p: 0, pointerEvents: 'none' }}
                    />
                  )}
                </ListItemIcon>
              )}
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
                      fontWeight: item.selected && !multiple && !radio ? 500 : 400,
                    },
                  },
                }}
              />
              {item.locked && (
                <LockOutlinedIcon
                  sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }}
                />
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
        <Box key="cta" component="li" role="presentation" sx={{ px: 2, py: 1 }}>
          <Button
            component={MenuCtaItem}
            role="menuitem"
            nativeButton={false}
            fullWidth
            variant="contained"
            sx={{
              minHeight: 'auto',
              whiteSpace: 'normal',
              textAlign: 'center',
              // Button already supplies disabled colors; do not also fade them as a MenuItem.
              '&.Mui-disabled': { opacity: 'initial' },
            }}
            disabled={cta.disabled}
            aria-disabled={cta.disabled || undefined}
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
