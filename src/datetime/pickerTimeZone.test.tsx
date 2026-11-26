import { useState } from 'react';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTheme, ThemeProvider, type Theme } from '@mui/material/styles';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { usePickerContext } from '@mui/x-date-pickers/hooks';
import dayjs, { type Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { configureDateTime, resetDateTimeConfig } from './formats';
import { InflowLocalizationProvider } from './client';
import { withInflowPickerDefaults } from './withInflowPickerDefaults';

// An app registers these itself: a picker cannot use a time zone without them.
dayjs.extend(utc);
dayjs.extend(timezone);

// 10:30 UTC is 00:30 the next day in Kiritimati (+14) and 05:30 in New York (-5), whatever the host zone is.
const instant = dayjs.utc('2024-01-01T10:30:00Z');

// A picker that is empty starts from "today", and New York is on a different offset in summer, so the date is frozen.
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'], now: new Date('2024-01-15T12:00:00Z') });
});

afterEach(() => {
  vi.useRealTimers();
  resetDateTimeConfig();
});

describe('InflowLocalizationProvider timeZone for time pickers', () => {
  it.each([
    ['Pacific/Kiritimati', '00:30', '1/2/2024 00:30'],
    ['America/New_York', '05:30', '1/1/2024 05:30'],
  ])('shows time and date-time pickers in %s', (zone, clock, dateClock) => {
    renderWithInflow(
      <InflowLocalizationProvider locale="en" hourCycle="24" timeZone={zone}>
        <DesktopTimePicker label="Desktop time" defaultValue={instant} />
        <MobileTimePicker label="Mobile time" defaultValue={instant} />
        <DesktopDateTimePicker label="Desktop date-time" defaultValue={instant} />
        <MobileDateTimePicker label="Mobile date-time" defaultValue={instant} />
      </InflowLocalizationProvider>,
    );

    expect(screen.getAllByDisplayValue(clock)).toHaveLength(2);
    expect(screen.getAllByDisplayValue(dateClock)).toHaveLength(2);
  });

  it('lets a picker timezone prop win over the provider', () => {
    renderWithInflow(
      <InflowLocalizationProvider locale="en" hourCycle="24" timeZone="Pacific/Kiritimati">
        <DesktopTimePicker defaultValue={instant} timezone="UTC" />
      </InflowLocalizationProvider>,
    );

    expect(screen.getByDisplayValue('10:30')).toBeInTheDocument();
  });

  it('follows configureDateTime, and lets the provider prop win over it', () => {
    configureDateTime({ timeZone: 'America/New_York' });
    renderWithInflow(
      <>
        <InflowLocalizationProvider locale="en" hourCycle="24">
          <DesktopTimePicker label="Configured" defaultValue={instant} />
        </InflowLocalizationProvider>
        <InflowLocalizationProvider locale="en" hourCycle="24" timeZone="Pacific/Kiritimati">
          <DesktopTimePicker label="Prop" defaultValue={instant} />
        </InflowLocalizationProvider>
      </>,
    );

    expect(screen.getByDisplayValue('05:30')).toBeInTheDocument();
    expect(screen.getByDisplayValue('00:30')).toBeInTheDocument();
  });

  it('updates a mounted picker that has a value when the configured zone changes', () => {
    configureDateTime({ timeZone: 'Pacific/Kiritimati' });
    renderWithInflow(
      <InflowLocalizationProvider locale="en" hourCycle="24">
        <DesktopTimePicker defaultValue={instant} />
      </InflowLocalizationProvider>,
    );
    expect(screen.getByDisplayValue('00:30')).toBeInTheDocument();

    act(() => configureDateTime({ timeZone: 'America/New_York' }));

    expect(screen.getByDisplayValue('05:30')).toBeInTheDocument();
  });

  it('lets a provider nested in another use a zone of its own, or none', () => {
    renderWithInflow(
      <InflowLocalizationProvider locale="en" hourCycle="24" timeZone="Pacific/Kiritimati">
        <DesktopTimePicker label="Outer" defaultValue={instant} />
        <InflowLocalizationProvider locale="en" hourCycle="24" timeZone="America/New_York">
          <DesktopTimePicker label="Nested" defaultValue={instant} />
        </InflowLocalizationProvider>
        <InflowLocalizationProvider locale="en" hourCycle="24" timeZone="Mars/Olympus">
          <DesktopTimePicker label="Nested without a zone" defaultValue={instant} />
        </InflowLocalizationProvider>
      </InflowLocalizationProvider>,
    );

    expect(screen.getByDisplayValue('00:30')).toBeInTheDocument();
    expect(screen.getByDisplayValue('05:30')).toBeInTheDocument();
    // The nested provider has no usable zone, so its picker infers it from the UTC value instead of the outer zone.
    expect(screen.getByDisplayValue('10:30')).toBeInTheDocument();
  });

  it('keeps a zone a consumer set on the theme over the provider zone', () => {
    const theme = createTheme({ components: { MuiDesktopTimePicker: { defaultProps: { timezone: 'UTC' } } } });
    renderWithInflow(
      <ThemeProvider theme={theme}>
        <InflowLocalizationProvider locale="en" hourCycle="24" timeZone="Pacific/Kiritimati">
          <DesktopTimePicker defaultValue={instant} />
        </InflowLocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.getByDisplayValue('10:30')).toBeInTheDocument();
  });

  it('keeps a consumer zone for a nested provider even when an outer provider has the same zone', () => {
    const theme = createTheme({ components: { MuiDesktopTimePicker: { defaultProps: { timezone: 'Pacific/Kiritimati' } } } });
    renderWithInflow(
      <ThemeProvider theme={theme}>
        <InflowLocalizationProvider locale="en" hourCycle="24" timeZone="Pacific/Kiritimati">
          <InflowLocalizationProvider locale="en" hourCycle="24" timeZone="America/New_York">
            <DesktopTimePicker defaultValue={instant} />
          </InflowLocalizationProvider>
        </InflowLocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.getByDisplayValue('00:30')).toBeInTheDocument();
  });

  it('lets a nested provider use its own zone when a theme is copied between the two providers', () => {
    renderWithInflow(
      <InflowLocalizationProvider locale="en" hourCycle="24" timeZone="Pacific/Kiritimati">
        <ThemeProvider theme={(outer: Theme) => ({ ...outer })}>
          <InflowLocalizationProvider locale="en" hourCycle="24" timeZone="America/New_York">
            <DesktopTimePicker defaultValue={instant} />
          </InflowLocalizationProvider>
        </ThemeProvider>
      </InflowLocalizationProvider>,
    );

    expect(screen.getByDisplayValue('05:30')).toBeInTheDocument();
  });

  it('never converts a date-only picker, so a date does not move to another day', () => {
    renderWithInflow(
      <InflowLocalizationProvider locale="en" timeZone="Pacific/Kiritimati">
        <DesktopDatePicker defaultValue={dayjs('2024-01-01')} />
      </InflowLocalizationProvider>,
    );

    expect(screen.getByDisplayValue('1/1/2024')).toBeInTheDocument();
  });

  it.each(['Mars/Olympus', 'default', 'system', '+05:00', ''])(
    'ignores %j, which is not a time zone, without throwing',
    (zone) => {
      renderWithInflow(
        <InflowLocalizationProvider locale="en" hourCycle="24" timeZone={zone}>
          <DesktopTimePicker defaultValue={instant} />
        </InflowLocalizationProvider>,
      );

      expect(screen.getByDisplayValue('10:30')).toBeInTheDocument();
    },
  );

  it('hands a custom field the zone through the picker context, for time pickers only', () => {
    const zones: Record<string, string> = {};
    const Spy = ({ name }: { name: string }) => {
      zones[name] = usePickerContext().timezone;
      return null;
    };
    renderWithInflow(
      <InflowLocalizationProvider locale="en" timeZone="Pacific/Kiritimati">
        <DesktopTimePicker defaultValue={instant} slots={{ field: Spy }} slotProps={{ field: { name: 'time' } as never }} />
        <DesktopDatePicker defaultValue={instant} slots={{ field: Spy }} slotProps={{ field: { name: 'date' } as never }} />
      </InflowLocalizationProvider>,
    );

    expect(zones.time).toBe('Pacific/Kiritimati');
    expect(zones.date).not.toBe('Pacific/Kiritimati');
  });

  it('writes a typed value in the zone the picker was given', async () => {
    const values: Array<Dayjs | null> = [];
    const user = userEvent.setup();
    renderWithInflow(
      <InflowLocalizationProvider locale="en" hourCycle="24" timeZone="America/New_York">
        <DesktopTimePicker onChange={(value) => values.push(value)} referenceDate={instant} />
      </InflowLocalizationProvider>,
    );

    await user.click(screen.getByRole('spinbutton', { name: 'Hours' }));
    await user.keyboard('{ArrowUp}');
    await user.keyboard('{ArrowRight}{ArrowUp}');

    const typed = values.filter((value): value is Dayjs => value !== null && value.isValid());
    expect(typed.length).toBeGreaterThan(0);
    // New York in January is UTC-5; a stale or missing zone would give +0 (UTC) or the host offset.
    expect(typed[typed.length - 1].utcOffset()).toBe(-300);
  });
  it('writes a typed value in the new zone when a picker is remounted after the zone changes', async () => {
    const values: Array<Dayjs | null> = [];
    const user = userEvent.setup();
    // A picker that is already mounted and empty keeps reading typed input in the zone it mounted with (MUI X keeps
    // its reference value in state), so the supported way to change the zone for it is to remount it with a key.
    function Form() {
      const [zone, setZone] = useState('Pacific/Kiritimati');
      return (
        <>
          <button onClick={() => setZone('America/New_York')}>Switch zone</button>
          <InflowLocalizationProvider locale="en" hourCycle="24" timeZone={zone}>
            <DesktopTimePicker key={zone} onChange={(value) => values.push(value)} referenceDate={instant} />
          </InflowLocalizationProvider>
        </>
      );
    }
    renderWithInflow(<Form />);
    await user.click(screen.getByRole('button', { name: 'Switch zone' }));

    await user.click(screen.getByRole('spinbutton', { name: 'Hours' }));
    await user.keyboard('{ArrowUp}');
    await user.keyboard('{ArrowRight}{ArrowUp}');

    const typed = values.filter((value): value is Dayjs => value !== null && value.isValid());
    expect(typed.length).toBeGreaterThan(0);
    expect(typed[typed.length - 1].utcOffset()).toBe(-300);
  });
});

describe('Inflow picker time zone defaults', () => {
  const keysWithZone = (zone?: string) => {
    const theme = withInflowPickerDefaults({}, [], zone) as { components: Record<string, { defaultProps?: Record<string, unknown> }> };
    return Object.entries(theme.components)
      .filter(([, value]) => value.defaultProps?.timezone !== undefined)
      .map(([key]) => key)
      .sort();
  };

  it('sets the zone on the six time and date-time pickers and on nothing else', () => {
    expect(keysWithZone('Europe/Stockholm')).toEqual([
      'MuiDesktopDateTimePicker',
      'MuiDesktopTimePicker',
      'MuiMobileDateTimePicker',
      'MuiMobileTimePicker',
      'MuiStaticDateTimePicker',
      'MuiStaticTimePicker',
    ]);
  });

  it('sets nothing without a zone, so MUI X keeps inferring it from the value', () => {
    expect(keysWithZone(undefined)).toEqual([]);
  });
});
