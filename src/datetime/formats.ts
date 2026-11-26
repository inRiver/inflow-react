import dayjs from 'dayjs';

/**
 * Single source of truth for how dates and times are displayed.
 *
 * Rule: follow the user's locale, like most large products do. English (US)
 * matches the PIM table display ("3/9/2022 4:33 PM"); every other locale uses
 * its own standard from the browser's locale data (Intl), such as
 * "09.03.2022 16:33" (German). The locale and clock can be set per user or
 * tenant (for example from a PIM preference) with `configureDateTime`.
 *
 * Inflow shows Gregorian dates with Latin digits, whatever the locale: the locale decides the order of day, month and
 * year, the separators and the clock. The display formatters always write English month names and AM/PM. A picker is
 * different: its calendar (month and day names, first day of the week) follows the dayjs locale the app has loaded
 * for the locale in use (`import 'dayjs/locale/de.js'`), so a 12-hour clock or the "unambiguous" style, which put
 * month names or AM/PM into a picker field, show that locale's words there.
 *
 * Contexts that several regions share use a fixed style instead: "iso" for an unambiguous, sortable display,
 * "unambiguous" for audit-style views. The timezone is owned
 * by the PIM; these formats only control presentation. Patterns are dayjs tokens.
 */
export type HourCycle = 'locale' | '12' | '24';
export type DateTimeStyle = 'locale' | 'iso' | 'unambiguous';

export interface DateTimeOptions {
  /**
   * BCP 47 locale such as "en-US" or "de". Defaults to the configured locale, then the browser language, then
   * "en-US". When rendering on a server, pass it explicitly: the browser language is not known there.
   */
  locale?: string;
  /** Defaults to the configured value, which defaults to "locale". */
  hourCycle?: HourCycle;
  /** Defaults to the configured value, which defaults to "locale". */
  style?: DateTimeStyle;
  /**
   * IANA timezone such as "Europe/Stockholm" that moments in time (values with a "Z" or offset, Dates, timestamps)
   * are shown in. Defaults to the configured value, then the browser timezone. Values without an offset and
   * date-only values are never converted.
   *
   * It also becomes the default `timezone` of the MUI X time and date-time pickers inside an
   * `InflowLocalizationProvider`, but only when the app has registered the dayjs `utc` and `timezone` plugins (a picker
   * cannot use a zone without them) and the name is a zone the runtime knows. Date-only pickers are never converted,
   * so a date does not move to another day. A picker's own `timezone` prop wins.
   */
  timeZone?: string;
}

export interface DateTimeFormats {
  date: string;
  time: string;
  dateTime: string;
  /** Whether the time uses an AM/PM clock. */
  twelveHour: boolean;
}

interface Preferences {
  readonly locale?: string;
  readonly hourCycle: HourCycle;
  readonly style: DateTimeStyle;
  readonly timeZone?: string;
}

const FALLBACK_LOCALE = 'en-US';
const CACHE_LIMIT = 64;
const DEFAULT_PREFERENCES: Preferences = { hourCycle: 'locale', style: 'locale' };

// The preferences are replaced, never mutated, so a component can subscribe to them and compare snapshots.
let preferences = DEFAULT_PREFERENCES;
const listeners = new Set<() => void>();

function publish(next: Preferences) {
  preferences = next;
  for (const listener of [...listeners]) listener();
}

export const getDateTimeConfig = (): Preferences => preferences;

export function subscribeDateTimeConfig(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Set app-wide preferences once at startup (or when the user changes them) so tables and pickers agree. Values that
 * are `undefined` are ignored. Mounted `InflowLocalizationProvider`s update; table cells that are already rendered do
 * not, so refresh them (for AG Grid, `api.refreshCells({ force: true })`). Do not call it per request on a server: the
 * preferences are shared by everything that uses this module.
 */
export function configureDateTime(next: Partial<DateTimeOptions>) {
  const merged: { -readonly [K in keyof Preferences]: Preferences[K] } = { ...preferences };
  if (next.locale !== undefined) merged.locale = next.locale;
  if (next.hourCycle !== undefined) merged.hourCycle = next.hourCycle;
  if (next.style !== undefined) merged.style = next.style;
  if (next.timeZone !== undefined) merged.timeZone = next.timeZone;
  const changed = (['locale', 'hourCycle', 'style', 'timeZone'] as const).some((key) => merged[key] !== preferences[key]);
  if (changed) publish(merged);
}

/** Back to the defaults. For tests. */
export function resetDateTimeConfig() {
  if (preferences !== DEFAULT_PREFERENCES) publish(DEFAULT_PREFERENCES);
}

function memo<T>(cache: Map<string, T>, key: string, compute: () => T): T {
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  const value = compute();
  if (cache.size >= CACHE_LIMIT) cache.clear();
  cache.set(key, value);
  return value;
}

const resolvedLocales = new Map<string, string>();

/** The locale in use: the given one, else the configured one, else the browser language, else "en-US". */
export function resolveLocale(locale?: string): string {
  const requested = locale ?? preferences.locale ?? (typeof navigator === 'undefined' ? undefined : navigator.language) ?? FALLBACK_LOCALE;
  return memo(resolvedLocales, requested, () => {
    try {
      return Intl.DateTimeFormat.supportedLocalesOf(requested)[0] ?? FALLBACK_LOCALE;
    } catch {
      return FALLBACK_LOCALE;
    }
  });
}

const SAMPLE = new Date(Date.UTC(2022, 2, 9, 16, 33));
const datePatterns = new Map<string, string>();
const twelveHourLocales = new Map<string, boolean>();
const usEnglishLocales = new Map<string, boolean>();

// Unicode direction marks that some locales put between the parts of a date.
const DIRECTION_MARKS = /[\u200e\u200f\u061c\u202a-\u202e\u2066-\u2069]/g;

/**
 * The locale's own date order and separators, in dayjs tokens (e.g. "DD.MM.YYYY"). Asking for the Gregorian calendar
 * and Latin digits keeps every locale to the same three numbers: a Buddhist, Japanese-era or Arabic-digit locale would
 * otherwise bring its own year, era letter or digits.
 */
function localeDatePattern(locale: string): string {
  return memo(datePatterns, locale, () =>
    new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      calendar: 'gregory',
      numberingSystem: 'latn',
      timeZone: 'UTC',
    })
      .formatToParts(SAMPLE)
      .map(({ type, value }) => {
        if (type === 'day') return 'DD';
        if (type === 'month') return 'MM';
        if (type === 'year') return 'YYYY';
        if (type !== 'literal') return '';
        const literal = value.replace(DIRECTION_MARKS, '');
        return /[A-Za-z]/.test(literal) ? `[${literal}]` : literal;
      })
      .join(''),
  );
}

function localeIsTwelveHour(locale: string): boolean {
  return memo(twelveHourLocales, locale, () => {
    const cycle = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hourCycle;
    return cycle === 'h11' || cycle === 'h12';
  });
}

// "en" and "en-US", with or without Unicode extensions such as "-u-hc-h23".
function isUsEnglish(locale: string): boolean {
  return memo(usEnglishLocales, locale, () => {
    const { language, region } = new Intl.Locale(locale);
    return language === 'en' && (region === undefined || region === 'US');
  });
}

/**
 * The dayjs locale a picker's calendar uses for month and day names and the first day of the week: the most specific
 * of language, script and region (dayjs names them like "zh-tw" or "pt-br") that the app has loaded, otherwise
 * English. Load locales before rendering: a picker keeps the one it started with.
 */
export function dayjsLocale(locale: string): string {
  const { language, script, region } = new Intl.Locale(locale);
  const candidates = [
    script && region ? `${language}-${script}-${region}` : undefined,
    region ? `${language}-${region}` : undefined,
    script ? `${language}-${script}` : undefined,
    language,
  ];
  return candidates.map((candidate) => candidate?.toLowerCase()).find((candidate) => candidate !== undefined && candidate in dayjs.Ls) ?? 'en';
}

export function getDateTimeFormats(options: DateTimeOptions = {}): DateTimeFormats {
  const locale = resolveLocale(options.locale);
  const style = options.style ?? preferences.style;
  const cycle = options.hourCycle ?? preferences.hourCycle;

  if (style === 'iso') {
    return { date: 'YYYY-MM-DD', time: 'HH:mm', dateTime: 'YYYY-MM-DD HH:mm', twelveHour: false };
  }

  const twelveHour = cycle === 'locale' ? localeIsTwelveHour(locale) : cycle === '12';
  const time = twelveHour ? 'h:mm A' : 'HH:mm';
  const date = style === 'unambiguous' ? 'D MMM YYYY' : isUsEnglish(locale) ? 'M/D/YYYY' : localeDatePattern(locale);

  return { date, time, dateTime: `${date} ${time}`, twelveHour };
}
