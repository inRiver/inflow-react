import { useState } from 'react';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function CircularProgressDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "color": "primary",
  "variant": "indeterminate",
  "size": 40
});

  const schema: PropSchema[] = [
  {
    "name": "color",
    "type": "select",
    "options": [
      "primary",
      "secondary",
      "error",
      "info",
      "success",
      "warning",
      "inherit"
    ]
  },
  {
    "name": "variant",
    "type": "select",
    "options": [
      "determinate",
      "indeterminate"
    ]
  }
];

  const codeExample = `
import { CircularProgress } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<CircularProgress 
  color={props.color}
  variant={props.variant}
  value={50}
/>`;

  return (
    <>
      <DemoFrame title="Circular Progress - Interactive">
        <CircularProgress {...props} value={50} />
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack direction="row" spacing={4} alignItems="center">
            <CircularProgress />
            <CircularProgress variant="determinate" value={75} />
            <CircularProgress color="secondary" />
            <CircularProgress color="error" />
            <Stack spacing={0.75} alignItems="center">
              <CircularProgress size={20} />
              <Typography variant="caption" color="text.secondary">
                size=20
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
