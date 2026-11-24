import { useState } from 'react';
import { Stack } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { InflowLocalizationProvider } from '../../datetime';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function TimePickerDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    disabled: false,
    size: 'small',
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
import { InflowLocalizationProvider } from '@inriver/inflow-react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
// Locale, 12/24-hour clock and timezone come from configureDateTime(...) or the provider props (see src/datetime).
<InflowLocalizationProvider>{/* follows the user's locale; pass hourCycle="24" to force 24-hour */}
  <TimePicker
    label="Alarm"
    slotProps={{ field: { shouldRespectLeadingZeros: true }, textField: { size: props.size } }}
    disabled={props.disabled}
  />
</InflowLocalizationProvider>`;

  const field = { shouldRespectLeadingZeros: true };

  return (
    <InflowLocalizationProvider>
      <DemoFrame title="Time Picker - Interactive">
        <TimePicker
          label="Alarm"
          defaultValue={dayjs('2024-01-01T07:30')}
          disabled={props.disabled}
          slotProps={{ field, textField: { size: props.size } }}
        />
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="row" sx={{ flexWrap: 'wrap' }}>
          <TimePicker label="Alarm" defaultValue={dayjs('2024-01-01T07:30')} slotProps={{ field }} />
          <TimePicker
            label="Small"
            defaultValue={dayjs('2024-01-01T14:00')}
            slotProps={{ field, textField: { size: 'small' } }}
          />
          <TimePicker
            label="Disabled"
            disabled
            defaultValue={dayjs('2024-01-01T09:00')}
            slotProps={{ field }}
          />
        </Stack>
      </DemoFrame>
    </InflowLocalizationProvider>
  );
}
