import { useState } from 'react';
import { FormControl, FormHelperText, FormLabel, Stack, TextField } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function FormControlDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    disabled: false,
    error: false,
    required: false,
    size: 'medium',
  });

  const schema: PropSchema[] = [
    {
      name: 'disabled',
      type: 'boolean',
    },
    {
      name: 'error',
      type: 'boolean',
    },
    {
      name: 'required',
      type: 'boolean',
    },
    {
      name: 'size',
      type: 'select',
      options: ['small', 'medium'],
    },
  ];

  const codeExample = `
import { FormControl, FormHelperText, FormLabel, TextField } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<FormControl
  disabled={props.disabled}
  error={props.error}
  required={props.required}
  size={props.size}
>
  <FormLabel>Email</FormLabel>
  <TextField
    size={props.size}
    disabled={props.disabled}
    error={props.error}
    required={props.required}
  />
  <FormHelperText>Enter your email</FormHelperText>
</FormControl>`;

  return (
    <>
      <DemoFrame title="Form Control - Interactive">
        <FormControl
          disabled={props.disabled}
          error={props.error}
          required={props.required}
          size={props.size}
          sx={{ width: 320 }}
        >
          <FormLabel>Email</FormLabel>
          <TextField
            variant="outlined"
            size={props.size}
            disabled={props.disabled}
            error={props.error}
            required={props.required}
            placeholder="user@example.com"
          />
          <FormHelperText>We'll never share your email.</FormHelperText>
        </FormControl>
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <FormControl sx={{ width: 280 }}>
              <FormLabel>Email</FormLabel>
              <TextField variant="outlined" placeholder="user@example.com" />
              <FormHelperText>We'll never share your email.</FormHelperText>
            </FormControl>
            <FormControl required sx={{ width: 280 }}>
              <FormLabel>Email</FormLabel>
              <TextField required variant="outlined" placeholder="required@example.com" />
              <FormHelperText>Required field.</FormHelperText>
            </FormControl>
            <FormControl error sx={{ width: 280 }}>
              <FormLabel>Email</FormLabel>
              <TextField error variant="outlined" placeholder="invalid@example.com" />
              <FormHelperText>Please enter a valid email.</FormHelperText>
            </FormControl>
            <FormControl disabled sx={{ width: 280 }}>
              <FormLabel>Email</FormLabel>
              <TextField disabled variant="outlined" placeholder="disabled@example.com" />
              <FormHelperText>Unavailable right now.</FormHelperText>
            </FormControl>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
