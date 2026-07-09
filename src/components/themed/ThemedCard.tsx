import { forwardRef } from 'react';
import { Card, CardHeader, CardContent, CardActions } from '@mui/material';
import type { CardProps } from '@mui/material';
import { inflowTokens } from '../../theme/tokens';

export interface ThemedCardProps extends Omit<CardProps, 'title'> {
  /** Optional title to render in the card header */
  title?: React.ReactNode;
  /** Optional subheader to render in the card header */
  subheader?: React.ReactNode;
  /** Optional actions to render at the bottom of the card */
  actions?: React.ReactNode;
  /** Prevents the default padding on CardContent if true */
  disableContentPadding?: boolean;
}

/**
 * ThemedCard
 * 
 * A pre-rendered, themed card component that follows the Inflow design system.
 * It applies specific Inflow design tokens for shadows, border-radius, and provides
 * optional built-in slots for title, subheader, and actions.
 *
 * @example
 * ```tsx
 * import { ThemedCard } from '@/components/themed';
 *
 * <ThemedCard 
 *   title="Project Details" 
 *   actions={<ThemedButton>Save</ThemedButton>}
 * >
 *   Main content goes here
 * </ThemedCard>
 * ```
 */
export const ThemedCard = forwardRef<HTMLDivElement, ThemedCardProps>(
  ({ title, subheader, actions, children, disableContentPadding = false, sx, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        elevation={1}
        sx={[
          {
            borderRadius: `${inflowTokens.radius.sm}px`,
            boxShadow: inflowTokens.shadows.e1,
          },
          ...(Array.isArray(sx) ? sx : [sx])
        ]}
        {...props}
      >
        {(title || subheader) && (
          <CardHeader 
            title={title} 
            subheader={subheader}
            titleTypographyProps={{ variant: 'subtitle1' }}
            sx={{ pb: 0 }}
          />
        )}
        <CardContent sx={disableContentPadding ? { p: 0, '&:last-child': { pb: 0 } } : undefined}>
          {children}
        </CardContent>
        {actions && (
          <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
            {actions}
          </CardActions>
        )}
      </Card>
    );
  }
);

ThemedCard.displayName = 'ThemedCard';
