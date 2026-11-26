import { useState } from 'react';
import { Stack } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { InflowLocalizationProvider } from '../../datetime/client';
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
import dayjs from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { InflowLocalizationProvider } from '@inriver/inflow-react/datetime/client';

// Needs the optional peers @mui/x-date-pickers and dayjs. <InflowProvider> is declared once at your app root.
// Locale and the 12/24-hour clock come from configureDateTime(...) or the provider props (props win) - see Content
// standards. Pass hourCycle="24" to force a 24-hour clock. A timeZone (provider prop or configureDateTime) becomes the
// time picker's zone once dayjs's utc and timezone plugins are registered; build values with dayjs.utc or dayjs.tz.
function AlarmPicker() {
  return (
    <InflowLocalizationProvider>
      <TimePicker
        label="Alarm"
        defaultValue={dayjs('2024-01-01T07:30')}
        disabled={${props.disabled}}
        slotProps={{ textField: { size: '${props.size}' } }}
      />
    </InflowLocalizationProvider>
  );
}`;

  return (
    <InflowLocalizationProvider>
      <DemoFrame title="Time Picker - Interactive">
        <TimePicker
          label="Alarm"
          defaultValue={dayjs('2024-01-01T07:30')}
          disabled={props.disabled}
          slotProps={{ textField: { size: props.size } }}
        />
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="row" sx={{ flexWrap: 'wrap' }}>
          <TimePicker label="Alarm" defaultValue={dayjs('2024-01-01T07:30')} />
          <TimePicker
            label="Small"
            defaultValue={dayjs('2024-01-01T14:00')}
            slotProps={{ textField: { size: 'small' } }}
          />
          <TimePicker label="Disabled" disabled defaultValue={dayjs('2024-01-01T09:00')} />
        </Stack>
      </DemoFrame>
    </InflowLocalizationProvider>
  );
}
