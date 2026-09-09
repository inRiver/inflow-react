import { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type CellFocusedEvent,
  type CellValueChangedEvent,
  type ColDef,
  type FirstDataRenderedEvent,
  type SelectionChangedEvent,
} from 'ag-grid-community';
import { AgGridReact, type CustomCellRendererProps } from 'ag-grid-react';
import {
  inflowGridHeaderActionsSx,
  inflowGridSelectionSx,
  inflowGridThemeParams,
} from '../ag-grid';
import {
  createDataTableCellContext,
  dataTableRows,
  isDataTableField,
  type DataTableCellContext,
  type DataTableRow,
  type DataTableStatus,
} from './DataTable.data';

ModuleRegistry.registerModules([AllCommunityModule]);

const gridTheme = themeQuartz.withParams({
  ...inflowGridThemeParams,
  headerHeight: 40,
  rowHeight: 44,
  wrapperBorder: false,
  wrapperBorderRadius: 0,
});

const rowSelection = {
  mode: 'multiRow',
  checkboxes: true,
  headerCheckbox: true,
  enableClickSelection: true,
} as const;

const selectionColumnDef = {
  width: 48,
  minWidth: 48,
  maxWidth: 48,
  pinned: 'left',
  lockPosition: true,
  resizable: false,
  sortable: false,
} as const;

const MI = ({ size = 24, children }: { readonly size?: number; readonly children: string }) => (
  <Icon baseClassName="material-icons-outlined" sx={{ fontSize: size }}>
    {children}
  </Icon>
);

function statusColor(status: DataTableStatus): 'success' | 'warning' | 'default' {
  switch (status) {
    case 'Active':
      return 'success';
    case 'Draft':
      return 'warning';
    case 'Archived':
      return 'default';
  }
}

function StatusCell({ value }: CustomCellRendererProps<DataTableRow, DataTableStatus>) {
  if (!value) return null;

  return (
    <Chip
      color={statusColor(value)}
      label={value}
      size="small"
      variant={value === 'Archived' ? 'outlined' : 'filled'}
    />
  );
}

const columnDefs: ColDef<DataTableRow>[] = [
  { field: 'sku', headerName: 'SKU', minWidth: 120, pinned: 'left' },
  { field: 'name', headerName: 'Product', editable: true, minWidth: 180, flex: 1 },
  { field: 'channel', headerName: 'Channel', editable: true, minWidth: 140 },
  {
    field: 'status',
    headerName: 'Status',
    editable: true,
    minWidth: 130,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: ['Active', 'Draft', 'Archived'] },
    cellRenderer: StatusCell,
  },
  {
    field: 'completeness',
    headerName: 'Completeness',
    editable: true,
    minWidth: 150,
    filter: 'agNumberColumnFilter',
    valueFormatter: ({ value }) => `${value}%`,
    valueParser: ({ newValue, oldValue }) => {
      const parsedValue = typeof newValue === 'number' ? newValue : Number.parseFloat(String(newValue));
      return Number.isFinite(parsedValue) ? Math.min(100, Math.max(0, parsedValue)) : oldValue;
    },
  },
];

export interface DataTableProps {
  readonly onFocusedCellChange?: (context: DataTableCellContext | null) => void;
}

export function DataTable({ onFocusedCellChange }: DataTableProps) {
  const [tab, setTab] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const rowData = useMemo(
    () => dataTableRows.filter(({ status }) => tab === 0 || status === ['Active', 'Draft', 'Archived'][tab - 1]),
    [tab],
  );

  const publishFocusedContext = useCallback((event: CellFocusedEvent<DataTableRow>) => {
    const field = typeof event.column === 'string' || event.column === null
      ? undefined
      : event.column.getColDef().field;
    const row = event.rowIndex === null ? undefined : event.api.getDisplayedRowAtIndex(event.rowIndex)?.data;
    onFocusedCellChange?.(row && isDataTableField(field) ? createDataTableCellContext(row, field) : null);
  }, [onFocusedCellChange]);

  const publishEditedContext = useCallback((event: CellValueChangedEvent<DataTableRow>) => {
    const field = event.colDef.field;
    onFocusedCellChange?.(
      event.data && isDataTableField(field) ? createDataTableCellContext(event.data, field) : null,
    );
  }, [onFocusedCellChange]);

  const selectReferenceRow = useCallback((event: FirstDataRenderedEvent<DataTableRow>) => {
    event.api.getRowNode('WB-077')?.setSelected(true);
  }, []);

  const updateSelectedCount = useCallback((event: SelectionChangedEvent<DataTableRow>) => {
    setSelectedCount(event.api.getSelectedRows().length);
  }, []);

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Box sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', flexWrap: { xs: 'wrap', sm: 'nowrap' }, alignItems: 'center', gap: 1 }}>
          <Tabs
            value={tab}
            onChange={(_event, value: unknown) => {
              if (typeof value === 'number') setTab(value);
            }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ flex: 1, minWidth: 0 }}
          >
            <Tab label="All products" />
            <Tab label="Active" />
            <Tab label="Draft" />
            <Tab label="Archived" />
          </Tabs>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: { xs: '100%', sm: 'auto' } }}>
            <Tooltip title="Filter">
              <IconButton aria-label="Filter products"><MI size={20}>filter_list</MI></IconButton>
            </Tooltip>
            <Tooltip title="Columns">
              <IconButton aria-label="Choose visible columns"><MI size={20}>view_column</MI></IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {selectedCount > 0 && (
        <Box sx={{ px: 2, py: 1, bgcolor: 'inflow.surfaceLow', display: 'flex', alignItems: 'center', gap: 2 }} data-testid="bulk-action-bar">
          <Typography variant="body2" color="primary.main">{selectedCount} selected</Typography>
          <Button size="small" variant="text" startIcon={<MI size={16}>publish</MI>}>Publish</Button>
          <Button size="small" variant="text" startIcon={<MI size={16}>auto_fix_high</MI>}>Enrich</Button>
          <Button size="small" variant="text" color="error" startIcon={<MI size={16}>delete</MI>}>Delete</Button>
        </Box>
      )}

      <Box
        role="region"
        aria-label="Product data grid"
        sx={{
          height: 300,
          width: '100%',
          overflow: 'hidden',
          ...inflowGridSelectionSx,
          ...inflowGridHeaderActionsSx,
        }}
      >
        <AgGridReact<DataTableRow>
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, filter: true, resizable: true }}
          getRowId={({ data }) => data.sku}
          rowData={rowData}
          rowSelection={rowSelection}
          selectionColumnDef={selectionColumnDef}
          theme={gridTheme}
          onCellFocused={publishFocusedContext}
          onCellValueChanged={publishEditedContext}
          onFirstDataRendered={selectReferenceRow}
          onSelectionChanged={updateSelectedCount}
        />
      </Box>
    </Paper>
  );
}
