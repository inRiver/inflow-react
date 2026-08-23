import { describe, expect, it } from 'vitest';
import {
  publisherColumnDefs,
  publisherGridThemeParams,
  publisherRowData,
  publisherRowSelection,
  publisherSelectionColumnDef,
  publisherUsageCode,
} from './PublishersAgGridPage.data';

describe('PublishersAgGridPage reference table', () => {
  it('uses the reference table columns and comfortable density', () => {
    expect(publisherColumnDefs.map(({ headerName }) => headerName)).toEqual([
      'Entity',
      'Media',
      'Display Name',
      'Display Description',
      'Completeness',
      'Field Set',
      'Segments',
    ]);
    expect(publisherGridThemeParams.headerHeight).toBe(32);
    expect(publisherGridThemeParams.rowHeight).toBe(40);
    expect(publisherGridThemeParams.headerFontWeight).toBe(700);
    expect(publisherGridThemeParams.headerColumnResizeHandleColor).toBe('transparent');
    expect(publisherGridThemeParams.selectedRowBackgroundColor).toBe('rgba(11, 45, 110, 0.08)');
    expect(publisherGridThemeParams.wrapperBorderRadius).toBe(0);
  });

  it('enables native multi-row checkbox selection', () => {
    expect(publisherRowSelection).toMatchObject({
      mode: 'multiRow',
      checkboxes: true,
      headerCheckbox: true,
    });
    expect(publisherSelectionColumnDef).toMatchObject({
      width: 48,
      pinned: 'left',
      resizable: false,
    });
  });

  it('uses stable product data with media and completeness values', () => {
    expect(publisherRowData).toHaveLength(6);
    expect(publisherRowData[0]).toMatchObject({
      entityId: 'T60V0111',
      entityName: '60V Push Mowers',
      displayDescription: '60V Push Mowers',
      completeness: 72,
      additionalMediaCount: 5,
    });
    expect(publisherRowData[0].mediaColors).toHaveLength(5);
  });

  it('documents the complete product grid shown by the live example', () => {
    expect(publisherUsageCode).toContain("const productRows: ProductRow[] = [");
    publisherRowData.forEach(({ entityId, entityName }) => {
      expect(publisherUsageCode).toContain(`entityId: '${entityId}'`);
      expect(publisherUsageCode).toContain(`entityName: '${entityName}'`);
    });
    publisherColumnDefs.forEach(({ headerName }) => {
      expect(publisherUsageCode).toContain(`headerName: '${headerName}'`);
    });
    expect(publisherUsageCode).toContain('function EntityCell');
    expect(publisherUsageCode).toContain('function MediaCell');
    expect(publisherUsageCode).toContain("initialState={{ rowSelection: ['T60V0111', 'T60V0212'] }}");
  });
});
