import { useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { ThemeContext } from '@emotion/react';
import { useDefaultProps } from '@mui/material/DefaultPropsProvider';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
  dayjsLocale,
  getDateTimeConfig,
  getDateTimeFormats,
  resolveLocale,
  subscribeDateTimeConfig,
  type DateTimeOptions,
} from './formats';
import { isKnownTimeZone } from './format';
import { withInflowPickerDefaults, type PopperModifier } from './withInflowPickerDefaults';

export interface InflowLocalizationProviderProps extends DateTimeOptions {
  children: ReactNode;
}

/**
 * Gives pickers the Inflow defaults through the theme context. MUI X reads its component defaults from the theme, so a
 * patched theme is all they need. A nested `ThemeProvider` would also replace the surrounding default-props, RTL and
 * CSS-variables providers, which is why the context is provided directly.
 */
function InflowPickerTheme({ children, timeZone }: { children: ReactNode; timeZone?: string }) {
  const outer = useContext(ThemeContext);
  // Material reads default props from their own context, which an explicit provider can differ from the theme in.
  const { modifiers } = useDefaultProps({ props: {} as { modifiers?: PopperModifier[] }, name: 'MuiPopper' });
  const theme = useMemo(() => withInflowPickerDefaults(outer, modifiers, timeZone), [outer, modifiers, timeZone]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

// MUI X cannot use a time zone without these dayjs plugins (it throws), and they are the app's to register, so a zone
// is only handed to the pickers once they are there.
const hasZonePlugins = () => {
  const plugins = dayjs as unknown as { utc?: unknown; tz?: unknown };
  return typeof plugins.utc === 'function' && typeof plugins.tz === 'function';
};

/**
 * The resolved locale and the picker formats for it. Every preference is passed to `getDateTimeFormats` explicitly, so
 * the memo is sound, and subscribing re-renders the provider when `configureDateTime` changes one.
 */
function useInflowFormats(
  locale?: string,
  hourCycle?: DateTimeOptions['hourCycle'],
  style?: DateTimeOptions['style'],
  timeZone?: string,
) {
  const preferences = useSyncExternalStore(subscribeDateTimeConfig, getDateTimeConfig, getDateTimeConfig);
  const resolvedLocale = resolveLocale(locale ?? preferences.locale);
  const hourCycleInUse = hourCycle ?? preferences.hourCycle;
  const styleInUse = style ?? preferences.style;
  const zoneInUse = timeZone ?? preferences.timeZone;
  const pickerTimeZone = isKnownTimeZone(zoneInUse) && hasZonePlugins() ? zoneInUse : undefined;

  const formats = useMemo(() => {
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

  return { ...formats, timeZone: pickerTimeZone };
}

/**
 * Wraps MUI X pickers with the Inflow date adapter and display formats, so
 * consumers don't each configure `LocalizationProvider` themselves. Pickers
 * inside it need no `format`, `ampm` or `shouldRespectLeadingZeros` props.
 *
 * It follows `configureDateTime`: props override the configured values, and a change of the configuration updates
 * a mounted provider. When rendering on a server, pass `locale` (the browser language is not known there) and load the
 * same dayjs locales before hydrating, or the markup differs.
 *
 * `timeZone` is the default `timezone` of the time and date-time pickers (a picker's own prop wins), once the app has
 * registered the dayjs `utc` and `timezone` plugins. Date pickers are never converted. A picker that is already mounted
 * and still empty reads what is typed in the zone it had when it mounted, so set the zone before pickers mount.
 */
export function InflowLocalizationProvider({
  children,
  locale,
  hourCycle,
  style,
  timeZone,
}: InflowLocalizationProviderProps) {
  const { locale: resolvedLocale, twelveHour, dateFormats, timeZone: pickerTimeZone } = useInflowFormats(
    locale,
    hourCycle,
    style,
    timeZone,
  );

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
    <InflowPickerTheme timeZone={pickerTimeZone}>
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
