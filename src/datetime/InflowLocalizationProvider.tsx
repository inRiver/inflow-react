import { useMemo, type ReactNode } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getDateTimeFormats, type DateTimeOptions } from './formats';

export interface InflowLocalizationProviderProps extends DateTimeOptions {
  children: ReactNode;
}

/** The dayjs locale used for month and day names, if it is loaded; otherwise English. */
function calendarLocale(locale?: string): string {
  const key = (locale ?? '').toLowerCase();
  return [key, key.split('-')[0]].find((candidate) => candidate in dayjs.Ls) ?? 'en';
}

/**
 * Wraps MUI X pickers with the Inflow date adapter and display formats, so
 * consumers don't each configure `LocalizationProvider` themselves. Pickers
 * inside it need no `format` or `ampm` props.
 */
export function InflowLocalizationProvider({ children, locale, hourCycle, style }: InflowLocalizationProviderProps) {
  const formats = getDateTimeFormats({ locale, hourCycle, style });

  // MUI decides the AM/PM clock from the adapter, so the adapter must know about a forced hour cycle.
  const Adapter = useMemo(
    () =>
      class InflowAdapter extends AdapterDayjs {
        constructor(...args: ConstructorParameters<typeof AdapterDayjs>) {
          super(...args);
          this.is12HourCycleInCurrentLocale = () => formats.twelveHour;
        }
      },
    [formats.twelveHour],
  );

  return (
    <LocalizationProvider
      dateAdapter={Adapter}
      adapterLocale={calendarLocale(locale ?? (typeof navigator === 'undefined' ? undefined : navigator.language))}
      dateFormats={{
        keyboardDate: formats.date,
        // MUI builds the default time format from these parts; the default hour is zero-padded ("07").
        hours12h: 'h',
        hours24h: 'HH',
        fullTime12h: formats.twelveHour ? formats.time : 'h:mm A',
        fullTime24h: formats.twelveHour ? 'HH:mm' : formats.time,
      }}
    >
      {children}
    </LocalizationProvider>
  );
}
