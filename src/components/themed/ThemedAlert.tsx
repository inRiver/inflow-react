import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
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

export const ThemedAlert = forwardRef<HTMLDivElement, ThemedAlertProps>(
  ({ severity = 'info', title, children, onClose }, ref) => (
    <Alert
      ref={ref}
      severity={severity}
      onClose={onClose}
      iconMapping={{
        error: <ErrorOutlineOutlinedIcon sx={{ fontSize: 20 }} />,
        warning: <WarningAmberOutlinedIcon sx={{ fontSize: 20 }} />,
        info: <InfoOutlinedIcon sx={{ fontSize: 20 }} />,
        success: <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 20 }} />,
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
