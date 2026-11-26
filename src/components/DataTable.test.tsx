import { StrictMode, useState } from 'react';
import { act, fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CellEditRequestEvent, CellFocusedEvent, GridOptions, ModelUpdatedEvent } from 'ag-grid-community';
import { formatDate, formatDateTime } from '../datetime';
import { renderWithInflow } from '../test/renderWithInflow';
import { DataTable } from './DataTable';
import { dataTableRows, type DataTableCellContext, type DataTableRow } from './DataTable.data';

const gridMocks = vi.hoisted(() => ({ props: new Map<string, GridOptions<DataTableRow>>() }));

vi.mock('ag-grid-react', async () => {
  const { useId, useLayoutEffect } = await import('react');
  return {
    AgGridReact: (props: GridOptions<DataTableRow>) => {
      const id = useId();
      useLayoutEffect(() => {
        gridMocks.props.set(id, props);
        return () => { gridMocks.props.delete(id); };
      }, [id, props]);
      return <div data-testid="mock-grid" data-grid-id={id} />;
    },
  };
});

function gridAt(index = 0): GridOptions<DataTableRow> {
  const id = screen.getAllByTestId('mock-grid')[index].getAttribute('data-grid-id');
  const props = id && gridMocks.props.get(id);
  if (!props) throw new Error('Grid is not mounted');
  return props;
}

function rowFor(grid: GridOptions<DataTableRow>, sku: string): DataTableRow {
  const row = grid.rowData?.find((item) => item.sku === sku);
  if (!row) throw new Error(`Missing row ${sku}`);
  return row;
}

function focus(grid: GridOptions<DataTableRow>, sku: string, colId: string) {
  const rowIndex = grid.rowData?.findIndex((row) => row.sku === sku) ?? -1;
  if (rowIndex < 0) throw new Error(`Missing row ${sku}`);
  act(() => grid.onCellFocused?.({
    rowIndex,
    column: { getColId: () => colId },
    api: { getDisplayedRowAtIndex: (index: number) => ({ data: grid.rowData?.[index] }) },
  } as unknown as CellFocusedEvent<DataTableRow>));
}

function edit(grid: GridOptions<DataTableRow>, sku: string, colId: string, newValue: unknown) {
  const data = rowFor(grid, sku);
  act(() => grid.onCellEditRequest?.({
    data,
    newValue,
    column: { getColId: () => colId },
  } as unknown as CellEditRequestEvent<DataTableRow>));
}

describe('DataTable row and focus state', () => {
  it('isolates instances and remounts from each other and the seed', () => {
    const seed = dataTableRows.map((row) => ({ ...row }));
    const { rerender } = renderWithInflow(<><DataTable /><DataTable /></>);
    const first = gridAt(0);
    const second = gridAt(1);
    const originalRow = rowFor(first, 'ABX-200');
    expect(first.readOnlyEdit).toBe(true);
    expect(originalRow).not.toBe(dataTableRows[0]);
    expect(originalRow).not.toBe(rowFor(second, 'ABX-200'));

    edit(first, 'ABX-200', 'name', 'Updated shoe');
    expect(rowFor(gridAt(0), 'ABX-200').name).toBe('Updated shoe');
    expect(rowFor(gridAt(0), 'ABX-200')).not.toBe(originalRow);
    expect(originalRow.name).toBe('Running shoe');
    expect(rowFor(gridAt(1), 'ABX-200').name).toBe('Running shoe');
    expect(dataTableRows).toEqual(seed);
    expect(gridAt(0).getRowId).toBe(first.getRowId);
    expect(gridAt(0).defaultColDef).toBe(first.defaultColDef);

    rerender(<DataTable key="remount" />);
    expect(rowFor(gridAt(), 'ABX-200').name).toBe('Running shoe');
    expect(dataTableRows).toEqual(seed);
  });

  it('refreshes only the matching focused cell and publishes outside state updaters', () => {
    const onChange = vi.fn();
    function Parent() {
      const [context, setContext] = useState<DataTableCellContext | null>(null);
      return <><span data-testid="context">{context?.value ?? 'none'}</span><DataTable onFocusedCellChange={(next) => { onChange(next); setContext(next); }} /></>;
    }
    renderWithInflow(<StrictMode><Parent /></StrictMode>);
    focus(gridAt(), 'ABX-200', 'name');
    expect(onChange).toHaveBeenLastCalledWith({ rowId: 'ABX-200', columnLabel: 'Product', value: 'Running shoe' });
    edit(gridAt(), 'ABX-200', 'name', 'New name');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith({ rowId: 'ABX-200', columnLabel: 'Product', value: 'New name' });
    expect(screen.getByTestId('context')).toHaveTextContent('New name');

    edit(gridAt(), 'ABX-200', 'channel', 'Other channel');
    edit(gridAt(), 'TJ-014', 'name', 'Other product');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('context')).toHaveTextContent('New name');
  });

  it.each(['status', 'name'])('clears focus on a status edit that hides the row while %s is focused', (focusedColumn) => {
    const onChange = vi.fn();
    renderWithInflow(<DataTable onFocusedCellChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Active' }));
    focus(gridAt(), 'ABX-200', focusedColumn);
    edit(gridAt(), 'ABX-200', 'status', 'Draft');
    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(gridAt().rowData?.some((row) => row.sku === 'ABX-200')).toBe(false);
    fireEvent.click(screen.getByRole('tab', { name: 'Draft' }));
    expect(rowFor(gridAt(), 'ABX-200').status).toBe('Draft');
  });

  it('uses the specific date column id for focused context', () => {
    const onChange = vi.fn();
    renderWithInflow(<DataTable onFocusedCellChange={onChange} />);
    const row = rowFor(gridAt(), 'ABX-200');
    focus(gridAt(), row.sku, 'createdAt');
    expect(onChange).toHaveBeenLastCalledWith({ rowId: row.sku, columnLabel: 'Created', value: formatDateTime(row.createdAt) });
    focus(gridAt(), row.sku, 'createdDate');
    expect(onChange).toHaveBeenLastCalledWith({ rowId: row.sku, columnLabel: 'Created (date)', value: formatDate(row.createdAt) });
    expect(formatDateTime(row.createdAt)).not.toBe(formatDate(row.createdAt));
  });

  it('retains focus for visible rows and clears it when switching to a tab that hides them', () => {
    const onChange = vi.fn();
    renderWithInflow(<DataTable onFocusedCellChange={onChange} />);
    focus(gridAt(), 'ABX-200', 'name');
    fireEvent.click(screen.getByRole('tab', { name: 'Active' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('tab', { name: 'Draft' }));
    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(onChange).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole('tab', { name: 'All products' }));
    edit(gridAt(), 'ABX-200', 'name', 'No longer focused');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('validates edit requests, clamps completeness and handles batched stale grid events', () => {
    const onChange = vi.fn();
    renderWithInflow(<DataTable onFocusedCellChange={onChange} />);
    const oldGrid = gridAt();
    focus(oldGrid, 'ABX-200', 'completeness');
    act(() => {
      oldGrid.onCellEditRequest?.({ data: rowFor(oldGrid, 'ABX-200'), newValue: '120.5', column: { getColId: () => 'completeness' } } as unknown as CellEditRequestEvent<DataTableRow>);
      oldGrid.onCellEditRequest?.({ data: rowFor(oldGrid, 'ABX-200'), newValue: 'Latest', column: { getColId: () => 'name' } } as unknown as CellEditRequestEvent<DataTableRow>);
    });
    expect(rowFor(gridAt(), 'ABX-200')).toMatchObject({ completeness: 100, name: 'Latest' });
    expect(onChange).toHaveBeenLastCalledWith({ rowId: 'ABX-200', columnLabel: 'Completeness', value: '100%' });
    edit(gridAt(), 'ABX-200', 'completeness', '-5');
    expect(rowFor(gridAt(), 'ABX-200').completeness).toBe(0);
    const calls = onChange.mock.calls.length;
    for (const [field, value] of [['completeness', 'not a number'], ['status', 'Unknown'], ['name', null], ['sku', 'bad']] as const) {
      edit(gridAt(), 'ABX-200', field, value);
    }
    expect(onChange).toHaveBeenCalledTimes(calls);
    expect(rowFor(gridAt(), 'ABX-200')).toMatchObject({ completeness: 0, name: 'Latest', status: 'Active', sku: 'ABX-200' });
  });

  it('clears identity for null focus and unrecognised columns', () => {
    const onChange = vi.fn();
    const { container } = renderWithInflow(<DataTable onFocusedCellChange={onChange} />);
    expect(within(container).getByRole('region', { name: 'Product data grid' })).toBeInTheDocument();
    const grid = gridAt();
    act(() => grid.onCellFocused?.({ rowIndex: 0, column: 'name', api: { getDisplayedRowAtIndex: () => ({ data: rowFor(grid, 'ABX-200') }) } } as unknown as CellFocusedEvent<DataTableRow>));
    expect(onChange).toHaveBeenLastCalledWith({ rowId: 'ABX-200', columnLabel: 'Product', value: 'Running shoe' });
    focus(gridAt(), 'ABX-200', 'unknown');
    expect(onChange).toHaveBeenLastCalledWith(null);
    focus(gridAt(), 'ABX-200', 'name');
    act(() => gridAt().onCellFocused?.({ rowIndex: null, column: null } as unknown as CellFocusedEvent<DataTableRow>));
    expect(onChange).toHaveBeenLastCalledWith(null);
    const calls = onChange.mock.calls.length;
    edit(gridAt(), 'ABX-200', 'name', 'No focus');
    expect(onChange).toHaveBeenCalledTimes(calls);
  });

  it('clears or updates focused context when AG Grid filtering hides or shifts the focused row', () => {
    const onChange = vi.fn();
    renderWithInflow(<DataTable onFocusedCellChange={onChange} />);
    focus(gridAt(), 'ABX-200', 'name');
    expect(onChange).toHaveBeenLastCalledWith({ rowId: 'ABX-200', columnLabel: 'Product', value: 'Running shoe' });

    // Filtering hides all rows at the focused index -> context clears
    act(() => gridAt().onModelUpdated?.({
      api: {
        getFocusedCell: () => null,
        getDisplayedRowAtIndex: () => undefined,
      },
    } as unknown as ModelUpdatedEvent<DataTableRow>));

    expect(onChange).toHaveBeenLastCalledWith(null);
    const calls = onChange.mock.calls.length;
    edit(gridAt(), 'ABX-200', 'name', 'Hidden edit');
    expect(onChange).toHaveBeenCalledTimes(calls);

    // Widening the filter restores ABX-200 while AG Grid retains focus at rowIndex 0 -> context restores with current row data
    const abxRow = rowFor(gridAt(), 'ABX-200');
    act(() => gridAt().onModelUpdated?.({
      api: {
        getFocusedCell: () => ({ rowIndex: 0, column: { getColId: () => 'name' } }),
        getDisplayedRowAtIndex: (index: number) => (index === 0 ? { data: abxRow } : undefined),
      },
    } as unknown as ModelUpdatedEvent<DataTableRow>));
    expect(onChange).toHaveBeenLastCalledWith({ rowId: 'ABX-200', columnLabel: 'Product', value: 'Hidden edit' });

    // Focus TJ-014 at rowIndex 1, then filter shifts WB-077 into rowIndex 1 -> context follows AG Grid's focused cell
    focus(gridAt(), 'TJ-014', 'name');
    const wbRow = rowFor(gridAt(), 'WB-077');
    act(() => gridAt().onModelUpdated?.({
      api: {
        getFocusedCell: () => ({ rowIndex: 1, column: { getColId: () => 'name' } }),
        getDisplayedRowAtIndex: (index: number) => (index === 1 ? { data: wbRow } : undefined),
      },
    } as unknown as ModelUpdatedEvent<DataTableRow>));
    expect(onChange).toHaveBeenLastCalledWith({ rowId: 'WB-077', columnLabel: 'Product', value: 'Wool beanie' });
  });
});
