import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { InflowProvider, type InflowProviderProps } from '../providers/InflowProvider';

type InflowProviderOverrides = Omit<InflowProviderProps, 'children'>;

interface InflowRenderOptions extends RenderOptions {
  /** Props forwarded to the InflowProvider wrapper (e.g. mode). */
  providerProps?: InflowProviderOverrides;
}

const buildWrapper =
  (providerProps?: InflowProviderOverrides) =>
  function InflowWrapper({ children }: { children: ReactNode }) {
    return <InflowProvider {...providerProps}>{children}</InflowProvider>;
  };

/**
 * Renders `ui` inside an `InflowProvider` via Testing Library's persistent
 * `wrapper`, so the provider (theme + palette.inflow + `--infl-*` vars) survives
 * `rerender`. If the caller passes their own `wrapper`, it is composed inside the
 * Inflow wrapper.
 *
 * PORTAL CAVEAT: MUI components that render in a React portal (Menu, Dialog,
 * Snackbar, Tooltip popups, Select dropdowns) mount their popup under
 * `document.body`, OUTSIDE the provider's `[data-inflow-root]`. React context
 * (theme) still reaches them, but scoped `--infl-*` CSS variables do NOT. For
 * those, assert theme/palette values and role-based visibility (e.g.
 * `screen.getByRole('menu')`) rather than computed `var(--infl-*)` styles.
 */
export function renderWithInflow(ui: ReactElement, options?: InflowRenderOptions) {
  const { providerProps, wrapper: CallerWrapper, ...rest } = options ?? {};
  const InflowWrapper = buildWrapper(providerProps);
  const ComposedWrapper = CallerWrapper
    ? function Composed({ children }: { children: ReactNode }) {
        return (
          <InflowWrapper>
            <CallerWrapper>{children}</CallerWrapper>
          </InflowWrapper>
        );
      }
    : InflowWrapper;
  return render(ui, { wrapper: ComposedWrapper, ...rest });
}

/**
 * Standalone persistent wrapper for callers that manage `render` themselves
 * (e.g. need a custom `container`/`baseElement`).
 */
export function createInflowWrapper(providerProps?: InflowProviderOverrides) {
  return buildWrapper(providerProps);
}

/**
 * Reads a scoped `--infl-*` variable off the provider root. Assert with this
 * (not on portaled content) when a test needs to verify a token's resolved value.
 */
export function getInflowCssVar(container: HTMLElement, name: string): string {
  const root = container.querySelector<HTMLElement>('[data-inflow-root]');
  if (!root) throw new Error('No [data-inflow-root] found — did you render with renderWithInflow?');
  return getComputedStyle(root).getPropertyValue(name).trim();
}
