import Popper from '@mui/material/Popper';
import type { PopperProps } from '@mui/material/Popper';
import { flippedGapModifier } from './flippedGapModifier';

/**
 * MUI Popper that keeps clear of the field label when the popup flips above it.
 *
 * Replacing the picker's `popper` slot also replaces MUI X's styled popper root, which is what gives the popup
 * `z-index: modal`. Without it the popup sits under page elements with a z-index (e.g. floating input labels).
 */
export function InflowPickerPopper({ modifiers, sx, ...other }: PopperProps) {
  return (
    <Popper
      {...other}
      modifiers={[...(modifiers ?? []), flippedGapModifier]}
      sx={[{ zIndex: (theme) => theme.zIndex.modal }, ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );
}
