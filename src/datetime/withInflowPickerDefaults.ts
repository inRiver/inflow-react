import { THEME_ID, createTheme, type Theme } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { InflowPickerActionBar } from './InflowPickerActionBar.js';
import { flippedGapModifier } from './flippedGapModifier.js';

type Props = Record<string, unknown>;
type SlotProps = Props | ((ownerState: unknown) => Props) | undefined;
export type PopperModifier = { name?: string };

interface ComponentDefaults {
  defaultProps?: Props;
}

// Only the Desktop variants open a popper. The responsive DatePicker, TimePicker and DateTimePicker wrappers forward
// their resolved props, so a default on a wrapper would override a consumer's default for the variant.
const desktopPickers = ['MuiDesktopDatePicker', 'MuiDesktopTimePicker', 'MuiDesktopDateTimePicker'];
// Every picker variant with the field it renders by default. The fields read their own theme defaults, which also
// covers a standalone field. A custom `slots.field` replacement does not render these components, but it receives the
// picker's `slotProps.field`, so the picker variants get the same default there.
const pickerFields: Record<string, string> = {
  MuiDesktopDatePicker: 'MuiDateField',
  MuiMobileDatePicker: 'MuiDateField',
  MuiDesktopTimePicker: 'MuiTimeField',
  MuiMobileTimePicker: 'MuiTimeField',
  MuiDesktopDateTimePicker: 'MuiDateTimeField',
  MuiMobileDateTimePicker: 'MuiDateTimeField',
};
const fields = [...new Set(Object.values(pickerFields))];
// The pickers that show a time. They take the PIM time zone as their default `timezone`. It is set on the picker, not
// on the field: MUI X applies a field's own theme default after the picker's zone, which would override it. Date
// pickers are left out on purpose, because converting a date to another zone can show the day before or after.
const timePickers = [
  'MuiDesktopTimePicker',
  'MuiMobileTimePicker',
  'MuiStaticTimePicker',
  'MuiDesktopDateTimePicker',
  'MuiMobileDateTimePicker',
  'MuiStaticDateTimePicker',
];

let defaultTheme: Theme | undefined;
// Marks a picker default that a provider injected, with the zone it set, so a provider nested below can replace it.
// A default a consumer set carries no marker and always wins. It is a symbol so that MUI, which only copies string keys
// into a component's props, never sees it, and it stays on the default when a theme is copied between providers.
const INJECTED_ZONE = Symbol('inflow.injectedTimeZone');
type ZoneDefaults = Props & { [INJECTED_ZONE]?: string };

// Adds the defaults a consumer left unset. An explicit `undefined` counts as unset, as it does for MUI's own props.
function withDefaults(existing: Props | undefined, defaults: Props): Props {
  const merged = { ...existing };
  for (const [key, value] of Object.entries(defaults)) {
    if (merged[key] === undefined) merged[key] = value;
  }
  return merged;
}

// MUI X spreads `slotProps.popper` instead of calling it, so a function is left to its owner.
function withPopperDefaults(existing: SlotProps, defaults: Props): SlotProps {
  return typeof existing === 'function' ? existing : withDefaults(existing, defaults);
}

// `slotProps.field` is resolved like any slot prop, so a function is called and the defaults are added underneath.
function withFieldDefaults(existing: SlotProps, defaults: Props): SlotProps {
  return typeof existing === 'function'
    ? (ownerState) => withDefaults(existing(ownerState) ?? undefined, defaults)
    : withDefaults(existing, defaults);
}

function addDefaults(theme: Theme, popperModifiers: readonly PopperModifier[], timeZone?: string): Theme {
  const components = { ...theme.components } as Record<string, ComponentDefaults | undefined>;
  const update = (name: string, change: (existing: Props) => Props) => {
    components[name] = { ...components[name], defaultProps: change(components[name]?.defaultProps ?? {}) };
  };

  // The compact action bar goes on the layout that renders it, where a consumer's own layout default still wins.
  // The desktop date-time layout does not read layout defaults, so that picker gets the same bar (or the consumer's
  // layout default) as a picker-level slot.
  const layoutSlots = components.MuiPickersLayout?.defaultProps?.slots as Props | undefined;
  update('MuiPickersLayout', (props) => ({
    ...props,
    slots: { actionBar: InflowPickerActionBar, ...(props.slots as Props | undefined) },
  }));
  update('MuiDesktopDateTimePicker', (props) => ({
    ...props,
    slots: { actionBar: layoutSlots?.actionBar ?? InflowPickerActionBar, ...(props.slots as Props | undefined) },
  }));

  // The popup gap keeps a popup that flips above its field clear of the floating label. It is scoped to pickers: a
  // global Popper default would move every tooltip and menu in the host app. Modifiers a consumer already set for all
  // poppers are kept (an explicit prop would otherwise replace them), and a consumer offset replaces the gap.
  const modifiers = popperModifiers.some(({ name }) => name === 'offset')
    ? popperModifiers
    : [...popperModifiers, flippedGapModifier];
  for (const name of desktopPickers) {
    update(name, (props) => ({
      ...props,
      slotProps: {
        ...(props.slotProps as Props | undefined),
        popper: withPopperDefaults((props.slotProps as Record<string, SlotProps> | undefined)?.popper, { modifiers }),
      },
    }));
  }

  // The Inflow formats ("M/D/YYYY", "h:mm A") have no leading zeros, so the sections must not add them back. The picker
  // gets the value the field default ends up with at this point, so a consumer who turned it off on the field above
  // the provider keeps it off, and a custom field slot receives it as a prop. A theme nested below the provider that
  // sets only the field default does not reach the picker; it sets the picker's `slotProps.field` instead.
  for (const name of fields) update(name, (props) => withDefaults(props, { shouldRespectLeadingZeros: true }));
  for (const [name, field] of Object.entries(pickerFields)) {
    const { shouldRespectLeadingZeros } = components[field]?.defaultProps ?? {};
    update(name, (props) => ({
      ...props,
      slotProps: {
        ...(props.slotProps as Props | undefined),
        field: withFieldDefaults((props.slotProps as Record<string, SlotProps> | undefined)?.field, {
          shouldRespectLeadingZeros,
        }),
      },
    }));
  }

  // A zone the caller has already checked (a known name, with the dayjs plugins registered). Without one, MUI X keeps
  // inferring the zone from the value, so nothing is set. A zone a consumer set on the theme or the picker wins, but
  // one that an outer Inflow provider injected is replaced, so a nested provider can use a zone of its own.
  for (const name of timePickers) {
    const current = components[name]?.defaultProps as ZoneDefaults | undefined;
    const injected = current?.[INJECTED_ZONE];
    if (!timeZone && injected === undefined) continue;
    if (current?.timezone !== undefined && current.timezone !== injected) continue;
    update(name, (props) => {
      const next: ZoneDefaults = { ...props };
      delete next.timezone;
      delete next[INJECTED_ZONE];
      if (timeZone) {
        next.timezone = timeZone;
        next[INJECTED_ZONE] = timeZone;
      }
      return next;
    });
  }

  return { ...theme, components } as Theme;
}

/**
 * Adds the Inflow picker defaults to a theme: the compact action bar, the popup gap and unpadded field sections.
 * They live here, not in the core theme, because the action bar needs MUI X at runtime and the core theme must not
 * load it. Defaults a consumer already set win.
 *
 * `outer` is the raw value of the theme context: a Material theme, a theme scoped under `THEME_ID`, or an empty
 * object when there is no provider (the MUI default theme is used then). `popperModifiers` are the modifiers that
 * apply to every Popper, resolved by the caller because Material reads them from the default-props context. `timeZone`,
 * when given, is the default `timezone` of the time and date-time pickers; the caller has already checked that it is
 * usable.
 */
export function withInflowPickerDefaults(
  outer: object,
  popperModifiers: readonly PopperModifier[] = [],
  timeZone?: string,
): object {
  const base = Object.keys(outer).length === 0 ? (defaultTheme ??= createTheme()) : outer;
  if (THEME_ID in base) {
    const scoped = base as Record<typeof THEME_ID, Theme>;
    return { ...scoped, [THEME_ID]: addDefaults(scoped[THEME_ID], popperModifiers, timeZone) };
  }
  return addDefaults(base as Theme, popperModifiers, timeZone);
}
