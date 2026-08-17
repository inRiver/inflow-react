import { forwardRef, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, ReactNode, SyntheticEvent } from 'react';
import { Box, Icon } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { inflowTokens } from '../../theme';

export interface ThemedTabItem {
  label: string;
  icon?: string;
  disabled?: boolean;
  id?: string;
}

export interface ThemedTabsProps {
  tabs: ThemedTabItem[];
  value?: number;
  onChange?: (event: SyntheticEvent, index: number) => void;
  ariaLabel?: string;
  style?: CSSProperties;
}

export interface ThemedTabPanelProps {
  value: number;
  index: number;
  id?: string;
  children: ReactNode;
  style?: CSSProperties;
}

export const ThemedTabs = forwardRef<HTMLDivElement, ThemedTabsProps>(
  ({ tabs, value: controlledValue, onChange, ariaLabel, style }, ref) => {
    const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const [internal, setInternal] = useState(0);
    const active = controlledValue ?? internal;

    const selectIndex = (event: SyntheticEvent, index: number) => {
      if (tabs[index]?.disabled) return;
      if (controlledValue === undefined) setInternal(index);
      onChange?.(event, index);
    };

    const focusAndSelect = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      selectIndex(event, index);
      buttonRefs.current[index]?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      const enabledIndexes = tabs.flatMap((tab, index) => (tab.disabled ? [] : [index]));
      if (enabledIndexes.length === 0) return;

      const currentEnabledIndex = enabledIndexes.indexOf(currentIndex);
      const nextIndex = (direction: 1 | -1) => {
        const position = currentEnabledIndex === -1 ? 0 : currentEnabledIndex;
        return enabledIndexes[(position + direction + enabledIndexes.length) % enabledIndexes.length];
      };

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          focusAndSelect(event, nextIndex(1));
          break;
        case 'ArrowLeft':
          event.preventDefault();
          focusAndSelect(event, nextIndex(-1));
          break;
        case 'Home':
          event.preventDefault();
          focusAndSelect(event, enabledIndexes[0]);
          break;
        case 'End':
          event.preventDefault();
          focusAndSelect(event, enabledIndexes[enabledIndexes.length - 1]);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          selectIndex(event, currentIndex);
          break;
        default:
          break;
      }
    };

    return (
      <Box ref={ref} role="tablist" aria-label={ariaLabel} style={style} sx={{ display: 'flex' }}>
        {tabs.map((tab, index) => {
          const isActive = index === active;
          const id = tab.id ?? `themed-tab-${index}`;

          return (
            <Box
              key={id}
              component="button"
              ref={(node: HTMLButtonElement | null) => {
                buttonRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={id}
              aria-selected={isActive}
              aria-controls={`${id}-panel`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={(event) => selectIndex(event, index)}
              onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => handleKeyDown(event, index)}
              sx={(theme) => ({
                flex: '1 1 0',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: theme.spacing(1),
                padding: theme.spacing(0, 2),
                minHeight: 26,
                cursor: 'pointer',
                border: 0,
                backgroundColor: isActive ? theme.palette.inflow.primaryTab : 'transparent',
                color: theme.palette.primary.main,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                borderRadius: inflowTokens.radius.lg,
                fontFamily: theme.typography.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 500,
                lineHeight: '20px',
                letterSpacing: '0.1px',
                transition: 'background-color 0.15s ease',
                '&:hover': {
                  backgroundColor: isActive
                    ? theme.palette.inflow.primaryTab
                    : alpha(theme.palette.inflow.primaryTab, 0.4),
                },
                '&:focus-visible': {
                  outline: `2px solid ${theme.palette.primary.main}`,
                  outlineOffset: -2,
                },
                '&:disabled': {
                  opacity: 0.38,
                  cursor: 'not-allowed',
                },
              })}
            >
              {tab.icon && (
                <Icon baseClassName="material-icons-outlined" sx={{ width: 18, height: 18, fontSize: 18, lineHeight: 1 }}>
                  {tab.icon}
                </Icon>
              )}
              {tab.label}
            </Box>
          );
        })}
      </Box>
    );
  },
);

ThemedTabs.displayName = 'ThemedTabs';

export const ThemedTabPanel = forwardRef<HTMLDivElement, ThemedTabPanelProps>(
  ({ value, index, id, children, style }, ref) => {
    if (value !== index) return null;

    const tabId = id ?? `themed-tab-${index}`;
    return (
      <Box
        ref={ref}
        role="tabpanel"
        id={`${tabId}-panel`}
        aria-labelledby={tabId}
        style={style}
        sx={(theme) => ({
          border: `1px solid ${theme.palette.inflow.outlineVariant}`,
          borderTop: 0,
          padding: theme.spacing(3),
          backgroundColor: theme.palette.background.paper,
          fontFamily: theme.typography.fontFamily,
          fontSize: '0.875rem',
          lineHeight: '20px',
          color: theme.palette.text.secondary,
        })}
      >
        {children}
      </Box>
    );
  },
);

ThemedTabPanel.displayName = 'ThemedTabPanel';
