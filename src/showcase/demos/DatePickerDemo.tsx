import { useState } from 'react';
import { Stack, TextField } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function DatePickerDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    disabled: false,
    size: 'medium',
  });

  const schema: PropSchema[] = [
    {
      name: 'disabled',
      type: 'boolean',
    },
    {
      name: 'size',
      type: 'select',
      options: ['small', 'medium'],
    },
  ];

  const codeExample = `
import { TextField } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<TextField
  type="date"
  label="Birthday"
  size={props.size}
  disabled={props.disabled}
  InputLabelProps={{ shrink: true }}
/>`;

  return (
    <>
      <DemoFrame title="Date Picker - Interactive">
        <TextField
          type="date"
          label="Birthday"
          size={props.size}
          disabled={props.disabled}
          defaultValue="2024-01-01"
          slotProps={{
            inputLabel: { shrink: true }
          }}
        />
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
            <TextField type="date" label="Birthday" defaultValue="2024-01-01" slotProps={{
              inputLabel: { shrink: true }
            }} />
            <TextField type="date" label="Anniversary" defaultValue="2024-08-15" slotProps={{
              inputLabel: { shrink: true }
            }} />
            <TextField type="date" label="Disabled" disabled slotProps={{
              inputLabel: { shrink: true }
            }} />
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
