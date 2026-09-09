import type { Theme } from '@mui/material/styles';

export const overviewLinkSx = (theme: Theme) => ({
  display: 'flex',
  minWidth: 0,
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.shortest,
  }),
  '& .overview-arrow': {
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  '&:hover': {
    backgroundColor: theme.palette.inflow.surfaceLow,
    '& .overview-arrow': {
      transform: 'translateX(4px)',
    },
  },
  '&:focus-visible': {
    zIndex: 1,
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '-2px',
  },
  '@media (prefers-reduced-motion: reduce)': {
    '& .overview-arrow': {
      transition: 'none',
    },
    '&:hover .overview-arrow': {
      transform: 'none',
    },
  },
});

export const overviewSectionSx = {
  overflow: 'hidden',
  border: 1,
  borderColor: 'inflow.outlineVariant',
  borderRadius: 2,
  backgroundColor: 'inflow.outlineVariant',
} as const;

export const overviewIconSx = {
  width: 40,
  height: 40,
  flex: '0 0 auto',
  display: 'grid',
  placeItems: 'center',
  borderRadius: 1,
  color: 'primary.main',
  backgroundColor: 'inflow.rowSelected',
} as const;
