import { useState } from 'react';
import { Alert, TextField, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function TextFieldDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "variant": "outlined",
  "color": "primary",
  "disabled": false,
  "error": false,
  "size": "small",
  "label": "Label"
});

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
/>`;

  return (
    <>
      <Alert severity="warning" sx={{ mb: 2 }}>
        ThemedTextField is deprecated and will be removed in the next major release. The theme
        already defaults MUI TextField to variant="outlined" and size="small" inside
        InflowProvider, so a plain TextField from @mui/material looks and behaves the same.
      </Alert>

      <DemoFrame title="Text Field - Interactive">
        <TextField {...props} />
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
        </Stack>
      </DemoFrame>
    </>
  );
}
