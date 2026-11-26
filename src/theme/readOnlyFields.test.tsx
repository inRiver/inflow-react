import { Autocomplete, MenuItem, Select, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { describe, expect, it } from 'vitest';
import { InflowLocalizationProvider } from '../datetime';
import { renderWithInflow } from '../test/renderWithInflow';

const TINT = 'rgb(241, 246, 254)';
const bg = (selector: string, index = 0) =>
  getComputedStyle(document.querySelectorAll<HTMLElement>(selector)[index]).backgroundColor;

describe('read-only outlined fields', () => {
  it('tints text fields, multiline fields and selects, but not editable ones', () => {
    renderWithInflow(
      <>
        <TextField label="a" slotProps={{ input: { readOnly: true } }} />
        <TextField label="b" multiline slotProps={{ input: { readOnly: true } }} />
        <Select readOnly value="x"><MenuItem value="x">X</MenuItem></Select>
        <TextField label="editable" />
      </>,
    );

    const roots = '.MuiOutlinedInput-root';
    expect(bg(roots, 0)).toBe(TINT);
    expect(bg(roots, 1)).toBe(TINT);
    expect(bg(roots, 2)).toBe(TINT);
    expect(bg(roots, 3)).not.toBe(TINT);
  });

  it('tints a read-only Autocomplete, whose root has no read-only class', () => {
    renderWithInflow(
      <>
        <Autocomplete readOnly options={['a']} value="a" renderInput={(p) => <TextField {...p} label="ro" />} />
        <Autocomplete options={['a']} renderInput={(p) => <TextField {...p} label="editable" />} />
      </>,
    );

    expect(bg('.MuiAutocomplete-root .MuiInputBase-root', 0)).toBe(TINT);
    expect(bg('.MuiAutocomplete-root .MuiInputBase-root', 1)).not.toBe(TINT);
  });

  it('tints a read-only date picker, which uses its own input', () => {
    renderWithInflow(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="ro" readOnly />
        <DatePicker label="editable" />
      </LocalizationProvider>,
    );

    expect(bg('.MuiPickersOutlinedInput-root', 0)).toBe(TINT);
    expect(bg('.MuiPickersOutlinedInput-root', 1)).not.toBe(TINT);
  });

  it('keeps the read-only date picker tint inside InflowLocalizationProvider', () => {
    renderWithInflow(
      <InflowLocalizationProvider>
        <DatePicker label="ro" readOnly />
        <DatePicker label="editable" />
      </InflowLocalizationProvider>,
    );

    expect(bg('.MuiPickersOutlinedInput-root', 0)).toBe(TINT);
    expect(bg('.MuiPickersOutlinedInput-root', 1)).not.toBe(TINT);
  });
});
