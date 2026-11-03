import { forwardRef } from 'react';
import { Chip, Icon } from '@mui/material';
import type { ChipProps } from '@mui/material';
import type { Theme } from '@mui/material/styles';

export type ThemedChipVariant = ChipProps['variant'] | 'filled-primary' | 'outlined-primary';
export type ThemedChipSize = ChipProps['size'] | 'sm' | 'md' | 'lg';

export interface ThemedChipProps extends Omit<ChipProps, 'size' | 'variant'> {
  /** If true, applies specific inflow colors regardless of global overrides */
  inflowVariant?: boolean;
  /** MUI variants plus the Inflow primary variants used by the design system. */
  variant?: ThemedChipVariant;
  /** MUI sizes plus the Inflow design-system size aliases. */
  size?: ThemedChipSize;
  /** Material Symbols glyph rendered before the label. */
  leadingIcon?: string;
}

const chipSizeStyles = {
  sm: { height: 24, paddingX: 8, fontSize: '0.75rem', iconSize: 14, gap: 6 },
  md: { height: 32, paddingX: 12, fontSize: '0.875rem', iconSize: 18, gap: 8 },
  lg: { height: 40, paddingX: 20, fontSize: '1rem', iconSize: 20, gap: 10 },
} as const;

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
  ({
    inflowVariant = true,
    sx,
    variant: requestedVariant,
    color: requestedColor,
    size: requestedSize = 'medium',
    leadingIcon,
    deleteIcon,
    ...props
  }, ref) => {
    const isPrimaryVariant = requestedVariant === 'filled-primary' || requestedVariant === 'outlined-primary';
    const variant = requestedVariant === 'filled-primary'
      ? 'filled'
      : requestedVariant === 'outlined-primary'
        ? 'outlined'
        : requestedVariant;
    const color = isPrimaryVariant ? 'primary' : requestedColor;
    const isDefaultColor = requestedColor === undefined || requestedColor === 'default';
    const size = requestedSize === 'sm'
      ? 'small'
      : requestedSize === 'md' || requestedSize === 'lg'
        ? 'medium'
        : requestedSize;
    const sizeKey = requestedSize === 'sm' || requestedSize === 'small'
      ? 'sm'
      : requestedSize === 'lg'
        ? 'lg'
        : 'md';
    const chipSize = chipSizeStyles[sizeKey];
    const sizeStyles = {
      [`&&.MuiChip-size${size === 'small' ? 'Small' : 'Medium'}`]: {
        height: chipSize.height,
        width: 'fit-content',
        flex: '0 0 auto',
        paddingLeft: `${chipSize.paddingX}px`,
        paddingRight: `${chipSize.paddingX}px`,
        fontSize: chipSize.fontSize,
        gap: `${chipSize.gap}px`,
      },
      '&& .MuiChip-label': { paddingLeft: 0, paddingRight: 0 },
      '&& .MuiChip-icon': { marginLeft: 0, marginRight: 0, color: 'inherit' },
      // The delete "x" always matches the chip's own text color (no tint or opacity), in every variant and mode.
      '&& .MuiChip-deleteIcon': { marginRight: 0, color: 'inherit', opacity: 1, '&:hover': { color: 'inherit', opacity: 1 } },
    };
    const customStyles = inflowVariant
      ? (theme: Theme) => ({
          borderRadius: '9999px',
          fontWeight: theme.typography.fontWeightMedium,
          letterSpacing: '0.00625rem',
          ...(variant === 'outlined' && {
            backgroundColor: theme.palette.inflow.surfaceLowest,
            borderColor: requestedVariant === 'outlined-primary'
              ? theme.palette.primary.main
              : theme.palette.inflow.outlineVariant,
            color: color === 'primary'
              ? theme.palette.primary.main
              : theme.palette.text.primary,
            '&:hover': { backgroundColor: theme.palette.inflow.rowHover },
          }),
          ...(variant !== 'outlined' && isDefaultColor && {
            backgroundColor: theme.palette.mode === 'dark'
              ? theme.palette.grey[700]
              : theme.palette.grey[300],
            color: theme.palette.text.primary,
            // Hover tints toward the brand blue instead of a darker grey.
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark'
                ? theme.palette.inflow.primaryFixed
                : theme.palette.inflow.primaryTab,
            },
          }),
          ...(variant !== 'outlined' && color === 'primary' && {
            backgroundColor: theme.palette.inflow.primaryTab,
            color: theme.palette.primary.main,
          }),
          ...(variant !== 'outlined' && color === 'error' && {
            backgroundColor: theme.palette.inflow.diffRemovedBg,
            color: theme.palette.inflow.diffRemovedText,
          }),
          ...(variant !== 'outlined' && color === 'success' && {
            backgroundColor: theme.palette.inflow.diffAddedBg,
            color: theme.palette.inflow.diffAddedText,
          }),
        })
      : undefined;

    return (
        <Chip
          ref={ref}
          variant={variant}
          color={color}
          size={size}
          icon={leadingIcon ? (
            <Icon
              baseClassName="material-icons-outlined"
              sx={{ fontSize: `${chipSize.iconSize}px !important` }}
            >
              {leadingIcon}
            </Icon>
          ) : undefined}
          deleteIcon={deleteIcon ?? (
            <Icon baseClassName="material-icons-outlined" sx={{ fontSize: `${chipSize.iconSize}px !important` }}>
              close
            </Icon>
          )}
          sx={[
            customStyles,
            sizeStyles,
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
          {...props}
        />
    );
  }
);

ThemedChip.displayName = 'ThemedChip';
