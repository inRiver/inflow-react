import { themeQuartz, type ThemeDefaultParams } from 'ag-grid-community';
import { describe, expect, it } from 'vitest';
import { lightTokens } from '../theme/inflow-tokens';
import { inflowTokens } from '../theme/tokens';
import { inflowGridThemeParams } from './index';

const expectedParamKeys = [
  'accentColor',
  'backgroundColor',
  'foregroundColor',
  'cellTextColor',
  'oddRowBackgroundColor',
  'headerBackgroundColor',
  'headerTextColor',
  'borderColor',
  'rowHoverColor',
  'selectedRowBackgroundColor',
  'rangeSelectionBorderColor',
  'rangeSelectionBackgroundColor',
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
    expect(inflowGridThemeParams.accentColor).toBe(lightTokens.navy700);
    expect(inflowGridThemeParams.backgroundColor).toBe(lightTokens.white);
    expect(inflowGridThemeParams.foregroundColor).toBe(lightTokens.onSurface);
    expect(inflowGridThemeParams.cellTextColor).toBe(lightTokens.onSurfaceVariant);
    expect(inflowGridThemeParams.oddRowBackgroundColor).toBe(lightTokens.white);
    expect(inflowGridThemeParams.headerBackgroundColor).toBe(lightTokens.surfaceHighest);
    expect(inflowGridThemeParams.headerTextColor).toBe(lightTokens.onSurface);
    expect(inflowGridThemeParams.borderColor).toBe(lightTokens.outlineVariant);
    expect(inflowGridThemeParams.rowHoverColor).toBe(lightTokens.rowHover);
    expect(inflowGridThemeParams.selectedRowBackgroundColor).toBe(lightTokens.primaryFixed);
    expect(inflowGridThemeParams.rangeSelectionBorderColor).toBe(lightTokens.navy700);
    expect(inflowGridThemeParams.rangeSelectionBackgroundColor).toBe(lightTokens.primaryFixed);
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
    expect(inflowGridThemeParams.fontSize).toBe(inflowTokens.grid.fontSize);
    expect(inflowGridThemeParams.headerHeight).toBe(inflowTokens.grid.headerHeight);
    expect(inflowGridThemeParams.rowHeight).toBe(inflowTokens.grid.rowHeight);
    expect(inflowGridThemeParams.cellHorizontalPadding).toBe(inflowTokens.spacing.s);
    expect(inflowGridThemeParams.cellWidgetSpacing).toBe(inflowTokens.grid.cellWidgetSpacing);
    expect(inflowGridThemeParams.wrapperBorderRadius).toBe(inflowTokens.radius.xs);
  });

  it('is accepted by AG Grid Quartz and exposes only the validated parameters', () => {
    type InflowGridParamKey = keyof typeof inflowGridThemeParams;
    type Assert<T extends true> = T;
    type AllInflowGridParamKeysAreKnown = Assert<
      Exclude<InflowGridParamKey, keyof ThemeDefaultParams> extends never ? true : false
    >;

    const allInflowGridParamKeysAreKnown: AllInflowGridParamKeysAreKnown = true;
    expect(allInflowGridParamKeysAreKnown).toBe(true);
    expect(() => themeQuartz.withParams(inflowGridThemeParams as Partial<ThemeDefaultParams>)).not.toThrow();
    expect(Object.keys(inflowGridThemeParams)).toEqual(expectedParamKeys);
  });
});
