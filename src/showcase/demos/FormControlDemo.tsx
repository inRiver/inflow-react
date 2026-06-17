import { FormControl, FormLabel, FormHelperText, TextField } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

export function FormControlDemo() {
  const codeExample = `<FormControl>
  <FormLabel>Email</FormLabel>
  <TextField variant="outlined" />
  <FormHelperText>Enter your email</FormHelperText>
</FormControl>`;

  return (
    <DemoFrame title="FormControl">
      <FormControl>
        <FormLabel>Email</FormLabel>
        <TextField variant="outlined" placeholder="user@example.com" />
        <FormHelperText>We'll never share your email.</FormHelperText>
      </FormControl>
      <CodeBlock code={codeExample} />
    </DemoFrame>
  );
}
