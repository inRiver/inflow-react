import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { ChangelogPage } from './ChangelogPage';

// Vitest cannot resolve ../../CHANGELOG.md?raw (outside the Vite project root),
// so mock the raw import with a representative handwritten-changelog fragment.
// This exercises the parser against the real grammar without depending on
// filesystem layout.
vi.mock('../../CHANGELOG.md?raw', () => ({
  default: `# Changelog

## For Library Consumers

<!-- consumer-digest:start -->
_Auto-generated digest content that must never reach the page._

### [9.9.9] - 2026-01-01

#### Added
- Digest-only bullet that must never render.
<!-- consumer-digest:end -->

## [Unreleased]

- Unreleased work-in-progress bullet that must never render.

## [3.10.2] - 2026-10-22

<!-- markdownlint-disable MD033 -->

### Added
- CSS tokens for the remaining Material 3 text roles (\`display-large/medium/small\`) with matching \`.text-*\` utility classes (library-facing).
- Showcase-only: the Tokens page documents spacing units 0.5–10.
  A continuation line belonging to the dropped showcase-only bullet.
- Parity tests that keep \`tokens.ts\` and the CSS \`--text-*\` tokens in line with the theme.

### Changed — Subheader weight alignment
- \`ListSubheader\` now matches Autocomplete group labels.

## [3.2.0] - 2026-08-17

### Added — 13 component families ported from the Inflow design system

New \`Themed*\` components, each with unit/a11y tests and a live showcase page. All are token-driven and dark-ready.

- **Feedback:** \`ThemedAlert\`, \`ThemedToast\`
`,
}));

describe('ChangelogPage', () => {
  it('renders handwritten releases and filters showcase-only content', () => {
    renderWithInflow(
      <MemoryRouter>
        <ChangelogPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Changelog' })).toBeInTheDocument();

    // Version headings render (robust to element nesting inside the h6).
    expect(
      screen.getByText((_, el) => el?.tagName === 'H6' && Boolean(el.textContent?.includes('3.10.2'))),
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, el) => el?.tagName === 'H6' && Boolean(el.textContent?.includes('3.2.0'))),
    ).toBeInTheDocument();

    // Subsection chip labels render.
    expect(screen.getAllByText('Added').length).toBeGreaterThan(0);
    expect(screen.getByText('Changed')).toBeInTheDocument();

    // Em-dash subsection suffix renders beside the chip.
    expect(screen.getByText('Subheader weight alignment')).toBeInTheDocument();

    // Plain paragraph inside a release renders.
    expect(
      screen.getByText((_, el) =>
        el?.tagName === 'P' &&
        Boolean(el.textContent?.includes('components, each with unit/a11y tests and a live showcase page')),
      ),
    ).toBeInTheDocument();

    // The (library-facing) suffix is stripped from kept bullets.
    expect(
      screen.getByText((_, el) =>
        el?.tagName === 'LI' &&
        Boolean(el.textContent?.includes('utility classes.')) &&
        !el.textContent?.includes('library-facing'),
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/\(library-facing\)/)).not.toBeInTheDocument();

    // Negative: showcase-only bullets and their continuation lines never render.
    expect(screen.queryByText(/Tokens page documents spacing units/)).not.toBeInTheDocument();
    expect(screen.queryByText(/continuation line belonging to the dropped/)).not.toBeInTheDocument();

    // Negative: HTML comment lines never render.
    expect(screen.queryByText(/markdownlint/)).not.toBeInTheDocument();

    // Negative: the Unreleased section never renders.
    expect(screen.queryByText(/Unreleased/)).not.toBeInTheDocument();
    expect(screen.queryByText(/work-in-progress bullet/)).not.toBeInTheDocument();

    // Negative: the auto-generated digest section never renders.
    expect(screen.queryByText(/9\.9\.9/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Digest-only bullet/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Auto-generated/)).not.toBeInTheDocument();
  });
});
