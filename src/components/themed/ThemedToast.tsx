import { forwardRef } from 'react';
import { Box, Icon, IconButton } from '@mui/material';
import type { ReactNode } from 'react';
import { ThemedButton } from './ThemedButton';

export type ThemedToastSeverity = 'error' | 'info' | 'success' | 'warning';

export interface ThemedToastProps {
  severity?: ThemedToastSeverity;
  title?: ReactNode;
  message: ReactNode;
  action?: { label: string; onClick: () => void };
  onClose?: () => void;
}

const iconNames: Record<ThemedToastSeverity, string> = {
  error: 'error_outline',
  info: 'info_outline',
  success: 'check_circle_outline',
  warning: 'warning_amber',
};

/**
 * An inline, persistent notification banner with severity-specific Inflow surfaces.
 */
export const ThemedToast = forwardRef<HTMLDivElement, ThemedToastProps>(
  ({ severity = 'info', title, message, action, onClose }, ref) => (
    <Box
      component="div"
      ref={ref}
      role={severity === 'error' || severity === 'warning' ? 'alert' : 'status'}
      sx={(theme) => ({
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        minHeight: 48,
        padding: theme.spacing(1.5, 2),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: {
          error: theme.palette.inflow.highlightRed,
          info: theme.palette.inflow.toastInfoBg,
          success: theme.palette.inflow.highlightGreen,
          warning: theme.palette.inflow.highlightYellow,
        }[severity],
        color: theme.palette.text.primary,
        width: '100%',
        maxWidth: 560,
        boxSizing: 'border-box',
      })}
    >
      <Icon
        baseClassName="material-icons-outlined"
        sx={(theme) => ({
          color: theme.palette.text.primary,
          flexShrink: 0,
          fontSize: 22,
        })}
      >
        {iconNames[severity]}
      </Icon>

      <Box
        component="span"
        sx={{
          flex: '1 1 auto',
          minWidth: 0,
          display: 'flex',
          alignItems: 'baseline',
          gap: 0.5,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          fontSize: '0.875rem',
          fontWeight: 400,
          lineHeight: '20px',
          letterSpacing: '0.25px',
        }}
      >
        {title && (
          <Box component="span" sx={{ flexShrink: 0, fontWeight: 600, lineHeight: '20px' }}>
            {title}
          </Box>
        )}
        <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {message}
        </Box>
        {action && (
          <Box component="span" sx={{ flexShrink: 0 }}>
            <ThemedButton variant="text" size="small" onClick={action.onClick}>
              {action.label}
            </ThemedButton>
          </Box>
        )}
      </Box>

      {onClose && (
        <IconButton
          aria-label="Dismiss"
          onClick={onClose}
          size="small"
          sx={(theme) => ({
            color: theme.palette.text.primary,
            flexShrink: 0,
            marginLeft: theme.spacing(0.5),
            '&:hover': { backgroundColor: theme.palette.action.hover },
          })}
        >
          <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 20 }}>
            close
          </Icon>
        </IconButton>
      )}
    </Box>
  ),
);

ThemedToast.displayName = 'ThemedToast';
