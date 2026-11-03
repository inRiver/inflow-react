import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InflowProvider } from './InflowProvider';
import { getInflowCssVar, renderWithInflow } from '../test/renderWithInflow';
import { darkTokens, lightTokens } from '../theme/inflow-tokens';

describe('InflowProvider color mode', () => {
  it('defaults to light', () => {
    const { container } = renderWithInflow(<div />);
    expect(getInflowCssVar(container, '--infl-surface-container-lowest-color')).toBe(lightTokens.surfaceLowest);
  });

  it.each([
    ['light', lightTokens],
    ['dark', darkTokens],
  ] as const)('exposes the %s tokens as --infl-* variables on the scoped root', (mode, T) => {
    const { container } = renderWithInflow(<div />, { providerProps: { mode } });
    expect(getInflowCssVar(container, '--infl-surface-container-lowest-color')).toBe(T.surfaceLowest);
    expect(getInflowCssVar(container, '--infl-on-surface-color')).toBe(T.onSurface);
    expect(getInflowCssVar(container, '--infl-outline-variant-color')).toBe(T.outlineVariant);
    expect(getInflowCssVar(container, '--infl-row-selected-color')).toBe(T.rowSelected);
  });

  it('switches the variables when the mode prop changes on the same provider', () => {
    const { container, rerender } = render(<InflowProvider mode="light"><div /></InflowProvider>);
    expect(getInflowCssVar(container, '--infl-on-surface-color')).toBe(lightTokens.onSurface);

    rerender(<InflowProvider mode="dark"><div /></InflowProvider>);
    expect(getInflowCssVar(container, '--infl-on-surface-color')).toBe(darkTokens.onSurface);
    expect(getInflowCssVar(container, '--infl-surface-container-lowest-color')).toBe(darkTokens.surfaceLowest);
  });
});
