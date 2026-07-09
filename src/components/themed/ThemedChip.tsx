import { forwardRef } from 'react';
import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';
import { inflowTokens } from '../../theme/tokens';

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
    
    const customStyles = inflowVariant ? {
      borderRadius: `${inflowTokens.radius.full}px`,
      fontWeight: inflowTokens.typography.fontWeights.medium,
      letterSpacing: '0.1px',
      ...(props.variant === 'outlined' && {
        borderColor: inflowTokens.colors.outlineVariant,
        color: props.color === 'primary'
          ? inflowTokens.colors.navy800
          : inflowTokens.colors.onSurfaceVariant,
      }),
      ...(props.variant !== 'outlined' && props.color === 'primary' && {
        backgroundColor: inflowTokens.colors.primaryTab,
        color: inflowTokens.colors.navy700,
        '& .MuiChip-deleteIcon': {
          color: inflowTokens.colors.navy700,
          opacity: 0.7,
          '&:hover': {
            opacity: 1,
            color: inflowTokens.colors.navyDark,
          }
        }
      }),
      ...(props.variant !== 'outlined' && props.color === 'error' && {
        backgroundColor: inflowTokens.colors.diffRemovedBg,
        color: inflowTokens.colors.diffRemovedText,
        '& .MuiChip-deleteIcon': {
          color: inflowTokens.colors.diffRemovedText,
          opacity: 0.7,
          '&:hover': {
            opacity: 1,
          }
        }
      }),
      ...(props.variant !== 'outlined' && props.color === 'success' && {
        backgroundColor: inflowTokens.colors.diffAddedBg,
        color: inflowTokens.colors.diffAddedText,
      }),
    } : {};

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
