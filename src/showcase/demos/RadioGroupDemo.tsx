import { useState } from 'react';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function RadioGroupDemo() {
  const [value, setValue] = useState('female');
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
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';

<RadioGroup
  row={props.row}
  value={value}
  onChange={(event) => setValue(event.target.value)}
>
  <FormControlLabel disabled={props.disabled} value="female" control={<Radio />} label="Female" />
</RadioGroup>`;

  return (
    <>
      <DemoFrame title="Radio Group - Interactive">
        <FormControl disabled={props.disabled}>
          <FormLabel>Gender</FormLabel>
          <RadioGroup row={props.row} value={value} onChange={(event) => setValue(event.target.value)}>
            <FormControlLabel disabled={props.disabled} value="female" control={<Radio />} label="Female" />
            <FormControlLabel disabled={props.disabled} value="male" control={<Radio />} label="Male" />
            <FormControlLabel disabled={props.disabled} value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </FormControl>
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Stack direction="row" spacing={4} flexWrap="wrap">
            <FormControl>
              <FormLabel>Gender</FormLabel>
              <RadioGroup value={value} onChange={(event) => setValue(event.target.value)}>
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Layout</FormLabel>
              <RadioGroup row defaultValue="email">
                <FormControlLabel value="email" control={<Radio />} label="Email" />
                <FormControlLabel value="phone" control={<Radio />} label="Phone" />
                <FormControlLabel value="slack" control={<Radio />} label="Slack" />
              </RadioGroup>
            </FormControl>
            <FormControl disabled>
              <FormLabel>Disabled</FormLabel>
              <RadioGroup defaultValue="archived">
                <FormControlLabel value="draft" control={<Radio />} label="Draft" />
                <FormControlLabel value="archived" control={<Radio />} label="Archived" />
              </RadioGroup>
            </FormControl>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
