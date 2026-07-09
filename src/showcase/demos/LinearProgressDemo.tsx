import { useState } from 'react';
import { LinearProgress, Stack, Box } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function LinearProgressDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "color": "primary",
  "variant": "indeterminate"
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
      "indeterminate",
      "buffer",
      "query"
    ]
  }
];

  const codeExample = `
import { LinearProgress } from '@mui/material';

<LinearProgress 
  color={props.color}
  variant={props.variant}
  value={50}
/>`;

  return (
    <>
      <DemoFrame title="Linear Progress - Interactive">
        <Box sx={{ width: '100%' }}><LinearProgress {...props} value={50} valueBuffer={75} /></Box>
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack spacing={4} sx={{ width: '100%' }}>
            <LinearProgress />
            <LinearProgress variant="determinate" value={50} />
            <LinearProgress color="secondary" />
            <LinearProgress color="error" variant="determinate" value={70} />
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
