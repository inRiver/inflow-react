import { useState } from 'react';
import { AccountCircle, Visibility } from '@mui/icons-material';
import { InputAdornment, Stack, TextField } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function InputAdornmentDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    disabled: false,
    variant: 'outlined',
  });

  const schema: PropSchema[] = [
    {
      name: 'disabled',
      type: 'boolean',
    },
    {
      name: 'variant',
      type: 'select',
      options: ['outlined', 'filled', 'standard'],
    },
  ];

  const codeExample = `
import { InputAdornment, TextField } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<TextField
  variant={props.variant}
  disabled={props.disabled}
  InputProps={{
    startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment>
  }}
/>`;

  return (
    <>
      <DemoFrame title="Input Adornment - Interactive">
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            label="Username"
            variant={props.variant}
            disabled={props.disabled}
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
            variant={props.variant}
            disabled={props.disabled}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Visibility />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Stack direction="row" spacing={2} flexWrap="wrap">
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
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Visibility />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              disabled
              label="Disabled"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
