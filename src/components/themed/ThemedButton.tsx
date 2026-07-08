import { forwardRef } from 'react';
import { Button, alpha } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { inriverTokens } from '../../theme/tokens';

export interface ThemedButtonProps extends ButtonProps {
  /**
   * Optional custom prop to signify if the button should use the explicit Inriver primary tokens.
   * If true, applies specific inriver colors regardless of global theme overrides.
   */
  inriverVariant?: boolean;
}

/**
 * ThemedButton
 * 
 * A pre-rendered, themed button component that follows the Inriver design system.
 * It extends the standard MUI Button and applies specific Inriver design tokens
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
  ({ inriverVariant = true, sx, ...props }, ref) => {
    
    // Apply explicit tokens if requested, otherwise fallback to standard MUI styles
    // The global theme inriver.ts also styles MuiButton, but this provides a standalone guaranteed look
    const customStyles = inriverVariant ? {
      borderRadius: `${inriverTokens.radius.sm}px`,
      fontWeight: inriverTokens.typography.fontWeights.medium,
      letterSpacing: '0.1px',
      ...(props.variant === 'contained' && (props.color === 'primary' || !props.color) && {
        backgroundColor: inriverTokens.colors.navy700,
        color: inriverTokens.colors.white,
        '&:hover': {
          backgroundColor: inriverTokens.colors.navyDark,
        },
      }),
      ...(props.variant === 'outlined' && (props.color === 'primary' || !props.color) && {
        color: inriverTokens.colors.navy700,
        borderColor: inriverTokens.colors.outline,
        '&:hover': {
          borderColor: inriverTokens.colors.navy700,
          backgroundColor: alpha(inriverTokens.colors.navy700, 0.08),
        },
      }),
      ...(props.variant === 'text' && (props.color === 'primary' || !props.color) && {
        color: inriverTokens.colors.navy700,
        '&:hover': {
          backgroundColor: alpha(inriverTokens.colors.navy700, 0.08),
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
