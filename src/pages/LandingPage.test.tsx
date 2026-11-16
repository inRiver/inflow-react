import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { LandingPage } from './LandingPage';

const renderLanding = (mode: 'light' | 'dark' = 'light') =>
  renderWithInflow(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
    { providerProps: { mode } },
  );

describe('LandingPage', () => {
  it('renders the hero with primary calls to action and a single h1', () => {
    renderLanding();

    const h1 = screen.getByRole('heading', {
      level: 1,
      name: 'Build Inriver product UIs that feel like one product',
    });
    expect(h1).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/getting-started');
    expect(screen.getByRole('link', { name: 'Browse components' })).toHaveAttribute('href', '/components');
  });

  it('renders the feature cards linking to theming, CLI, and patterns with valid phrasing markup', () => {
    const { container } = renderLanding();

    expect(screen.getByRole('link', { name: 'Explore theming' })).toHaveAttribute('href', '/theming');
    expect(screen.getByRole('link', { name: 'Read the CLI reference' })).toHaveAttribute('href', '/cli');
    expect(screen.getByRole('link', { name: 'Browse patterns' })).toHaveAttribute('href', '/components');

    // CardHeader title renders inside a <span>; ensure no <div> sits inside it.
    const cardTitleSpans = container.querySelectorAll('.MuiCardHeader-title');
    expect(cardTitleSpans).toHaveLength(3);
    for (const span of cardTitleSpans) {
      expect(span.querySelector('div')).toBeNull();
    }
  });

  it('shows the live proof surface built from themed components and keeps all panel targets mounted across tab switches', async () => {
    const user = userEvent.setup();
    renderLanding();

    const panelIds = ['themed-tab-0-panel', 'themed-tab-1-panel', 'themed-tab-2-panel'];
    const assertAllPanelsMounted = (activeId: string) => {
      for (const id of panelIds) {
        const panel = document.getElementById(id);
        expect(panel).toBeInTheDocument();
        const wrapper = panel?.parentElement;
        if (id === activeId) {
          expect(wrapper).not.toHaveAttribute('hidden');
        } else {
          expect(wrapper).toHaveAttribute('hidden');
        }
      }
    };

    // Default tab renders the themed table with the example rows.
    const table = screen.getByRole('table', { name: 'Example product workspaces' });
    expect(within(table).getByText('Summer catalog')).toBeInTheDocument();

    // Every tab's aria-controls resolves to a mounted panel element in all states.
    const tableTab = screen.getByRole('tab', { name: 'Table' });
    expect(tableTab).toHaveAttribute('aria-controls', 'themed-tab-0-panel');
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'themed-tab-0-panel');
    assertAllPanelsMounted('themed-tab-0-panel');

    // Switch to the Status tab: themed chips render, and the panel relationship follows.
    await user.click(screen.getByRole('tab', { name: 'Status' }));
    expect(screen.getByText('Scheduled')).toBeInTheDocument();
    expect(screen.queryByRole('table', { name: 'Example product workspaces' })).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Status' })).toHaveAttribute('aria-controls', 'themed-tab-1-panel');
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'themed-tab-1-panel');
    assertAllPanelsMounted('themed-tab-1-panel');

    // Switch to the Notify tab: the themed alert renders and wraps cleanly.
    await user.click(screen.getByRole('tab', { name: 'Notify' }));
    expect(screen.getByText('Publish complete')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Notify' })).toHaveAttribute('aria-controls', 'themed-tab-2-panel');
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'themed-tab-2-panel');
    assertAllPanelsMounted('themed-tab-2-panel');
  });

  it('keeps the browsable component index, category links, and example screens sections', () => {
    renderLanding();

    const browseHeading = screen.getByRole('heading', {
      level: 2,
      name: /Browse all \d+ showcase components/,
    });
    expect(browseHeading).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Forms \d+ Components$/ })).toHaveAttribute(
      'href',
      '/components',
    );
    expect(screen.getByRole('heading', { name: 'Example screens' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Popular components' })).toBeInTheDocument();
  });

  it('renders cleanly in dark mode with all interactive sections intact', async () => {
    const user = userEvent.setup();
    renderLanding('dark');

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Build Inriver product UIs that feel like one product',
      }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Notify' }));
    expect(screen.getByText('Publish complete')).toBeInTheDocument();
  });
});
