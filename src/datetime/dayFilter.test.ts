import { afterEach, describe, expect, it } from 'vitest';
import { displayedDayFilter } from './format';
import { configureDateTime, resetDateTimeConfig } from './formats';

const { comparator, isValidDate } = displayedDayFilter.filterParams;

// A local date at noon. `setFullYear` is used because the Date constructor maps the years 0-99 to 1900-1999.
const day = (year: number, month: number, dayOfMonth: number) => {
  const date = new Date(2000, 0, 1, 12);
  date.setFullYear(year, month - 1, dayOfMonth);
  return date;
};

afterEach(resetDateTimeConfig);

describe('displayedDayFilter', () => {
  it('compares the day shown in the configured timezone, not the day of the raw timestamp', () => {
    configureDateTime({ timeZone: 'America/New_York' });
    const cell = '2026-08-04T02:14:00.000Z'; // 22:14 on 3 August in New York

    expect(comparator(day(2026, 8, 3), cell)).toBe(0);
    expect(comparator(day(2026, 8, 4), cell)).toBe(-1);
    expect(comparator(day(2026, 8, 2), cell)).toBe(1);
  });

  it('finds the next day when a timestamp crosses midnight east of UTC', () => {
    configureDateTime({ timeZone: 'Asia/Singapore' });

    expect(comparator(day(2026, 8, 4), '2026-08-03T17:00:00Z')).toBe(0);
    expect(comparator(day(2026, 8, 3), '2026-08-03T17:00:00Z')).toBe(1);
  });

  it('leaves wall-clock and date-only values on the day they were received', () => {
    configureDateTime({ timeZone: 'Asia/Tokyo' });

    expect(comparator(day(2026, 8, 4), '2026-08-04T02:14:00')).toBe(0);
    expect(comparator(day(2026, 8, 4), '2026-08-04')).toBe(0);
  });

  it('uses the browser timezone when none is configured', () => {
    const lateEvening = new Date(2026, 7, 4, 23, 30);

    expect(comparator(day(2026, 8, 4), lateEvening)).toBe(0);
    expect(comparator(day(2026, 8, 4), lateEvening.getTime())).toBe(0);
  });

  it('orders days across months and years', () => {
    expect(comparator(day(2026, 8, 5), '2026-08-04')).toBe(-1);
    expect(comparator(day(2026, 9, 1), '2026-08-31')).toBe(-1);
    expect(comparator(day(2025, 12, 31), '2026-01-01')).toBe(1);
  });

  it('compares the years 0-99', () => {
    expect(comparator(day(99, 5, 6), '0099-05-06')).toBe(0);
    expect(comparator(day(1999, 5, 6), '0099-05-06')).toBe(-1);
  });

  it('does not take the time of day into account', () => {
    expect(comparator(day(2026, 8, 4), '2026-08-04T00:00:00')).toBe(0);
    expect(comparator(day(2026, 8, 4), '2026-08-04T23:59:59')).toBe(0);
    expect(displayedDayFilter.filterParams.includeTime).toBe(false);
  });

  it('asks the grid to leave out values that cannot be shown', () => {
    for (const value of [null, undefined, '', '   ', 'not a date', '2022-02-31', {}, true]) {
      expect(isValidDate(value)).toBe(false);
    }
    for (const value of ['2026-08-04', '2026-08-04T02:14:00Z', new Date(), 1_650_000_000_000]) {
      expect(isValidDate(value)).toBe(true);
    }
  });

  it('is a Community date filter', () => {
    expect(displayedDayFilter.filter).toBe('agDateColumnFilter');
  });
});
