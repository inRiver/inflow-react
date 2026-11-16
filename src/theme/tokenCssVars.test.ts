import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { getInflowCssVar, renderWithInflow } from '../test/renderWithInflow';
import { darkTokens, lightTokens } from './inflow-tokens';
import { darkSeverityBase, darkSeverityTint } from './inflow';
import { inflowCustomColors, inflowTokens } from './tokens';

// Deliberately fixed: adding or removing a public variable requires updating this list.
const expectedVariables = [
  '--infl-surface-container-lowest-color',
  '--infl-surface-container-low-color',
  '--infl-surface-container-color',
  '--infl-surface-container-high-color',
  '--infl-surface-container-highest-color',
  '--infl-primary-color',
  '--infl-primary-fixed-color',
  '--infl-secondary-fixed-color',
  '--infl-tertiary-fixed-color',
  '--infl-on-surface-color',
  '--infl-on-surface-variant-color',
  '--infl-inverse-surface-color',
  '--infl-inverse-on-surface-color',
  '--infl-outline-color',
  '--infl-outline-variant-color',
  '--infl-certainty-high-color',
  '--infl-certainty-medium-color',
  '--infl-highlight-green-color',
  '--infl-highlight-red-color',
  '--infl-highlight-yellow-color',
  '--infl-row-hover-color',
  '--infl-row-selected-color',
  '--infl-mandatory-row-color',
  '--infl-toast-info-bg-color',
  '--infl-feedback-error-surface-color',
  '--infl-feedback-error-icon-color',
  '--infl-feedback-warning-surface-color',
  '--infl-feedback-warning-icon-color',
  '--infl-feedback-info-surface-color',
  '--infl-feedback-info-icon-color',
  '--infl-feedback-success-surface-color',
  '--infl-feedback-success-icon-color',
  '--infl-toast-surface-color',
  '--infl-navy-900-color',
  '--infl-navy-800-color',
  '--infl-navy-700-color',
  '--infl-navy-600-color',
  '--infl-navy-400-color',
  '--infl-navy-dark-color',
  '--infl-navy-100-color',
  '--infl-white-color',
  '--infl-surface-variant-color',
  '--infl-primary-tab-color',
  '--infl-rating-active-color',
  '--infl-app-background-color',
  '--infl-nav-surface-color',
  '--infl-row-selected-hover-color',
  '--infl-diff-removed-bg-color',
  '--infl-diff-removed-text-color',
  '--infl-diff-added-bg-color',
  '--infl-diff-added-text-color',
  '--infl-background-color',
  '--infl-button-hover-color',
  '--infl-dialog-header-color',
  '--infl-search-color',
  '--infl-row-mandatory-color',
  '--infl-text-disabled-color',
  '--infl-background-default-color',
  '--infl-background-paper-color',
  '--infl-divider-color',
  '--infl-action-hover-color',
  '--infl-action-selected-color',
  '--infl-action-disabled-color',
  '--infl-action-disabled-background-color',
  '--infl-primary-main-color',
  '--infl-primary-light-color',
  '--infl-primary-dark-color',
  '--infl-primary-contrast-text-color',
  '--infl-secondary-main-color',
  '--infl-secondary-light-color',
  '--infl-secondary-dark-color',
  '--infl-secondary-contrast-text-color',
  '--infl-error-main-color',
  '--infl-error-light-color',
  '--infl-error-dark-color',
  '--infl-error-contrast-text-color',
  '--infl-warning-main-color',
  '--infl-warning-light-color',
  '--infl-warning-dark-color',
  '--infl-warning-contrast-text-color',
  '--infl-info-main-color',
  '--infl-info-light-color',
  '--infl-info-dark-color',
  '--infl-info-contrast-text-color',
  '--infl-success-main-color',
  '--infl-success-light-color',
  '--infl-success-dark-color',
  '--infl-success-contrast-text-color',
  '--infl-radius-xs',
  '--infl-radius-sm',
  '--infl-radius-md',
  '--infl-radius-lg',
  '--infl-radius-xl',
  '--infl-radius-full',
  '--infl-spacing-xxs',
  '--infl-spacing-xs',
  '--infl-spacing-s',
  '--infl-spacing-m',
  '--infl-spacing-l',
  '--infl-spacing-xl',
  '--infl-grid-font-size',
  '--infl-grid-header-height',
  '--infl-grid-row-height',
  '--infl-grid-cell-widget-spacing',
  '--infl-shadow-e1',
  '--infl-shadow-e2',
  '--infl-shadow-e3',
  '--infl-font-family',
  '--infl-font-weight-light',
  '--infl-font-weight-regular',
  '--infl-font-weight-medium',
  '--infl-font-weight-bold',
] as const;

describe('scoped token CSS variables', () => {
  it.each([['light', lightTokens], ['dark', darkTokens]] as const)(
    'emits exactly the expected variables with resolved %s values',
    (mode, tokens) => {
      const { container } = renderWithInflow(createElement('div'), { providerProps: { mode } });
      const root = container.querySelector<HTMLElement>('[data-inflow-root]')!;
      const style = getComputedStyle(root);
      const actualNames = Array.from({ length: style.length }, (_, i) => style.item(i))
        .filter((name) => name.startsWith('--infl-'));
      expect(new Set(expectedVariables).size).toBe(expectedVariables.length);
      expect(actualNames).toHaveLength(expectedVariables.length);
      expect(actualNames.sort()).toEqual([...expectedVariables].sort());
      for (const name of expectedVariables) expect(getInflowCssVar(container, name), name).not.toBe('');

      expect(getInflowCssVar(container, '--infl-primary-color')).toBe(tokens.navy700);
      expect(getInflowCssVar(container, '--infl-surface-container-lowest-color')).toBe(tokens.surfaceLowest);
      expect(getInflowCssVar(container, '--infl-error-main-color')).toBe(tokens.error.main);
      expect(getInflowCssVar(container, '--infl-warning-light-color')).toBe(tokens.warning.light);
      expect(getInflowCssVar(container, '--infl-diff-removed-text-color')).toBe(tokens.diffRemovedText);
      expect(getInflowCssVar(container, '--infl-diff-added-bg-color')).toBe(tokens.diffAddedBg);
      expect(getInflowCssVar(container, '--infl-toast-info-bg-color')).toBe(tokens.toastInfoBg);
      const lightSurfaces = { error: tokens.highlightRed, warning: tokens.highlightYellow, info: tokens.toastInfoBg, success: tokens.highlightGreen };
      for (const severity of ['error', 'warning', 'info', 'success'] as const) {
        expect(getInflowCssVar(container, `--infl-feedback-${severity}-surface-color`).replace(/,\s*/g, ','))
          .toBe((mode === 'dark' ? darkSeverityTint(severity) : lightSurfaces[severity]).replace(/,\s*/g, ','));
        const lightIcon = severity === 'warning' || severity === 'success' ? tokens[severity].dark : tokens[severity].main;
        expect(getInflowCssVar(container, `--infl-feedback-${severity}-icon-color`))
          .toBe(mode === 'dark' ? darkSeverityBase[severity] : lightIcon);
      }
      expect(getInflowCssVar(container, '--infl-toast-surface-color'))
        .toBe(mode === 'dark' ? tokens.surfaceHighest : tokens.mandatoryRow);
      expect(getInflowCssVar(container, '--infl-navy-600-color')).toBe(tokens.navy600);
      expect(getInflowCssVar(container, '--infl-rating-active-color')).toBe(tokens.ratingActive);
      for (const [name, value] of Object.entries(inflowTokens.radius)) {
        expect(getInflowCssVar(container, `--infl-radius-${name}`)).toBe(`${value}px`);
      }
      for (const [name, value] of Object.entries(inflowTokens.spacing)) {
        expect(getInflowCssVar(container, `--infl-spacing-${name}`)).toBe(`${value}px`);
      }
      expect(getInflowCssVar(container, '--infl-grid-font-size')).toBe(inflowTokens.grid.fontSize);
      expect(getInflowCssVar(container, '--infl-grid-header-height')).toBe(`${inflowTokens.grid.headerHeight}px`);
      expect(getInflowCssVar(container, '--infl-grid-row-height')).toBe(`${inflowTokens.grid.rowHeight}px`);
      expect(getInflowCssVar(container, '--infl-grid-cell-widget-spacing')).toBe(`${inflowTokens.grid.cellWidgetSpacing}px`);
      if (mode === 'light') {
        expect(getInflowCssVar(container, '--infl-button-hover-color')).toBe(inflowCustomColors.buttonHover);
      }
    },
  );

  it('preserves the light JS token export values', () => {
    const { container } = renderWithInflow(createElement('div'));
    const colorNames: Record<Exclude<keyof typeof inflowTokens.colors, 'error' | 'warning' | 'info' | 'success'>, string> = {
      navy900: 'navy-900', navy800: 'navy-800', navy700: 'navy-700', navy600: 'navy-600',
      navy400: 'navy-400', navyDark: 'navy-dark', navy100: 'navy-100',
      onSurface: 'on-surface', onSurfaceVariant: 'on-surface-variant', surfaceVariant: 'surface-variant',
      surfaceLow: 'surface-container-low', surfaceHighest: 'surface-container-highest',
      outline: 'outline', outlineVariant: 'outline-variant', ratingActive: 'rating-active',
      primaryTab: 'primary-tab', white: 'white', rowHover: 'row-hover', rowSelected: 'row-selected',
      rowSelectedHover: 'row-selected-hover', toastInfoBg: 'toast-info-bg', diffRemovedBg: 'diff-removed-bg',
      diffRemovedText: 'diff-removed-text', diffAddedBg: 'diff-added-bg', diffAddedText: 'diff-added-text',
    };
    for (const [key, name] of Object.entries(colorNames)) {
      const value = inflowTokens.colors[key as keyof typeof colorNames];
      expect(getInflowCssVar(container, `--infl-${name}-color`).toLowerCase()).toBe(value.toLowerCase());
    }
    for (const color of ['error', 'warning', 'info', 'success'] as const) {
      for (const shade of ['main', 'dark', 'light'] as const) {
        expect(getInflowCssVar(container, `--infl-${color}-${shade}-color`)).toBe(inflowTokens.colors[color][shade]);
      }
    }
    const customNames: Record<keyof typeof inflowCustomColors, string> = {
      background: 'background', buttonHover: 'button-hover', certaintyHigh: 'certainty-high',
      certaintyMedium: 'certainty-medium', dialogHeader: 'dialog-header', highlightGreen: 'highlight-green',
      highlightRed: 'highlight-red', highlightYellow: 'highlight-yellow', primaryTab: 'primary-tab',
      rowMandatory: 'row-mandatory', search: 'search',
    };
    for (const [key, name] of Object.entries(customNames)) {
      expect(getInflowCssVar(container, `--infl-${name}-color`).toLowerCase())
        .toBe(inflowCustomColors[key as keyof typeof customNames].toLowerCase());
    }
    for (const [name, value] of Object.entries(inflowTokens.shadows)) {
      expect(getInflowCssVar(container, `--infl-shadow-${name}`).replace(/,\s*/g, ','))
        .toBe(value.replace(/,\s*/g, ','));
    }
    expect(getInflowCssVar(container, '--infl-font-family').replace(/,\s*/g, ','))
      .toBe(inflowTokens.typography.fontFamily.replace(/,\s*/g, ','));
    for (const [name, value] of Object.entries(inflowTokens.typography.fontWeights)) {
      expect(getInflowCssVar(container, `--infl-font-weight-${name}`)).toBe(String(value));
    }
  });

  it('resolves primary and surface differently in separate modes', () => {
    const light = renderWithInflow(createElement('div'), { providerProps: { mode: 'light' } });
    const dark = renderWithInflow(createElement('div'), { providerProps: { mode: 'dark', cacheKey: 'dark-inflow' } });
    for (const name of ['--infl-primary-color', '--infl-surface-container-lowest-color']) {
      expect(getInflowCssVar(light.container, name)).not.toBe(getInflowCssVar(dark.container, name));
    }
  });

  it('lets provider sx override a variable without changing another provider', () => {
    const overridden = renderWithInflow(createElement('div'), {
      providerProps: { sx: { '--infl-radius-sm': '13px' }, cacheKey: 'override-inflow' },
    });
    const normal = renderWithInflow(createElement('div'));
    expect(getInflowCssVar(overridden.container, '--infl-radius-sm')).toBe('13px');
    expect(getInflowCssVar(normal.container, '--infl-radius-sm')).toBe(`${inflowTokens.radius.sm}px`);
  });
});
