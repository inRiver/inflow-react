import { forwardRef } from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { inflowTokens } from '../../theme/tokens';

export type ThemedTextFieldProps = TextFieldProps;

/**
 * ThemedTextField
 * 
 * A pre-rendered, themed text field component that follows the Inflow design system.
 * It extends the standard MUI TextField and applies specific Inflow design tokens
 * for border colors, focus states, and error states.
 *
 * @example
 * ```tsx
 * import { ThemedTextField } from '@/components/themed';
 *
 * // Standard usage
 * <ThemedTextField label="Username" placeholder="Enter username" />
 * 
 * // Error state
 * <ThemedTextField label="Password" error helperText="Incorrect password" />
 * ```
 */
export const ThemedTextField = forwardRef<HTMLDivElement, ThemedTextFieldProps>(
  ({ sx, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        variant="outlined"
        size="small"
        sx={[
          {
            '& .MuiOutlinedInput-root': {
              borderRadius: `${inflowTokens.radius.xs}px`,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: inflowTokens.colors.outline,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: inflowTokens.colors.onSurface,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: inflowTokens.colors.navy700,
                borderWidth: 2,
              },
              '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                borderColor: inflowTokens.colors.error.main,
              },
              '&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: inflowTokens.colors.error.main,
              },
            },
            '& .MuiInputLabel-root': {
              '&.Mui-focused': {
                color: inflowTokens.colors.navy700,
              },
              '&.Mui-error': {
                color: inflowTokens.colors.error.main,
              },
            },
            '& .MuiFilledInput-root': {
              backgroundColor: inflowTokens.colors.surfaceHighest,
              borderRadius: `${inflowTokens.radius.xs}px ${inflowTokens.radius.xs}px 0 0`,
              '&:hover': {
                backgroundColor: '#dbe2f4',
              },
              '&.Mui-focused': {
                backgroundColor: inflowTokens.colors.surfaceHighest,
              },
              '&:after': {
                borderBottomColor: inflowTokens.colors.navy700,
              },
            },
          },
          ...(Array.isArray(sx) ? sx : [sx])
        ]}
        {...props}
      />
    );
  }
);

ThemedTextField.displayName = 'ThemedTextField';
