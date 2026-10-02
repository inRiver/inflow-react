import { forwardRef, useState } from 'react';
import { Box, Breadcrumbs, Icon, IconButton, Link, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export interface ThemedBreadcrumbItem {
  label: ReactNode;
  href?: string;
  icon?: string;
  onClick?: () => void;
}

export interface ThemedBreadcrumbsProps {
  items: ThemedBreadcrumbItem[];
  /** Separator style — vertical bar (default), chevron, or slash. */
  separator?: 'bar' | 'chevron' | 'slash';
  /** Max items before collapsing to ellipsis. */
  maxItems?: number;
}

export const ThemedBreadcrumbs = forwardRef<HTMLElement, ThemedBreadcrumbsProps>(
  ({ items, separator = 'bar', maxItems }, ref) => {
    const [expanded, setExpanded] = useState(false);
    const breadcrumbSeparator =
      separator === 'chevron' ? (
        <Icon
          baseClassName="material-icons-outlined"
          sx={{ fontSize: 18, color: 'text.secondary', verticalAlign: 'middle' }}
        >
          chevron_right
        </Icon>
      ) : separator === 'bar' ? (
        <Box
          component="span"
          sx={(theme) => ({
            display: 'inline-block',
            width: '1px',
            height: '0.9em',
            backgroundColor: theme.palette.primary.main,
            verticalAlign: 'middle',
            userSelect: 'none',
          })}
        />
      ) : (
        <Typography
          component="span"
          sx={{ color: 'text.secondary', opacity: 0.7, userSelect: 'none', fontSize: 'inherit' }}
        >
          /
        </Typography>
      );
    const visibleItems =
      !expanded && maxItems && items.length > maxItems
        ? [...items.slice(0, 1), null, ...items.slice(items.length - (maxItems - 1))]
        : items;

    return (
      <Breadcrumbs
        ref={ref}
        aria-label="breadcrumb"
        separator={breadcrumbSeparator}
        sx={{
          '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap', alignItems: 'center' },
          '& .MuiBreadcrumbs-li': { display: 'flex', alignItems: 'center' },
        }}
      >
        {visibleItems.map((item, index) => {
          if (item === null) {
            return (
              <IconButton
                key="ellipsis"
                aria-label="Show all breadcrumbs"
                size="small"
                onClick={() => setExpanded(true)}
                sx={{ borderRadius: 1, color: 'text.secondary', fontSize: 14 }}
              >
                …
              </IconButton>
            );
          }

          const content = (
            <>
              {item.icon && (
                <Icon
                  baseClassName="material-icons-outlined"
                  sx={{ fontSize: 16, mr: '4px', verticalAlign: 'middle' }}
                >
                  {item.icon}
                </Icon>
              )}
              {item.label}
            </>
          );

          return (
            <Link
              key={index}
              href={item.href ?? '#'}
              onClick={item.onClick}
              underline="always"
              variant="body2"
              color="primary.main"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {content}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  },
);

ThemedBreadcrumbs.displayName = 'ThemedBreadcrumbs';
