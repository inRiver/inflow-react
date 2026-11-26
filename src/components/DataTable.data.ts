import { formatDate, formatDateTime } from '../datetime';

export type DataTableStatus = 'Active' | 'Draft' | 'Archived';

export interface DataTableRow {
  readonly sku: string;
  readonly name: string;
  readonly channel: string;
  readonly status: DataTableStatus;
  readonly completeness: number;
  /** ISO 8601 timestamp; display formatting is owned by src/datetime. */
  readonly createdAt: string;
}

/** A grid column id: the row fields, and the date-only view of `createdAt`. */
export type DataTableField = keyof DataTableRow | 'createdDate';

export interface DataTableCellContext {
  readonly rowId: string;
  readonly columnLabel: string;
  readonly value: string;
}

export const dataTableRows: readonly DataTableRow[] = [
  { sku: 'ABX-200', name: 'Running shoe', channel: 'Amazon', status: 'Active', completeness: 98, createdAt: '2026-08-04T02:14:00.000Z' },
  { sku: 'TJ-014', name: 'Trail jacket', channel: 'Shopify', status: 'Draft', completeness: 61, createdAt: '2026-08-05T00:29:00.000Z' },
  { sku: 'WB-077', name: 'Wool beanie', channel: 'Salsify', status: 'Active', completeness: 100, createdAt: '2026-08-29T11:57:00.000Z' },
  { sku: 'MS-310', name: 'Merino socks', channel: 'Print', status: 'Archived', completeness: 44, createdAt: '2026-11-11T05:17:00.000Z' },
  { sku: 'HP-512', name: 'Hydration pack', channel: 'Amazon', status: 'Draft', completeness: 73, createdAt: '2025-06-10T14:09:00.000Z' },
];

const dataTableFieldLabels = {
  sku: 'SKU',
  name: 'Product',
  channel: 'Channel',
  status: 'Status',
  completeness: 'Completeness',
  createdAt: 'Created',
  createdDate: 'Created (date)',
} as const satisfies Record<DataTableField, string>;

export function isDataTableField(value: string | undefined): value is DataTableField {
  switch (value) {
    case 'sku':
    case 'name':
    case 'channel':
    case 'status':
    case 'completeness':
    case 'createdAt':
    case 'createdDate':
      return true;
    default:
      return false;
  }
}

function shownValue(row: DataTableRow, field: DataTableField): string {
  switch (field) {
    case 'completeness':
      return `${row.completeness}%`;
    case 'createdAt':
      return formatDateTime(row.createdAt);
    case 'createdDate':
      return formatDate(row.createdAt);
    default:
      return String(row[field]);
  }
}

export function createDataTableCellContext(
  row: DataTableRow,
  field: DataTableField,
): DataTableCellContext {
  return {
    rowId: row.sku,
    columnLabel: dataTableFieldLabels[field],
    value: shownValue(row, field),
  };
}

export function createFocusedCellReply(context: DataTableCellContext | null): string {
  if (!context) {
    return 'Focus a data cell first, then ask me about its latest value. I will read the active AG Grid cell.';
  }

  return `The focused ${context.columnLabel} cell for ${context.rowId} currently contains “${context.value}”. That is the latest value in the grid.`;
}
