import { useState } from 'react';
import { Stack, TextField } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function TimePickerDemo() {
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
  type="time"
  label="Alarm"
  size={props.size}
  disabled={props.disabled}
  InputLabelProps={{ shrink: true }}
/>`;

  return (
    <>
      <DemoFrame title="Time Picker - Interactive">
        <TextField
          type="time"
          label="Alarm"
          size={props.size}
          disabled={props.disabled}
          defaultValue="07:30"
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
            <TextField type="time" label="Alarm" defaultValue="07:30" slotProps={{
              inputLabel: { shrink: true }
            }} />
            <TextField type="time" label="Meeting" defaultValue="14:00" slotProps={{
              inputLabel: { shrink: true }
            }} />
            <TextField type="time" label="Disabled" disabled defaultValue="09:00" slotProps={{
              inputLabel: { shrink: true }
            }} />
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
