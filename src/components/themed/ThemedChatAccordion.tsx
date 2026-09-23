import { forwardRef, useId, useState } from 'react';
import type { ReactNode, SyntheticEvent } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Icon,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

export interface ThemedChatAccordionStep {
  id: string;
  label: ReactNode;
  /** Shows the DS-owned progress indicator while `isStreaming` is true. */
  isActive?: boolean;
}

export interface ThemedChatAccordionProps {
  /** Header text of the collapsed accordion (e.g. "Reasoning"). */
  title: ReactNode;
  /** Completed and in-flight steps for a single assistant turn. */
  steps: readonly ThemedChatAccordionStep[];
  /**
   * When true the steps render inline as a flat list (active step shows a
   * spinner); when false they fold into a collapsed accordion. Conditionally
   * mounting the accordion means its uncontrolled expansion naturally starts
   * from `defaultExpanded` once streaming ends.
   */
  isStreaming?: boolean;
  /**
   * Renders per-step todo/checklist status icons in the streaming view:
   * done steps show `check_circle`, the active step shows the spinner, and
   * pending steps show `radio_button_unchecked`.
   */
  stepStatusIcons?: boolean;
  defaultExpanded?: boolean;
  /** Controlled expansion. Omit to keep the product rule: collapsed when done. */
  expanded?: boolean;
  onChange?: (expanded: boolean) => void;
  sx?: SxProps<Theme>;
}

/**
 * Chat "Reasoning" block for an assistant turn. While streaming it shows tool
 * steps inline; once streaming completes the same steps fold into a collapsed
 * accordion labelled `title`. Content construction (labels, Markdown, italics)
 * stays host-owned via `label: ReactNode`; the DS owns row layout and the
 * streaming spinner.
 *
 * @example
 * <ThemedChatAccordion
 *   title="Reasoning"
 *   isStreaming={isStreaming}
 *   steps={[{ id: '1', label: 'Tool used: Loading file' }, { id: '2', label: 'Extracting data', isActive: true }]}
 * />
 */
export const ThemedChatAccordion = forwardRef<HTMLDivElement, ThemedChatAccordionProps>(
  ({ title, steps, isStreaming = false, stepStatusIcons = false, defaultExpanded = false, expanded, onChange, sx }, ref) => {
    const accordionId = useId();
    const summaryId = `${accordionId}-summary`;
    const detailsId = `${accordionId}-details`;

    const isControlled = expanded !== undefined;
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
    const open = isControlled ? expanded : internalExpanded;

    const handleChange = (_event: SyntheticEvent, isExpanded: boolean) => {
      if (!isControlled) setInternalExpanded(isExpanded);
      onChange?.(isExpanded);
    };

    const stepLabel = (step: ThemedChatAccordionStep, isActive = step.isActive === true) => (
      <Box
        component="span"
        sx={(theme) => ({
          minWidth: 0,
          flex: isActive ? '1 1 auto' : undefined,
          fontSize: theme.typography.body2.fontSize,
          lineHeight: theme.typography.body2.lineHeight,
          letterSpacing: theme.typography.body2.letterSpacing,
          color: 'text.secondary',
          overflowWrap: 'anywhere',
        })}
      >
        {step.label}
      </Box>
    );

    const activeStepIndex = steps.reduce(
      (latestIndex, step, index) => step.isActive ? index : latestIndex,
      -1,
    );

    const activePillSx = {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      minHeight: 40,
      mb: 1,
      px: 1.5,
      py: 1,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2.5,
    } as const;

    const statusLeadingIcon = (status: 'done' | 'active' | 'pending') => {
      if (status === 'active') {
        return <CircularProgress aria-hidden="true" size={16} thickness={5} sx={{ flexShrink: 0 }} />;
      }
      return (
        <Icon
          aria-hidden="true"
          baseClassName="material-icons-outlined"
          sx={{ flexShrink: 0, fontSize: 18, color: status === 'done' ? 'primary.main' : 'text.disabled' }}
        >
          {status === 'done' ? 'check_circle' : 'radio_button_unchecked'}
        </Icon>
      );
    };

    if (isStreaming) {
      return (
        <Box ref={ref} sx={sx}>
          <Box component="ul" aria-live="polite" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {steps.map((step, index) => {
              const isActive = index === activeStepIndex;

              if (stepStatusIcons) {
                const status = activeStepIndex === -1 || index < activeStepIndex
                  ? 'done'
                  : isActive ? 'active' : 'pending';
                return (
                  <Box
                    component="li"
                    key={step.id}
                    aria-current={isActive ? 'step' : undefined}
                    sx={isActive ? activePillSx : { display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                  >
                    {statusLeadingIcon(status)}
                    {stepLabel(step, isActive)}
                  </Box>
                );
              }

              return (
                <Box
                  component="li"
                  key={step.id}
                  aria-current={isActive ? 'step' : undefined}
                  sx={isActive ? activePillSx : { display: 'block', mb: 1 }}
                >
                  {isActive ? (
                    <Icon
                      aria-hidden="true"
                      baseClassName="material-icons-outlined"
                      sx={{ flexShrink: 0, color: 'text.secondary', fontSize: 16 }}
                    >
                      build
                    </Icon>
                  ) : null}
                  {stepLabel(step, isActive)}
                  {isActive ? (
                    <CircularProgress aria-hidden="true" size={14} thickness={5} sx={{ flexShrink: 0 }} />
                  ) : null}
                </Box>
              );
            })}
          </Box>
        </Box>
      );
    }

    return (
      <Box ref={ref} sx={sx}>
        <Accordion
          expanded={open}
          onChange={handleChange}
          disableGutters
          elevation={0}
          sx={{
            m: 0,
            bgcolor: 'transparent',
            borderRadius: 0,
            '&:before': { display: 'none' },
            '&.Mui-expanded': { m: 0 },
          }}
        >
          <AccordionSummary
            id={summaryId}
            aria-controls={detailsId}
            expandIcon={
              <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 18, color: 'text.secondary' }}>
                {open ? 'expand_more' : 'chevron_right'}
              </Icon>
            }
            sx={(theme) => ({
              minHeight: 32,
              px: 0,
              width: 'fit-content',
              fontSize: '0.75rem',
              fontWeight: theme.typography.fontWeightMedium,
              lineHeight: theme.typography.body2.lineHeight,
              letterSpacing: theme.typography.body2.letterSpacing,
              color: 'text.secondary',
              '&.Mui-expanded': { minHeight: 32 },
              '& .MuiAccordionSummary-content': { my: 0, flexGrow: 0 },
              '& .MuiAccordionSummary-content.Mui-expanded': { my: 0 },
              '& .MuiAccordionSummary-expandIconWrapper': { ml: 0.5 },
              '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': { transform: 'none' },
            })}
          >
            {title}
          </AccordionSummary>
          <AccordionDetails
            id={detailsId}
            aria-labelledby={summaryId}
            sx={{ px: 0, pb: 0, pt: 0.75 }}
          >
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
              {steps.map((step) => (
                <Box component="li" key={step.id} sx={{ mb: 1, '&:last-child': { mb: 0 } }}>
                  {stepLabel(step, false)}
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  },
);

ThemedChatAccordion.displayName = 'ThemedChatAccordion';
