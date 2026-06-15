import { useState } from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function RadioDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "color": "primary",
  "disabled": false,
  "size": "medium"
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
  }
];

  const codeExample = `
import { Radio } from '@mui/material';

<Radio 
  color={props.color}
  size={props.size}
  disabled={props.disabled}
/>`;

  return (
    <>
      <DemoFrame title="Radio - Interactive">
        
        <FormControl>
          <FormLabel>Gender</FormLabel>
          <RadioGroup defaultValue="female" row>
            <FormControlLabel value="female" control={<Radio {...props} />} label="Female" />
            <FormControlLabel value="male" control={<Radio {...props} />} label="Male" />
          </RadioGroup>
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
            <FormControlLabel control={<Radio checked />} label="Checked" />
            <FormControlLabel control={<Radio />} label="Unchecked" />
            <FormControlLabel control={<Radio checked disabled />} label="Disabled Checked" />
            <FormControlLabel control={<Radio disabled />} label="Disabled Unchecked" />
            <FormControlLabel control={<Radio checked color="error" />} label="Error color" />
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
