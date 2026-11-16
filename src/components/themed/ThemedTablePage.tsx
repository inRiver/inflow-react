import { Box, Typography } from '@mui/material';
import type { BoxProps } from '@mui/material';
import { forwardRef, type ForwardedRef, type ReactElement, type ReactNode, type RefAttributes } from 'react';
import { ThemedPageHeader, type ThemedPageHeaderProps } from './ThemedPageHeader';
import { ThemedTable, type ThemedTableProps } from './ThemedTable';

type TableRowData = Record<string, unknown>;

export interface ThemedTablePageProps<T extends TableRowData = TableRowData> extends Omit<BoxProps, 'children'> {
  /** Optional page chrome; its props are forwarded to ThemedPageHeader. */
  header?: ThemedPageHeaderProps;
  /** Application-owned filters and table actions. */
  toolbar?: ReactNode;
  columns: ThemedTableProps<T>['columns'];
  data: ThemedTableProps<T>['data'];
  /** Remaining props forwarded to ThemedTable. */
  tableProps?: Omit<ThemedTableProps<T>, 'columns' | 'data'>;
  /** Loading takes precedence over both rows and the empty state. */
  loading?: boolean;
  loadingContent?: ReactNode;
  emptyContent?: ReactNode;
}

const ThemedTablePageBase = <T extends TableRowData = TableRowData>(
  {
    header,
    toolbar,
    columns,
    data,
    tableProps,
    loading = false,
    loadingContent = 'Loading...',
    emptyContent = 'No data available',
    sx,
    ...props
  }: ThemedTablePageProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) => (
  <Box ref={ref} aria-busy={loading} sx={[{ minWidth: 0 }, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
    {header && <ThemedPageHeader {...header} />}
    <Box sx={(theme) => ({ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) })}>
      {toolbar}
      {loading ? (
        <Typography component="div" role="status" color="text.secondary">{loadingContent}</Typography>
      ) : data.length === 0 ? (
        <Typography component="div" role="status" color="text.secondary">{emptyContent}</Typography>
      ) : (
        <ThemedTable {...tableProps} columns={columns} data={data} />
      )}
    </Box>
  </Box>
);

const ForwardedThemedTablePage = forwardRef(ThemedTablePageBase);
ForwardedThemedTablePage.displayName = 'ThemedTablePage';

export const ThemedTablePage = ForwardedThemedTablePage as <T extends TableRowData = TableRowData>(
  props: ThemedTablePageProps<T> & RefAttributes<HTMLDivElement>,
) => ReactElement | null;
