import { Box, Icon, IconButton, Typography } from '@mui/material';
import { forwardRef, type ReactNode } from 'react';

export interface ThemedDetailPanelSectionProps {
  title: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
}

export interface ThemedDetailPanelProps {
  title: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
  actions?: ReactNode;
  width?: number | string;
}

export const ThemedDetailPanel = forwardRef<HTMLDivElement, ThemedDetailPanelProps>(
  function ThemedDetailPanel({ title, onClose, children, actions, width = '100%' }, ref) {
    return (
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width,
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme.spacing(2, 2, 1.5, 2),
            flexShrink: 0,
          })}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: '28px', color: 'primary.main' }}>
            {title}
          </Typography>
          {onClose && (
            <IconButton
              aria-label="Close detail panel"
              size="small"
              onClick={onClose}
              sx={{ color: 'text.secondary', borderRadius: 1 }}
            >
              <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 24 }}>
                close
              </Icon>
            </IconButton>
          )}
        </Box>

        <Box
          sx={(theme) => ({
            flex: '1 1 auto',
            overflowY: 'auto',
            padding: theme.spacing(0, 2, 2),
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2.5),
          })}
        >
          {children}
        </Box>

        {actions && (
          <Box
            sx={(theme) => ({
              display: 'flex',
              justifyContent: 'flex-end',
              gap: theme.spacing(1),
              padding: theme.spacing(2),
              flexShrink: 0,
            })}
          >
            {actions}
          </Box>
        )}
      </Box>
    );
  },
);

ThemedDetailPanel.displayName = 'ThemedDetailPanel';

export const ThemedDetailPanelSection = forwardRef<HTMLDivElement, ThemedDetailPanelSectionProps>(
  function ThemedDetailPanelSection({ title, headerAction, children }, ref) {
    return (
      <Box ref={ref} sx={(theme) => ({ display: 'flex', flexDirection: 'column', gap: theme.spacing(1.5) })}>
        {(title || headerAction) && (
          <Box sx={(theme) => ({ display: 'flex', alignItems: 'center', gap: theme.spacing(1) })}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: '20px' }}>
              {title}
            </Typography>
            {headerAction}
          </Box>
        )}
        {children}
      </Box>
    );
  },
);

ThemedDetailPanelSection.displayName = 'ThemedDetailPanelSection';
