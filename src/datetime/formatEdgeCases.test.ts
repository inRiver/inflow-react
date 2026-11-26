import { afterEach, describe, expect, it } from 'vitest';
import { configureDateTime, getDateTimeFormats, resetDateTimeConfig } from './formats';
import { formatDate, formatDateTime, formatTime } from './format';

afterEach(resetDateTimeConfig);

describe('locale formats', () => {
  const WALL = '2022-03-09T16:33:00';

  it.each([
    ['en', '3/9/2022 4:33 PM'],
    ['en-US', '3/9/2022 4:33 PM'],
    ['en-GB', '09/03/2022 16:33'],
    ['fr', '09/03/2022 16:33'],
    ['en-AU', '09/03/2022 4:33 PM'],
    ['ar-SA', '09/03/2022 4:33 PM'],
    ['de', '09.03.2022 16:33'],
    ['sv', '2022-03-09 16:33'],
    ['ja', '2022/03/09 16:33'],
    ['zh', '2022/03/09 16:33'],
    ['ko', '2022. 03. 09. 4:33 PM'],
    ['th-TH', '09/03/2022 16:33'],
    ['en-US-u-hc-h23', '3/9/2022 16:33'],
  ])('shows %s as %s', (locale, expected) => {
    expect(formatDateTime(WALL, { locale })).toBe(expected);
  });

  it('shows the Gregorian calendar with Latin digits whatever the locale asks for', () => {
    expect(formatDateTime(WALL, { locale: 'ja-JP-u-ca-japanese' })).toBe('2022/03/09 16:33');
    expect(formatDateTime(WALL, { locale: 'th-TH-u-ca-buddhist-nu-thai' })).toBe('09/03/2022 16:33');
  });

  it('falls back to English (US) for a locale it cannot use', () => {
    expect(formatDate(WALL, { locale: 'not a locale!' })).toBe('3/9/2022');
    expect(formatDate(WALL, { locale: '' })).toBe('3/9/2022');
  });

  it('keeps the dayjs token pattern of a locale with literal punctuation', () => {
    expect(getDateTimeFormats({ locale: 'ko' }).date).toBe('YYYY. MM. DD.');
  });
});

describe('configureDateTime', () => {
  it('ignores undefined values instead of overwriting the defaults', () => {
    configureDateTime({ hourCycle: undefined, style: undefined, locale: undefined });

    expect(formatTime('2022-03-09T16:33:00', { locale: 'en' })).toBe('4:33 PM');
  });

  it('applies a configured hour cycle, timezone and locale, which explicit options override', () => {
    configureDateTime({ locale: 'de', hourCycle: '12', timeZone: 'Asia/Tokyo' });

    // 16:33 UTC is 01:33 the next day in Tokyo.
    expect(formatDateTime('2022-03-09T16:33:00Z')).toBe('10.03.2022 1:33 AM');
    expect(formatDateTime('2022-03-09T16:33:00Z', { locale: 'en', timeZone: 'UTC', hourCycle: '24' })).toBe('3/9/2022 16:33');
  });
});

describe('strict parsing', () => {
  const utc = { locale: 'en', timeZone: 'UTC' } as const;

  it('shows values that are not real moments as they were received', () => {
    for (const value of ['2022-02-31', '2023-02-29', '2022-13-01', '2022-03-09T25:00', '2022-03-09T16:60', '2022-03-09T24:00']) {
      expect(formatDateTime(value, utc)).toBe(value);
    }
  });

  it('accepts a leap day and years before 1000', () => {
    expect(formatDate('2024-02-29')).toBe('2/29/2024');
    expect(formatDate('0099-01-02', { locale: 'en' })).toBe('1/2/0099');
  });

  it('reads offsets with or without minutes, a colon, a space separator and lowercase letters', () => {
    expect(formatDateTime('2022-03-09T16:33:00+02', utc)).toBe('3/9/2022 2:33 PM');
    expect(formatDateTime('2022-03-09T16:33:00+0200', utc)).toBe('3/9/2022 2:33 PM');
    expect(formatDateTime('2022-03-09T16:33:00-03:30', utc)).toBe('3/9/2022 8:03 PM');
    expect(formatDateTime('2022-03-09 16:33:00+02:00', { locale: 'en', timeZone: 'Asia/Tokyo' })).toBe('3/9/2022 11:33 PM');
    expect(formatDateTime('2022-03-09t16:33:00z', utc)).toBe('3/9/2022 4:33 PM');
  });

  it('rejects an offset that cannot exist', () => {
    expect(formatDateTime('2022-03-09T16:33:00+25:00', utc)).toBe('2022-03-09T16:33:00+25:00');
    expect(formatDateTime('2022-03-09T16:33:00+02:99', utc)).toBe('2022-03-09T16:33:00+02:99');
  });

  it('treats 24:00 as the next midnight for a moment in time only', () => {
    expect(formatDateTime('2022-03-09T24:00:00Z', utc)).toBe('3/10/2022 12:00 AM');
    expect(formatDateTime('2022-03-09T24:00:01Z', utc)).toBe('2022-03-09T24:00:01Z');
  });

  it('truncates fractions of a second instead of rolling over', () => {
    expect(formatDateTime('2022-03-09T23:59:59.9999999Z', utc)).toBe('3/9/2022 11:59 PM');
    expect(formatDateTime('2022-03-09T23:59:59.5Z', utc)).toBe('3/9/2022 11:59 PM');
  });

  it('crosses midnight when a zone is ahead or behind', () => {
    expect(formatDateTime('2022-03-09T23:30:00Z', { locale: 'en', timeZone: 'Asia/Tokyo' })).toBe('3/10/2022 8:30 AM');
    expect(formatDateTime('2022-03-09T01:30:00Z', { locale: 'en', timeZone: 'America/New_York' })).toBe('3/8/2022 8:30 PM');
  });

  it('formats a Date and a timestamp as moments in time', () => {
    const date = new Date(Date.UTC(2022, 2, 9, 16, 33));

    expect(formatDateTime(date, utc)).toBe('3/9/2022 4:33 PM');
    expect(formatDateTime(date.getTime(), utc)).toBe('3/9/2022 4:33 PM');
    expect(formatDateTime(new Date(Number.NaN), utc)).toBe('Invalid Date');
    expect(formatDateTime(Number.NaN, utc)).toBe('NaN');
  });

  it('leaves digits-only text alone, because only a number is a timestamp', () => {
    expect(formatDateTime('1646843580000', utc)).toBe('1646843580000');
  });

  it('reads an expanded year, and keeps the era of a year before 1 AD', () => {
    expect(formatDateTime('+002022-03-09T16:33:00Z', utc)).toBe('3/9/2022 4:33 PM');
    expect(formatDate('0000-01-01T00:00:00Z', { locale: 'en', timeZone: 'Asia/Tokyo' })).toBe('1/1/0000');
  });

  it('keeps text that starts like a date but is not valid ISO as it was received', () => {
    expect(formatDateTime('2022-02-31T16:33:00.', utc)).toBe('2022-02-31T16:33:00.');
    expect(formatDateTime('2022-03-09T24:00:00.0001Z', utc)).toBe('2022-03-09T24:00:00.0001Z');
    expect(formatDateTime('-000000-03-09T16:33:00Z', utc)).toBe('-000000-03-09T16:33:00Z');
    expect(formatDateTime('+999999-01-01T00:00:00Z', utc)).toBe('+999999-01-01T00:00:00Z');
  });

  it('shows the largest timestamp without failing in a zone ahead of UTC', () => {
    const latest = new Date(8.64e15);

    expect(formatDateTime(latest, { locale: 'en', timeZone: 'Pacific/Kiritimati' })).not.toBe('Invalid Date');
  });

  it('shows the browser timezone when the timezone name is unknown', () => {
    const date = new Date(Date.UTC(2022, 2, 9, 16, 33));

    expect(formatDateTime(date, { locale: 'en', timeZone: 'Nowhere/Land' })).toBe(formatDateTime(date, { locale: 'en' }));
  });

  it('still reads loose text the browser understands', () => {
    expect(formatDate('March 9, 2022', { locale: 'en' })).toBe('3/9/2022');
  });
});

// The host timezone is fixed when the process starts, so these run when it has the gap: under the TZ that
// `scripts/datetime-host-timezones.test.mjs` sets, or on a developer machine in an American zone.
const hostHasGap = new Date(2022, 2, 13, 2, 30).getHours() === 3;

describe('host timezone', () => {
  it('is the one the run was asked for', () => {
    if (process.env.INFLOW_HOST_TZ === 'America/New_York') expect(hostHasGap).toBe(true);
  });

  it('never moves a date or a wall-clock time', () => {
    expect(formatDate('2022-03-09', { locale: 'en' })).toBe('3/9/2022');
    expect(formatDate('2022-12-31', { locale: 'en' })).toBe('12/31/2022');
    expect(formatDateTime('2022-03-09T00:00:00', { locale: 'en' })).toBe('3/9/2022 12:00 AM');
    expect(formatDateTime('2022-03-09T23:59:59', { locale: 'en' })).toBe('3/9/2022 11:59 PM');
  });
});

describe.runIf(hostHasGap)('in a host timezone with a daylight saving gap', () => {
  // 02:30 on 13 March 2022 does not exist in New York: clocks go from 02:00 to 03:00.
  it('shows a wall-clock time inside the gap as it was received', () => {
    expect(formatDateTime('2022-03-13T02:30:00', { locale: 'en' })).toBe('3/13/2022 2:30 AM');
    expect(formatDate('2022-03-13', { locale: 'en' })).toBe('3/13/2022');
  });

  it('shows a configured timezone whose time falls inside the host gap', () => {
    expect(formatDateTime('2022-03-12T17:30:00Z', { locale: 'en', timeZone: 'Asia/Tokyo' })).toBe('3/13/2022 2:30 AM');
  });
});
