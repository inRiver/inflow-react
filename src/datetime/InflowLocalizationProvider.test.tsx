import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@mui/material/Button';
import DefaultPropsProvider from '@mui/material/DefaultPropsProvider';
import { createTheme, ThemeProvider, THEME_ID } from '@mui/material/styles';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import dayjs from 'dayjs';
import { afterEach, describe, expect, it } from 'vitest';
import { createInflowTheme } from '../theme';
import { renderWithInflow } from '../test/renderWithInflow';
import { InflowLocalizationProvider } from './client';

const value = dayjs('2024-01-01T07:30');
const openPicker = () => fireEvent.click(screen.getByRole('button', { name: /choose time/i }));

function CustomActionBar() {
  return <div>custom action bar</div>;
}

describe('InflowLocalizationProvider picker slots', () => {
  it('gives pickers the compact Inflow action bar', () => {
    renderWithInflow(
      <InflowLocalizationProvider>
        <DesktopTimePicker defaultValue={value} />
      </InflowLocalizationProvider>,
    );
    openPicker();

    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass('MuiButton-outlined', 'MuiButton-sizeSmall');
    expect(screen.getByRole('button', { name: 'OK' })).toHaveClass('MuiButton-contained', 'MuiButton-sizeSmall');
  });

  it('renders without any surrounding theme provider', () => {
    render(
      <InflowLocalizationProvider>
        <DesktopTimePicker defaultValue={value} />
      </InflowLocalizationProvider>,
    );
    openPicker();

    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass('MuiButton-sizeSmall');
  });

  it('lets a consumer theme replace the action bar', () => {
    const theme = createTheme({
      components: { MuiDesktopTimePicker: { defaultProps: { slots: { actionBar: CustomActionBar } } } },
    });
    render(
      <ThemeProvider theme={theme}>
        <InflowLocalizationProvider>
          <DesktopTimePicker defaultValue={value} />
        </InflowLocalizationProvider>
      </ThemeProvider>,
    );
    openPicker();

    expect(screen.getByText('custom action bar')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('lets a picker prop replace the action bar', () => {
    renderWithInflow(
      <InflowLocalizationProvider>
        <DesktopTimePicker defaultValue={value} slots={{ actionBar: CustomActionBar }} />
      </InflowLocalizationProvider>,
    );
    openPicker();

    expect(screen.getByText('custom action bar')).toBeInTheDocument();
  });

  it('keeps the theme defaults of a scoped Material theme', () => {
    render(
      <ThemeProvider theme={{ [THEME_ID]: createInflowTheme('light') }}>
        <InflowLocalizationProvider>
          <DesktopTimePicker defaultValue={value} />
        </InflowLocalizationProvider>
      </ThemeProvider>,
    );
    openPicker();

    // The Inflow action bar is applied, and the scoped theme's default contained Button still reaches it.
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass('MuiButton-sizeSmall');
    expect(screen.getByRole('button', { name: 'OK' })).toHaveClass('MuiButton-contained');
  });

  it('leaves a surrounding default-props provider in charge', () => {
    renderWithInflow(
      <DefaultPropsProvider value={{ MuiButton: { variant: 'outlined' } }}>
        <InflowLocalizationProvider>
          <Button>Plain</Button>
        </InflowLocalizationProvider>
      </DefaultPropsProvider>,
    );

    expect(screen.getByRole('button', { name: 'Plain' })).toHaveClass('MuiButton-outlined');
  });

  describe('inside a CSS-variables theme', () => {
    afterEach(() => {
      document.documentElement.removeAttribute('data-dark');
      document.documentElement.removeAttribute('data-light');
      localStorage.clear();
    });

    it('does not reset the active color scheme', () => {
      const theme = createTheme({ cssVariables: { colorSchemeSelector: 'data' }, colorSchemes: { dark: true } });
      render(
        <ThemeProvider theme={theme} defaultMode="dark">
          <InflowLocalizationProvider>
            <DesktopTimePicker defaultValue={value} />
          </InflowLocalizationProvider>
        </ThemeProvider>,
      );
      openPicker();
      expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass('MuiButton-sizeSmall');
      expect(document.documentElement).toHaveAttribute('data-dark');
      expect(document.documentElement).not.toHaveAttribute('data-light');
    });
  });
});
