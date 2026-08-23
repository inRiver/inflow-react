import { forwardRef } from 'react';
import type { ForwardedRef, MouseEvent, ReactElement, ReactNode, RefAttributes } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper
} from '@mui/material';
import type { TableProps } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

type TableRowData = Record<string, unknown>;

export interface Column<T extends TableRowData = TableRowData> {
  id: string;
  label: ReactNode;
  /** Function to render a specific cell, or keyof T */
  render?: (row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface ThemedTableProps<T extends TableRowData = TableRowData> extends Omit<TableProps, 'data'> {
  /** Array of column definitions */
  columns: Column<T>[];
  /** Array of data objects */
  data: T[];
  /** Function to extract a unique key from a row */
  keyExtractor?: (row: T, index: number) => string | number;
  /** Enable striped rows */
  striped?: boolean;
  /** Styling applied to the outer table container */
  containerSx?: SxProps<Theme>;
  /** Mark rows as selected */
  isRowSelected?: (row: T, index: number) => boolean;
  /** Handle a row click */
  onRowClick?: (row: T, index: number, event: MouseEvent<HTMLTableRowElement>) => void;
}

/**
 * ThemedTable
 * 
 * A pre-rendered, themed table component that follows the Inflow design system.
 * It provides a simplified data/columns API while applying Inflow styling.
 *
 * @example
 * ```tsx
 * import { ThemedTable } from '@/components/themed';
 *
 * const columns = [
 *   { id: 'name', label: 'Name', render: (row) => row.name },
 *   { id: 'status', label: 'Status', render: (row) => <ThemedChip label={row.status} /> }
 * ];
 * 
 * <ThemedTable columns={columns} data={myData} striped />
 * ```
 */
const ThemedTableBase = <T extends TableRowData = TableRowData>(
  {
    columns,
    data,
    keyExtractor,
    striped = false,
    containerSx,
    isRowSelected,
    onRowClick,
    sx,
    ...props
  }: ThemedTableProps<T>,
  ref: ForwardedRef<HTMLTableElement>
) => {
    return (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={[
            (theme: Theme) => ({
              border: `1px solid ${theme.palette.inflow.outlineVariant}`,
              borderRadius: `${theme.shape.borderRadius}px`,
              boxShadow: 'none',
            }),
            ...(Array.isArray(containerSx) ? containerSx : [containerSx]),
          ]}
        >
        <Table ref={ref} sx={[...(Array.isArray(sx) ? sx : [sx])]} {...props}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.id} 
                  align={column.align || 'left'}
                  sx={(theme: Theme) => ({
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.inflow.outlineVariant,
                    backgroundColor: theme.palette.background.paper,
                    height: 48,
                    boxSizing: 'border-box',
                    padding: theme.spacing(0, 2),
                  })}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow 
                key={keyExtractor ? keyExtractor(row, index) : index}
                selected={isRowSelected?.(row, index) ?? false}
                aria-selected={isRowSelected ? isRowSelected(row, index) : undefined}
                onClick={onRowClick ? (event) => onRowClick(row, index, event) : undefined}
                sx={(theme: Theme) => ({
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: theme.palette.inflow.rowHover,
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(11, 45, 110, 0.08)',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'rgba(11, 45, 110, 0.14)',
                  },
                  ...(onRowClick && { cursor: 'pointer' }),
                  height: 52,
                  ...(striped && index % 2 === 1 && {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                  }),
                })}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={column.id} 
                    align={column.align || 'left'}
                    sx={(theme: Theme) => ({
                      borderColor: theme.palette.inflow.outlineVariant,
                      fontSize: '0.875rem',
                      letterSpacing: '0.015625rem',
                      color: theme.palette.text.secondary,
                      boxSizing: 'border-box',
                      padding: theme.spacing(0, 2),
                    })}
                  >
                    {column.render ? column.render(row) : String(row[column.id] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

const ForwardedThemedTable = forwardRef(ThemedTableBase);
ForwardedThemedTable.displayName = 'ThemedTable';

export const ThemedTable = ForwardedThemedTable as <T extends TableRowData = TableRowData>(
  props: ThemedTableProps<T> & RefAttributes<HTMLTableElement>
) => ReactElement | null;
