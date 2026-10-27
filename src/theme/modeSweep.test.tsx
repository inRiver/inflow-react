import { cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import type { ComponentType } from 'react';
import { renderWithInflow } from '../test/renderWithInflow';
import { darkTokens, lightTokens } from './inflow-tokens';

// Renders every showcase demo and page in light and dark mode and checks what the browser resolves for each element:
// text must reach 4.5:1 and icons 3:1 against the surface they sit on (WCAG AA). It catches fixed colors such as
// `color: 'white'` or a default browser link color that the token tests cannot see. Disabled controls, code blocks
// and colors jsdom cannot resolve (per-variant CSS variables, color-mix) are skipped; the token tests cover those.
type Rgba = [number, number, number, number];
type Module = Record<string, unknown>;

const modules = {
  ...import.meta.glob<Module>('../showcase/demos/*Demo.tsx', { eager: true }),
  ...import.meta.glob<Module>('../pages/*Page.tsx', { eager: true }),
};

const parse = (css: string): Rgba | null => {
  if (!css || css.includes('var(') || css.includes('color-mix')) return null;
  const match = css.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;
  const [r, g, b, a = 1] = match[1].split(/[,/ ]+/).filter(Boolean).map(Number);
  return [r, g, b, a];
};
const fromHex = (hex: string): Rgba => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).concat(1) as Rgba;
const over = (top: Rgba, bottom: Rgba): Rgba => [
  top[0] * top[3] + bottom[0] * (1 - top[3]),
  top[1] * top[3] + bottom[1] * (1 - top[3]),
  top[2] * top[3] + bottom[2] * (1 - top[3]),
  1,
];
const channel = (v: number) => (v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4);
const luminance = (c: Rgba) => 0.2126 * channel(c[0]) + 0.7152 * channel(c[1]) + 0.0722 * channel(c[2]);
const ratio = (a: Rgba, b: Rgba) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const surfaceBehind = (el: Element, page: string): Rgba => {
  const layers: Rgba[] = [];
  for (let node: Element | null = el; node; node = node.parentElement) {
    const bg = parse(getComputedStyle(node).backgroundColor);
    if (bg && bg[3] > 0) layers.push(bg);
  }
  return layers.reverse().reduce((below, layer) => over(layer, below), fromHex(page));
};

const SKIPPED = '.Mui-disabled,[aria-disabled="true"],[disabled],pre,code,.code-block,[class*="visuallyHidden"]';
const ICON = 'svg.MuiSvgIcon-root,[class*="material-icons"]';

const lowContrast = (root: Element, page: string) => {
  const found: string[] = [];
  root.querySelectorAll('*').forEach((el) => {
    if (el.closest(SKIPPED)) return;
    const isIcon = el.matches(ICON);
    const text = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent?.trim()).filter(Boolean).join(' ');
    if (!isIcon && !text) return;
    if (!isIcon && el.closest('svg')) return;
    const color = parse(getComputedStyle(el).color);
    if (!color) return;
    const bg = surfaceBehind(el, page);
    const result = ratio(over(color, bg), bg);
    const needed = isIcon ? 3 : 4.5;
    if (result < needed) found.push(`${isIcon ? 'icon' : `"${text.slice(0, 30)}"`} ${result.toFixed(2)}:1 (needs ${needed})`);
  });
  return found;
};

// Light mode is the shipped look and is not being reworked, so the findings it already has are listed here with
// their cause. Dark mode has none and must stay at none. A NEW light finding fails the test; so does a listed one that
// no longer occurs (remove it from the list then).
const KNOWN_LIGHT: Record<string, string> = {
  // Identical to a stock MUI theme (measured with createTheme()).
  'AvatarDemo: "H"': 'Same in stock MUI (1.88:1): white initials on grey',
  'AvatarDemo: "R"': 'Same in stock MUI (1.88:1): white initials on grey',
  'ChipDemo: "M"': 'Same in stock MUI (3.30:1): white initials on grey',
  'StepperDemo: icon': 'Same in stock MUI (2.68:1): inactive step number icon',
  // Weak in stock MUI too.
  'AutocompleteDemo: icon': 'Chip delete icon: 1.86:1 in stock MUI, 1.72:1 here',
  'ChipDemo: icon': 'Chip delete icon: 1.86:1 in stock MUI, 1.72:1 here',
  // Inflow's own choices, not MUI defaults.
  'RatingDemo: icon': 'Empty star: 2.68:1 here, already better than stock MUI (1.88:1)',
  'ChangelogPage: "Added"': 'Inflow palette: white on success green, 3.6:1 (documented on the Accessibility page)',
  'ChangelogPage: "Fixed"': 'Inflow palette: white on warning orange, 3.0:1 (documented; stock MUI uses dark text on warning)',
  // Not a real finding.
  'PreRenderedPage: icon': 'Measurement artifact: copy icon is overlaid on the code block but sits outside it in the DOM',
};
const withoutRatio = (issue: string) => issue.replace(/ \d+\.\d+:1 \(needs \d(\.\d)?\)$/, '');

describe.each([
  ['light', lightTokens],
  ['dark', darkTokens],
] as const)('%s mode sweep of the showcase', (mode, T) => {
  it('found demos and pages to check', () => {
    expect(Object.keys(modules).length).toBeGreaterThan(60);
  });

  it('renders every demo and page, with readable text and icons', () => {
    const failures: string[] = [];
    for (const [path, mod] of Object.entries(modules)) {
      const name = path.split('/').pop()!.replace('.tsx', '');
      const Component = (mod[name] ?? mod.default) as ComponentType | undefined;
      if (!Component) continue;
      const { baseElement } = renderWithInflow(
        <MemoryRouter>
          <Component />
        </MemoryRouter>,
        { providerProps: { mode } },
      );
      failures.push(...[...new Set(lowContrast(baseElement, T.appBackground))].map((issue) => `${name}: ${issue}`));
      cleanup();
    }
    if (mode === 'dark') {
      expect(failures).toEqual([]);
      return;
    }
    const keys = new Set(failures.map(withoutRatio));
    expect(failures.filter((issue) => !(withoutRatio(issue) in KNOWN_LIGHT))).toEqual([]);
    expect(Object.keys(KNOWN_LIGHT).filter((known) => !keys.has(known))).toEqual([]);
  }, 600000); // Renders ~70 demos and pages in one test; the CI runner needs well over the local 2 minutes.
});
