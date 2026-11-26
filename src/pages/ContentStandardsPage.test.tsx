import { screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { configureDateTime } from '../datetime';
import { resetDateTimeConfig } from '../datetime/formats';

afterEach(resetDateTimeConfig);

const renderPage = async () => {
  const { ContentStandardsPage } = await import('./ContentStandardsPage');
  renderWithInflow(
    <MemoryRouter>
      <ContentStandardsPage />
    </MemoryRouter>,
  );
};

describe('ContentStandardsPage', () => {
  it('documents the date and time formats with examples from the shared formatters', async () => {
    // The page builds its examples when it is first loaded, so a preference set beforehand must not leak into them.
    configureDateTime({ locale: 'ja', style: 'iso', hourCycle: '12' });
    await renderPage();

    const title = screen.getByRole('heading', { name: 'Content standards', level: 1 });
    expect(title).toHaveClass('MuiTypography-h3');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Dates and times', level: 2 })).toBeInTheDocument();

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
    expect(within(byLocale).getByRole('row', { name: /^English \(UK\)/ })).toHaveTextContent('09/03/2022 16:33');
    expect(within(byLocale).getByRole('row', { name: /^German/ })).toHaveTextContent('09.03.2022 16:33');
    expect(within(byLocale).getByRole('row', { name: /^Swedish/ })).toHaveTextContent('2022-03-09 16:33');
  });

  it('states the clock, machine-timestamp and table-language rules precisely', async () => {
    await renderPage();

    const fixed = screen.getByRole('table', { name: 'Fixed date and time styles' });
    expect(within(fixed).getByRole('row', { name: /^ISO/ })).toHaveTextContent(
      'Use ISO 8601 timestamps with an offset or Z for exports and logs.',
    );
    expect(screen.getByText(/drop the leading zero from single-digit hours/)).toHaveTextContent('08:00');
    expect(screen.getByText(/Table formats use Gregorian dates and Latin digits/)).toHaveTextContent(
      'English month names and AM/PM',
    );
  });

  it('links to the Capitalization page', async () => {
    await renderPage();

    expect(screen.getByRole('link', { name: 'Capitalization' })).toHaveAttribute('href', expect.stringContaining('/capitalization'));
  });
});
