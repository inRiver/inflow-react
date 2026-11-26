import { useState } from 'react';
import { Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import { InflowLocalizationProvider } from '../../datetime/client';
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
import { useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { InflowLocalizationProvider } from '@inriver/inflow-react/datetime/client';

// Needs the optional peers @mui/x-date-pickers and dayjs. <InflowProvider> is declared once at your app root.
// Locale and date order come from configureDateTime(...) or the provider props (props win) - see Content standards.
// The time zone is not applied to a date-only picker, so a date never moves to another day.
function BirthdayPicker() {
  const [value, setValue] = useState<Dayjs | null>(dayjs('2024-01-01'));

  return (
    <InflowLocalizationProvider>
      <DatePicker
        label="Birthday"
        value={value}
        onChange={setValue}
        disabled={${props.disabled}}
        slotProps={{ textField: { size: '${props.size}' } }}
      />
    </InflowLocalizationProvider>
  );
}`;

  return (
    <InflowLocalizationProvider>
      <DemoFrame title="Date Picker - Interactive">
        <DatePicker
          label="Birthday"
          value={value}
          disabled={props.disabled}
          slotProps={{ textField: { size: props.size } }}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="row" sx={{ flexWrap: 'wrap' }}>
          <DatePicker label="Birthday" defaultValue={dayjs('2024-01-01')} />
          <DatePicker label="Small" defaultValue={dayjs('2024-08-15')} slotProps={{ textField: { size: 'small' } }} />
          <DatePicker label="Disabled" disabled defaultValue={dayjs('2024-01-01')} />
        </Stack>
      </DemoFrame>
    </InflowLocalizationProvider>
  );
}
