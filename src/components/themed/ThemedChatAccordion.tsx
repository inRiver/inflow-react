import { forwardRef, useId } from 'react';
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
  ({ title, steps, isStreaming = false, defaultExpanded = false, expanded, onChange, sx }, ref) => {
    const accordionId = useId();
    const summaryId = `${accordionId}-summary`;
    const detailsId = `${accordionId}-details`;

    const handleChange = (_event: SyntheticEvent, isExpanded: boolean) => {
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

    if (isStreaming) {
      return (
        <Box ref={ref} sx={sx}>
          <Box component="ul" aria-live="polite" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {steps.map((step, index) => {
              const isActive = index === activeStepIndex;
              return (
                <Box
                  component="li"
                  key={step.id}
                  aria-current={isActive ? 'step' : undefined}
                  sx={isActive
                    ? {
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
                      }
                    : { display: 'block', mb: 1 }}
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
          expanded={expanded}
          defaultExpanded={defaultExpanded}
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
              <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 20, color: 'text.secondary' }}>
                expand_more
              </Icon>
            }
            sx={(theme) => ({
              minHeight: 32,
              px: 0,
              fontSize: theme.typography.body2.fontSize,
              fontWeight: theme.typography.fontWeightRegular,
              lineHeight: theme.typography.body2.lineHeight,
              letterSpacing: theme.typography.body2.letterSpacing,
              color: 'text.primary',
              '&.Mui-expanded': { minHeight: 32 },
              '& .MuiAccordionSummary-content': { my: 0 },
              '& .MuiAccordionSummary-content.Mui-expanded': { my: 0 },
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
