import { useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function CheckboxGroupDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    row: false,
    disabled: false,
  });

  const schema: PropSchema[] = [
    {
      name: 'row',
      type: 'boolean',
    },
    {
      name: 'disabled',
      type: 'boolean',
    },
  ];

  const codeExample = `
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<FormGroup row={props.row}>
  <FormControlLabel
    disabled={props.disabled}
    control={<Checkbox defaultChecked disabled={props.disabled} />}
    label="Option 1"
  />
</FormGroup>`;

  return (
    <>
      <DemoFrame title="Checkbox Group - Interactive">
        <FormGroup row={props.row}>
          <FormControlLabel
            disabled={props.disabled}
            control={<Checkbox defaultChecked disabled={props.disabled} />}
            label="React"
          />
          <FormControlLabel
            disabled={props.disabled}
            control={<Checkbox disabled={props.disabled} />}
            label="Vue"
          />
          <FormControlLabel
            disabled={props.disabled}
            control={<Checkbox defaultChecked disabled={props.disabled} />}
            label="Angular"
          />
        </FormGroup>
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked />} label="React" />
              <FormControlLabel control={<Checkbox />} label="Vue" />
              <FormControlLabel control={<Checkbox defaultChecked />} label="Angular" />
              <FormControlLabel control={<Checkbox disabled />} label="Svelte (disabled)" />
            </FormGroup>
            <FormGroup row>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Row layout" />
              <FormControlLabel control={<Checkbox />} label="Option 2" />
              <FormControlLabel control={<Checkbox />} label="Option 3" />
            </FormGroup>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
