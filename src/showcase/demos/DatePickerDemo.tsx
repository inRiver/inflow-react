import { useState } from 'react';
import { Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function DatePickerDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    disabled: false,
    size: 'medium',
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker label="Birthday" />
</LocalizationProvider>`;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
    </LocalizationProvider>
  );
}
