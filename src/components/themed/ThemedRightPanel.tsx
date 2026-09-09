import {
  Box,
  Fade,
  Slide,
  useTheme,
} from '@mui/material';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ThemedButton } from './ThemedButton';
import { ThemedDialog } from './ThemedDialog';

export type ThemedRightPanelMode = 'push' | 'overlay';
export type ThemedRightPanelWidth = 'narrow' | 'medium' | 'wide';
export type ThemedRightPanelVariant = 'assistant' | 'editor' | 'modal';

export interface ThemedRightPanelRenderApi {
  requestClose: () => void;
}

const WIDTH_PX: Record<ThemedRightPanelWidth, number> = {
  narrow: 320,
  medium: 400,
  wide: 520,
};

const CSS_VAR = '--infl-right-panel-width';
const MIN_WIDTH = 280;
const MAX_WIDTH = 720;

interface ActivePanelRegistration {
  id: symbol;
  requestReplacement: () => Promise<boolean>;
}

let activePanel: ActivePanelRegistration | null = null;

export interface ThemedRightPanelProps {
  open: boolean;
  mode?: ThemedRightPanelMode;
  variant?: ThemedRightPanelVariant;
  width?: ThemedRightPanelWidth;
  onClose: () => void;
  hasUnsavedChanges?: boolean;
  resizable?: boolean;
  closeOnNavigation?: boolean;
  topOffset?: number;
  children?: ReactNode | ((api: ThemedRightPanelRenderApi) => ReactNode);
  'aria-label'?: string;
}

export const ThemedRightPanel = forwardRef<HTMLDivElement, ThemedRightPanelProps>(
  function ThemedRightPanel(
    {
      open,
      mode = 'push',
      variant = 'assistant',
      width,
      onClose,
      hasUnsavedChanges = false,
      resizable,
      closeOnNavigation,
      topOffset = 56,
      children,
      'aria-label': ariaLabel = 'Right panel',
    },
    ref,
  ) {
    const theme = useTheme();
    const panelId = useRef(Symbol('themed-right-panel'));
    const panelRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);
    const replacementResolverRef = useRef<((replace: boolean) => void) | null>(null);
    const [discardOpen, setDiscardOpen] = useState(false);
    const resolvedWidth = width ?? (variant === 'assistant' ? 'medium' : 'wide');
    const [panelWidth, setPanelWidth] = useState(WIDTH_PX[resolvedWidth]);
    const [isDragging, setIsDragging] = useState(false);
    const [activationGranted, setActivationGranted] = useState(false);
    const visibleOpen = open && activationGranted;

    useImperativeHandle(ref, () => panelRef.current!);

    useEffect(() => {
      setPanelWidth(WIDTH_PX[resolvedWidth]);
    }, [resolvedWidth]);

    useEffect(() => {
      if (mode !== 'push' || !visibleOpen) return undefined;

      const host = panelRef.current?.closest<HTMLElement>('[data-inflow-root]');
      if (!host) return undefined;

      host.style.setProperty(CSS_VAR, `${panelWidth}px`);
      return () => host.style.setProperty(CSS_VAR, '0px');
    }, [mode, panelWidth, visibleOpen]);

    useEffect(() => {
      if (mode !== 'overlay' || !visibleOpen) return undefined;

      const { body } = document;
      const previousOverflow = body.style.overflow;
      body.style.overflow = 'hidden';
      return () => {
        body.style.overflow = previousOverflow;
      };
    }, [mode, visibleOpen]);

    const requestClose = useCallback(() => {
      if (hasUnsavedChanges) {
        setDiscardOpen(true);
      } else {
        onClose();
      }
    }, [hasUnsavedChanges, onClose]);

    const requestReplacement = useCallback(() => {
      if (!hasUnsavedChanges) {
        setActivationGranted(false);
        onClose();
        return Promise.resolve(true);
      }

      setDiscardOpen(true);
      return new Promise<boolean>((resolve) => {
        replacementResolverRef.current = resolve;
      });
    }, [hasUnsavedChanges, onClose]);

    const keepEditing = useCallback(() => {
      setDiscardOpen(false);
      replacementResolverRef.current?.(false);
      replacementResolverRef.current = null;
    }, []);

    const discardChanges = useCallback(() => {
      setDiscardOpen(false);
      setActivationGranted(false);
      onClose();
      replacementResolverRef.current?.(true);
      replacementResolverRef.current = null;
    }, [onClose]);

    useEffect(() => {
      let cancelled = false;
      const registration: ActivePanelRegistration = {
        id: panelId.current,
        requestReplacement,
      };

      if (!open) {
        setActivationGranted(false);
        return undefined;
      }

      const activate = async () => {
        const currentPanel = activePanel;
        if (currentPanel && currentPanel.id !== registration.id) {
          const canReplace = await currentPanel.requestReplacement();
          if (cancelled) return;
          if (!canReplace) {
            onClose();
            return;
          }
        }

        if (cancelled) return;
        activePanel = registration;
        setActivationGranted(true);
      };

      void activate();
      return () => {
        cancelled = true;
        if (activePanel?.id === registration.id) activePanel = null;
        replacementResolverRef.current?.(false);
        replacementResolverRef.current = null;
      };
    }, [onClose, open, requestReplacement]);

    useEffect(() => {
      const shouldCloseOnNavigation = closeOnNavigation ?? variant === 'editor';
      if (!visibleOpen || !shouldCloseOnNavigation) return undefined;

      const handleNavigation = () => requestClose();
      window.addEventListener('hashchange', handleNavigation);
      window.addEventListener('popstate', handleNavigation);
      return () => {
        window.removeEventListener('hashchange', handleNavigation);
        window.removeEventListener('popstate', handleNavigation);
      };
    }, [closeOnNavigation, requestClose, variant, visibleOpen]);

    useEffect(() => {
      if (!visibleOpen) return undefined;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') requestClose();
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [requestClose, visibleOpen]);

    useEffect(() => {
      if (visibleOpen) panelRef.current?.focus();
    }, [visibleOpen]);

    useEffect(() => {
      const onPointerMove = (event: PointerEvent) => {
        if (!dragRef.current) return;

        const nextWidth = Math.max(
          MIN_WIDTH,
          Math.min(MAX_WIDTH, dragRef.current.startWidth + dragRef.current.startX - event.clientX),
        );
        setPanelWidth(nextWidth);
      };
      const stopDragging = () => {
        dragRef.current = null;
        setIsDragging(false);
      };

      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', stopDragging);
      document.addEventListener('pointercancel', stopDragging);
      return () => {
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', stopDragging);
        document.removeEventListener('pointercancel', stopDragging);
      };
    }, []);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragRef.current = { startX: event.clientX, startWidth: panelWidth };
      setIsDragging(true);
    };

    const isOverlay = mode === 'overlay';
    const canResize = resizable ?? variant !== 'modal';
    const panelContent = typeof children === 'function' ? children({ requestClose }) : children;
    const panelSx = {
      position: 'fixed',
      top: isOverlay ? 0 : topOffset,
      right: 0,
      bottom: 0,
      width: panelWidth,
      maxWidth: '100vw',
      zIndex: isOverlay ? theme.zIndex.modal + 1 : variant === 'editor' ? theme.zIndex.appBar + 1 : theme.zIndex.appBar,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      bgcolor: theme.palette.background.paper,
      borderLeft: 1,
      borderColor: theme.palette.divider,
      boxShadow: isOverlay ? theme.shadows[8] : 'none',
      fontFamily: String(theme.typography.fontFamily),
    };

    return (
      <>
        {isOverlay && (
          <Fade in={visibleOpen} mountOnEnter unmountOnExit>
            <Box
              aria-hidden="true"
              data-testid="right-panel-backdrop"
              onClick={requestClose}
              sx={{
                position: 'fixed',
                inset: 0,
                zIndex: theme.zIndex.modal,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
              }}
            />
          </Fade>
        )}

        <Slide direction="left" in={visibleOpen} mountOnEnter unmountOnExit>
          <Box
            ref={panelRef}
            component="aside"
            role="complementary"
            aria-label={ariaLabel}
            tabIndex={-1}
            sx={panelSx}
          >
            {canResize && (
              <Box
                aria-label="Resize panel"
                data-testid="right-panel-resize-handle"
                onPointerDown={handlePointerDown}
                sx={{
                  position: 'absolute',
                  left: -3,
                  top: 0,
                  bottom: 0,
                  width: 7,
                  cursor: 'col-resize',
                  touchAction: 'none',
                  zIndex: 1,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: 3,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    bgcolor: isDragging ? theme.palette.primary.main : 'transparent',
                    transition: theme.transitions.create('background', {
                      duration: theme.transitions.duration.shortest,
                    }),
                  },
                }}
              />
            )}
            <Box sx={{ flex: '1 1 auto', minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {panelContent}
            </Box>
          </Box>
        </Slide>

        <ThemedDialog
          open={discardOpen}
          onClose={keepEditing}
          title="Discard changes?"
          actions={(
            <>
              <ThemedButton variant="outlined" onClick={discardChanges}>
                Discard
              </ThemedButton>
              <ThemedButton variant="contained" onClick={keepEditing}>
                Keep Editing
              </ThemedButton>
            </>
          )}
        >
          Your progress will be lost.
        </ThemedDialog>
      </>
    );
  },
);

ThemedRightPanel.displayName = 'ThemedRightPanel';
