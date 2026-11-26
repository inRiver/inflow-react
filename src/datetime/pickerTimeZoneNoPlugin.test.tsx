import { screen } from '@testing-library/react';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import dayjs from 'dayjs';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { configureDateTime, resetDateTimeConfig } from './formats';
import { InflowLocalizationProvider } from './InflowLocalizationProvider';

// This file deliberately does not register the dayjs `timezone` plugin. Apps set a zone for their tables, and a picker
// that threw because the plugin is missing would break every one of them that did not also set pickers up for zones.
afterEach(resetDateTimeConfig);

describe('InflowLocalizationProvider timeZone without the dayjs timezone plugin', () => {
  it('leaves the pickers alone, for a prop and for the configured zone, instead of throwing', () => {
    expect((dayjs as unknown as { tz?: unknown }).tz).toBeUndefined();
    configureDateTime({ timeZone: 'Pacific/Kiritimati' });
    const value = dayjs('2024-01-01T07:30:00');

    renderWithInflow(
      <>
        <InflowLocalizationProvider locale="en">
          <DesktopTimePicker label="Configured" defaultValue={value} />
        </InflowLocalizationProvider>
        <InflowLocalizationProvider locale="en" timeZone="America/New_York">
          <DesktopDateTimePicker label="Prop" defaultValue={value} />
        </InflowLocalizationProvider>
      </>,
    );

    expect(screen.getByDisplayValue('7:30 AM')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1/1/2024 7:30 AM')).toBeInTheDocument();
  });
});
