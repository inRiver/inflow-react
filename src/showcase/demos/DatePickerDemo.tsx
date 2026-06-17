import { TextField, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

export function DatePickerDemo() {
  const codeExample = `<TextField type="date" label="Birthday" InputLabelProps={{ shrink: true }} />`;

  return (
    <DemoFrame title="Date Picker">
      <Stack spacing={2}>
        <TextField
          type="date"
          label="Birthday"
          InputLabelProps={{ shrink: true }}
          defaultValue="2024-01-01"
        />
        <TextField
          type="date"
          label="Disabled"
          InputLabelProps={{ shrink: true }}
          disabled
        />
      </Stack>
      <CodeBlock code={codeExample} />
    </DemoFrame>
  );
}
