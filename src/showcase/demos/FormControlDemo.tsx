import { useId, useState } from 'react';
import { FormControl, FormHelperText, InputLabel, OutlinedInput, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

type FieldState = { disabled?: boolean; error?: boolean; required?: boolean; size?: 'small' | 'medium' };

// FormControl shares disabled, error, required and size with the label, input and helper text, so they are set once
// here. InputLabel and OutlinedInput are what TextField is built from, so the label floats in the border the same way,
// and the label is tied to the input through htmlFor and id.
function EmailField({
  helper,
  placeholder,
  width,
  ...state
}: FieldState & { helper: string; placeholder: string; width: number }) {
  const id = useId();
  return (
    <FormControl {...state} sx={{ width }}>
      <InputLabel htmlFor={`${id}-input`}>Email</InputLabel>
      <OutlinedInput id={`${id}-input`} label="Email" placeholder={placeholder} aria-describedby={`${id}-helper`} />
      <FormHelperText id={`${id}-helper`}>{helper}</FormHelperText>
    </FormControl>
  );
}

export function FormControlDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    disabled: false,
    error: false,
    required: false,
    size: 'small',
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
import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
// FormControl shares disabled, error, required and size with everything inside it.
<FormControl
  disabled={props.disabled}
  error={props.error}
  required={props.required}
  size={props.size}
>
  <InputLabel htmlFor="email">Email</InputLabel>
  <OutlinedInput id="email" label="Email" aria-describedby="email-helper" />
  <FormHelperText id="email-helper">Enter your email</FormHelperText>
</FormControl>`;

  return (
    <>
      <DemoFrame title="Form Control - Interactive">
        <EmailField
          disabled={props.disabled}
          error={props.error}
          required={props.required}
          size={props.size}
          width={320}
          placeholder="user@example.com"
          helper="We'll never share your email."
        />
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', rowGap: 2 }}>
            <EmailField width={280} placeholder="user@example.com" helper="We'll never share your email." />
            <EmailField required width={280} placeholder="required@example.com" helper="Required field." />
            <EmailField error width={280} placeholder="invalid@example.com" helper="Please enter a valid email." />
            <EmailField disabled width={280} placeholder="disabled@example.com" helper="Unavailable right now." />
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
