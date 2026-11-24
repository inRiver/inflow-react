/**
 * Single source of truth for how dates and times are displayed.
 *
 * Rule: follow the user's locale, like most large products do. English (US)
 * matches the PIM table display ("3/9/2022 4:33 PM"); every other locale uses
 * its own standard from the browser's locale data (Intl), such as
 * "09.03.2022 16:33" (German). The locale and clock can be set per user or
 * tenant (for example from a PIM preference) with `configureDateTime`.
 *
 * Contexts that several regions share use a fixed style instead: "iso" for
 * exports and logs, "unambiguous" for audit-style views. The timezone is owned
 * by the PIM; these formats only control presentation. Patterns are dayjs tokens.
 */
export type HourCycle = 'locale' | '12' | '24';
export type DateTimeStyle = 'locale' | 'iso' | 'unambiguous';

export interface DateTimeOptions {
  /** BCP 47 locale such as "en-US" or "de". Defaults to the configured locale, then the browser language. */
  locale?: string;
  /** Defaults to the configured value, which defaults to "locale". */
  hourCycle?: HourCycle;
  /** Defaults to the configured value, which defaults to "locale". */
  style?: DateTimeStyle;
  /**
   * IANA timezone such as "Europe/Stockholm" that moments in time (values with a "Z" or offset, Dates, timestamps)
   * are shown in. Defaults to the configured value, then the browser timezone. Values without an offset and
   * date-only values are never converted.
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

export const dateTimeConfig: { locale?: string; hourCycle: HourCycle; style: DateTimeStyle; timeZone?: string } = {
  hourCycle: 'locale',
  style: 'locale',
};

/** Set app-wide preferences once at startup (or when the user changes them) so tables and pickers agree. */
export function configureDateTime(preferences: Partial<DateTimeOptions>) {
  Object.assign(dateTimeConfig, preferences);
}

function resolveLocale(locale?: string): string {
  const requested = locale ?? dateTimeConfig.locale ?? (typeof navigator === 'undefined' ? undefined : navigator.language);
  try {
    return Intl.DateTimeFormat.supportedLocalesOf(requested ?? 'en-US')[0] ?? 'en-US';
  } catch {
    return 'en-US';
  }
}

const SAMPLE = new Date(2022, 2, 9, 16, 33);

/** The locale's own date order and separators, in dayjs tokens (e.g. "DD.MM.YYYY"). */
function localeDatePattern(locale: string): string {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(SAMPLE)
    .map(({ type, value }) => {
      if (type === 'day') return 'DD';
      if (type === 'month') return 'MM';
      if (type === 'year') return 'YYYY';
      const literal = value.replace(/[‎‏]/g, '');
      return /[A-Za-z]/.test(literal) ? `[${literal}]` : literal;
    })
    .join('');
}

function localeIsTwelveHour(locale: string): boolean {
  const cycle = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hourCycle;
  return cycle === 'h11' || cycle === 'h12';
}

export function getDateTimeFormats(options: DateTimeOptions = {}): DateTimeFormats {
  const locale = resolveLocale(options.locale);
  const style = options.style ?? dateTimeConfig.style;
  const cycle = options.hourCycle ?? dateTimeConfig.hourCycle;

  if (style === 'iso') {
    return { date: 'YYYY-MM-DD', time: 'HH:mm', dateTime: 'YYYY-MM-DD HH:mm', twelveHour: false };
  }

  const twelveHour = cycle === 'locale' ? localeIsTwelveHour(locale) : cycle === '12';
  const time = twelveHour ? 'h:mm A' : 'HH:mm';
  const isUs = /^en(-US)?$/i.test(locale);
  const date = style === 'unambiguous' ? 'D MMM YYYY' : isUs ? 'M/D/YYYY' : localeDatePattern(locale);

  return { date, time, dateTime: `${date} ${time}`, twelveHour };
}
