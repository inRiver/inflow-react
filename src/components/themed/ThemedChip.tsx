import { forwardRef } from 'react';
import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';
import { inriverTokens } from '../../theme/tokens';

export interface ThemedChipProps extends ChipProps {
  /** If true, applies specific inriver colors regardless of global overrides */
  inriverVariant?: boolean;
}

/**
 * ThemedChip
 * 
 * A pre-rendered, themed chip component that follows the Inriver design system.
 * It applies specific Inriver design tokens for radius, colors, and delete icons.
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
  ({ inriverVariant = true, sx, ...props }, ref) => {
    
    const customStyles = inriverVariant ? {
      borderRadius: `${inriverTokens.radius.full}px`,
      fontWeight: inriverTokens.typography.fontWeights.medium,
      letterSpacing: '0.1px',
      ...(props.variant === 'outlined' && {
        borderColor: inriverTokens.colors.outlineVariant,
        color: props.color === 'primary'
          ? inriverTokens.colors.navy800
          : inriverTokens.colors.onSurfaceVariant,
      }),
      ...(props.variant !== 'outlined' && props.color === 'primary' && {
        backgroundColor: inriverTokens.colors.primaryTab,
        color: inriverTokens.colors.navy700,
        '& .MuiChip-deleteIcon': {
          color: inriverTokens.colors.navy700,
          opacity: 0.7,
          '&:hover': {
            opacity: 1,
            color: inriverTokens.colors.navyDark,
          }
        }
      }),
      ...(props.variant !== 'outlined' && props.color === 'error' && {
        backgroundColor: inriverTokens.colors.diffRemovedBg,
        color: inriverTokens.colors.diffRemovedText,
        '& .MuiChip-deleteIcon': {
          color: inriverTokens.colors.diffRemovedText,
          opacity: 0.7,
          '&:hover': {
            opacity: 1,
          }
        }
      }),
      ...(props.variant !== 'outlined' && props.color === 'success' && {
        backgroundColor: inriverTokens.colors.diffAddedBg,
        color: inriverTokens.colors.diffAddedText,
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
