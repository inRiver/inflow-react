import { forwardRef } from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import type { Theme } from '@mui/material/styles';

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
          (theme: Theme) => ({
            '& .MuiOutlinedInput-root': {
              borderRadius: `${theme.shape.borderRadius}px`,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.inflow.outline,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.text.primary,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
              },
              '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.error.main,
              },
              '&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.error.main,
              },
            },
            '& .MuiInputLabel-root': {
              '&.Mui-focused': {
                color: theme.palette.primary.main,
              },
              '&.Mui-error': {
                color: theme.palette.error.main,
              },
            },
            '& .MuiFilledInput-root': {
              backgroundColor: theme.palette.inflow.surfaceHighest,
              borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
              '&:hover': {
                backgroundColor: theme.palette.inflow.surfaceContainerHigh,
              },
              '&.Mui-focused': {
                backgroundColor: theme.palette.inflow.surfaceHighest,
              },
              '&:after': {
                borderBottomColor: theme.palette.primary.main,
              },
            },
          }),
          ...(Array.isArray(sx) ? sx : [sx])
        ]}
        {...props}
      />
    );
  }
);

ThemedTextField.displayName = 'ThemedTextField';
