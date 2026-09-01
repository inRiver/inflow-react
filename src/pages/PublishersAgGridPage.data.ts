import type { ColDef, MultiRowSelectionOptions, SelectionColumnDef } from 'ag-grid-community';
import {
  inflowGridHeaderActionsSx,
  inflowGridSelectionSx,
  inflowGridThemeParams,
} from '../ag-grid';
import { tableReferenceRows, type TableReferenceRow } from '../showcase/tableReferenceData';
import { EntityCell, MediaCell } from './PublishersAgGridCells';

export type PublisherRowData = TableReferenceRow;

export const publisherGridThemeParams = {
  ...inflowGridThemeParams,
  headerHeight: 32,
  rowHeight: 40,
  headerFontSize: 12,
  headerFontWeight: 700,
  headerColumnBorder: `1px solid ${inflowGridThemeParams.borderColor}`,
  headerColumnBorderHeight: '40%',
  headerColumnResizeHandleColor: 'transparent',
  selectedRowBackgroundColor: 'rgba(11, 45, 110, 0.08)',
  wrapperBorder: false,
  wrapperBorderRadius: 0,
};

export const publisherColumnDefs: ColDef<PublisherRowData>[] = [
  {
    colId: 'entity',
    headerName: 'Entity',
    valueGetter: ({ data }) => data?.entityId,
    cellRenderer: EntityCell,
    minWidth: 190,
    width: 210,
  },
  {
    colId: 'media',
    headerName: 'Media',
    valueGetter: ({ data }) => data?.mediaColors.length ?? 0,
    cellRenderer: MediaCell,
    filter: false,
    minWidth: 165,
    width: 165,
  },
  { field: 'displayName', headerName: 'Display Name', minWidth: 155, width: 155 },
  { field: 'displayDescription', headerName: 'Display Description', minWidth: 210, width: 220 },
  {
    field: 'completeness',
    headerName: 'Completeness',
    valueFormatter: ({ value }) => `${value}%`,
    filter: 'agNumberColumnFilter',
    minWidth: 150,
    width: 150,
  },
  { field: 'fieldSet', headerName: 'Field Set', minWidth: 190, width: 200 },
  { field: 'segments', headerName: 'Segments', minWidth: 125, width: 125 },
];

export const publisherRowData: PublisherRowData[] = tableReferenceRows;

export const publisherRowSelection: MultiRowSelectionOptions<PublisherRowData> = {
  mode: 'multiRow',
  checkboxes: true,
  headerCheckbox: true,
  enableClickSelection: true,
  enableSelectionWithoutKeys: true,
};

export const publisherSelectionColumnDef: SelectionColumnDef = {
  width: 48,
  minWidth: 48,
  maxWidth: 48,
  pinned: 'left',
  lockPosition: true,
  resizable: false,
  sortable: false,
};

export const publisherGridSx = {
  width: '100%',
  height: 272,
  overflow: 'hidden',
  ...inflowGridSelectionSx,
  ...inflowGridHeaderActionsSx,
} as const;

export const publisherUsageCode = `import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Box } from '@mui/material';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type ICellRendererParams,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import {
  inflowGridHeaderActionsSx,
  inflowGridSelectionSx,
  inflowGridThemeParams,
} from '@inriver/inflow-react/ag-grid';

// AG Grid registration stays in the consuming app; the Inflow export does not import AG Grid.
ModuleRegistry.registerModules([AllCommunityModule]);

type ProductRow = {
  entityId: string;
  entityName: string;
  mediaColors: string[];
  additionalMediaCount: number;
  displayName: string;
  displayDescription: string;
  completeness: number;
  fieldSet: string;
  segments: string;
};

const mediaColors = ['#e9d4d8', '#b0b0b0', '#e9d4d8', '#4a4a4a', '#4a4a4a'];

const productRows: ProductRow[] = [
  { entityId: 'T60V0111', entityName: '60V Push Mowers', mediaColors, additionalMediaCount: 5, displayName: 'T60V0111', displayDescription: '60V Push Mowers', completeness: 72, fieldSet: 'Outdoor Power Tools', segments: 'Default' },
  { entityId: 'T60V0212', entityName: '60V Self-Propelled', mediaColors, additionalMediaCount: 5, displayName: 'T60V0212', displayDescription: '60V Self-Propelled', completeness: 88, fieldSet: 'Outdoor Power Tools', segments: 'Default' },
  { entityId: 'T80V0301', entityName: '80V Snow Blowers', mediaColors, additionalMediaCount: 5, displayName: 'T80V0301', displayDescription: '80V Snow Blowers', completeness: 64, fieldSet: 'Snow Removal', segments: 'Default' },
  { entityId: 'T40V1102', entityName: '40V Hedge Trimmer', mediaColors, additionalMediaCount: 5, displayName: 'T40V1102', displayDescription: '40V Hedge Trimmer', completeness: 53, fieldSet: 'Trimmers & Edgers', segments: 'Default' },
  { entityId: 'T20V0808', entityName: '20V String Trimmer', mediaColors, additionalMediaCount: 5, displayName: 'T20V0808', displayDescription: '20V String Trimmer', completeness: 91, fieldSet: 'Trimmers & Edgers', segments: 'Default' },
  { entityId: 'T60V0445', entityName: '60V Riding Mowers', mediaColors, additionalMediaCount: 5, displayName: 'T60V0445', displayDescription: '60V Riding Mowers', completeness: 79, fieldSet: 'Outdoor Power Tools', segments: 'Default' },
];

function EntityCell({ data }: ICellRendererParams<ProductRow>) {
  if (!data) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
      <DescriptionOutlinedIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box sx={{ fontSize: 14, lineHeight: '17px' }}>{data.entityId}</Box>
        <Box sx={{ color: 'text.secondary', fontSize: 11, lineHeight: '14px' }}>
          {data.entityName}
        </Box>
      </Box>
    </Box>
  );
}

function MediaCell({ data }: ICellRendererParams<ProductRow>) {
  if (!data) return null;

  return (
    <Box
      aria-label={data.mediaColors.length + data.additionalMediaCount + ' media items'}
      sx={{ display: 'flex', alignItems: 'center', gap: 0.5, height: '100%' }}
    >
      {data.mediaColors.map((color, index) => (
        <Box
          aria-hidden="true"
          key={data.entityId + '-media-' + index}
          sx={{ width: 20, height: 24, flexShrink: 0, borderRadius: '2px', bgcolor: color }}
        />
      ))}
      <Box sx={{ ml: 0.25, color: 'text.secondary', fontSize: 11 }}>
        +{data.additionalMediaCount}
      </Box>
    </Box>
  );
}

const productColumns: ColDef<ProductRow>[] = [
  {
    colId: 'entity',
    headerName: 'Entity',
    valueGetter: ({ data }) => data?.entityId,
    // Cell renderers are application components, not part of the shared theme.
    cellRenderer: EntityCell,
    minWidth: 190,
    width: 210,
  },
  {
    colId: 'media',
    headerName: 'Media',
    valueGetter: ({ data }) => data?.mediaColors.length ?? 0,
    cellRenderer: MediaCell,
    filter: false,
    minWidth: 165,
    width: 165,
  },
  { field: 'displayName', headerName: 'Display Name', minWidth: 155, width: 155 },
  { field: 'displayDescription', headerName: 'Display Description', minWidth: 210, width: 220 },
  {
    field: 'completeness',
    headerName: 'Completeness',
    valueFormatter: ({ value }) => value + '%',
    filter: 'agNumberColumnFilter',
    minWidth: 150,
    width: 150,
  },
  { field: 'fieldSet', headerName: 'Field Set', minWidth: 190, width: 200 },
  { field: 'segments', headerName: 'Segments', minWidth: 125, width: 125 },
];

const productTheme = themeQuartz.withParams({
  // Shared, dependency-free Inflow values for AG Grid's supported theme parameters.
  ...inflowGridThemeParams,
  // Density and table-specific overrides remain local to this grid.
  headerHeight: 32,
  rowHeight: 40,
  headerFontSize: 12,
  headerFontWeight: 700,
  headerColumnBorder: '1px solid ' + inflowGridThemeParams.borderColor,
  headerColumnBorderHeight: '40%',
  headerColumnResizeHandleColor: 'transparent',
  selectedRowBackgroundColor: 'rgba(11, 45, 110, 0.08)',
  wrapperBorder: false,
  wrapperBorderRadius: 0,
});

const productGridSx = {
  // The consuming app controls the grid wrapper's layout.
  width: '100%',
  height: 272,
  overflow: 'hidden',
  // Optional presentation-only recipes; AG Grid still owns the underlying behavior.
  ...inflowGridSelectionSx,
  ...inflowGridHeaderActionsSx,
} as const;

export function ProductsGrid() {
  // Columns, filtering, selection behavior, and available header actions are app-owned.
  return (
    <Box sx={productGridSx}>
      <AgGridReact<ProductRow>
        theme={productTheme}
        rowData={productRows}
        columnDefs={productColumns}
        rowSelection={{
          mode: 'multiRow',
          checkboxes: true,
          headerCheckbox: true,
          enableClickSelection: true,
          enableSelectionWithoutKeys: true,
        }}
        selectionColumnDef={{
          width: 48,
          minWidth: 48,
          maxWidth: 48,
          pinned: 'left',
          lockPosition: true,
          resizable: false,
          sortable: false,
        }}
        getRowId={({ data }) => data.entityId}
        // AG Grid hides its menu button on header hover when this is false.
        // The Inflow header recipe applies the same contextual treatment to the filter button.
        suppressMenuHide={false}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          suppressHeaderMenuButton: false,
        }}
      />
    </Box>
  );
}`;
