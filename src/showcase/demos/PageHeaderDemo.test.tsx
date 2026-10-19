import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { PageHeaderDemo } from './PageHeaderDemo';

describe('PageHeaderDemo', () => {
  it('renders the title-only and breadcrumb page headers', () => {
    renderWithInflow(<PageHeaderDemo />);

    expect(screen.getByText('Title only')).toBeInTheDocument();
    expect(screen.getByText('With breadcrumbs')).toBeInTheDocument();

    expect(screen.getAllByRole('heading', { name: 'Winter collection' })).toHaveLength(2);

    const breadcrumbScenario = screen.getByText('With breadcrumbs').parentElement as HTMLElement;
    expect(within(breadcrumbScenario).getByRole('link', { name: 'Catalog' })).toBeInTheDocument();
    expect(
      within(breadcrumbScenario).getByRole('link', { name: 'Collections' }),
    ).toBeInTheDocument();
  });

  it('reports header actions and the back button through the activity line', () => {
    renderWithInflow(<PageHeaderDemo />);

    expect(screen.getByText('No action selected.')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'Save changes' })[0]);
    expect(screen.getByText('Save changes selected.')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'Cancel' })[0]);
    expect(screen.getByText('Cancel selected.')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /back/i })[0]);
    expect(screen.getByText('Back selected.')).toBeInTheDocument();
  });

  it('playground toggles remove the back button, actions, and add an eyebrow', () => {
    renderWithInflow(<PageHeaderDemo />);

    expect(screen.getAllByRole('button', { name: 'Save changes' })).toHaveLength(2);
    expect(screen.queryByText('Product information')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Show back button' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Show actions' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Show eyebrow (title only)' }));

    expect(screen.queryByRole('button', { name: 'Save changes' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
    expect(screen.getByText('Product information')).toBeInTheDocument();
  });
});
