import { screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { ContentStandardsPage } from './ContentStandardsPage';

describe('ContentStandardsPage', () => {
  it('documents the date and time formats with examples from the shared formatters', () => {
    renderWithInflow(
      <MemoryRouter>
        <ContentStandardsPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Content standards' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Dates and times' })).toBeInTheDocument();

    const table = screen.getByRole('table', { name: 'Date and time formats' });
    expect(within(table).getAllByRole('row')).toHaveLength(4);

    const date = within(table).getByRole('row', { name: /^Date\b(?! and)/ });
    expect(date).toHaveTextContent('M/D/YYYY');
    expect(date).toHaveTextContent('3/9/2022');

    expect(within(table).getByRole('row', { name: /^Time/ })).toHaveTextContent('4:33 PM');
    expect(within(table).getByRole('row', { name: /^Date and time/ })).toHaveTextContent('3/9/2022 4:33 PM');

    const byLocale = screen.getByRole('table', { name: 'Date and time by locale' });
    const fixed = screen.getByRole('table', { name: 'Fixed date and time styles' });
    expect(within(fixed).getByRole('row', { name: /^ISO/ })).toHaveTextContent('2022-03-09 16:33');
    expect(within(fixed).getByRole('row', { name: /^Unambiguous/ })).toHaveTextContent('9 Mar 2022 16:33');
    expect(within(byLocale).getByRole('row', { name: /^German/ })).toHaveTextContent('09.03.2022 16:33');
    expect(within(byLocale).getByRole('row', { name: /^Swedish/ })).toHaveTextContent('2022-03-09 16:33');
  });

  it('links to the Capitalization page', () => {
    renderWithInflow(
      <MemoryRouter>
        <ContentStandardsPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Capitalization' })).toHaveAttribute('href', expect.stringContaining('/capitalization'));
  });
});
