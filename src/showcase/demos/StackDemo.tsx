import { useState } from 'react';
import { Stack, Paper, Box } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function StackDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "direction": "row",
  "spacing": 2
});

  const schema: PropSchema[] = [
  {
    "name": "direction",
    "type": "select",
    "options": [
      "row",
      "row-reverse",
      "column",
      "column-reverse"
    ]
  },
  {
    "name": "spacing",
    "type": "select",
    "options": ["0", "1", "2", "3", "4", "8"]
  }
];

  const codeExample = `
import { Stack } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Stack 
  direction={props.direction}
  spacing={props.spacing}
/>`;

  return (
    <>
      <DemoFrame title="Stack - Interactive">
        
        <Stack {...props}>
          <Paper sx={{p:2}}>Item 1</Paper>
          <Paper sx={{p:2}}>Item 2</Paper>
          <Paper sx={{p:2}}>Item 3</Paper>
        </Stack>
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Box>
            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
              <Paper sx={{p:2}}>Row</Paper>
              <Paper sx={{p:2}}>Row</Paper>
            </Stack>
            <Stack direction="column" spacing={2}>
              <Paper sx={{p:2}}>Column</Paper>
              <Paper sx={{p:2}}>Column</Paper>
            </Stack>
          </Box>
        </Stack>
      </DemoFrame>
    </>
  );
}
