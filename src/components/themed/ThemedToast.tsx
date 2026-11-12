import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { forwardRef } from 'react';
import { Box, IconButton } from '@mui/material';
import type { ReactNode } from 'react';
import { darkSeverityTint } from '../../theme/inflow';

export type ThemedToastSeverity = 'error' | 'info' | 'success' | 'warning';

export interface ThemedToastProps {
  severity?: ThemedToastSeverity;
  title?: ReactNode;
  message: ReactNode;
  action?: { label: string; onClick: () => void };
  onClose?: () => void;
}

const severityIcons = {
  error: ErrorOutlineOutlinedIcon,
  info: InfoOutlinedIcon,
  success: CheckCircleOutlineOutlinedIcon,
  warning: WarningAmberOutlinedIcon,
};

/**
 * An inline, persistent notification banner with severity-specific Inflow surfaces.
 */
export const ThemedToast = forwardRef<HTMLDivElement, ThemedToastProps>(
  ({ severity = 'info', title, message, action, onClose }, ref) => {
    const SeverityIcon = severityIcons[severity];
    return (
      <Box
        component="div"
        ref={ref}
        role={severity === 'error' || severity === 'warning' ? 'alert' : 'status'}
        sx={(theme) => ({
          display: 'inline-flex',
          alignItems: 'center',
          gap: 2.5,
          height: 39,
          padding: theme.spacing(0, 2.5),
          borderRadius: `${theme.shape.borderRadius}px`,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? darkSeverityTint(severity)
              : {
                  error: theme.palette.inflow.highlightRed,
                  info: theme.palette.inflow.toastInfoBg,
                  success: theme.palette.inflow.highlightGreen,
                  warning: theme.palette.inflow.highlightYellow,
                }[severity],
          color: theme.palette.text.primary,
          width: '100%',
          maxWidth: 389,
          boxSizing: 'border-box',
        })}
      >
        <SeverityIcon
          sx={(theme) => ({
            color: theme.palette.text.primary,
            flexShrink: 0,
            fontSize: 18,
            lineHeight: '18px',
          })}
        />

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
            <Box
              component="button"
              type="button"
              onClick={action.onClick}
              sx={{
                flexShrink: 0,
                appearance: 'none',
                border: 0,
                padding: 0,
                background: 'transparent',
                color: 'inherit',
                cursor: 'pointer',
                font: 'inherit',
                lineHeight: 'inherit',
                textDecoration: 'underline',
              }}
            >
              {action.label}
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
              width: 24,
              height: 24,
              padding: 0,
              '&:hover': { backgroundColor: theme.palette.action.hover },
            })}
          >
            <CloseOutlinedIcon sx={{ fontSize: 24 }} />
          </IconButton>
        )}
      </Box>
    );
  },
);

ThemedToast.displayName = 'ThemedToast';
