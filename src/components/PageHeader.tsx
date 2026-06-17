import { Box, Button, IconButton, Icon, Breadcrumbs, Link, Typography } from '@mui/material';

export interface PageHeaderProps {
  eyebrow?: string;
  title?: string;
  onBack?: () => void;
  actions?: Array<{
    label: string;
    icon?: string;
    variant: 'outlined' | 'filled';
    onClick?: () => void;
  }>;
}

export function PageHeader({ title, onBack, actions = [] }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
        minHeight: 'var(--custom-page-header-height)',
        padding: 'var(--custom-page-header-padding)',
        background: 'var(--custom-background)',
        fontFamily: 'var(--iv-font-sans)',
        boxSizing: 'border-box',
      }}
    >
      {onBack && (
        <IconButton
          aria-label="Back"
          onClick={onBack}
          sx={{
            width: 'var(--custom-icon-button-size)',
            height: 'var(--custom-icon-button-size)',
            flexShrink: 0,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          <Icon baseClassName="material-icons-outlined">arrow_back</Icon>
        </IconButton>
      )}
      
      <Box sx={{ flex: 1 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 0.25 }}>
          <Link underline="hover" href="#" variant="caption">Catalog</Link>
          <Typography variant="caption" color="primary.main">Dashboard</Typography>
        </Breadcrumbs>
        <Typography variant="h6">{title || 'Projects'}</Typography>
      </Box>

      {actions.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {actions.map((a, i) => (
            <Button
              key={i}
              variant={a.variant === 'filled' ? 'contained' : 'outlined'}
              onClick={a.onClick}
              startIcon={a.icon ? <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 18 }}>{a.icon}</Icon> : undefined}
              sx={
                a.variant === 'filled'
                  ? undefined
                  : { bgcolor: 'background.paper', '&:hover': { bgcolor: 'background.paper' } }
              }
            >
              {a.label}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
}
