import { fireEvent, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import copy from 'clipboard-copy';
import { renderWithInflow } from '../test/renderWithInflow';
import { LocalAssetsPage } from './LocalAssetsPage';

vi.mock('clipboard-copy', () => ({ default: vi.fn().mockResolvedValue(undefined) }));

describe('LocalAssetsPage', () => {
  it.each(['light', 'dark'] as const)('explains the optional import and unchanged consumer default in %s mode', (mode) => {
    renderWithInflow(<MemoryRouter><LocalAssetsPage /></MemoryRouter>, { providerProps: { mode } });
    expect(screen.getByRole('heading', { name: 'Local assets', level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 }).map(heading => heading.textContent)).toEqual([
      'Setup', 'Local intranets', 'Without the import', 'Before you adopt it',
    ]);
    expect(screen.getByText(/The library and InflowProvider do not import these fonts by default/))
      .toBeInTheDocument();
    expect(screen.getByText(/This theme showcase imports and uses the bundled local assets by default/))
      .toHaveTextContent('Exception: This theme showcase imports and uses the bundled local assets by default.');
    expect(within(screen.getByRole('region', { name: 'Setup' })).getByText(/This single import includes both Inter/))
      .toHaveTextContent('filled/outlined Material Icons fonts used by legacy string icons');
    expect(screen.getByText(/Your existing font setup stays in place/)).toHaveTextContent('names appear as text');
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Import Guidelines' }).style.color).toBe('inherit');
  });

  it('explains when an intranet app needs both local font stylesheets', () => {
    renderWithInflow(<MemoryRouter><LocalAssetsPage /></MemoryRouter>);
    const intranet = screen.getByRole('region', { name: 'Local intranets' });
    expect(intranet).toHaveTextContent('Without access to Google Fonts, import both font stylesheets (or the combined import above) if your app needs both Inter and legacy string icons.');
    expect(intranet).toHaveTextContent('Serve the font files from your intranet.');
    expect(intranet).toHaveTextContent('Skip Material Icons if you use only SVG icons');
    expect(intranet).toHaveTextContent('skip bundled Inter if your host already supplies the text font you want');
  });

  it('keeps partial setup in an expandable section', () => {
    renderWithInflow(<MemoryRouter><LocalAssetsPage /></MemoryRouter>);
    const summary = screen.getByText('Load only the fonts you need');
    const details = summary.closest('details');
    expect(details).not.toHaveAttribute('open');
    fireEvent.click(summary);
    expect(details).toHaveAttribute('open');
    expect(screen.getByText(/Use either import, or both/)).toHaveTextContent('Don’t add them again if you use the combined stylesheet above.');
    expect(screen.getByText(/import '@inriver\/inflow-react\/fonts\/inter.css'/)).toBeVisible();
    expect(screen.getByText(/import '@inriver\/inflow-react\/fonts\/material-icons.css'/)).toBeVisible();
    fireEvent.click(summary);
    expect(details).not.toHaveAttribute('open');
  });

  it('copies just the complete import', async () => {
    renderWithInflow(<MemoryRouter><LocalAssetsPage /></MemoryRouter>);
    fireEvent.click(within(screen.getByRole('region', { name: 'Setup' })).getByRole('button', { name: 'Copy code' }));
    expect(copy).toHaveBeenCalledWith("import '@inriver/inflow-react/local-assets.css';");
    expect(await screen.findByRole('button', { name: 'Copied!' })).toBeInTheDocument();
  });

  it('keeps the deployment and compatibility tradeoffs available', () => {
    renderWithInflow(<MemoryRouter><LocalAssetsPage /></MemoryRouter>);
    expect(screen.getByText(/About 994 KB/)).toHaveTextContent('1.22 MB compressed');
    expect(screen.getByText(/Font families and icon classes are global/)).toHaveTextContent('microfrontends');
    expect(screen.getByText(/Your bundler must emit the WOFF2 files/)).toHaveTextContent('raw Node.js cannot import CSS');
    expect(screen.getByText(/These assets make no Google Fonts requests/)).toHaveTextContent('cached');
    expect(screen.getByText(/React, MUI and Emotion are still required/)).toHaveTextContent('text wrapping');
    expect(screen.getByText(/Keep the bundled SIL Open Font License/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Import Guidelines' })).toHaveAttribute('href', '/guidelines');
  });
});
