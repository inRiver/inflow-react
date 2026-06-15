import { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function SelectDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "variant": "outlined",
  "disabled": false,
  "error": false,
  "size": "medium"
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
import { Select } from '@mui/material';

<Select 
  variant={props.variant}
  size={props.size}
  disabled={props.disabled}
  error={props.error}
/>`;

  return (
    <>
      <DemoFrame title="Select - Interactive">
        
        <FormControl {...props} fullWidth>
          <InputLabel>Age</InputLabel>
          <Select label="Age" value={10}>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
          </Select>
        </FormControl>
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
            <FormControl>
              <InputLabel>Default</InputLabel>
              <Select label="Default" value={10}><MenuItem value={10}>Ten</MenuItem></Select>
            </FormControl>
            <FormControl disabled>
              <InputLabel>Disabled</InputLabel>
              <Select label="Disabled" value={10}><MenuItem value={10}>Ten</MenuItem></Select>
            </FormControl>
            <FormControl error>
              <InputLabel>Error</InputLabel>
              <Select label="Error" value={10}><MenuItem value={10}>Ten</MenuItem></Select>
            </FormControl>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
