import {
  Box,
  Fade,
  Slide,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
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

const WIDTH_PX: Record<ThemedRightPanelWidth, number> = {
  narrow: 320,
  medium: 400,
  wide: 520,
};

const CSS_VAR = '--infl-right-panel-width';
const MIN_WIDTH = 280;
const MAX_WIDTH = 720;

export interface ThemedRightPanelProps {
  open: boolean;
  mode?: ThemedRightPanelMode;
  variant?: ThemedRightPanelVariant;
  width?: ThemedRightPanelWidth;
  onClose: () => void;
  hasUnsavedChanges?: boolean;
  resizable?: boolean;
  topOffset?: number;
  children?: ReactNode;
  'aria-label'?: string;
}

export const ThemedRightPanel = forwardRef<HTMLDivElement, ThemedRightPanelProps>(
  function ThemedRightPanel(
    {
      open,
      mode = 'push',
      variant = 'assistant',
      width = 'medium',
      onClose,
      hasUnsavedChanges = false,
      resizable = true,
      topOffset = 56,
      children,
      'aria-label': ariaLabel = 'Right panel',
    },
    ref,
  ) {
    const theme = useTheme();
    const panelRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);
    const [discardOpen, setDiscardOpen] = useState(false);
    const [panelWidth, setPanelWidth] = useState(WIDTH_PX[width]);
    const [isDragging, setIsDragging] = useState(false);

    useImperativeHandle(ref, () => panelRef.current!);

    useEffect(() => {
      setPanelWidth(WIDTH_PX[width]);
    }, [width]);

    useEffect(() => {
      if (mode !== 'push' || !open) return undefined;

      const host = panelRef.current?.closest<HTMLElement>('[data-inflow-root]');
      if (!host) return undefined;

      host.style.setProperty(CSS_VAR, `${panelWidth}px`);
      return () => host.style.setProperty(CSS_VAR, '0px');
    }, [mode, open, panelWidth]);

    useEffect(() => {
      if (mode !== 'overlay' || !open) return undefined;

      const { body } = document;
      const previousOverflow = body.style.overflow;
      body.style.overflow = 'hidden';
      return () => {
        body.style.overflow = previousOverflow;
      };
    }, [mode, open]);

    const requestClose = useCallback(() => {
      if (hasUnsavedChanges) {
        setDiscardOpen(true);
      } else {
        onClose();
      }
    }, [hasUnsavedChanges, onClose]);

    useEffect(() => {
      if (!open) return undefined;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') requestClose();
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, requestClose]);

    useEffect(() => {
      if (open) panelRef.current?.focus();
    }, [open]);

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
    const panelSx = {
      position: 'fixed',
      top: isOverlay ? 0 : topOffset,
      right: 0,
      bottom: 0,
      width: panelWidth,
      zIndex: isOverlay ? theme.zIndex.modal + 1 : variant === 'editor' ? theme.zIndex.appBar + 1 : theme.zIndex.appBar,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      bgcolor: theme.palette.background.paper,
      borderLeft: 1,
      borderColor: theme.palette.divider,
      borderTop: isOverlay ? 0 : 1,
      borderTopColor: theme.palette.background.default,
      boxShadow: variant === 'assistant'
        ? 'none'
        : variant === 'editor'
          ? `-10px 0 28px ${alpha(theme.palette.primary.main, 0.1)}`
          : `-12px 0 32px ${alpha(theme.palette.primary.main, 0.2)}`,
      fontFamily: String(theme.typography.fontFamily),
    };

    return (
      <>
        {isOverlay && (
          <Fade in={open} mountOnEnter unmountOnExit>
            <Box
              aria-hidden="true"
              onClick={requestClose}
              sx={{
                position: 'fixed',
                inset: 0,
                zIndex: theme.zIndex.modal,
                bgcolor: theme.palette.action.disabledBackground,
              }}
            />
          </Fade>
        )}

        <Slide direction="left" in={open} mountOnEnter unmountOnExit>
          <Box
            ref={panelRef}
            component="aside"
            role="complementary"
            aria-label={ariaLabel}
            tabIndex={-1}
            sx={panelSx}
          >
            {resizable && (
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
              {children}
            </Box>
          </Box>
        </Slide>

        <ThemedDialog
          open={discardOpen}
          onClose={() => setDiscardOpen(false)}
          title="Discard changes?"
          actions={(
            <>
              <ThemedButton variant="outlined" onClick={() => setDiscardOpen(false)}>
                Keep Editing
              </ThemedButton>
              <ThemedButton variant="contained" onClick={() => { setDiscardOpen(false); onClose(); }}>
                Discard
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
