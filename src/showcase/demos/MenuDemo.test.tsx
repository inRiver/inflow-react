import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { MenuDemo } from './MenuDemo';

describe('MenuDemo', () => {
  it('renders the plain MUI MenuList states', () => {
    renderWithInflow(<MenuDemo />);

    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  it('opens the upsell menu with a header, locked items and a CTA', () => {
    renderWithInflow(<MenuDemo />);

    fireEvent.click(screen.getByRole('tab', { name: 'ThemedMenu' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open upsell menu' }));

    const menu = within(screen.getByRole('menu').closest<HTMLElement>('.MuiPaper-root') as HTMLElement);
    expect(menu.getByText('Orchestrate')).toBeInTheDocument();
    expect(menu.getAllByText('lock')).toHaveLength(2);
    expect(menu.getByRole('menuitem', { name: 'Enable Orchestrate' })).toBeInTheDocument();
  });

  it('opens the regular and work area menus', () => {
    renderWithInflow(<MenuDemo />);

    fireEvent.click(screen.getByRole('tab', { name: 'ThemedMenu' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByText('My account')).toBeInTheDocument();
  });
});
