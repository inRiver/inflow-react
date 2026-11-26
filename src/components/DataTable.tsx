import { useCallback, useMemo, useRef, useState } from 'react';
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
  useTheme,
} from '@mui/material';
import {
  AllCommunityModule,
  ModuleRegistry,
  colorSchemeDark,
  themeQuartz,
  type CellFocusedEvent,
  type CellEditRequestEvent,
  type ColDef,
  type FirstDataRenderedEvent,
  type ModelUpdatedEvent,
  type SelectionChangedEvent,
} from 'ag-grid-community';
import { AgGridReact, type CustomCellRendererProps } from 'ag-grid-react';
import {
  inflowGridHeaderActionsSx,
  inflowGridSelectionSx,
  inflowGridThemeParams,
  inflowGridThemeParamsDark,
} from '../ag-grid';
import {
  createDataTableCellContext,
  dataTableRows,
  isDataTableField,
  type DataTableCellContext,
  type DataTableField,
  type DataTableRow,
  type DataTableStatus,
} from './DataTable.data';
import { dateColumn, dateTimeColumn } from '../datetime';
import { displayedDayFilter } from '../datetime/format';

ModuleRegistry.registerModules([AllCommunityModule]);

const gridDimensionParams = {
  headerHeight: 40,
  rowHeight: 44,
  wrapperBorder: false,
  wrapperBorderRadius: 0,
} as const;

const lightGridTheme = themeQuartz.withParams({ ...inflowGridThemeParams, ...gridDimensionParams });
const darkGridTheme = themeQuartz
  .withPart(colorSchemeDark)
  .withParams({ ...inflowGridThemeParamsDark, ...gridDimensionParams });

const defaultColDef = { sortable: true, filter: true, resizable: true } as const;
const getRowId = ({ data }: { data: DataTableRow }) => data.sku;

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
  { field: 'createdAt', headerName: 'Created', minWidth: 170, ...dateTimeColumn, ...displayedDayFilter },
  { field: 'createdAt', colId: 'createdDate', headerName: 'Created (date)', minWidth: 150, ...dateColumn, ...displayedDayFilter },
];

function isVisibleInTab(row: DataTableRow, tab: number): boolean {
  return tab === 0 || row.status === ['Active', 'Draft', 'Archived'][tab - 1];
}

function applyEdit(row: DataTableRow, columnId: string, value: unknown): DataTableRow | null {
  switch (columnId) {
    case 'name':
    case 'channel':
      return typeof value === 'string' ? { ...row, [columnId]: value } : null;
    case 'status':
      return value === 'Active' || value === 'Draft' || value === 'Archived'
        ? { ...row, status: value }
        : null;
    case 'completeness': {
      const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number.parseFloat(value) : NaN;
      return Number.isFinite(parsed) ? { ...row, completeness: Math.min(100, Math.max(0, parsed)) } : null;
    }
    default:
      return null;
  }
}

export interface DataTableProps {
  readonly onFocusedCellChange?: (context: DataTableCellContext | null) => void;
}

export function DataTable({ onFocusedCellChange }: DataTableProps) {
  const gridTheme = useTheme().palette.mode === 'dark' ? darkGridTheme : lightGridTheme;
  const [tab, setTab] = useState(0);
  const [rows, setRows] = useState<DataTableRow[]>(() => dataTableRows.map((row) => ({ ...row })));
  // Events can arrive in a batch before React renders the next rowData/tab props.
  const rowsRef = useRef(rows);
  const tabRef = useRef(tab);
  const focusedCellRef = useRef<{ sku: string; colId: DataTableField } | null>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const rowData = useMemo(() => rows.filter((row) => isVisibleInTab(row, tab)), [rows, tab]);

  const publishFocusedContext = useCallback((event: CellFocusedEvent<DataTableRow>) => {
    // AG Grid retains cell focus when browser focus moves outside the grid.
    // The column id, not the field: two columns can show the same field differently.
    const columnId = typeof event.column === 'string' ? event.column : event.column?.getColId();
    const displayedRow = event.rowIndex === null ? undefined : event.api.getDisplayedRowAtIndex(event.rowIndex)?.data;
    const row = rowsRef.current.find(({ sku }) => sku === displayedRow?.sku);
    if (row && isVisibleInTab(row, tabRef.current) && isDataTableField(columnId)) {
      focusedCellRef.current = { sku: row.sku, colId: columnId };
      onFocusedCellChange?.(createDataTableCellContext(row, columnId));
    } else {
      focusedCellRef.current = null;
      onFocusedCellChange?.(null);
    }
  }, [onFocusedCellChange]);

  const handleEditRequest = useCallback((event: CellEditRequestEvent<DataTableRow>) => {
    const columnId = event.column.getColId();
    const row = rowsRef.current.find(({ sku }) => sku === event.data?.sku);
    if (!row) return;
    const updatedRow = applyEdit(row, columnId, event.newValue);
    if (!updatedRow) return;

    const nextRows = rowsRef.current.map((current) => current.sku === row.sku ? updatedRow : current);
    rowsRef.current = nextRows;
    setRows(nextRows);

    const focused = focusedCellRef.current;
    if (focused?.sku !== row.sku) return;
    if (!isVisibleInTab(updatedRow, tabRef.current)) {
      focusedCellRef.current = null;
      onFocusedCellChange?.(null);
    } else if (focused.colId === columnId) {
      onFocusedCellChange?.(createDataTableCellContext(updatedRow, focused.colId));
    }
  }, [onFocusedCellChange]);

  const changeTab = useCallback((nextTab: number) => {
    tabRef.current = nextTab;
    setTab(nextTab);
    const focused = focusedCellRef.current;
    if (focused && !rowsRef.current.some((row) => row.sku === focused.sku && isVisibleInTab(row, nextTab))) {
      focusedCellRef.current = null;
      onFocusedCellChange?.(null);
    }
  }, [onFocusedCellChange]);

  const reconcileDisplayedFocus = useCallback((event: ModelUpdatedEvent<DataTableRow>) => {
    const focused = focusedCellRef.current;
    const activeCell = event.api.getFocusedCell();
    const displayedRow = activeCell ? event.api.getDisplayedRowAtIndex(activeCell.rowIndex)?.data : undefined;
    const activeColId = activeCell?.column.getColId();
    const row = displayedRow ? rowsRef.current.find(({ sku }) => sku === displayedRow.sku) : undefined;
    if (!row || !isVisibleInTab(row, tabRef.current) || !isDataTableField(activeColId)) {
      if (focused) {
        focusedCellRef.current = null;
        onFocusedCellChange?.(null);
      }
      return;
    }
    if (row.sku !== focused?.sku || activeColId !== focused.colId) {
      focusedCellRef.current = { sku: row.sku, colId: activeColId };
      onFocusedCellChange?.(createDataTableCellContext(row, activeColId));
    }
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
              if (typeof value === 'number') changeTab(value);
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
          defaultColDef={defaultColDef}
          getRowId={getRowId}
          rowData={rowData}
          rowSelection={rowSelection}
          selectionColumnDef={selectionColumnDef}
          theme={gridTheme}
          onCellFocused={publishFocusedContext}
          readOnlyEdit
          onCellEditRequest={handleEditRequest}
          onFirstDataRendered={selectReferenceRow}
          onModelUpdated={reconcileDisplayedFocus}
          onSelectionChanged={updateSelectedCount}
        />
      </Box>
    </Paper>
  );
}
