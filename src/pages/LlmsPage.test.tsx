import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { LlmsPage } from './LlmsPage';

describe('LlmsPage', () => {
  it('shows the published llms.txt contents', () => {
    renderWithInflow(<MemoryRouter><LlmsPage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'llms.txt' })).toBeInTheDocument();
    // Rendered from the real public/llms.txt, so the preview cannot drift from the file.
    expect(screen.getByText(/# Inflow React/)).toHaveTextContent('@inriver/inflow-react');
    expect(screen.getByText(/## CLI/)).toHaveTextContent('inflow component --list');
    expect(screen.getByText(/# Inflow React/)).toHaveTextContent('@inriver/inflow-react/datetime');
    expect(screen.getByText(/# Inflow React/)).toHaveTextContent('dayjs');
    const content = screen.getByText(/# Inflow React/);
    expect(content).toHaveTextContent('react19-mui9.6');
    expect(content).toHaveTextContent('@inriver/inflow-react/datetime/client');
    expect(content).toHaveTextContent('server-safe');
    expect(content).toHaveTextContent('ThemedButtonProps');
    expect(content).toHaveTextContent('ThemedTextFieldProps');
    expect(content).toHaveTextContent('createDefaultTheme');
    expect(content).toHaveTextContent('defaultTheme');
    expect(content).toHaveTextContent('onSendMessage(text)');
    expect(content).toHaveTextContent('configureDateTime');
  });

  it('offers open and download links resolved against the base path', () => {
    renderWithInflow(<MemoryRouter><LlmsPage /></MemoryRouter>);

    const download = screen.getByRole('link', { name: 'Download llms.txt' });
    expect(download).toHaveAttribute('href', `${import.meta.env.BASE_URL}llms.txt`);
    expect(download).toHaveAttribute('download', 'llms.txt');

    const open = screen.getByRole('link', { name: 'Open llms.txt' });
    expect(open).toHaveAttribute('href', `${import.meta.env.BASE_URL}llms.txt`);
    expect(open).toHaveAttribute('target', '_blank');
  });

  it('keeps the filename lowercase despite the theme title-casing buttons', () => {
    renderWithInflow(<MemoryRouter><LlmsPage /></MemoryRouter>);

    // The Inflow theme capitalizes button text; a filename must not become "Llms.Txt".
    expect(getComputedStyle(screen.getByRole('link', { name: 'Download llms.txt' })).textTransform).toBe('none');
    expect(getComputedStyle(screen.getByRole('link', { name: 'Open llms.txt' })).textTransform).toBe('none');
  });
});
