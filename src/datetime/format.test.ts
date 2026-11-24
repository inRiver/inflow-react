import { describe, expect, it } from 'vitest';
import { getDateTimeFormats } from './formats';
import { dateColumn, dateTimeColumn, formatDate, formatDateTime, formatTime } from './format';

describe('datetime formatters', () => {
  it('formats using the shared PIM-style formats', () => {
    expect(formatDate('2022-03-09T16:33:00')).toBe('3/9/2022');
    expect(formatTime('2022-03-09T16:33:00')).toBe('4:33 PM');
    expect(formatDateTime('2022-03-09T16:33:00')).toBe('3/9/2022 4:33 PM');
  });

  it('follows each locale standard, with English (US) matching the PIM', () => {
    expect(formatDateTime('2022-03-09T16:33:00', { locale: 'en' })).toBe('3/9/2022 4:33 PM');
    expect(formatDateTime('2022-03-09T16:33:00', { locale: 'de' })).toBe('09.03.2022 16:33');
    expect(formatDateTime('2022-03-09T16:33:00', { locale: 'en-GB' })).toBe('09/03/2022 16:33');
    expect(formatDate('2022-03-09T16:33:00', { locale: 'sv' })).toBe('2022-03-09');
  });

  it('offers fixed styles for views several regions share', () => {
    expect(formatDateTime('2022-03-09T16:33:00', { locale: 'de', style: 'iso' })).toBe('2022-03-09 16:33');
    expect(formatDateTime('2022-03-09T16:33:00', { locale: 'de', style: 'unambiguous' })).toBe('9 Mar 2022 16:33');
    expect(formatDateTime('2022-03-09T16:33:00', { locale: 'en', style: 'unambiguous' })).toBe('9 Mar 2022 4:33 PM');
  });

  it('can force the hour cycle regardless of locale', () => {
    expect(formatTime('2022-03-09T16:33:00', { locale: 'en', hourCycle: '24' })).toBe('16:33');
    expect(formatTime('2022-03-09T16:33:00', { locale: 'de', hourCycle: '12' })).toBe('4:33 PM');
    expect(getDateTimeFormats({ locale: 'de', hourCycle: '12' }).twelveHour).toBe(true);
  });

  it('converts moments in time to the configured timezone, and nothing else', () => {
    const zone = (timeZone: string) => ({ locale: 'en', timeZone });
    expect(formatDateTime('2022-03-09T16:33:00Z', zone('America/New_York'))).toBe('3/9/2022 11:33 AM');
    expect(formatDateTime('2022-03-09T16:33:00+02:00', zone('Asia/Tokyo'))).toBe('3/9/2022 11:33 PM');
    // Wall-clock and date-only values are shown as received.
    expect(formatDateTime('2022-03-09T16:33:00', zone('Asia/Tokyo'))).toBe('3/9/2022 4:33 PM');
    expect(formatDate('2022-03-09', zone('Pacific/Kiritimati'))).toBe('3/9/2022');
  });

  it('handles empty and invalid values without throwing', () => {
    expect(formatDateTime(null)).toBe('');
    expect(formatDateTime('not a date')).toBe('not a date');
  });

  it('formats Set-filter values too, so the filter list is not raw ISO', () => {
    expect(dateTimeColumn.filterParams.valueFormatter({ value: '2026-08-04T02:14:00' })).toBe(
      '8/4/2026 2:14 AM',
    );
  });

  it('offers a date-only column fragment for cells and Set-filter values', () => {
    expect(dateColumn.valueFormatter({ value: '2026-08-04T02:14:00' })).toBe('8/4/2026');
    expect(dateColumn.filterParams.valueFormatter({ value: '2026-08-04T02:14:00' })).toBe('8/4/2026');
  });
});
