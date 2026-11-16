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
});
