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
  '& .ag-row:not(.ag-row-selected) .ag-selection-checkbox .ag-checkbox-input-wrapper': {
    opacity: 0,
    transition: 'opacity 120ms ease',
  },
  '& .ag-row:not(.ag-row-selected):hover .ag-selection-checkbox .ag-checkbox-input-wrapper, & .ag-row.ag-row-hover:not(.ag-row-selected) .ag-selection-checkbox .ag-checkbox-input-wrapper, & .ag-row.ag-row-focus:not(.ag-row-selected) .ag-selection-checkbox .ag-checkbox-input-wrapper, & .ag-row:not(.ag-row-selected):focus-within .ag-selection-checkbox .ag-checkbox-input-wrapper': {
    opacity: 1,
  },
} as const;

/**
 * Optional, dependency-free MUI `sx` recipe for contextual AG Grid header actions.
 *
 * Apply this object to an element wrapping AG Grid. It controls only the visibility
 * of filter and menu buttons that AG Grid renders. Which actions exist and what they
 * do remain configured by the consuming application.
 */
export const inflowGridHeaderActionsSx = {
  '& .ag-header-cell .ag-header-cell-filter-button, & .ag-header-cell .ag-header-cell-menu-button': {
    opacity: 0,
    transition: 'opacity 120ms ease',
  },
  '& .ag-header-cell:hover .ag-header-cell-filter-button, & .ag-header-cell:hover .ag-header-cell-menu-button, & .ag-header-cell.ag-header-active .ag-header-cell-filter-button, & .ag-header-cell.ag-header-active .ag-header-cell-menu-button, & .ag-header-cell:focus-within .ag-header-cell-filter-button, & .ag-header-cell:focus-within .ag-header-cell-menu-button, & .ag-header-cell .ag-header-cell-filter-button.ag-filter-active': {
    opacity: 1,
  },
} as const;
