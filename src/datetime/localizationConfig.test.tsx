import { act, fireEvent, screen } from '@testing-library/react';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/zh-tw';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { configureDateTime, dayjsLocale, resetDateTimeConfig } from './formats';
import { formatDate, formatTime } from './format';
import { InflowLocalizationProvider } from './InflowLocalizationProvider';

const time = dayjs('2024-01-01T07:30');
const january = dayjs('2024-01-15');

afterEach(() => {
  resetDateTimeConfig();
  vi.unstubAllGlobals();
});

const openCalendar = () => fireEvent.click(screen.getByRole('button', { name: /choose date/i }));

describe('InflowLocalizationProvider and configureDateTime', () => {
  it('updates a mounted provider when the preferences change', () => {
    renderWithInflow(
      <InflowLocalizationProvider>
        <DesktopTimePicker defaultValue={time} />
      </InflowLocalizationProvider>,
    );
    expect(screen.getByDisplayValue('7:30 AM')).toBeInTheDocument();

    act(() => configureDateTime({ hourCycle: '24' }));

    expect(screen.getByDisplayValue('07:30')).toBeInTheDocument();
  });

  it('lets props override the configured preferences', () => {
    configureDateTime({ hourCycle: '24' });
    renderWithInflow(
      <InflowLocalizationProvider hourCycle="12">
        <DesktopTimePicker defaultValue={time} />
      </InflowLocalizationProvider>,
    );

    expect(screen.getByDisplayValue('7:30 AM')).toBeInTheDocument();
  });

  it('honors the hour cycle in a locale tag', () => {
    renderWithInflow(
      <InflowLocalizationProvider locale="en-US-u-hc-h23">
        <DesktopTimePicker defaultValue={time} />
      </InflowLocalizationProvider>,
    );

    expect(screen.getByDisplayValue('07:30')).toBeInTheDocument();
  });

  it('uses the same locale for the formats and the calendar names, from a prop or from the configuration', () => {
    renderWithInflow(
      <InflowLocalizationProvider locale="de">
        <DesktopDatePicker defaultValue={january} />
      </InflowLocalizationProvider>,
    );
    expect(screen.getByDisplayValue('15.01.2024')).toBeInTheDocument();
    openCalendar();
    expect(screen.getByText('Januar 2024')).toBeInTheDocument();
  });

  it('follows a locale set with configureDateTime', () => {
    configureDateTime({ locale: 'de' });
    renderWithInflow(
      <InflowLocalizationProvider>
        <DesktopDatePicker defaultValue={january} />
      </InflowLocalizationProvider>,
    );
    openCalendar();

    expect(screen.getByText('Januar 2024')).toBeInTheDocument();
  });

  it('keeps English calendar names for a locale dayjs has not loaded', () => {
    renderWithInflow(
      <InflowLocalizationProvider locale="pl">
        <DesktopDatePicker defaultValue={january} />
      </InflowLocalizationProvider>,
    );
    expect(screen.getByDisplayValue('15.01.2024')).toBeInTheDocument();
    openCalendar();

    expect(screen.getByText('January 2024')).toBeInTheDocument();
  });

  it('does not depend on the browser language when a locale is given', () => {
    vi.stubGlobal('navigator', { language: 'de-DE' });
    renderWithInflow(
      <InflowLocalizationProvider locale="en">
        <DesktopTimePicker defaultValue={time} />
      </InflowLocalizationProvider>,
    );

    expect(screen.getByDisplayValue('7:30 AM')).toBeInTheDocument();
  });

  it('accepts a timeZone prop and uses it for the time pickers, not for the formatters', () => {
    renderWithInflow(
      <InflowLocalizationProvider locale="en" timeZone="UTC">
        <DesktopTimePicker defaultValue={time} />
      </InflowLocalizationProvider>,
    );

    // Without the dayjs timezone plugin a zone is not handed to the pickers, so the host-local value shows as it is.
    expect(screen.getByDisplayValue('7:30 AM')).toBeInTheDocument();
  });
});

describe('dayjs locale for a picker calendar', () => {
  it('keeps English month names and AM/PM in a table even when the app has loaded the locale', () => {
    expect(formatDate('2024-01-15', { locale: 'de', style: 'unambiguous' })).toBe('15 Jan 2024');
    expect(formatTime('2024-01-15T16:30:00', { locale: 'de', hourCycle: '12' })).toBe('4:30 PM');
  });

  it.each([
    ['de', 'de'],
    ['de-AT', 'de'],
    ['zh-Hant-TW', 'zh-tw'],
    ['zh-TW', 'zh-tw'],
    ['zh-Hant-HK', 'en'],
    ['pl', 'en'],
    ['en-GB', 'en'],
  ])('uses the loaded dayjs locale for %s: %s', (locale, expected) => {
    expect(dayjsLocale(locale)).toBe(expected);
  });
});
