import { TextField, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

export function TimePickerDemo() {
  const codeExample = `<TextField type="time" label="Alarm" InputLabelProps={{ shrink: true }} />`;

  return (
    <DemoFrame title="Time Picker">
      <Stack spacing={2}>
        <TextField
          type="time"
          label="Alarm"
          InputLabelProps={{ shrink: true }}
          defaultValue="07:30"
        />
        <TextField
          type="time"
          label="Meeting"
          InputLabelProps={{ shrink: true }}
          defaultValue="14:00"
        />
      </Stack>
      <CodeBlock code={codeExample} />
    </DemoFrame>
  );
}
