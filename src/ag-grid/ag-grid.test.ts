import { themeQuartz } from 'ag-grid-community';
import { describe, expect, it } from 'vitest';
import { getInflowTokensForMode } from '../theme/inflow';
import { inflowTokens } from '../theme/tokens';
import { inflowGridThemeParams } from './index';

const expectedParamKeys = [
  'accentColor',
  'backgroundColor',
  'foregroundColor',
  'dataColor',
  'oddRowBackgroundColor',
  'headerBackgroundColor',
  'headerTextColor',
  'borderColor',
  'rowHoverColor',
  'selectedRowBackgroundColor',
  'rangeSelectionBorderColor',
  'rangeSelectionBackgroundColor',
  'rangeSelectionBackgroundColor2',
  'rangeSelectionBackgroundColor3',
  'rangeSelectionBackgroundColor4',
  'inputFocusBorder',
  'rowBorder',
  'checkboxCheckedBackgroundColor',
  'checkboxCheckedBorderColor',
  'checkboxCheckedShapeColor',
  'checkboxUncheckedBackgroundColor',
  'checkboxUncheckedBorderColor',
  'checkboxIndeterminateBackgroundColor',
  'checkboxIndeterminateBorderColor',
  'checkboxIndeterminateShapeColor',
  'fontFamily',
  'fontSize',
  'headerHeight',
  'rowHeight',
  'cellHorizontalPadding',
  'cellWidgetSpacing',
  'wrapperBorderRadius',
] as const;

describe('inflowGridThemeParams', () => {
  it('stays aligned with the Inflow light-mode tokens and canonical dimensions', () => {
    const lightTokens = getInflowTokensForMode('light');

    expect(inflowGridThemeParams.accentColor).toBe(lightTokens.navy700);
    expect(inflowGridThemeParams.backgroundColor).toBe(lightTokens.white);
    expect(inflowGridThemeParams.foregroundColor).toBe(lightTokens.onSurface);
    expect(inflowGridThemeParams.dataColor).toBe(lightTokens.onSurfaceVariant);
    expect(inflowGridThemeParams.oddRowBackgroundColor).toBe(lightTokens.white);
    expect(inflowGridThemeParams.headerBackgroundColor).toBe(lightTokens.surfaceHighest);
    expect(inflowGridThemeParams.headerTextColor).toBe(lightTokens.onSurface);
    expect(inflowGridThemeParams.borderColor).toBe(lightTokens.outlineVariant);
    expect(inflowGridThemeParams.rowHoverColor).toBe(lightTokens.rowHover);
    expect(inflowGridThemeParams.selectedRowBackgroundColor).toBe(lightTokens.primaryFixed);
    expect(inflowGridThemeParams.rangeSelectionBorderColor).toBe(lightTokens.navy700);
    expect(inflowGridThemeParams.rangeSelectionBackgroundColor).toBe(lightTokens.primaryFixed);
    expect(inflowGridThemeParams.rangeSelectionBackgroundColor2).toBe(lightTokens.primaryFixed);
    expect(inflowGridThemeParams.rangeSelectionBackgroundColor3).toBe(lightTokens.primaryFixed);
    expect(inflowGridThemeParams.rangeSelectionBackgroundColor4).toBe(lightTokens.primaryFixed);
    expect(inflowGridThemeParams.inputFocusBorder).toBe(`1px solid ${lightTokens.navy700}`);
    expect(inflowGridThemeParams.rowBorder).toBe(`1px solid ${lightTokens.outlineVariant}`);
    expect(inflowGridThemeParams.checkboxCheckedBackgroundColor).toBe(lightTokens.navy700);
    expect(inflowGridThemeParams.checkboxCheckedBorderColor).toBe(lightTokens.navy700);
    expect(inflowGridThemeParams.checkboxCheckedShapeColor).toBe(lightTokens.white);
    expect(inflowGridThemeParams.checkboxUncheckedBackgroundColor).toBe(lightTokens.white);
    expect(inflowGridThemeParams.checkboxUncheckedBorderColor).toBe(lightTokens.outline);
    expect(inflowGridThemeParams.checkboxIndeterminateBackgroundColor).toBe(lightTokens.navy700);
    expect(inflowGridThemeParams.checkboxIndeterminateBorderColor).toBe(lightTokens.navy700);
    expect(inflowGridThemeParams.checkboxIndeterminateShapeColor).toBe(lightTokens.white);
    expect(inflowGridThemeParams.fontFamily).toBe(inflowTokens.typography.fontFamily);
    expect(inflowGridThemeParams.fontSize).toBe('0.875rem');
    expect(inflowGridThemeParams.headerHeight).toBe(48);
    expect(inflowGridThemeParams.rowHeight).toBe(52);
    expect(inflowGridThemeParams.cellHorizontalPadding).toBe(16);
    expect(inflowGridThemeParams.cellWidgetSpacing).toBe(12);
    expect(inflowGridThemeParams.wrapperBorderRadius).toBe(inflowTokens.radius.xs);
  });

  it('is accepted by AG Grid Quartz and exposes only the validated parameters', () => {
    // The shipped params intentionally avoid AG Grid types; runtime compatibility is validated here.
    expect(() => themeQuartz.withParams(inflowGridThemeParams as never)).not.toThrow();
    expect(Object.keys(inflowGridThemeParams)).toEqual(expectedParamKeys);
  });
});
