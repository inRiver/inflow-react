import { useState } from 'react';
import { Alert, Autocomplete, Box, MenuItem, TextField, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { InflowLocalizationProvider } from '../../datetime';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

// MUI has no character counter: maxLength stops typing at the limit and the count goes in the helper text, right-aligned
// (Material's pattern). The count is an option that only appears when a limit is set; any helper message stays left.
function CharacterLimitField({ limit, label }: { limit?: number; label: string }) {
  const [value, setValue] = useState('Quarterly product catalog update');
  return (
    <TextField
      label={label}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      slotProps={{ htmlInput: { maxLength: limit } }}
      helperText={
        <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <span>Shown on the product page.</span>
          {limit !== undefined && <span>{`${value.length}/${limit}`}</span>}
        </Box>
      }
      sx={{ width: 320 }}
    />
  );
}

const characterLimitCode = `
// Pass a limit to cap the input and show the count. Without one there is no counter.
const limit = 100;
const [value, setValue] = useState('');

<TextField
  label="Description"
  value={value}
  onChange={(event) => setValue(event.target.value)}
  slotProps={{ htmlInput: { maxLength: limit } }}
  helperText={
    <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <span>Shown on the product page.</span>
      <span>{value.length}/{limit}</span>
    </Box>
  }
/>`;

export function TextFieldDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "variant": "outlined",
  "color": "primary",
  "disabled": false,
  "error": false,
  "readOnly": false,
  "size": "small",
  "label": "Label"
});

  const { readOnly, ...interactiveProps } = props;

  const schema: PropSchema[] = [
  {
    "name": "variant",
    "type": "select",
    "options": [
      "outlined",
      "filled",
      "standard"
    ]
  },
  {
    "name": "color",
    "type": "select",
    "options": [
      "primary",
      "secondary",
      "error",
      "info",
      "success",
      "warning"
    ]
  },
  {
    "name": "size",
    "type": "select",
    "options": [
      "small",
      "medium"
    ]
  },
  {
    "name": "disabled",
    "type": "boolean"
  },
  {
    "name": "error",
    "type": "boolean"
  },
  {
    "name": "readOnly",
    "type": "boolean"
  }
];

  const muiCodeExample = `
import { TextField } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<TextField 
  variant={props.variant}
  color={props.color}
  size={props.size}
  disabled={props.disabled}
  error={props.error}
  label="Label"
  slotProps={{ input: { readOnly: props.readOnly } }}
/>`;

  return (
    <>
      <Alert severity="warning" sx={{ mb: 2 }}>
        ThemedTextField is deprecated and will be removed in the next major release. The theme
        already defaults MUI TextField to variant="outlined" and size="small" inside
        InflowProvider, so a plain TextField from @mui/material looks and behaves the same.
      </Alert>

      <DemoFrame title="Text Field - Interactive">
        <TextField
          {...interactiveProps}
          defaultValue="SKU-48213"
          slotProps={{ input: { readOnly: Boolean(readOnly) } }}
        />
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={muiCodeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack direction="row" spacing={2}>
            <TextField label="Default" />
            <TextField label="Disabled" disabled />
            <TextField label="Error" error helperText="Incorrect entry." />
            <TextField label="Focused" focused />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField label="Read only" defaultValue="SKU-48213" slotProps={{ input: { readOnly: true } }} />
            <TextField label="Disabled with value" defaultValue="SKU-48213" disabled />
          </Stack>
        </Stack>
      </DemoFrame>

      <DemoFrame title="Read only - all inputs">
        <InflowLocalizationProvider>
          <Stack spacing={3}>
            <Stack direction="row" useFlexGap spacing={2} sx={{ flexWrap: 'wrap' }}>
              <TextField label="Text" defaultValue="SKU-48213" slotProps={{ input: { readOnly: true } }} />
              <TextField label="Multiline" defaultValue={'Line one\nLine two'} multiline slotProps={{ input: { readOnly: true } }} />
              <TextField label="Select" select defaultValue="draft" slotProps={{ input: { readOnly: true } }} sx={{ width: 200 }}>
                <MenuItem value="draft">Draft</MenuItem>
              </TextField>
              <Autocomplete
                readOnly
                options={['Electronics']}
                defaultValue="Electronics"
                sx={{ width: 200 }}
                renderInput={(params) => <TextField {...params} label="Autocomplete" />}
              />
              <DatePicker label="Date" readOnly defaultValue={null} />
            </Stack>
            <Stack direction="row" useFlexGap spacing={2}>
              <TextField label="Filled" variant="filled" defaultValue="SKU-48213" slotProps={{ input: { readOnly: true } }} />
              <TextField label="Standard" variant="standard" defaultValue="SKU-48213" slotProps={{ input: { readOnly: true } }} />
            </Stack>
          </Stack>
        </InflowLocalizationProvider>
      </DemoFrame>

      <DemoFrame title="Character limit">
        <Stack spacing={3}>
          <CharacterLimitField label="Description (limit 100)" limit={100} />
          <CharacterLimitField label="Notes (no limit)" />
        </Stack>
      </DemoFrame>

      <CodeBlock code={characterLimitCode} language="tsx" />
    </>
  );
}
