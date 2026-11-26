import { useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { ThemeContext } from '@emotion/react';
import { useDefaultProps } from '@mui/material/DefaultPropsProvider';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  dayjsLocale,
  getDateTimeConfig,
  getDateTimeFormats,
  resolveLocale,
  subscribeDateTimeConfig,
  type DateTimeOptions,
} from './formats';
import { withInflowPickerDefaults, type PopperModifier } from './withInflowPickerDefaults';

/**
 * `timeZone` is not here: it configures the display formatters only. A picker takes its own `timezone` prop, with the
 * dayjs `utc` and `timezone` plugins.
 */
export interface InflowLocalizationProviderProps extends Omit<DateTimeOptions, 'timeZone'> {
  children: ReactNode;
}

/**
 * Gives pickers the Inflow defaults through the theme context. MUI X reads its component defaults from the theme, so a
 * patched theme is all they need. A nested `ThemeProvider` would also replace the surrounding default-props, RTL and
 * CSS-variables providers, which is why the context is provided directly.
 */
function InflowPickerTheme({ children }: { children: ReactNode }) {
  const outer = useContext(ThemeContext);
  // Material reads default props from their own context, which an explicit provider can differ from the theme in.
  const { modifiers } = useDefaultProps({ props: {} as { modifiers?: PopperModifier[] }, name: 'MuiPopper' });
  const theme = useMemo(() => withInflowPickerDefaults(outer, modifiers), [outer, modifiers]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

/**
 * The resolved locale and the picker formats for it. Every preference is passed to `getDateTimeFormats` explicitly, so
 * the memo is sound, and subscribing re-renders the provider when `configureDateTime` changes one.
 */
function useInflowFormats(locale?: string, hourCycle?: DateTimeOptions['hourCycle'], style?: DateTimeOptions['style']) {
  const preferences = useSyncExternalStore(subscribeDateTimeConfig, getDateTimeConfig, getDateTimeConfig);
  const resolvedLocale = resolveLocale(locale ?? preferences.locale);
  const hourCycleInUse = hourCycle ?? preferences.hourCycle;
  const styleInUse = style ?? preferences.style;

  return useMemo(() => {
    const { date, time, twelveHour } = getDateTimeFormats({
      locale: resolvedLocale,
      hourCycle: hourCycleInUse,
      style: styleInUse,
    });
    const time12h = twelveHour ? time : 'h:mm A';
    const time24h = twelveHour ? 'HH:mm' : time;
    return {
      locale: resolvedLocale,
      twelveHour,
      // MUI uses the identity of this object to decide when to rebuild the adapter, so it must stay the same between renders.
      dateFormats: {
        keyboardDate: date,
        keyboardDateTime12h: `${date} ${time12h}`,
        keyboardDateTime24h: `${date} ${time24h}`,
        // MUI builds the default time format from these parts; the default hour is zero-padded ("07").
        hours12h: 'h',
        hours24h: 'HH',
        fullTime12h: time12h,
        fullTime24h: time24h,
      },
    };
  }, [resolvedLocale, hourCycleInUse, styleInUse]);
}

/**
 * Wraps MUI X pickers with the Inflow date adapter and display formats, so
 * consumers don't each configure `LocalizationProvider` themselves. Pickers
 * inside it need no `format`, `ampm` or `shouldRespectLeadingZeros` props.
 *
 * It follows `configureDateTime`: props override the configured values, and a change of the configuration updates
 * a mounted provider. When rendering on a server, pass `locale` (the browser language is not known there) and load the
 * same dayjs locales before hydrating, or the markup differs.
 */
export function InflowLocalizationProvider({ children, locale, hourCycle, style }: InflowLocalizationProviderProps) {
  const { locale: resolvedLocale, twelveHour, dateFormats } = useInflowFormats(locale, hourCycle, style);

  // MUI decides the AM/PM clock from the adapter, so the adapter must know about a forced hour cycle.
  const Adapter = useMemo(
    () =>
      class InflowAdapter extends AdapterDayjs {
        constructor(...args: ConstructorParameters<typeof AdapterDayjs>) {
          super(...args);
          this.is12HourCycleInCurrentLocale = () => twelveHour;
        }
      },
    [twelveHour],
  );

  return (
    <InflowPickerTheme>
      <LocalizationProvider
        dateAdapter={Adapter}
        adapterLocale={dayjsLocale(resolvedLocale)}
        dateFormats={dateFormats}
      >
        {children}
      </LocalizationProvider>
    </InflowPickerTheme>
  );
}
