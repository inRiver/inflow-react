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
    expect(menu.getAllByTestId('LockOutlinedIcon')).toHaveLength(2);
    expect(menu.getByRole('menuitem', { name: 'Enable Orchestrate' })).toBeInTheDocument();
  });

  it('opens the regular and work area menus', () => {
    renderWithInflow(<MenuDemo />);

    fireEvent.click(screen.getByRole('tab', { name: 'ThemedMenu' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByText('My account')).toBeInTheDocument();
  });

  it('toggles checkboxes in the plain MUI MenuList without closing anything', () => {
    renderWithInflow(<MenuDemo />);

    const draft = screen.getByRole('menuitemcheckbox', { name: 'Draft' });
    expect(draft).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(draft);
    expect(draft).toHaveAttribute('aria-checked', 'false');
  });

  it('opens the multi-select ThemedMenu and keeps it open while toggling', () => {
    renderWithInflow(<MenuDemo />);

    fireEvent.click(screen.getByRole('tab', { name: 'ThemedMenu' }));
    fireEvent.click(screen.getByRole('button', { name: /Filter by status \(2\)/ }));

    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'In review' }));

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitemcheckbox', { name: 'In review' })).toHaveAttribute('aria-checked', 'true');
  });

  it('changes the sort choice with the radio menu', () => {
    renderWithInflow(<MenuDemo />);

    fireEvent.click(screen.getByRole('tab', { name: 'ThemedMenu' }));
    fireEvent.click(screen.getByRole('button', { name: /Sort by: Last modified/ }));
    expect(screen.getByRole('menuitemradio', { name: 'Last modified' })).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Name' }));
    expect(screen.getByRole('button', { name: /Sort by: Name/ })).toBeInTheDocument();
  });

  it('opens the grouped and icon menus', () => {
    renderWithInflow(<MenuDemo />);

    fireEvent.click(screen.getByRole('tab', { name: 'ThemedMenu' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open grouped menu' }));
    expect(screen.getByText('Danger zone')).toBeInTheDocument();
  });

  it('opens the icon menu with shortcuts', () => {
    renderWithInflow(<MenuDemo />);

    fireEvent.click(screen.getByRole('tab', { name: 'ThemedMenu' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open icon menu' }));
    expect(screen.getByText('⌘C')).toBeInTheDocument();
  });

  it('toggles radio items in the plain MUI MenuList', () => {
    renderWithInflow(<MenuDemo />);

    const created = screen.getByRole('menuitemradio', { name: 'Date created' });
    expect(created).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(created);
    expect(created).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menuitemradio', { name: 'Name' })).toHaveAttribute('aria-checked', 'false');
  });
});
