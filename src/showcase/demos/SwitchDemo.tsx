import { useState } from 'react';
import { Switch, FormControlLabel, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function SwitchDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "color": "primary",
  "disabled": false,
  "size": "medium",
  "checked": true
});

  const schema: PropSchema[] = [
  {
    "name": "color",
    "type": "select",
    "options": [
      "primary",
      "secondary",
      "error",
      "info",
      "success",
      "warning",
      "default"
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
    "name": "checked",
    "type": "boolean"
  }
];

  const codeExample = `
import { Switch } from '@mui/material';

<Switch 
  color={props.color}
  size={props.size}
  disabled={props.disabled}
  checked={props.checked}
/>`;

  return (
    <>
      <DemoFrame title="Switch - Interactive">
        <FormControlLabel control={<Switch {...props} />} label="Label" />
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
            <FormControlLabel control={<Switch checked />} label="Checked" />
            <FormControlLabel control={<Switch />} label="Unchecked" />
            <FormControlLabel control={<Switch checked disabled />} label="Disabled Checked" />
            <FormControlLabel control={<Switch disabled />} label="Disabled Unchecked" />
            <FormControlLabel control={<Switch checked color="error" />} label="Error color" />
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
