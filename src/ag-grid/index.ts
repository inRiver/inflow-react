import { getInflowTokensForMode } from '../theme/inflow';
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
  readonly dataColor: string;
  readonly oddRowBackgroundColor: string;
  readonly headerBackgroundColor: string;
  readonly headerTextColor: string;
  readonly borderColor: string;
  readonly rowHoverColor: string;
  readonly selectedRowBackgroundColor: string;
  readonly rangeSelectionBorderColor: string;
  readonly rangeSelectionBackgroundColor: string;
  readonly rangeSelectionBackgroundColor2: string;
  readonly rangeSelectionBackgroundColor3: string;
  readonly rangeSelectionBackgroundColor4: string;

  /** AG Grid border parameters. */
  readonly inputFocusBorder: string;
  readonly rowBorder: string;

  /** AG Grid checkbox parameters. */
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

const lightTokens = getInflowTokensForMode('light');

export const inflowGridThemeParams = {
  accentColor: lightTokens.navy700,
  backgroundColor: lightTokens.white,
  foregroundColor: lightTokens.onSurface,
  dataColor: lightTokens.onSurfaceVariant,
  oddRowBackgroundColor: lightTokens.white,
  headerBackgroundColor: lightTokens.surfaceHighest,
  headerTextColor: lightTokens.onSurface,
  borderColor: lightTokens.outlineVariant,
  rowHoverColor: lightTokens.rowHover,
  selectedRowBackgroundColor: lightTokens.primaryFixed,
  rangeSelectionBorderColor: lightTokens.navy700,
  rangeSelectionBackgroundColor: lightTokens.primaryFixed,
  rangeSelectionBackgroundColor2: lightTokens.primaryFixed,
  rangeSelectionBackgroundColor3: lightTokens.primaryFixed,
  rangeSelectionBackgroundColor4: lightTokens.primaryFixed,
  inputFocusBorder: `1px solid ${lightTokens.navy700}`,
  rowBorder: `1px solid ${lightTokens.outlineVariant}`,
  checkboxCheckedBackgroundColor: lightTokens.navy700,
  checkboxCheckedBorderColor: lightTokens.navy700,
  checkboxCheckedShapeColor: lightTokens.white,
  checkboxUncheckedBackgroundColor: lightTokens.white,
  checkboxUncheckedBorderColor: lightTokens.outline,
  checkboxIndeterminateBackgroundColor: lightTokens.navy700,
  checkboxIndeterminateBorderColor: lightTokens.navy700,
  checkboxIndeterminateShapeColor: lightTokens.white,
  fontFamily: inflowTokens.typography.fontFamily,
  fontSize: '0.875rem',
  headerHeight: 48,
  rowHeight: 52,
  cellHorizontalPadding: 16,
  cellWidgetSpacing: 12,
  wrapperBorderRadius: inflowTokens.radius.xs,
} as const satisfies InflowGridThemeParams;
