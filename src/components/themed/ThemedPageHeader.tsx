import { forwardRef } from 'react';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import type { CSSProperties, ReactNode } from 'react';

export interface PageHeaderAction {
  label: string;
  variant?: 'outlined' | 'filled';
  onClick?: () => void;
}

export interface PageHeaderProps {
  eyebrow?: string;
  /** Breadcrumb trail shown above the title in place of the eyebrow, e.g. a `ThemedBreadcrumbs`. */
  breadcrumbs?: ReactNode;
  title?: string;
  /**
   * Element used for the title. Defaults to 'h1' for a page header; pass another
   * heading level or element when the header is not the page's top-level heading
   * (for example inside a card or embedded surface).
   */
  titleComponent?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  onBack?: () => void;
  actions?: PageHeaderAction[];
  style?: CSSProperties;
  /** Composable MUI system styles, merged after the header's defaults. */
  sx?: SxProps<Theme>;
}

export type ThemedPageHeaderProps = PageHeaderProps;

/**
 * ThemedPageHeader
 *
 * Inflow's structural page chrome for an optional back action, page context,
 * and page-level actions.
 */
export const ThemedPageHeader = forwardRef<HTMLDivElement, ThemedPageHeaderProps>(
  ({ eyebrow, breadcrumbs, title, titleComponent = 'h1', onBack, actions = [], style, sx }, ref) => (
    <Box
      ref={ref}
      style={style}
      sx={[
        (theme: Theme) => ({
          alignItems: 'center',
          backgroundColor: theme.palette.inflow.appBackground,
          boxSizing: 'border-box',
          display: 'flex',
          gap: theme.spacing(2),
          minHeight: 76,
          padding: theme.spacing(1.25, 3),
        }),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
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
        {breadcrumbs ??
          (eyebrow && (
            <Typography color="primary" variant="body2">
              {eyebrow}
            </Typography>
          ))}
        {title && (
          <Typography color="primary" component={titleComponent} variant="h6">
            {title}
          </Typography>
        )}
      </Box>

      {actions.length > 0 && (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexShrink: 0 }}>
          {actions.map((action, index) => (
            <Button
              key={`${action.label}-${index}`}
              onClick={action.onClick}
              sx={action.variant !== 'filled' ? { backgroundColor: 'background.paper', '&:hover': { backgroundColor: 'background.paper' } } : undefined}
              variant={action.variant === 'filled' ? 'contained' : 'outlined'}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      )}
    </Box>
  ),
);

ThemedPageHeader.displayName = 'ThemedPageHeader';
