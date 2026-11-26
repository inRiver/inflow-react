import { useEffect, useState } from 'react';
import { Autocomplete, Box, CircularProgress, Stack, TextField, createFilterOptions } from '@mui/material';
import { renderCheckboxOption, renderRadioOption } from '../../components/themed/autocompleteOptions';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

const topFilms = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Dark Knight', year: 2008 },
  { label: 'Pulp Fiction', year: 1994 },
];

const categories = [
  'Electronics',
  'Clothing & apparel',
  'Clothing accessories',
  'Home & garden',
  'Beauty & personal care',
  'Sports & outdoors',
];

// Options that load when the list opens. `loading` shows the loading text, and a spinner replaces the arrow.
function AsyncAutocomplete() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    if (!loading) return undefined;
    const timer = setTimeout(() => setOptions(categories), 600);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <Autocomplete
      size="small"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      loading={loading}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Category (async)"
          size="small"
          slotProps={{
            // Keep the htmlInput slot: it carries the ref the Autocomplete needs to find the input.
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={16} /> : null}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}

interface CreatableOption {
  label: string;
  /** Set on the "Add ..." row, holding what the user typed. */
  inputValue?: string;
}

const creatableFilter = createFilterOptions<CreatableOption>();
const creatableOptions: CreatableOption[] = categories.map((label) => ({ label }));

// A value that is not in the list can be added: an `Add "..."` row appears while typing.
function CreatableAutocomplete() {
  const [value, setValue] = useState<CreatableOption | null>(null);

  return (
    <Autocomplete
      freeSolo
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      size="small"
      value={value}
      options={creatableOptions}
      sx={{ width: 300 }}
      onChange={(_event, next) => {
        if (typeof next === 'string') setValue({ label: next });
        else if (next?.inputValue) setValue({ label: next.inputValue });
        else setValue(next);
      }}
      filterOptions={(options, params) => {
        const filtered = creatableFilter(options, params);
        const { inputValue } = params;
        if (inputValue !== '' && !options.some((option) => option.label === inputValue)) {
          filtered.push({ inputValue, label: `Add "${inputValue}"` });
        }
        return filtered;
      }}
      getOptionLabel={(option) => (typeof option === 'string' ? option : (option.inputValue ?? option.label))}
      renderOption={(optionProps, option) => {
        const { key, ...rest } = optionProps;
        return (
          <li key={key} {...rest}>
            {option.label}
          </li>
        );
      }}
      renderInput={(params) => <TextField {...params} label="Category (creatable)" size="small" />}
    />
  );
}

export function AutocompleteDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    size: 'small',
    disabled: false,
    multiple: false,
    disableClearable: false,
  });
  const [singleValue, setSingleValue] = useState<(typeof topFilms)[number] | null>(topFilms[0]);
  const [multipleValue, setMultipleValue] = useState<(typeof topFilms)>([topFilms[0], topFilms[2]]);

  const schema: PropSchema[] = [
    {
      name: 'size',
      type: 'select',
      options: ['small', 'medium'],
    },
    {
      name: 'disabled',
      type: 'boolean',
    },
    {
      name: 'multiple',
      type: 'boolean',
    },
    {
      name: 'disableClearable',
      type: 'boolean',
    },
  ];

  const codeExample = `
import { Autocomplete, TextField } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Autocomplete
  options={topFilms}
  size={props.size}
  disabled={props.disabled}
  multiple={props.multiple}
  // In multiple mode, keep the list open while picking and show a checkbox on each row (see the example below).
  disableCloseOnSelect={props.multiple}
  // Hides the clear (X) icon and its functionality. Chips in multiple mode can still be removed individually.
  disableClearable={props.disableClearable}
  renderInput={(params) => <TextField {...params} label="Movie" />}
/>`;

  const controlCode = `
import { Autocomplete, TextField } from '@mui/material';
import { renderCheckboxOption, renderRadioOption } from '@inriver/inflow-react';

// Multi-select with a checkbox on each row. Selected values show as chips in the input.
<Autocomplete
  multiple
  disableCloseOnSelect
  options={categories}
  renderOption={renderCheckboxOption}
  renderInput={(params) => <TextField {...params} label="Categories" />}
/>

// Single-select with a radio button on each row, for a choice that needs an explicit "picked" mark.
<Autocomplete
  options={categories}
  renderOption={renderRadioOption}
  renderInput={(params) => <TextField {...params} label="Category" />}
/>`;

  const moreCode = `
import { Autocomplete, CircularProgress, TextField, createFilterOptions } from '@mui/material';

// Limit tags: collapse extra chips to "+2" while the field is not focused.
<Autocomplete multiple limitTags={2} options={categories} renderInput={(params) => <TextField {...params} label="Categories" />} />

// Loading: set loading while options are fetched; put a spinner in the end adornment.
<Autocomplete
  open={open}
  onOpen={() => setOpen(true)}
  onClose={() => setOpen(false)}
  options={options}
  loading={open && options.length === 0}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Category"
      slotProps={{
        ...params.slotProps,
        input: {
          ...params.slotProps.input,
          endAdornment: (<>{loading ? <CircularProgress color="inherit" size={16} /> : null}{params.slotProps.input.endAdornment}</>),
        },
      }}
    />
  )}
/>

// Disabled options: some entries are shown but cannot be picked.
<Autocomplete options={categories} getOptionDisabled={(option) => unavailable.includes(option)} renderInput={...} />

// Creatable: freeSolo plus an Add "..." row built in filterOptions (see the MUI Autocomplete docs for the full pattern).
<Autocomplete freeSolo selectOnFocus clearOnBlur handleHomeEndKeys filterOptions={addOptionFilter} options={options} renderInput={...} />`;

  return (
    <>
      <DemoFrame title="Autocomplete - Interactive">
        {props.multiple ? (
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={topFilms}
            value={multipleValue}
            disabled={props.disabled}
            disableClearable={props.disableClearable}
            size={props.size}
            sx={{ width: 360 }}
            onChange={(_event, newValue) => setMultipleValue(newValue)}
            renderOption={renderCheckboxOption}
            renderInput={(params) => <TextField {...params} label="Movies" size={props.size} />}
          />
        ) : (
          <Autocomplete
            options={topFilms}
            value={singleValue}
            disabled={props.disabled}
            disableClearable={props.disableClearable}
            size={props.size}
            sx={{ width: 360 }}
            onChange={(_event, newValue) => setSingleValue(newValue)}
            renderInput={(params) => <TextField {...params} label="Movie" size={props.size} />}
          />
        )}
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
            <Box sx={{ width: 240 }}>
              <Autocomplete
                options={topFilms}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Movie" />}
              />
            </Box>
            <Box sx={{ width: 240 }}>
              <Autocomplete
                size="small"
                options={topFilms}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Small" size="small" />}
              />
            </Box>
            <Box sx={{ width: 240 }}>
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={topFilms}
                defaultValue={[topFilms[1]]}
                sx={{ width: '100%' }}
                renderOption={renderCheckboxOption}
                renderInput={(params) => <TextField {...params} label="Multiple" />}
              />
            </Box>
            <Box sx={{ width: 240 }}>
              <Autocomplete
                disableClearable
                options={topFilms}
                defaultValue={topFilms[0]}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="No clear icon" />}
              />
            </Box>
            <Box sx={{ width: 240 }}>
              <Autocomplete
                disabled
                options={topFilms}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Disabled" />}
              />
            </Box>
          </Stack>
        </Stack>
      </DemoFrame>

      <DemoFrame title="Multi-select with checkboxes">
        <Autocomplete
          multiple
          disableCloseOnSelect
          size="small"
          options={categories}
          defaultValue={[categories[0], categories[3]]}
          sx={{ width: 380 }}
          renderOption={renderCheckboxOption}
          renderInput={(params) => <TextField {...params} label="Categories" size="small" />}
        />
      </DemoFrame>

      <DemoFrame title="Single-select with radio buttons">
        <Autocomplete
          size="small"
          options={categories}
          defaultValue={categories[0]}
          sx={{ width: 300 }}
          renderOption={renderRadioOption}
          renderInput={(params) => <TextField {...params} label="Category" size="small" />}
        />
      </DemoFrame>

      <CodeBlock code={controlCode} language="tsx" />

      <DemoFrame title="Limit tags">
        <Autocomplete
          multiple
          disableCloseOnSelect
          limitTags={2}
          size="small"
          options={categories}
          defaultValue={[categories[0], categories[1], categories[3], categories[5]]}
          sx={{ width: 320 }}
          renderOption={renderCheckboxOption}
          renderInput={(params) => <TextField {...params} label="Many categories" size="small" />}
        />
      </DemoFrame>

      <DemoFrame title="Loading (async)">
        <AsyncAutocomplete />
      </DemoFrame>

      <DemoFrame title="Disabled options">
        <Autocomplete
          size="small"
          options={categories}
          getOptionDisabled={(option) => option === categories[4] || option === categories[5]}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Category (some unavailable)" size="small" />}
        />
      </DemoFrame>

      <DemoFrame title="Creatable (free solo)">
        <CreatableAutocomplete />
      </DemoFrame>

      <CodeBlock code={moreCode} language="tsx" />
    </>
  );
}
