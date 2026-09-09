import { describe, expect, it } from 'vitest';
import {
  createDataTableCellContext,
  createFocusedCellReply,
  type DataTableRow,
} from './DataTable.data';

describe('DataTable focused-cell assistant context', () => {
  it('reports an edited cell value after the cell is focused', () => {
    // Given
    const editedRow: DataTableRow = {
      sku: 'ABX-200',
      name: 'Running shoe, navy edition',
      channel: 'Amazon',
      status: 'Active',
      completeness: 98,
    };

    // When
    const context = createDataTableCellContext(editedRow, 'name');
    const reply = createFocusedCellReply(context);

    // Then
    expect(context.value).toBe('Running shoe, navy edition');
    expect(reply).toBe(
      'The focused Product cell for ABX-200 currently contains “Running shoe, navy edition”. That is the latest value in the grid.',
    );
  });

  it('formats a numeric completeness value for the assistant', () => {
    // Given
    const editedRow: DataTableRow = {
      sku: 'TJ-014',
      name: 'Trail jacket',
      channel: 'Shopify',
      status: 'Draft',
      completeness: 76,
    };

    // When
    const context = createDataTableCellContext(editedRow, 'completeness');

    // Then
    expect(context.value).toBe('76%');
  });
});
