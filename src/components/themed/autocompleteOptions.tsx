import type { HTMLAttributes, Key, ReactNode } from 'react';
import { Checkbox, Radio } from '@mui/material';
import type { AutocompleteRenderOptionState } from '@mui/material/Autocomplete';

type OptionProps = HTMLAttributes<HTMLLIElement> & { key: Key };
type OptionOwnerState<Value> = { getOptionLabel: (option: Value) => string };

function renderControlOption<Value>(
  control: 'checkbox' | 'radio',
  { key, ...optionProps }: OptionProps,
  option: Value,
  { selected }: AutocompleteRenderOptionState,
  ownerState: OptionOwnerState<Value>,
): ReactNode {
  // The row handles the click; the control only shows the state, so it is out of the tab order and not clickable.
  const controlProps = { size: 'small', checked: selected, tabIndex: -1, disableRipple: true, sx: { pointerEvents: 'none' } } as const;
  return (
    <li key={key} {...optionProps}>
      {control === 'checkbox' ? <Checkbox {...controlProps} /> : <Radio {...controlProps} />}
      {ownerState.getOptionLabel(option)}
    </li>
  );
}

/**
 * `renderOption` for Autocomplete that shows a checkbox on each row. Use it for multi-select lists, with
 * `multiple` and `disableCloseOnSelect`: `<Autocomplete multiple disableCloseOnSelect renderOption={renderCheckboxOption} />`.
 * Selected values show as chips in the input (library-facing).
 */
export function renderCheckboxOption<Value>(
  optionProps: OptionProps,
  option: Value,
  state: AutocompleteRenderOptionState,
  ownerState: OptionOwnerState<Value>,
): ReactNode {
  return renderControlOption('checkbox', optionProps, option, state, ownerState);
}

/**
 * `renderOption` for Autocomplete that shows a radio button on each row, for a single choice that needs an
 * explicit "picked" mark: `<Autocomplete renderOption={renderRadioOption} />`.
 */
export function renderRadioOption<Value>(
  optionProps: OptionProps,
  option: Value,
  state: AutocompleteRenderOptionState,
  ownerState: OptionOwnerState<Value>,
): ReactNode {
  return renderControlOption('radio', optionProps, option, state, ownerState);
}
