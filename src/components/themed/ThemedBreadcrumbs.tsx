import { forwardRef, useState } from 'react';
import { Breadcrumbs, Icon, IconButton, Link, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export interface ThemedBreadcrumbItem {
  label: ReactNode;
  href?: string;
  icon?: string;
  onClick?: () => void;
}

export interface ThemedBreadcrumbsProps {
  items: ThemedBreadcrumbItem[];
  /** Separator style — chevron (default) or slash. */
  separator?: 'chevron' | 'slash';
  /** Max items before collapsing to ellipsis. */
  maxItems?: number;
}

export const ThemedBreadcrumbs = forwardRef<HTMLElement, ThemedBreadcrumbsProps>(
  ({ items, separator = 'chevron', maxItems }, ref) => {
    const [expanded, setExpanded] = useState(false);
    const breadcrumbSeparator =
      separator === 'chevron' ? (
        <Icon
          baseClassName="material-icons-outlined"
          sx={{ fontSize: 18, color: 'text.secondary', verticalAlign: 'middle' }}
        >
          chevron_right
        </Icon>
      ) : (
        <Typography
          component="span"
          sx={(theme) => ({
            color: theme.palette.text.secondary,
            opacity: 0.7,
            userSelect: 'none',
            fontSize: '1rem',
            lineHeight: 1,
          })}
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

          const isLast = index === visibleItems.length - 1;
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

          if (isLast) {
            return (
              <Typography
                key={index}
                aria-current="page"
                variant="body2"
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {content}
              </Typography>
            );
          }

          return (
            <Link
              key={index}
              href={item.href ?? '#'}
              onClick={item.onClick}
              underline="hover"
              variant="body2"
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                '&:hover': { color: 'primary.main' },
              }}
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
