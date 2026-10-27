import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { Box, Icon } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { inflowTokens } from '../../theme';

export interface ThemedAppNavItem {
  label: string;
  icon: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

export interface ThemedAppNavProps {
  items?: ThemedAppNavItem[];
  /** Bottom-pinned items (settings, help, etc.). */
  footer?: ThemedAppNavItem[];
  style?: CSSProperties;
}

export interface ThemedAppNavPlaceholderProps {
  /** Number of placeholder dots to render. */
  count?: number;
  style?: CSSProperties;
}

interface NavItemProps {
  item: ThemedAppNavItem;
}

function NavItem({ item }: NavItemProps) {
  const itemSx = (theme: Theme) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    width: '100%',
    padding: theme.spacing(0.5, 1),
    border: 0,
    backgroundColor: 'transparent',
    color: alpha(theme.palette.common.white, 0.85),
    cursor: 'pointer',
    fontFamily: String(theme.typography.fontFamily),
    textDecoration: 'none',
    '&:hover .ThemedAppNav-indicator': {
      backgroundColor: alpha(theme.palette.common.white, 0.08),
    },
  });

  const indicatorSx = (theme: Theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 32,
    borderRadius: inflowTokens.radius.full,
    backgroundColor: item.active ? theme.palette.common.white : 'transparent',
    transition: 'background 0.15s ease',
  });

  const iconSx = (theme: Theme) => ({
    fontSize: 24,
    color: item.active ? theme.palette.primary.main : alpha(theme.palette.common.white, 0.85),
  });

  const labelSx = (theme: Theme) => ({
    maxWidth: 56,
    color: item.active ? theme.palette.common.white : alpha(theme.palette.common.white, 0.85),
    fontFamily: String(theme.typography.fontFamily),
    fontSize: 11,
    fontWeight: Number(theme.typography.fontWeightMedium),
    lineHeight: 1.2,
    textAlign: 'center',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  });

  const content = (
    <>
      <Box className="ThemedAppNav-indicator" sx={indicatorSx}>
        <Icon aria-hidden baseClassName="material-icons-outlined" sx={iconSx}>
          {item.icon}
        </Icon>
      </Box>
      <Box component="span" sx={labelSx}>
        {item.label}
      </Box>
    </>
  );

  return item.href ? (
    <Box
      component="a"
      href={item.href}
      onClick={item.onClick}
      aria-current={item.active ? 'page' : undefined}
      sx={itemSx}
    >
      {content}
    </Box>
  ) : (
    <Box
      component="button"
      type="button"
      onClick={item.onClick}
      aria-current={item.active ? 'page' : undefined}
      sx={itemSx}
    >
      {content}
    </Box>
  );
}

/** A fixed-width Inflow application-navigation rail with optional pinned footer actions. */
export const ThemedAppNav = forwardRef<HTMLElement, ThemedAppNavProps>(
  ({ items = [], footer = [], style }, ref) => (
    <Box
      component="nav"
      ref={ref}
      aria-label="Primary"
      style={style}
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 72,
        minHeight: '100%',
        padding: theme.spacing(1.5, 0),
        backgroundColor: theme.palette.inflow.navSurface,
        boxSizing: 'border-box',
        flexShrink: 0,
        fontFamily: String(theme.typography.fontFamily),
      })}
    >
      <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', width: '100%', gap: 0.5 }}>
        {items.map((item, index) => (
          <NavItem key={`${item.label}-${index}`} item={item} />
        ))}
      </Box>
      {footer.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: 0.5 }}>
          {footer.map((item, index) => (
            <NavItem key={`${item.label}-${index}`} item={item} />
          ))}
        </Box>
      )}
    </Box>
  ),
);

ThemedAppNav.displayName = 'ThemedAppNav';

/** Skeleton rail for layout wireframes before navigation items are defined. */
export const ThemedAppNavPlaceholder = forwardRef<HTMLElement, ThemedAppNavPlaceholderProps>(
  ({ count = 4, style }, ref) => (
    <Box
      component="nav"
      ref={ref}
      aria-label="Primary"
      style={style}
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing(1.25),
        width: 72,
        minHeight: '100%',
        padding: theme.spacing(2, 0),
        backgroundColor: theme.palette.inflow.navSurface,
        boxSizing: 'border-box',
        flexShrink: 0,
      })}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          component="span"
          aria-hidden
          sx={(theme) => ({
            width: 28,
            height: 28,
            flexShrink: 0,
            borderRadius: inflowTokens.radius.full,
            backgroundColor: alpha(theme.palette.common.white, index === 0 ? 0.85 : 0.25),
          })}
        />
      ))}
    </Box>
  ),
);

ThemedAppNavPlaceholder.displayName = 'ThemedAppNavPlaceholder';
