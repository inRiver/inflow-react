import { forwardRef } from 'react';
import { Alert, AlertTitle } from '@mui/material';
import type { ReactNode } from 'react';

export type AlertSeverity = 'error' | 'warning' | 'info' | 'success';

export interface ThemedAlertProps {
  severity?: AlertSeverity;
  title?: ReactNode;
  children: ReactNode;
  onClose?: () => void;
}

const iconMap: Record<AlertSeverity, string> = {
  error: 'error_outline',
  warning: 'warning_amber',
  info: 'info_outline',
  success: 'check_circle_outline',
};

export const ThemedAlert = forwardRef<HTMLDivElement, ThemedAlertProps>(
  ({ severity = 'info', title, children, onClose }, ref) => (
    <Alert
      ref={ref}
      severity={severity}
      onClose={onClose}
      iconMapping={{
        error: <span className="material-icons-outlined" style={{ fontSize: 20 }}>{iconMap.error}</span>,
        warning: <span className="material-icons-outlined" style={{ fontSize: 20 }}>{iconMap.warning}</span>,
        info: <span className="material-icons-outlined" style={{ fontSize: 20 }}>{iconMap.info}</span>,
        success: <span className="material-icons-outlined" style={{ fontSize: 20 }}>{iconMap.success}</span>,
      }}
      sx={(theme) => ({
        borderRadius: `${theme.shape.borderRadius}px`,
        alignItems: 'center',
        '& .MuiAlert-icon': {
          marginTop: 0,
          marginRight: theme.spacing(1.5),
        },
        '& .MuiAlert-message': {
          minWidth: 0,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        },
      })}
    >
      {title && (
        <AlertTitle component="span" sx={{ display: 'inline', fontWeight: 600, lineHeight: '20px', margin: 0, marginRight: 0.5 }}>
          {title}
        </AlertTitle>
      )}
      {children}
    </Alert>
  ),
);

ThemedAlert.displayName = 'ThemedAlert';
