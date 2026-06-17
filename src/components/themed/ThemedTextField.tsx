import { forwardRef } from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { inriverTokens } from '../../theme/tokens';

export type ThemedTextFieldProps = TextFieldProps;

/**
 * ThemedTextField
 * 
 * A pre-rendered, themed text field component that follows the Inriver design system.
 * It extends the standard MUI TextField and applies specific Inriver design tokens
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
              borderRadius: inriverTokens.radius.xs,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: inriverTokens.colors.outline,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: inriverTokens.colors.onSurface,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: inriverTokens.colors.navy700,
                borderWidth: 2,
              },
              '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                borderColor: inriverTokens.colors.error.main,
              },
              '&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: inriverTokens.colors.error.main,
              },
            },
            '& .MuiInputLabel-root': {
              '&.Mui-focused': {
                color: inriverTokens.colors.navy700,
              },
              '&.Mui-error': {
                color: inriverTokens.colors.error.main,
              },
            },
            '& .MuiFilledInput-root': {
              backgroundColor: inriverTokens.colors.surfaceHighest,
              borderRadius: `${inriverTokens.radius.xs}px ${inriverTokens.radius.xs}px 0 0`,
              '&:hover': {
                backgroundColor: '#dbe2f4',
              },
              '&.Mui-focused': {
                backgroundColor: inriverTokens.colors.surfaceHighest,
              },
              '&:after': {
                borderBottomColor: inriverTokens.colors.navy700,
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
