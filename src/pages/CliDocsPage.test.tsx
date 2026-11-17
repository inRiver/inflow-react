import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { CliDocsPage } from './CliDocsPage';

describe('CliDocsPage', () => {
  it('shows each command, real output examples and the JSON contract', () => {
    renderWithInflow(<MemoryRouter><CliDocsPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'CLI reference' })).toBeInTheDocument();
    expect(screen.getByText(/zero-dependency inflow CLI ships/)).toBeInTheDocument();
    expect(screen.getByText(/\$ inflow --help/)).toHaveTextContent('inflow docs <setup|theming|migration>');
    expect(screen.getByText(/\$ inflow component --list/)).toHaveTextContent('ThemedAccordion');
    expect(screen.getByText(/\$ inflow component ThemedChip/)).toHaveTextContent('Owned props:');
    expect(screen.getByText(/\$ inflow tokens/)).toHaveTextContent('navy900: #16243d');
    expect(screen.getByText(/\$ inflow search chip/)).toHaveTextContent('[component] ThemedChip');
    expect(screen.getByText(/\$ inflow docs setup --json/)).toHaveTextContent('"ok":false');
    expect(screen.getByText(/Errors are also written to stderr/)).toBeInTheDocument();
    expect(screen.getByText(/Unknown commands, components or topics/)).toHaveTextContent('exit 1');
  });

  it('reveals llms.txt with an open and a download link resolved against the base path', () => {
    renderWithInflow(<MemoryRouter><CliDocsPage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Agent-readable docs (llms.txt)' })).toBeInTheDocument();

    const download = screen.getByRole('link', { name: 'Download llms.txt' });
    expect(download).toHaveAttribute('href', `${import.meta.env.BASE_URL}llms.txt`);
    expect(download).toHaveAttribute('download', 'llms.txt');

    const open = screen.getByRole('link', { name: 'Open llms.txt' });
    expect(open).toHaveAttribute('href', `${import.meta.env.BASE_URL}llms.txt`);
    expect(open).toHaveAttribute('target', '_blank');
  });
});
