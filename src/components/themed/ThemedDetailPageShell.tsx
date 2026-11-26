import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import { forwardRef, type ReactNode } from 'react';
import { ThemedDetailPanel, type ThemedDetailPanelProps } from './ThemedDetailPanel.js';
import { ThemedRightPanel, type ThemedRightPanelProps } from './ThemedRightPanel.js';

export interface ThemedDetailPageShellProps extends Omit<BoxProps, 'children'> {
  /** Main page content; applications own its landmarks and layout. */
  children: ReactNode;
  /**
   * Omit to render a page without a panel. RightPanel owns visibility and presentation.
   * In push mode this shell consumes its provider's --infl-right-panel-width; avoid
   * also applying that variable to an ancestor or the content will be pushed twice.
   */
  panel?: {
    panelProps: Omit<ThemedRightPanelProps, 'children'>;
    detailProps: Omit<ThemedDetailPanelProps, 'onClose'>;
  };
}

/** Page content paired with a controlled Inflow detail panel. */
export const ThemedDetailPageShell = forwardRef<HTMLDivElement, ThemedDetailPageShellProps>(
  function ThemedDetailPageShell({ children, panel, sx, ...props }, ref) {
    return (
      <Box ref={ref} sx={[{ minWidth: 0 }, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
        <Box
          sx={(theme) => ({
            minWidth: 0,
            marginRight: panel ? 'var(--infl-right-panel-width, 0px)' : undefined,
            transition: theme.transitions.create('margin-right', {
              duration: theme.transitions.duration.enteringScreen,
            }),
          })}
        >
          {children}
        </Box>
        {panel && (
          <ThemedRightPanel {...panel.panelProps}>
            {({ requestClose }) => <ThemedDetailPanel {...panel.detailProps} onClose={requestClose} />}
          </ThemedRightPanel>
        )}
      </Box>
    );
  },
);

ThemedDetailPageShell.displayName = 'ThemedDetailPageShell';
