import { useState } from 'react';
import { Checkbox, FormControlLabel, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function CheckboxDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    "color": "primary",
    "disabled": false,
    "size": "medium",
    "checked": true,
    "indeterminate": false
  });

  const schema: PropSchema[] = [
    {
      "name": "color",
      "type": "select",
      "options": [
        "primary",
        "secondary",
        "success",
        "error",
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
    },
    {
      "name": "indeterminate",
      "type": "boolean"
    }
  ];

  const codeExample = `
import { Checkbox } from '@mui/material';

<Checkbox 
  color={props.color}
  size={props.size}
  disabled={props.disabled}
  checked={props.checked}
  indeterminate={props.indeterminate}
/>`;

  return (
    <>
      <DemoFrame title="Checkbox - Interactive">
        <FormControlLabel
          label="Label"
          disabled={props.disabled}
          control={
            <Checkbox
              color={props.color}
              size={props.size}
              checked={props.checked}
              indeterminate={props.indeterminate}
              onChange={(e) => setProps({ ...props, checked: e.target.checked })}
            />
          }
        />
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <FormControlLabel control={<Checkbox checked />} label="Checked" />
            <FormControlLabel control={<Checkbox />} label="Unchecked" />
            <FormControlLabel control={<Checkbox indeterminate />} label="Indeterminate" />
            <FormControlLabel disabled control={<Checkbox checked />} label="Disabled checked" />
            <FormControlLabel disabled control={<Checkbox />} label="Disabled unchecked" />
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
