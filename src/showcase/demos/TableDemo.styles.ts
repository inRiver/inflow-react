import type { SxProps, Theme } from '@mui/material/styles';

export function getReferenceTableSx(size: 'small' | 'medium', padding: 'normal' | 'checkbox' | 'none'): SxProps<Theme> {
  const horizontalPadding = padding === 'none' ? 0 : padding === 'checkbox' ? 1 : 2;
  const rowHeight = size === 'small' ? 32 : 40;

  return {
    minWidth: 1273,
    tableLayout: 'fixed',
    '& th, & td': { boxSizing: 'border-box', borderColor: 'inflow.outlineVariant', px: horizontalPadding },
    '& thead th': {
      height: 32,
      py: 0,
      position: 'relative',
      bgcolor: 'background.paper',
      color: 'text.primary',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: 0,
      lineHeight: 1,
    },
    '& thead th:nth-of-type(n+2)::before': {
      position: 'absolute',
      top: '50%',
      left: 0,
      width: '1px',
      height: 12,
      bgcolor: 'inflow.outlineVariant',
      content: '""',
      transform: 'translateY(-50%)',
    },
    '& tbody tr': { height: rowHeight },
    '& tbody td': {
      height: rowHeight,
      py: 0,
      overflow: 'hidden',
      color: 'text.primary',
      fontSize: 14,
      letterSpacing: 0,
      lineHeight: 1.2,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '& th:nth-of-type(1), & td:nth-of-type(1)': { width: 48, minWidth: 48, maxWidth: 48, px: 1 },
    '& th:nth-of-type(2), & td:nth-of-type(2)': { width: 210 },
    '& th:nth-of-type(3), & td:nth-of-type(3)': { width: 165 },
    '& th:nth-of-type(4), & td:nth-of-type(4)': { width: 155 },
    '& th:nth-of-type(5), & td:nth-of-type(5)': { width: 220 },
    '& th:nth-of-type(6), & td:nth-of-type(6)': { width: 150 },
    '& th:nth-of-type(7), & td:nth-of-type(7)': { width: 200 },
    '& th:nth-of-type(8), & td:nth-of-type(8)': { width: 125 },
    '& .MuiCheckbox-root': { p: 0.5 },
    '& .MuiSvgIcon-root': { fontSize: 18 },
  };
}
