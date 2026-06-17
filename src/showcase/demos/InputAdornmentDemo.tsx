import { TextField, InputAdornment } from '@mui/material';
import { AccountCircle, Visibility } from '@mui/icons-material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

export function InputAdornmentDemo() {
  const codeExample = `<TextField
  InputProps={{
    startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment>
  }}
/>`;

  return (
    <DemoFrame title="InputAdornment">
      <TextField
        label="Username"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Password"
        type="password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Visibility />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2 }}
      />
      <CodeBlock code={codeExample} />
    </DemoFrame>
  );
}
