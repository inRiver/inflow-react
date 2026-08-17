import { forwardRef, useId } from 'react';
import type { ReactNode, SyntheticEvent } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Icon,
} from '@mui/material';

export interface ThemedAccordionItem {
  id: string;
  summary: ReactNode;
  details: ReactNode;
  disabled?: boolean;
}

export interface ThemedAccordionProps {
  items: ThemedAccordionItem[];
  /** Controlled expanded panel id(s). Pass an array to allow multiple panels. */
  expanded?: string | string[];
  /** If true, multiple panels can be open simultaneously. */
  multiple?: boolean;
  onChange?: (id: string, isExpanded: boolean) => void;
}

export const ThemedAccordion = forwardRef<HTMLDivElement, ThemedAccordionProps>(
  ({ items, expanded, multiple = false, onChange }, ref) => {
    const accordionId = useId();
    const isMultiple = multiple || Array.isArray(expanded);

    const isExpanded = (id: string) => {
      if (expanded === undefined) return false;
      if (isMultiple && Array.isArray(expanded)) return expanded.includes(id);
      return expanded === id;
    };

    const handleChange = (id: string) => (_event: SyntheticEvent, isOpen: boolean) => {
      onChange?.(id, isOpen);
    };

    return (
      <div ref={ref}>
        {items.map((item) => {
          const summaryId = `${accordionId}-${item.id}-summary`;
          const detailsId = `${accordionId}-${item.id}-details`;

          return (
            <Accordion
            key={item.id}
            disabled={item.disabled}
            expanded={expanded !== undefined ? isExpanded(item.id) : undefined}
            onChange={handleChange(item.id)}
            disableGutters
            elevation={0}
            sx={(theme) => ({
              border: '1px solid',
              borderColor: theme.palette.divider,
              borderBottom: 'none',
              '&:first-of-type': {
                borderTopLeftRadius: theme.shape.borderRadius,
                borderTopRightRadius: theme.shape.borderRadius,
              },
              '&:last-of-type': {
                borderBottom: '1px solid',
                borderColor: theme.palette.divider,
                borderBottomLeftRadius: theme.shape.borderRadius,
                borderBottomRightRadius: theme.shape.borderRadius,
              },
            })}
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
                minHeight: 48,
                px: 2,
                fontSize: '0.875rem',
                fontWeight: theme.typography.fontWeightMedium,
                lineHeight: '20px',
                letterSpacing: '0.1px',
                '&:hover': { backgroundColor: theme.palette.action.hover },
                '&.Mui-expanded': { minHeight: 48 },
                '& .MuiAccordionSummary-content': { my: '14px', margin: '14px 0' },
                '& .MuiAccordionSummary-content.Mui-expanded': { my: '14px', margin: '14px 0' },
              })}
            >
              {item.summary}
            </AccordionSummary>
            <AccordionDetails
              id={detailsId}
              aria-labelledby={summaryId}
              sx={(theme) => ({
                px: 2,
                pb: 2,
                pt: 2,
                fontSize: '0.875rem',
                lineHeight: '20px',
                letterSpacing: '0.25px',
                color: theme.palette.text.secondary,
              })}
            >
              {item.details}
            </AccordionDetails>
          </Accordion>
          );
        })}
      </div>
    );
  },
);

ThemedAccordion.displayName = 'ThemedAccordion';
