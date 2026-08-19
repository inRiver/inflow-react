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
    const iconSize = requestedSize === 'sm' || requestedSize === 'small'
      ? 14
      : requestedSize === 'lg'
        ? 20
        : 18;
    const iconMarginLeft = requestedSize === 'sm' || requestedSize === 'small' ? 4 : 6;
    const sizeStyles = requestedSize === 'lg'
      ? {
          '&&.MuiChip-sizeMedium': {
            height: 40,
            width: 'fit-content',
            flex: '0 0 auto',
            paddingLeft: 20,
            paddingRight: 20,
            fontSize: '1rem',
            gap: 10,
          },
          '&& .MuiChip-label': { paddingLeft: 0, paddingRight: 0 },
          '&& .MuiChip-icon': { marginLeft: 0, marginRight: 0, color: 'inherit' },
        }
      : undefined;
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
            '& .MuiChip-deleteIcon': {
              color: color === 'primary'
                ? theme.palette.primary.main
                : theme.palette.inflow.outline,
              opacity: 1,
              '&:hover': {
                color: color === 'primary'
                  ? theme.palette.primary.dark
                  : theme.palette.text.primary,
              },
            },
          }),
          ...(variant !== 'outlined' && isDefaultColor && {
            backgroundColor: theme.palette.mode === 'dark'
              ? theme.palette.grey[700]
              : theme.palette.grey[300],
            color: theme.palette.text.primary,
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark'
                ? theme.palette.grey[600]
                : theme.palette.grey[400],
            },
            '& .MuiChip-deleteIcon': {
              color: theme.palette.inflow.outline,
              opacity: 1,
              '&:hover': {
                color: theme.palette.text.primary,
              },
            },
          }),
          ...(variant !== 'outlined' && color === 'primary' && {
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
          ...(variant !== 'outlined' && color === 'error' && {
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
              sx={{ fontSize: `${iconSize}px !important`, ml: `${iconMarginLeft}px` }}
            >
              {leadingIcon}
            </Icon>
          ) : undefined}
          deleteIcon={deleteIcon ?? (
            <Icon baseClassName="material-icons-outlined" sx={{ fontSize: `${iconSize}px !important` }}>
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
