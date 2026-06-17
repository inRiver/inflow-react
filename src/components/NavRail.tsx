import { Box, Icon } from '@mui/material';

export interface NavRailItem {
  label: string;
  icon: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

export interface NavRailProps {
  items?: NavRailItem[];
  footer?: NavRailItem[];
}

const defaultItems: NavRailItem[] = [
  { label: 'Dashboard', icon: 'dashboard' },
  { label: 'Products', icon: 'inventory_2' },
  { label: 'Enrich', icon: 'edit_note' },
  { label: 'Validate', icon: 'check_circle' },
  { label: 'Channels', icon: 'share' },
  { label: 'Print', icon: 'print' },
  { label: 'Insights', icon: 'analytics' },
];

function NavItem({ item }: { item: NavRailItem }) {
  const active = !!item.active;
  return (
    <Box
      component={item.href ? 'a' : 'button'}
      href={item.href}
      onClick={item.onClick}
      type={item.href ? undefined : 'button'}
      aria-current={active ? 'page' : undefined}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        width: '100%',
        padding: 'var(--custom-nav-item-padding-y, 8px) var(--custom-nav-item-padding-x, 12px)',
        textDecoration: 'none',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        fontFamily: 'var(--iv-font-sans)',
        '&:hover .iv-nav__indicator': {
          background: 'var(--custom-nav-item-hover, rgba(255, 255, 255, 0.08))',
        },
      }}
    >
      <Box
        className="iv-nav__indicator"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'var(--custom-nav-pill-width, 56px)',
          height: 'var(--custom-nav-pill-height, 32px)',
          borderRadius: 'var(--iv-radius-pill, 999px)',
          transition: 'background 0.15s ease',
          background: active ? 'var(--iv-bg, #ffffff)' : 'transparent',
        }}
      >
        <Icon
          baseClassName="material-icons-outlined"
          sx={{
            fontSize: 'var(--custom-nav-icon-size, 24px)',
            color: active ? 'var(--iv-navy-700, #0b2d6e)' : 'var(--custom-nav-on-surface, #ffffff)',
          }}
        >
          {item.icon}
        </Icon>
      </Box>
      <Box
        component="span"
        sx={{
          fontSize: 'var(--custom-nav-label-size, 12px)',
          fontWeight: 'var(--font-weight-medium, 500)',
          color: active
            ? 'var(--custom-nav-on-surface-active, #ffffff)'
            : 'var(--custom-nav-on-surface, rgba(255, 255, 255, 0.7))',
          textAlign: 'center',
          lineHeight: 1.2,
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          maxWidth: 'var(--custom-nav-pill-width, 56px)',
        }}
      >
        {item.label}
      </Box>
    </Box>
  );
}

export function NavRail({ items = defaultItems, footer = [] }: NavRailProps) {
  return (
    <Box
      component="nav"
      aria-label="Primary"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 'var(--custom-nav-width, 80px)',
        minHeight: '100%',
        background: 'var(--iv-navy-700, #0b2d6e)',
        padding: 'var(--custom-nav-padding-y, 16px) 0',
        flexShrink: 0,
        boxSizing: 'border-box',
        fontFamily: 'var(--iv-font-sans)',
      }}
    >
      <Box sx={{ color: '#fff', mb: 1.5, mt: 0.5 }}>
        <svg width="26" height="16" viewBox="0 0 25.331 15.833" fill="currentColor">
          <path d="M 0 9.387 C 1.33 7.307 3.645 5.293 6.878 5.181 L 6.878 0 L 0 0 L 0 9.387 Z"/>
          <path d="M 0 11.15 L 0 15.833 L 6.878 15.833 L 6.878 5.994 C 3.393 6.131 0.94 8.867 0 11.15 Z"/>
          <path d="M 8.94 7.781 L 8.94 15.833 L 15.818 15.833 L 15.818 11.627 L 17.904 15.833 L 25.331 15.833 L 21.823 9.456 C 23.359 8.551 24.299 6.968 24.299 5.158 C 24.301 2.329 22.008 0 18.592 0 L 8.94 0 L 8.94 2.262 C 8.94 3.914 9.651 4.614 11.324 4.614 L 16.504 4.614 C 17.444 4.614 18.04 5.225 18.04 6.22 C 18.04 7.216 17.467 7.781 16.504 7.804 L 15.816 7.827 L 15.816 5.429 L 11.322 5.429 C 9.647 5.429 8.938 6.131 8.938 7.781 Z"/>
        </svg>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          flex: 1,
          gap: 'var(--custom-nav-item-gap, 8px)',
        }}
      >
        {items.map((item, i) => (
          <NavItem key={i} item={item} />
        ))}
      </Box>
      {footer.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            paddingBottom: '4px',
          }}
        >
          {footer.map((item, i) => (
            <NavItem key={`footer-${i}`} item={item} />
          ))}
        </Box>
      )}
    </Box>
  );
}
