import { createRef, type Ref, type RefObject } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import Autocomplete from '@mui/material/Autocomplete';
import DefaultPropsProvider from '@mui/material/DefaultPropsProvider';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import type { PopperProps } from '@mui/material/Popper';
import { createTheme, ThemeProvider, type Theme } from '@mui/material/styles';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import { createInflowTheme } from '../theme';
import { renderWithInflow } from '../test/renderWithInflow';
import { POPPER_FLIPPED_GAP } from './flippedGapModifier';
import { InflowLocalizationProvider } from './InflowLocalizationProvider';

const value = dayjs('2024-01-01T07:30');

type PopperInstance = NonNullable<PopperProps['popperRef']> extends Ref<infer Instance> ? Instance : never;

// The offset the popper was actually created with: our gap function, or Popper's own default.
const offsetOf = (popper: RefObject<PopperInstance | null>) =>
  popper.current?.state.orderedModifiers.find(({ name }) => name === 'offset')?.options?.offset;

describe('InflowLocalizationProvider field defaults', () => {
  it('shows bare pickers in the Inflow formats without any field props', () => {
    renderWithInflow(
      <InflowLocalizationProvider>
        <DesktopDatePicker label="Date" defaultValue={value} />
        <DesktopTimePicker label="Time" defaultValue={value} />
        <DesktopDateTimePicker label="Both" defaultValue={value} />
      </InflowLocalizationProvider>,
    );

    expect(screen.getByDisplayValue('1/1/2024')).toBeInTheDocument();
    expect(screen.getByDisplayValue('7:30 AM')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1/1/2024 7:30 AM')).toBeInTheDocument();
  });

  it('shows a standalone date-time field in the Inflow format in both clocks', () => {
    renderWithInflow(
      <>
        <InflowLocalizationProvider>
          <DateTimeField label="12 hour" defaultValue={value} />
        </InflowLocalizationProvider>
        <InflowLocalizationProvider locale="en" hourCycle="24">
          <DateTimeField label="24 hour" defaultValue={value} />
        </InflowLocalizationProvider>
      </>,
    );

    expect(screen.getByDisplayValue('1/1/2024 7:30 AM')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1/1/2024 07:30')).toBeInTheDocument();
  });

  it('lets a picker prop turn leading zeros back on', () => {
    renderWithInflow(
      <InflowLocalizationProvider>
        <DesktopDatePicker defaultValue={value} slotProps={{ field: { shouldRespectLeadingZeros: false } }} />
      </InflowLocalizationProvider>,
    );

    expect(screen.getByDisplayValue('01/01/2024')).toBeInTheDocument();
  });

  it('keeps a field default a consumer theme sets, also for the field inside a picker', () => {
    const theme = createTheme({ components: { MuiDateField: { defaultProps: { shouldRespectLeadingZeros: false } } } });
    renderWithInflow(
      <ThemeProvider theme={theme}>
        <InflowLocalizationProvider>
          <DesktopDatePicker defaultValue={value} />
        </InflowLocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.getByDisplayValue('01/01/2024')).toBeInTheDocument();
  });

  it('keeps a consumer theme field callback and still adds the Inflow default', () => {
    const theme = createTheme({
      components: {
        MuiDesktopTimePicker: { defaultProps: { slotProps: { field: () => ({ 'data-custom': 'yes' }) } } },
      },
    });
    const { container } = renderWithInflow(
      <ThemeProvider theme={theme}>
        <InflowLocalizationProvider>
          <DesktopTimePicker defaultValue={value} />
        </InflowLocalizationProvider>
      </ThemeProvider>,
    );

    expect(container.querySelector('[data-custom="yes"]')).not.toBeNull();
    expect(screen.getByDisplayValue('7:30 AM')).toBeInTheDocument();
  });
});

describe('InflowLocalizationProvider field defaults for a custom field slot', () => {
  // A replacement field that does not render MUI's field components, so only the props the picker passes reach it.
  const received: Array<Record<string, unknown>> = [];
  const SpyField = (props: Record<string, unknown>) => {
    received.push(props);
    return null;
  };
  const lastProps = () => received[received.length - 1];

  it.each([
    ['date', DesktopDatePicker],
    ['time', DesktopTimePicker],
    ['date-time', DesktopDateTimePicker],
    ['mobile date', MobileDatePicker],
    ['mobile time', MobileTimePicker],
    ['mobile date-time', MobileDateTimePicker],
  ])('hands a %s picker field the unpadded-sections default as a prop', (_name, Picker) => {
    received.length = 0;
    renderWithInflow(
      <InflowLocalizationProvider>
        <Picker defaultValue={value} slots={{ field: SpyField }} />
      </InflowLocalizationProvider>,
    );

    expect(lastProps().shouldRespectLeadingZeros).toBe(true);
  });

  it('lets a picker prop, in object or function form, change the default', () => {
    received.length = 0;
    renderWithInflow(
      <InflowLocalizationProvider>
        <DesktopDatePicker defaultValue={value} slots={{ field: SpyField }} slotProps={{ field: { shouldRespectLeadingZeros: false } }} />
      </InflowLocalizationProvider>,
    );
    expect(lastProps().shouldRespectLeadingZeros).toBe(false);

    received.length = 0;
    renderWithInflow(
      <InflowLocalizationProvider>
        <DesktopDatePicker
          defaultValue={value}
          slots={{ field: SpyField }}
          slotProps={{ field: () => ({ 'data-custom': 'yes' }) }}
        />
      </InflowLocalizationProvider>,
    );
    expect(lastProps()).toMatchObject({ shouldRespectLeadingZeros: true, 'data-custom': 'yes' });
  });

  it('follows a field default a consumer theme sets', () => {
    received.length = 0;
    const theme = createTheme({ components: { MuiDateField: { defaultProps: { shouldRespectLeadingZeros: false } } } });
    renderWithInflow(
      <ThemeProvider theme={theme}>
        <InflowLocalizationProvider>
          <DesktopDatePicker defaultValue={value} slots={{ field: SpyField }} />
        </InflowLocalizationProvider>
      </ThemeProvider>,
    );

    expect(lastProps().shouldRespectLeadingZeros).toBe(false);
  });

  it('keeps the default when a consumer field theme default leaves it undefined', () => {
    received.length = 0;
    const theme = createTheme({ components: { MuiDateField: { defaultProps: { shouldRespectLeadingZeros: undefined } } } });
    renderWithInflow(
      <ThemeProvider theme={theme}>
        <InflowLocalizationProvider>
          <DesktopDatePicker label="Date" defaultValue={value} slots={{ field: SpyField }} />
          <DateField label="Standalone" defaultValue={value} />
        </InflowLocalizationProvider>
      </ThemeProvider>,
    );

    expect(lastProps().shouldRespectLeadingZeros).toBe(true);
    expect(screen.getByDisplayValue('1/1/2024')).toBeInTheDocument();
  });

  it.each([
    ['an object', { shouldRespectLeadingZeros: undefined, 'data-custom': 'yes' }],
    ['a callback', () => ({ shouldRespectLeadingZeros: undefined, 'data-custom': 'yes' })],
  ])('keeps the default when a consumer picker theme default leaves it undefined in %s', (_name, field) => {
    received.length = 0;
    const theme = createTheme({ components: { MuiDesktopDatePicker: { defaultProps: { slotProps: { field } } } } });
    renderWithInflow(
      <ThemeProvider theme={theme}>
        <InflowLocalizationProvider>
          <DesktopDatePicker defaultValue={value} slots={{ field: SpyField }} />
        </InflowLocalizationProvider>
      </ThemeProvider>,
    );

    expect(lastProps()).toMatchObject({ shouldRespectLeadingZeros: true, 'data-custom': 'yes' });
  });

  it('lets a consumer picker theme default turn it off for a theme nested below the provider', () => {
    received.length = 0;
    const nested = createTheme({
      components: { MuiDesktopDatePicker: { defaultProps: { slotProps: { field: { shouldRespectLeadingZeros: false } } } } },
    });
    renderWithInflow(
      <InflowLocalizationProvider>
        <ThemeProvider theme={(outer: Theme) => ({ ...outer, components: { ...outer.components, ...nested.components } })}>
          <DesktopDatePicker defaultValue={value} slots={{ field: SpyField }} />
        </ThemeProvider>
      </InflowLocalizationProvider>,
    );

    expect(lastProps().shouldRespectLeadingZeros).toBe(false);
  });
});

describe('Inflow picker popup gap', () => {
  const openTimePicker = () => fireEvent.click(screen.getByRole('button', { name: /choose time/i }));

  it('is applied to picker popups only', () => {
    const popper = createRef<PopperInstance>();
    renderWithInflow(
      <InflowLocalizationProvider>
        <DesktopTimePicker defaultValue={value} slotProps={{ popper: { popperRef: popper } }} />
      </InflowLocalizationProvider>,
    );
    openTimePicker();

    const offset = offsetOf(popper) as (arg: { placement?: string }) => number[];
    expect(offset({ placement: 'top-start' })).toEqual([0, POPPER_FLIPPED_GAP]);
    expect(offset({ placement: 'bottom-start' })).toEqual([0, 0]);
  });

  it('is replaced by modifiers a picker prop supplies', () => {
    const popper = createRef<PopperInstance>();
    renderWithInflow(
      <InflowLocalizationProvider>
        <DesktopTimePicker defaultValue={value} slotProps={{ popper: { popperRef: popper, modifiers: [] } }} />
      </InflowLocalizationProvider>,
    );
    openTimePicker();

    expect(typeof offsetOf(popper)).not.toBe('function');
  });

  it('keeps modifiers a consumer theme sets for every popper', () => {
    const theme = createTheme({
      components: { MuiPopper: { defaultProps: { modifiers: [{ name: 'flip', enabled: false }] } } },
    });
    const popper = createRef<PopperInstance>();
    renderWithInflow(
      <ThemeProvider theme={theme}>
        <InflowLocalizationProvider>
          <DesktopTimePicker defaultValue={value} slotProps={{ popper: { popperRef: popper } }} />
        </InflowLocalizationProvider>
      </ThemeProvider>,
    );
    openTimePicker();

    // Popper drops a disabled modifier from its ordered list, while `flip` is always there by default.
    expect(popper.current?.state.orderedModifiers.some(({ name }) => name === 'flip')).toBe(false);
    expect(typeof offsetOf(popper)).toBe('function');
  });

  it('keeps modifiers a default-props provider sets for every popper', () => {
    const popper = createRef<PopperInstance>();
    renderWithInflow(
      <DefaultPropsProvider value={{ MuiPopper: { modifiers: [{ name: 'flip', enabled: false }] } }}>
        <InflowLocalizationProvider>
          <DesktopTimePicker defaultValue={value} slotProps={{ popper: { popperRef: popper } }} />
        </InflowLocalizationProvider>
      </DefaultPropsProvider>,
    );
    openTimePicker();

    expect(popper.current?.state.orderedModifiers.some(({ name }) => name === 'flip')).toBe(false);
    expect(typeof offsetOf(popper)).toBe('function');
  });

  it('leaves tooltips and autocompletes alone', () => {
    expect(createInflowTheme('light').components?.MuiPopper).toBeUndefined();

    const tooltip = createRef<PopperInstance>();
    renderWithInflow(
      <Tooltip open placement="top" title="Hint" slotProps={{ popper: { popperRef: tooltip } }}>
        <button type="button">Anchor</button>
      </Tooltip>,
    );
    expect(typeof offsetOf(tooltip)).not.toBe('function');

    const listbox = createRef<PopperInstance>();
    renderWithInflow(
      <Autocomplete
        open
        options={['One']}
        renderInput={(params) => <TextField {...params} label="Options" />}
        slotProps={{ popper: { popperRef: listbox } }}
      />,
    );
    expect(typeof offsetOf(listbox)).not.toBe('function');
  });
});

describe('Inflow picker action bar styling', () => {
  const openTimePicker = () => fireEvent.click(screen.getByRole('button', { name: /choose time/i }));

  it('also styles the action bar of the desktop date-time picker', () => {
    renderWithInflow(
      <InflowLocalizationProvider>
        <DesktopDateTimePicker defaultValue={value} />
      </InflowLocalizationProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /choose date/i }));

    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass('MuiButton-outlined', 'MuiButton-sizeSmall');
    expect(screen.getByRole('button', { name: 'OK' })).toHaveClass('MuiButton-contained', 'MuiButton-sizeSmall');
  });

  it('keeps the compact layout and composes a consumer sx on top', () => {
    renderWithInflow(
      <InflowLocalizationProvider>
        <DesktopTimePicker
          defaultValue={value}
          slotProps={{ actionBar: { sx: { backgroundColor: 'rgb(1, 2, 3)' } } }}
        />
      </InflowLocalizationProvider>,
    );
    openTimePicker();

    const bar = screen.getByRole('button', { name: 'OK' }).parentElement as HTMLElement;
    expect(bar).toHaveStyle({ paddingLeft: '8px', backgroundColor: 'rgb(1, 2, 3)' });
  });

  it('lets a theme override of the layout action bar change the compact layout', () => {
    const theme = createTheme({ components: { MuiPickersLayout: { styleOverrides: { actionBar: { paddingLeft: 20 } } } } });
    renderWithInflow(
      <ThemeProvider theme={theme}>
        <InflowLocalizationProvider>
          <DesktopTimePicker defaultValue={value} />
        </InflowLocalizationProvider>
      </ThemeProvider>,
    );
    openTimePicker();

    const bar = screen.getByRole('button', { name: 'OK' }).parentElement as HTMLElement;
    expect(bar).toHaveStyle({ paddingLeft: '20px' });
  });

  it('keeps a layout default a consumer theme sets for the action bar', () => {
    const theme = createTheme({
      components: { MuiPickersLayout: { defaultProps: { slots: { actionBar: () => <div>layout action bar</div> } } } },
    });
    renderWithInflow(
      <ThemeProvider theme={theme}>
        <InflowLocalizationProvider>
          <DesktopTimePicker defaultValue={value} />
          <DesktopDateTimePicker defaultValue={value} />
        </InflowLocalizationProvider>
      </ThemeProvider>,
    );
    openTimePicker();
    expect(screen.getByText('layout action bar')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /choose date/i }));

    expect(screen.getAllByText('layout action bar')).toHaveLength(2);
  });

  it('keeps the spacing between buttons unless the picker turns it off', () => {
    renderWithInflow(
      <InflowLocalizationProvider>
        <DesktopTimePicker defaultValue={value} slotProps={{ actionBar: { disableSpacing: true } }} />
      </InflowLocalizationProvider>,
    );
    openTimePicker();

    const bar = screen.getByRole('button', { name: 'OK' }).parentElement as HTMLElement;
    expect(getComputedStyle(bar).gap).toBe('0px');
  });

  it('spaces the buttons by default', () => {
    renderWithInflow(
      <InflowLocalizationProvider>
        <DesktopTimePicker defaultValue={value} />
      </InflowLocalizationProvider>,
    );
    openTimePicker();

    const bar = screen.getByRole('button', { name: 'OK' }).parentElement as HTMLElement;
    expect(getComputedStyle(bar).gap).toBe('8px');
  });
});
