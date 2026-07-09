import { forwardRef } from 'react';
import { Button, alpha } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import type { Theme } from '@mui/material/styles';

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
    const customStyles = inflowVariant
      ? (theme: Theme) => ({
          borderRadius: `${theme.shape.borderRadius}px`,
          fontWeight: theme.typography.fontWeightMedium,
          letterSpacing: '0.1px',
          ...(props.variant === 'contained' && (props.color === 'primary' || !props.color) && {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }),
          ...(props.variant === 'outlined' && (props.color === 'primary' || !props.color) && {
            color: theme.palette.primary.main,
            borderColor: theme.palette.inflow.outlineVariant,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }),
          ...(props.variant === 'text' && (props.color === 'primary' || !props.color) && {
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }),
        })
      : undefined;

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
