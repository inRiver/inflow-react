/// <reference types="node" />
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { lightTokens } from './inflow-tokens';
import { createInflowTheme } from './inflow';
import { inflowTokens } from './tokens';

const tokensCss = readFileSync('src/styles/inflow-design-tokens.css', 'utf8');

const cssVar = (name: string) => {
  const match = tokensCss.match(new RegExp(`--${name}:\\s*([^;]+);`));
  return match?.[1].trim();
};

const toPx = (value: string) => (value.endsWith('rem') ? parseFloat(value) * 16 : parseFloat(value));

// Light mode only; dark mode is not documented yet.
describe('tokens.ts parity with the light theme tokens', () => {
  it('matches every color that also exists in inflow-tokens', () => {
    const source = lightTokens as Record<string, unknown>;
    const mismatches = Object.entries(inflowTokens.colors)
      .filter(([key]) => key in source)
      .filter(([key, value]) => JSON.stringify(value) !== JSON.stringify(source[key]))
      .map(([key]) => key);
    expect(mismatches).toEqual([]);
  });
});

describe('CSS semantic text tokens parity with theme.typography', () => {
  const theme = createInflowTheme('light');
  const pairs = {
    'title-large': 'h6',
    // title-medium is intentionally not paired: CSS is weight 500, theme.typography.subtitle1 is 400. Needs a design decision.
    'title-small': 'subtitle2',
    'body-large': 'body1',
    'body-medium': 'body2',
    'body-small': 'caption',
    'label-large': 'button',
  } as const;

  it.each(Object.entries(pairs))('--text-%s-* matches theme.typography.%s', (role, variant) => {
    const style = theme.typography[variant];
    const size = cssVar(`text-${role}-font-size`)!;
    const lineHeight = cssVar(`text-${role}-line-height`)!;
    const letterSpacing = cssVar(`text-${role}-letter-spacing`)!;

    expect(toPx(size)).toBe(toPx(String(style.fontSize)));
    expect(Number(cssVar(`text-${role}-font-weight`))).toBe(style.fontWeight);
    expect(toPx(lineHeight)).toBeCloseTo(
      typeof style.lineHeight === 'number' ? style.lineHeight * toPx(size) : toPx(String(style.lineHeight)),
      1,
    );
    expect(toPx(letterSpacing)).toBeCloseTo(toPx(String(style.letterSpacing ?? 0)), 2);
  });

  it('keeps --font-size-body2 equal to theme.typography.body2', () => {
    expect(toPx(cssVar('font-size-body2')!)).toBe(toPx(String(theme.typography.body2.fontSize)));
  });
});

describe('CSS text utility classes', () => {
  const roles = [...new Set([...tokensCss.matchAll(/--text-([a-z]+-[a-z]+)-font-size:/g)].map((m) => m[1]))];

  it('finds the Material 3 text roles', () => {
    expect(roles).toHaveLength(15);
  });

  it.each(roles)('.text-%s uses all four of its tokens', (role) => {
    const rule = tokensCss.match(new RegExp(`\\.text-${role}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
    for (const property of ['font-size', 'font-weight', 'line-height', 'letter-spacing']) {
      expect(rule).toContain(`var(--text-${role}-${property})`);
    }
  });
});
