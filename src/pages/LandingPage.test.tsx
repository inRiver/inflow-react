import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { LandingPage } from './LandingPage';

const renderLanding = () =>
  renderWithInflow(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  );

describe('LandingPage', () => {
  it('renders the hero with primary calls to action', () => {
    renderLanding();

    expect(
      screen.getByRole('heading', { name: 'Build Inriver product UIs that feel like one product' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/getting-started');
    expect(screen.getByRole('link', { name: 'Browse components' })).toHaveAttribute('href', '/components');
  });

  it('renders the feature cards linking to theming, CLI, and patterns', () => {
    renderLanding();

    expect(screen.getByRole('link', { name: 'Explore theming' })).toHaveAttribute('href', '/theming');
    expect(screen.getByRole('link', { name: 'Read the CLI reference' })).toHaveAttribute('href', '/cli');
    expect(screen.getByRole('link', { name: 'Browse patterns' })).toHaveAttribute('href', '/components');
  });

  it('shows the live proof surface built from themed components and switches tabs', async () => {
    const user = userEvent.setup();
    renderLanding();

    // Default tab renders the themed table with the example rows.
    const table = screen.getByRole('table', { name: 'Example product workspaces' });
    expect(within(table).getByText('Summer catalog')).toBeInTheDocument();

    // The selected tab controls its panel (aria-controls -> role=tabpanel id).
    const tableTab = screen.getByRole('tab', { name: 'Table' });
    expect(tableTab).toHaveAttribute('aria-controls', 'themed-tab-0-panel');
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'themed-tab-0-panel');

    // Switch to the Status tab: themed chips render, and the panel relationship follows.
    await user.click(screen.getByRole('tab', { name: 'Status' }));
    expect(screen.getByText('Scheduled')).toBeInTheDocument();
    expect(screen.queryByRole('table', { name: 'Example product workspaces' })).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Status' })).toHaveAttribute('aria-controls', 'themed-tab-1-panel');
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'themed-tab-1-panel');

    // Switch to the Notify tab: the themed alert renders.
    await user.click(screen.getByRole('tab', { name: 'Notify' }));
    expect(screen.getByText('Publish complete')).toBeInTheDocument();
  });

  it('keeps the browsable component index and example screens sections', () => {
    renderLanding();

    expect(screen.getByRole('heading', { name: /Browse all \d+ showcase components/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Example screens' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Popular components' })).toBeInTheDocument();
  });
});
