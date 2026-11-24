import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { dateTimeConfig, getDateTimeFormats, type DateTimeOptions } from './formats';

dayjs.extend(utc);
dayjs.extend(timezone);

type DateInput = string | number | Date | null | undefined;

// A moment in time: a Date, a timestamp, or an ISO string that ends in "Z" or an offset such as "+02:00".
const isInstant = (value: Exclude<DateInput, null | undefined>) =>
  value instanceof Date || typeof value === 'number' || /T.*(Z|[+-]\d{2}:?\d{2})$/i.test(value);

function parse(value: Exclude<DateInput, null | undefined>, timeZone?: string) {
  let parsed = dayjs(value);
  if (timeZone && parsed.isValid() && isInstant(value)) {
    try {
      parsed = parsed.tz(timeZone);
    } catch {
      // Unknown timezone name: show the value in the browser timezone rather than failing.
    }
  }
  // "en" keeps month names and AM/PM stable; digits and order come from the pattern.
  return parsed.locale('en');
}

function format(value: DateInput, pick: 'date' | 'time' | 'dateTime', options?: DateTimeOptions) {
  if (value === null || value === undefined || value === '') return '';
  const parsed = parse(value, options?.timeZone ?? dateTimeConfig.timeZone);
  // Fall back to the raw value rather than rendering "Invalid Date".
  return parsed.isValid() ? parsed.format(getDateTimeFormats(options)[pick]) : String(value);
}

/** e.g. "3/9/2022" (English US) or "09.03.2022" (German) */
export const formatDate = (value: DateInput, options?: DateTimeOptions) => format(value, 'date', options);
/** e.g. "4:33 PM" (English US) or "16:33" (German) */
export const formatTime = (value: DateInput, options?: DateTimeOptions) => format(value, 'time', options);
/** e.g. "3/9/2022 4:33 PM" (English US) or "09.03.2022 16:33" (German) */
export const formatDateTime = (value: DateInput, options?: DateTimeOptions) => format(value, 'dateTime', options);

/**
 * Column-definition fragment for a date-time column in AG Grid. Spread it into a
 * colDef. `filterParams.valueFormatter` makes the Set filter list readable values
 * instead of raw ISO strings such as "2026-08-04T02:14:00.000Z".
 * Typed structurally so this module does not depend on AG Grid.
 */
export const dateTimeColumn = {
  valueFormatter: ({ value }: { value?: DateInput }) => formatDateTime(value),
  filterParams: { valueFormatter: ({ value }: { value?: DateInput }) => formatDateTime(value) },
} as const;

/** Same as {@link dateTimeColumn}, for date-only columns (e.g. "3/9/2022"). */
export const dateColumn = {
  valueFormatter: ({ value }: { value?: DateInput }) => formatDate(value),
  filterParams: { valueFormatter: ({ value }: { value?: DateInput }) => formatDate(value) },
} as const;
