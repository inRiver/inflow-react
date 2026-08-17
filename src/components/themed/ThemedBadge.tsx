import { forwardRef } from 'react';
import MuiBadge from '@mui/material/Badge';
import type { BadgeProps as MuiBadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

export type BadgeColor = 'error' | 'primary' | 'success';

export interface ThemedBadgeProps extends Omit<MuiBadgeProps, 'color'> {
  color?: BadgeColor;
}

const StyledBadge = styled(MuiBadge, {
  shouldForwardProp: (prop) => prop !== '$badgecolor',
})<{ $badgecolor: BadgeColor }>(({ theme, $badgecolor }) => {
  const colorMap: Record<BadgeColor, string> = {
    error: theme.palette.error.main,
    primary: theme.palette.primary.main,
    success: theme.palette.success.main,
  };

  return {
    '& .MuiBadge-badge': {
      backgroundColor: colorMap[$badgecolor],
      color: theme.palette.common.white,
      fontWeight: 500,
      fontSize: '0.6875rem',
      lineHeight: '16px',
      minWidth: 16,
      height: 16,
      padding: '0 4px',
      borderRadius: '8px',
    },
    '& .MuiBadge-dot': {
      backgroundColor: colorMap[$badgecolor],
      minWidth: 8,
      height: 8,
      borderRadius: '4px',
      padding: 0,
    },
  };
});

/**
 * A Badge with fixed Inflow geometry and a constrained semantic color set.
 */
export const ThemedBadge = forwardRef<HTMLSpanElement, ThemedBadgeProps>(
  ({ color = 'error', ...props }, ref) => <StyledBadge ref={ref} $badgecolor={color} {...props} />,
);

ThemedBadge.displayName = 'ThemedBadge';
