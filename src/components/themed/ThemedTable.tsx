import { forwardRef } from 'react';
import type { ForwardedRef, ReactElement, ReactNode, RefAttributes } from 'react';
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
import { inriverTokens } from '../../theme/tokens';

type TableRowData = Record<string, unknown>;

export interface Column<T extends TableRowData = TableRowData> {
  id: string;
  label: string;
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
}

/**
 * ThemedTable
 * 
 * A pre-rendered, themed table component that follows the Inriver design system.
 * It provides a simplified data/columns API while applying Inriver styling.
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
  { columns, data, keyExtractor, striped = false, sx, ...props }: ThemedTableProps<T>,
  ref: ForwardedRef<HTMLTableElement>
) => {
    return (
      <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${inriverTokens.colors.outlineVariant}`, borderRadius: inriverTokens.radius.sm }}>
        <Table ref={ref} sx={[...(Array.isArray(sx) ? sx : [sx])]} {...props}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.id} 
                  align={column.align || 'left'}
                  sx={{ 
                    fontWeight: 600, 
                    color: inriverTokens.colors.onSurface,
                    borderColor: inriverTokens.colors.outlineVariant,
                    backgroundColor: inriverTokens.colors.surfaceHighest
                  }}
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
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: inriverTokens.colors.rowHover,
                  },
                  ...(striped && index % 2 === 1 && {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  })
                }}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={column.id} 
                    align={column.align || 'left'}
                    sx={{
                      borderColor: inriverTokens.colors.outlineVariant,
                      fontSize: '0.875rem',
                      letterSpacing: '0.25px'
                    }}
                  >
                    {column.render ? column.render(row) : String(row[column.id] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4, color: inriverTokens.colors.onSurfaceVariant }}>
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
