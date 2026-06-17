import { forwardRef } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton
} from '@mui/material';
import type { DialogProps } from '@mui/material';
import { inriverTokens } from '../../theme/tokens';

export interface ThemedDialogProps extends Omit<DialogProps, 'title'> {
  /** The title of the dialog */
  title?: React.ReactNode;
  /** Actions to render at the bottom of the dialog */
  actions?: React.ReactNode;
  /** Callback fired when the component requests to be closed */
  onClose?: (event: object, reason: "backdropClick" | "escapeKeyDown" | "closeButtonClick") => void;
  /** Hide the default close button in the header */
  hideCloseButton?: boolean;
}

/**
 * ThemedDialog
 * 
 * A pre-rendered, themed dialog component that follows the Inriver design system.
 * Built-in slots for title, actions, and content, styling them with Inriver tokens.
 *
 * @example
 * ```tsx
 * import { ThemedDialog, ThemedButton } from '@/components/themed';
 *
 * <ThemedDialog
 *   open={isOpen}
 *   onClose={handleClose}
 *   title="Edit Profile"
 *   actions={<ThemedButton onClick={handleClose}>Save</ThemedButton>}
 * >
 *   Dialog content goes here
 * </ThemedDialog>
 * ```
 */
export const ThemedDialog = forwardRef<HTMLDivElement, ThemedDialogProps>(
  ({ title, actions, children, onClose, hideCloseButton = false, sx, ...props }, ref) => {
    return (
      <Dialog
        ref={ref}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderRadius: inriverTokens.radius.xl,
          }
        }}
        sx={[...(Array.isArray(sx) ? sx : [sx])]}
        {...props}
      >
        {title && (
          <DialogTitle 
            sx={{
              backgroundColor: inriverTokens.colors.surfaceHighest,
              padding: '24px',
              fontSize: '1.5rem',
              fontWeight: 400,
              lineHeight: 1.334,
              letterSpacing: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {title}
            {!hideCloseButton && onClose && (
              <IconButton
                aria-label="close"
                onClick={(e) => onClose(e, 'closeButtonClick')}
                sx={{
                  color: inriverTokens.colors.onSurfaceVariant,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                </svg>
              </IconButton>
            )}
          </DialogTitle>
        )}
        
        <DialogContent sx={{ padding: '24px', mt: title ? 1 : 0 }}>
          {children}
        </DialogContent>
        
        {actions && (
          <DialogActions sx={{ padding: '8px 24px 24px' }}>
            {actions}
          </DialogActions>
        )}
      </Dialog>
    );
  }
);

ThemedDialog.displayName = 'ThemedDialog';
