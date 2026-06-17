import { Card, CardContent, Typography } from '@mui/material';

export interface KPICardProps {
  label: string;
  value: string;
  subtitle?: string;
  color?: 'success' | 'warning' | 'error' | 'primary';
}

export function KPICard({ label, value, subtitle, color }: KPICardProps) {
  return (
    <Card
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        bgcolor: 'background.paper',
      }}
    >
      <CardContent
        sx={{
          p: 2,
          '&:last-child': { pb: 2 },
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="h4"
          color={color ? `${color}.main` : undefined}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
