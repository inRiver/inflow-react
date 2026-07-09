import { useState } from 'react';
import { Autocomplete, Box, Stack, TextField } from '@mui/material';
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

export function AutocompleteDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    size: 'medium',
    disabled: false,
    multiple: false,
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
  ];

  const codeExample = `
import { Autocomplete, TextField } from '@mui/material';

<Autocomplete
  options={topFilms}
  size={props.size}
  disabled={props.disabled}
  multiple={props.multiple}
  renderInput={(params) => <TextField {...params} label="Movie" />}
/>`;

  return (
    <>
      <DemoFrame title="Autocomplete - Interactive">
        {props.multiple ? (
          <Autocomplete
            multiple
            options={topFilms}
            value={multipleValue}
            disabled={props.disabled}
            size={props.size}
            sx={{ width: 360 }}
            onChange={(_event, newValue) => setMultipleValue(newValue)}
            renderInput={(params) => <TextField {...params} label="Movies" size={props.size} />}
          />
        ) : (
          <Autocomplete
            options={topFilms}
            value={singleValue}
            disabled={props.disabled}
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
          <Stack direction="row" spacing={2} flexWrap="wrap">
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
                options={topFilms}
                defaultValue={[topFilms[1]]}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Multiple" />}
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
    </>
  );
}
