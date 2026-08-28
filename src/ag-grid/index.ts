import { lightTokens } from '../theme/inflow-tokens';
import { inflowTokens } from '../theme/tokens';

/**
 * Dependency-free Inflow values for the corresponding AG Grid theme parameters.
 *
 * This intentionally mirrors AG Grid parameter names without importing its types,
 * so consumers can use this subpath without adding AG Grid as a dependency.
 */
export interface InflowGridThemeParams {
  /** AG Grid color parameters. */
  readonly accentColor: string;
  readonly backgroundColor: string;
  readonly foregroundColor: string;
  readonly cellTextColor: string;
  readonly oddRowBackgroundColor: string;
  readonly headerBackgroundColor: string;
  readonly headerTextColor: string;
  readonly borderColor: string;
  readonly rowHoverColor: string;
  readonly selectedRowBackgroundColor: string;
  readonly rangeSelectionBorderColor: string;
  readonly rangeSelectionBackgroundColor: string;

  /** AG Grid border parameters. */
  readonly inputFocusBorder: string;
  readonly rowBorder: string;
  readonly pinnedColumnBorder: boolean;

  /** AG Grid checkbox parameters. */
  readonly checkboxBorderRadius: number;
  readonly checkboxBorderWidth: number;
  readonly checkboxCheckedBackgroundColor: string;
  readonly checkboxCheckedBorderColor: string;
  readonly checkboxCheckedShapeColor: string;
  readonly checkboxUncheckedBackgroundColor: string;
  readonly checkboxUncheckedBorderColor: string;
  readonly checkboxIndeterminateBackgroundColor: string;
  readonly checkboxIndeterminateBorderColor: string;
  readonly checkboxIndeterminateShapeColor: string;

  /** AG Grid typography, dimension, spacing, and radius parameters. */
  readonly fontFamily: string;
  readonly fontSize: string;
  readonly headerHeight: number;
  readonly rowHeight: number;
  readonly cellHorizontalPadding: number;
  readonly cellWidgetSpacing: number;
  readonly wrapperBorderRadius: number;
}

export const inflowGridThemeParams = {
  accentColor: lightTokens.navy700,
  backgroundColor: lightTokens.white,
  foregroundColor: lightTokens.onSurface,
  cellTextColor: lightTokens.onSurfaceVariant,
  oddRowBackgroundColor: lightTokens.white,
  headerBackgroundColor: lightTokens.white,
  headerTextColor: lightTokens.onSurface,
  borderColor: lightTokens.outlineVariant,
  rowHoverColor: lightTokens.rowHover,
  selectedRowBackgroundColor: lightTokens.primaryFixed,
  rangeSelectionBorderColor: lightTokens.navy700,
  rangeSelectionBackgroundColor: lightTokens.primaryFixed,
  inputFocusBorder: `1px solid ${lightTokens.navy700}`,
  rowBorder: `1px solid ${lightTokens.outlineVariant}`,
  pinnedColumnBorder: false,
  checkboxBorderRadius: 2,
  checkboxBorderWidth: 2,
  checkboxCheckedBackgroundColor: lightTokens.navy700,
  checkboxCheckedBorderColor: lightTokens.navy700,
  checkboxCheckedShapeColor: lightTokens.white,
  checkboxUncheckedBackgroundColor: lightTokens.white,
  checkboxUncheckedBorderColor: lightTokens.outline,
  checkboxIndeterminateBackgroundColor: lightTokens.navy700,
  checkboxIndeterminateBorderColor: lightTokens.navy700,
  checkboxIndeterminateShapeColor: lightTokens.white,
  fontFamily: inflowTokens.typography.fontFamily,
  fontSize: inflowTokens.grid.fontSize,
  headerHeight: inflowTokens.grid.headerHeight,
  rowHeight: inflowTokens.grid.rowHeight,
  cellHorizontalPadding: inflowTokens.spacing.s,
  cellWidgetSpacing: inflowTokens.grid.cellWidgetSpacing,
  wrapperBorderRadius: inflowTokens.radius.xs,
} as const satisfies InflowGridThemeParams;

/**
 * Optional, dependency-free MUI `sx` recipe for the Inflow row-selection treatment.
 *
 * Apply this object to an element wrapping AG Grid. It only changes the rendered
 * checkbox presentation; row selection and keyboard behavior remain owned by AG Grid
 * and configured by the consuming application.
 */
export const inflowGridSelectionSx = {
  '& .ag-checkbox-input-wrapper.ag-checked::after': {
    opacity: 0,
    transition: 'opacity 120ms ease',
  },
  '& .ag-row:hover .ag-checkbox-input-wrapper.ag-checked::after, & .ag-row.ag-row-hover .ag-checkbox-input-wrapper.ag-checked::after, & .ag-row.ag-row-focus .ag-checkbox-input-wrapper.ag-checked::after, & .ag-row:focus-within .ag-checkbox-input-wrapper.ag-checked::after': {
    opacity: 1,
  },
  '& .ag-header-cell:hover .ag-checkbox-input-wrapper.ag-checked::after, & .ag-header-cell:focus-within .ag-checkbox-input-wrapper.ag-checked::after': {
    opacity: 1,
  },
} as const;
