import { forwardRef } from 'react';
import { Button, alpha } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { inflowTokens } from '../../theme/tokens';

export interface ThemedButtonProps extends ButtonProps {
  /**
   * Optional custom prop to signify if the button should use the explicit Inflow primary tokens.
   * If true, applies specific inflow colors regardless of global theme overrides.
   */
  inflowVariant?: boolean;
}

/**
 * ThemedButton
 * 
 * A pre-rendered, themed button component that follows the Inflow design system.
 * It extends the standard MUI Button and applies specific Inflow design tokens
 * for colors, border radius, and hover states.
 *
 * @example
 * ```tsx
 * import { ThemedButton } from '@/components/themed';
 *
 * // Standard usage
 * <ThemedButton variant="contained">Save</ThemedButton>
 * 
 * // Outlined usage
 * <ThemedButton variant="outlined">Cancel</ThemedButton>
 * ```
 */
export const ThemedButton = forwardRef<HTMLButtonElement, ThemedButtonProps>(
  ({ inflowVariant = true, sx, ...props }, ref) => {
    
    // Apply explicit tokens if requested, otherwise fallback to standard MUI styles
    // The global theme inflow.ts also styles MuiButton, but this provides a standalone guaranteed look
    const customStyles = inflowVariant ? {
      borderRadius: `${inflowTokens.radius.sm}px`,
      fontWeight: inflowTokens.typography.fontWeights.medium,
      letterSpacing: '0.1px',
      ...(props.variant === 'contained' && (props.color === 'primary' || !props.color) && {
        backgroundColor: inflowTokens.colors.navy700,
        color: inflowTokens.colors.white,
        '&:hover': {
          backgroundColor: inflowTokens.colors.navyDark,
        },
      }),
      ...(props.variant === 'outlined' && (props.color === 'primary' || !props.color) && {
        color: inflowTokens.colors.navy700,
        borderColor: inflowTokens.colors.outlineVariant,
        '&:hover': {
          borderColor: inflowTokens.colors.navy700,
          backgroundColor: alpha(inflowTokens.colors.navy700, 0.08),
        },
      }),
      ...(props.variant === 'text' && (props.color === 'primary' || !props.color) && {
        color: inflowTokens.colors.navy700,
        '&:hover': {
          backgroundColor: alpha(inflowTokens.colors.navy700, 0.08),
        },
      }),
    } : {};

    return (
      <Button
        ref={ref}
        disableElevation
        sx={[
          customStyles,
          ...(Array.isArray(sx) ? sx : [sx])
        ]}
        {...props}
      />
    );
  }
);

ThemedButton.displayName = 'ThemedButton';
