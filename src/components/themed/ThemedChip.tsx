import { forwardRef } from 'react';
import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';
import type { Theme } from '@mui/material/styles';

export interface ThemedChipProps extends ChipProps {
  /** If true, applies specific inflow colors regardless of global overrides */
  inflowVariant?: boolean;
}

/**
 * ThemedChip
 * 
 * A pre-rendered, themed chip component that follows the Inflow design system.
 * It applies specific Inflow design tokens for radius, colors, and delete icons.
 *
 * @example
 * ```tsx
 * import { ThemedChip } from '@/components/themed';
 *
 * // Standard usage
 * <ThemedChip label="Active" color="primary" />
 * 
 * // Outlined with delete
 * <ThemedChip label="Filter" variant="outlined" onDelete={() => {}} />
 * ```
 */
export const ThemedChip = forwardRef<HTMLDivElement, ThemedChipProps>(
  ({ inflowVariant = true, sx, ...props }, ref) => {
    const customStyles = inflowVariant
      ? (theme: Theme) => ({
          borderRadius: '9999px',
          fontWeight: theme.typography.fontWeightMedium,
          letterSpacing: '0.1px',
          ...(props.variant === 'outlined' && {
            borderColor: theme.palette.inflow.outlineVariant,
            color: props.color === 'primary'
              ? theme.palette.primary.main
              : theme.palette.text.secondary,
          }),
          ...(props.variant !== 'outlined' && props.color === 'primary' && {
            backgroundColor: theme.palette.inflow.primaryTab,
            color: theme.palette.primary.main,
            '& .MuiChip-deleteIcon': {
              color: theme.palette.primary.main,
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
                color: theme.palette.primary.dark,
              },
            },
          }),
          ...(props.variant !== 'outlined' && props.color === 'error' && {
            backgroundColor: theme.palette.inflow.diffRemovedBg,
            color: theme.palette.inflow.diffRemovedText,
            '& .MuiChip-deleteIcon': {
              color: theme.palette.inflow.diffRemovedText,
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
              },
            },
          }),
          ...(props.variant !== 'outlined' && props.color === 'success' && {
            backgroundColor: theme.palette.inflow.diffAddedBg,
            color: theme.palette.inflow.diffAddedText,
          }),
        })
      : undefined;

    return (
      <Chip
        ref={ref}
        sx={[
          customStyles,
          ...(Array.isArray(sx) ? sx : [sx])
        ]}
        {...props}
      />
    );
  }
);

ThemedChip.displayName = 'ThemedChip';
