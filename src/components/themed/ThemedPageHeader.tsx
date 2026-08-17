import { forwardRef } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import type { CSSProperties } from 'react';
import { ThemedButton } from './ThemedButton';

export interface PageHeaderAction {
  label: string;
  variant?: 'outlined' | 'filled';
  onClick?: () => void;
}

export interface PageHeaderProps {
  eyebrow?: string;
  title?: string;
  onBack?: () => void;
  actions?: PageHeaderAction[];
  style?: CSSProperties;
}

export type ThemedPageHeaderProps = PageHeaderProps;

/**
 * ThemedPageHeader
 *
 * Inflow's structural page chrome for an optional back action, page context,
 * and page-level actions.
 */
export const ThemedPageHeader = forwardRef<HTMLDivElement, ThemedPageHeaderProps>(
  ({ eyebrow, title, onBack, actions = [], style }, ref) => (
    <Box
      ref={ref}
      style={style}
      sx={(theme) => ({
        alignItems: 'center',
        backgroundColor: theme.palette.inflow.appBackground,
        boxSizing: 'border-box',
        display: 'flex',
        gap: theme.spacing(2),
        minHeight: 76,
        padding: theme.spacing(1.5, 3),
      })}
    >
      {onBack && (
        <IconButton
          aria-label="Back"
          color="primary"
          onClick={onBack}
          sx={(theme) => ({
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            flexShrink: 0,
            height: 40,
            width: 40,
            '&:hover': { backgroundColor: theme.palette.primary.dark },
          })}
        >
          <ArrowBackOutlinedIcon />
        </IconButton>
      )}

      <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', minWidth: 0 }}>
        {eyebrow && (
          <Typography color="primary" variant="body2">
            {eyebrow}
          </Typography>
        )}
        {title && (
          <Typography color="primary" component="h1" variant="h6">
            {title}
          </Typography>
        )}
      </Box>

      {actions.length > 0 && (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexShrink: 0 }}>
          {actions.map((action, index) => (
            <ThemedButton
              key={`${action.label}-${index}`}
              onClick={action.onClick}
              sx={action.variant !== 'filled' ? { backgroundColor: 'background.paper', '&:hover': { backgroundColor: 'background.paper' } } : undefined}
              variant={action.variant === 'filled' ? 'contained' : 'outlined'}
            >
              {action.label}
            </ThemedButton>
          ))}
        </Stack>
      )}
    </Box>
  ),
);

ThemedPageHeader.displayName = 'ThemedPageHeader';
