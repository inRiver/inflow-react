import { useState } from 'react';
import { Box, Dialog } from '@mui/material';
import { render, screen } from '@testing-library/react';
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

function EmbeddedDialog({ scoped }: { scoped: boolean }) {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setPortalContainer} data-testid="portal-container">
      {portalContainer && <Dialog open container={scoped ? portalContainer : undefined}>
        <Box data-testid="portal-content" sx={{ color: 'text.primary', backgroundColor: 'var(--infl-surface-container-lowest-color)' }}>
          Embedded content
        </Box>
      </Dialog>}
    </div>
  );
}

describe('InflowProvider portal boundary', () => {
  it.each([false, true])('keeps theme context and uses the requested portal container (scoped: %s)', (scoped) => {
    renderWithInflow(
      <InflowProvider mode="dark" cacheKey="embedded-dark">
        <EmbeddedDialog scoped={scoped} />
      </InflowProvider>,
      { providerProps: { cacheKey: 'host-light' } },
    );

    const content = screen.getByTestId('portal-content');
    const target = screen.getByTestId('portal-container');
    const embeddedRoot = target.closest<HTMLElement>('[data-inflow-root]')!;
    expect(getComputedStyle(embeddedRoot).getPropertyValue('--infl-surface-container-lowest-color').trim()).toBe(darkTokens.surfaceLowest);
    expect(target.contains(content)).toBe(scoped);
    expect(content.closest('[data-inflow-root]')).toBe(scoped ? embeddedRoot : null);
    // jsdom does not resolve inherited var() values. Assert the scope relationship
    // and declared CSS variable separately; browser QA must check the resolved color.
    expect(getComputedStyle(content).backgroundColor).toBe('var(--infl-surface-container-lowest-color)');
    const swatch = document.createElement('span');
    swatch.style.color = darkTokens.onSurface;
    expect(getComputedStyle(content).color).toBe(swatch.style.color);
  });
});
