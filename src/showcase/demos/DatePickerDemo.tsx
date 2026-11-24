import { useState } from 'react';
import { Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import { InflowLocalizationProvider } from '../../datetime';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function DatePickerDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    disabled: false,
    size: 'small',
  });
  const [value, setValue] = useState<Dayjs | null>(dayjs('2024-01-01'));

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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
// Locale and date order come from configureDateTime(...) or the provider props (see src/datetime).
<InflowLocalizationProvider>
  <DatePicker
    label="Birthday"
    slotProps={{ field: { shouldRespectLeadingZeros: true } }}
  />
</InflowLocalizationProvider>`;

  return (
    <InflowLocalizationProvider>
      <DemoFrame title="Date Picker - Interactive">
        <DatePicker
          label="Birthday"
                value={value}
          disabled={props.disabled}
          slotProps={{ field: { shouldRespectLeadingZeros: true }, textField: { size: props.size } }}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="row" sx={{ flexWrap: 'wrap' }}>
          <DatePicker label="Birthday" defaultValue={dayjs('2024-01-01')} slotProps={{ field: { shouldRespectLeadingZeros: true } }} />
          <DatePicker label="Small" defaultValue={dayjs('2024-08-15')} slotProps={{ field: { shouldRespectLeadingZeros: true }, textField: { size: 'small' } }} />
          <DatePicker label="Disabled" disabled defaultValue={dayjs('2024-01-01')} slotProps={{ field: { shouldRespectLeadingZeros: true } }} />
        </Stack>
      </DemoFrame>
    </InflowLocalizationProvider>
  );
}
