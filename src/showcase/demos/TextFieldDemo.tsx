import { useState } from 'react';
import { TextField, Stack } from '@mui/material';
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
  "size": "medium",
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

  const codeExample = `
import { TextField } from '@mui/material';

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
      <DemoFrame title="TextField - Interactive">
        <TextField {...props} />
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

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
