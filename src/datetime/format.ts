import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { getDateTimeConfig, getDateTimeFormats, type DateTimeOptions } from './formats';

// Registers the dayjs `utc` plugin, which the formatters use to show wall-clock fields exactly as they are. Apps that
// want a MUI X picker's `timezone` prop also have to extend dayjs with its `timezone` plugin themselves.
dayjs.extend(utc);

type DateInput = string | number | Date | null | undefined;

// What to show: wall-clock fields kept as a UTC timestamp (UTC has no DST gap or overflow, so they can never shift), or a
// moment in time shown in the browser timezone.
type Shown = { wall: number } | { local: number };

const MAX_TIMESTAMP = 8.64e15;
const CACHE_LIMIT = 64;
// "2022-03-09", "2022-03-09T16:33", "2022-03-09 16:33:00.123", with an optional "Z" or offset after a time. The year may
// be expanded to six digits with a sign ("+002022").
const ISO = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?)?(Z|[+-]\d{2}(?::?\d{2})?)?$/i;
const ISO_PREFIX = /^[+-]?\d{4,6}-\d{2}-\d{2}/;
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const isLeapYear = (year: number) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
const daysInMonth = (year: number, month: number) => (month === 2 && isLeapYear(year) ? 29 : DAYS_IN_MONTH[month - 1]);

// `Date.UTC` maps years 0-99 to 1900-1999, so set the fields on a date instead.
function utcTimestamp(year: number, month: number, day: number, hour: number, minute: number, second: number, ms: number) {
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(hour, minute, second, ms);
  return date.getTime();
}

function offsetMinutes(zone: string): number | undefined {
  if (zone.toUpperCase() === 'Z') return 0;
  const digits = zone.slice(1).replace(':', '');
  const hours = Number(digits.slice(0, 2));
  const minutes = digits.length > 2 ? Number(digits.slice(2)) : 0;
  if (hours > 23 || minutes > 59) return undefined;
  return (zone.startsWith('-') ? -1 : 1) * (hours * 60 + minutes);
}

/**
 * `undefined` when the text is not ISO-shaped, `null` when it is but is not a real moment (month 13, 31 February, 24:30),
 * otherwise a wall-clock value or, with a "Z" or offset, an instant in milliseconds.
 */
function parseIso(text: string): { wall: number } | { instant: number } | null | undefined {
  const match = ISO.exec(text);
  if (!match) return undefined;
  const [, year, month, day, hour, minute, second, fraction, zone] = match;
  if (zone !== undefined && hour === undefined) return undefined;

  const y = Number(year);
  const mo = Number(month);
  const d = Number(day);
  const h = hour === undefined ? 0 : Number(hour);
  const mi = minute === undefined ? 0 : Number(minute);
  const s = second === undefined ? 0 : Number(second);
  const ms = fraction === undefined ? 0 : Number(fraction.padEnd(3, '0').slice(0, 3));
  // "-000000" is not a year, and a fraction counts as a whole, not as the milliseconds it is cut to.
  if (year === '-000000' || mo < 1 || mo > 12 || d < 1 || d > daysInMonth(y, mo) || h > 24 || mi > 59 || s > 59) return null;
  const hasFraction = fraction !== undefined && /[1-9]/.test(fraction);
  // 24:00 is the end of the day, which only a moment in time can be.
  if (h === 24 && (mi !== 0 || s !== 0 || hasFraction || zone === undefined)) return null;

  const wall = utcTimestamp(y, mo, d, h, mi, s, ms);
  // An expanded year can be past the largest timestamp.
  if (!Number.isFinite(wall)) return null;
  if (zone === undefined) return { wall };
  const offset = offsetMinutes(zone);
  return offset === undefined ? null : { instant: wall - offset * 60_000 };
}

const projectors = new Map<string, Intl.DateTimeFormat | null>();

function projector(timeZone: string) {
  let projection = projectors.get(timeZone);
  if (projection === undefined) {
    try {
      projection = new Intl.DateTimeFormat('en-US', {
        timeZone,
        calendar: 'gregory',
        numberingSystem: 'latn',
        hourCycle: 'h23',
        year: 'numeric',
        era: 'short',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });
    } catch {
      // Unknown timezone name: the value is shown in the browser timezone rather than failing.
      projection = null;
    }
    if (projectors.size >= CACHE_LIMIT) projectors.clear();
    projectors.set(timeZone, projection);
  }
  return projection;
}

/** The wall-clock fields of an instant in a timezone, as a UTC timestamp. Dayjs' own `tz` re-parses them in the host zone, which can shift them through a host DST gap. */
function zonedWall(instant: number, timeZone: string): number | undefined {
  const projection = projector(timeZone);
  if (!projection) return undefined;
  const fields: Record<string, number> = {};
  let beforeCommonEra = false;
  for (const { type, value } of projection.formatToParts(instant)) {
    if (type === 'era') beforeCommonEra = value.startsWith('B');
    else fields[type] = Number(value);
  }
  const ms = ((Math.floor(instant) % 1000) + 1000) % 1000;
  // The year is counted from 1 before and after the era, so 1 BC is year 0.
  const year = beforeCommonEra ? 1 - fields.year : fields.year;
  const wall = utcTimestamp(year, fields.month, fields.day, fields.hour % 24, fields.minute, fields.second, ms);
  // A wall time past the largest timestamp (the last day in a zone ahead of UTC) cannot be shown as one.
  return Number.isFinite(wall) ? wall : undefined;
}

function place(instant: number, timeZone?: string): Shown | undefined {
  if (!Number.isFinite(instant) || Math.abs(instant) > MAX_TIMESTAMP) return undefined;
  const wall = timeZone ? zonedWall(instant, timeZone) : undefined;
  return wall === undefined ? { local: instant } : { wall };
}

function resolve(value: Exclude<DateInput, null | undefined>, timeZone?: string): Shown | undefined {
  if (value instanceof Date) return place(value.getTime(), timeZone);
  if (typeof value === 'number') return place(value, timeZone);

  const text = value.trim();
  // Digits only look like a timestamp but are not one: numbers are milliseconds, so leave the text as it is.
  if (/^[+-]?\d+$/.test(text)) return undefined;
  const iso = parseIso(text);
  if (iso === null) return undefined;
  if (iso) return 'instant' in iso ? place(iso.instant, timeZone) : iso;
  // Starts like an ISO date but is not valid ISO (such as "2022-02-31T16:33:00."): leave it, rather than let the
  // browser read it as some other day.
  if (ISO_PREFIX.test(text)) return undefined;
  // Not ISO: whatever the browser can read, shown in the browser timezone as before.
  const parsed = dayjs(text);
  return parsed.isValid() ? { local: parsed.valueOf() } : undefined;
}

function format(value: DateInput, pick: 'date' | 'time' | 'dateTime', options?: DateTimeOptions) {
  if (value === null || value === undefined || value === '') return '';
  const shown = resolve(value, options?.timeZone ?? getDateTimeConfig().timeZone);
  // Fall back to the raw value rather than rendering "Invalid Date".
  if (!shown) return String(value);
  const moment = 'wall' in shown ? dayjs.utc(shown.wall) : dayjs(shown.local);
  // "en" keeps month names and AM/PM stable, and ignores any digit-changing dayjs locale the app has loaded: digits and
  // order come from the pattern.
  return moment.locale('en').format(getDateTimeFormats(options)[pick]);
}

/** e.g. "3/9/2022" (English US) or "09.03.2022" (German) */
export const formatDate = (value: DateInput, options?: DateTimeOptions) => format(value, 'date', options);
/** e.g. "4:33 PM" (English US) or "16:33" (German) */
export const formatTime = (value: DateInput, options?: DateTimeOptions) => format(value, 'time', options);
/** e.g. "3/9/2022 4:33 PM" (English US) or "09.03.2022 16:33" (German) */
export const formatDateTime = (value: DateInput, options?: DateTimeOptions) => format(value, 'dateTime', options);

/**
 * Column-definition fragment for a date-time column in AG Grid. Spread it into a
 * colDef. `valueFormatter` shows the formatted value, and `filterParams.valueFormatter` makes the Set filter
 * (Enterprise) list readable values instead of raw ISO strings such as "2026-08-04T02:14:00.000Z".
 * Typed structurally so this module does not depend on AG Grid.
 *
 * Filtering is left to the caller: whichever default filter the grid picks for the column works on the raw value, not
 * on the shown text. AG Grid normally exports and copies the shown text, which depends on the locale. Set
 * `useValueFormatterForExport: false` to keep the raw values, or use an export callback (`processCellCallback`) to
 * write machine timestamps as ISO 8601 with an offset or `Z`; the "iso" style is a display pattern without an offset.
 * After `configureDateTime` changes a preference, refresh the cells with `api.refreshCells({ force: true })` and
 * re-apply filters with `api.onFilterChanged()`.
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

interface Day {
  year: number;
  month: number;
  day: number;
}

/** The calendar day the formatters show for a value, or `undefined` for a value they cannot show. */
function displayedDay(value: unknown): Day | undefined {
  if (!(typeof value === 'string' || typeof value === 'number' || value instanceof Date) || value === '') return undefined;
  const shown = resolve(value, getDateTimeConfig().timeZone);
  if (!shown) return undefined;
  if ('wall' in shown) {
    const date = new Date(shown.wall);
    return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
  }
  const date = new Date(shown.local);
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

// Compared as numbers rather than as Dates: the Date constructor maps the years 0-99 to 1900-1999.
function compareToFilterDate(filterLocalDateAtMidnight: Date, cellValue: unknown): number {
  const day = displayedDay(cellValue);
  if (!day) return 0;
  return Math.sign(
    day.year - filterLocalDateAtMidnight.getFullYear() ||
      day.month - (filterLocalDateAtMidnight.getMonth() + 1) ||
      day.day - filterLocalDateAtMidnight.getDate(),
  );
}

/**
 * Opt-in for the Community date filter (`DateFilterModule`, part of `AllCommunityModule`): it filters by the calendar
 * day the formatters show, in the configured timezone, instead of the raw value. Spread it after a date fragment. The
 * filter has no time of day, so a date-time column is filtered by its day too. Blank cells follow AG Grid's blank
 * options; a value that is not blank but cannot be shown is left out of every comparison, so it matches neither
 * "equals", "before", "after" nor "in range".
 */
export const displayedDayFilter = {
  filter: 'agDateColumnFilter',
  filterParams: {
    includeTime: false,
    isValidDate: (value: unknown) => displayedDay(value) !== undefined,
    comparator: compareToFilterDate,
  },
} as const;
