import { fireEvent, screen, within } from '@testing-library/react';
import { Autocomplete, TextField } from '@mui/material';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { renderCheckboxOption, renderRadioOption } from './autocompleteOptions';

const options = [{ label: 'Electronics' }, { label: 'Home & garden' }];

describe('autocomplete option helpers', () => {
  it('renderCheckboxOption shows a labelled checkbox on each row and reflects the selection', () => {
    renderWithInflow(
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={options}
        defaultValue={[options[1]]}
        renderOption={renderCheckboxOption}
        renderInput={(params) => <TextField {...params} label="Categories" />}
      />,
    );

    fireEvent.keyDown(screen.getByLabelText('Categories'), { key: 'ArrowDown' });
    const rows = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(rows.map((row) => row.textContent)).toEqual(['Electronics', 'Home & garden']);
    expect(within(rows[0]).getByRole('checkbox')).not.toBeChecked();
    expect(within(rows[1]).getByRole('checkbox')).toBeChecked();
  });

  it('renderRadioOption shows a radio button on each row with the current choice marked', () => {
    renderWithInflow(
      <Autocomplete
        options={options}
        defaultValue={options[0]}
        renderOption={renderRadioOption}
        renderInput={(params) => <TextField {...params} label="Category" />}
      />,
    );

    fireEvent.keyDown(screen.getByLabelText('Category'), { key: 'ArrowDown' });
    const rows = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(within(rows[0]).getByRole('radio')).toBeChecked();
    expect(within(rows[1]).getByRole('radio')).not.toBeChecked();
  });
});
