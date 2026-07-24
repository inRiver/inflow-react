import { useState } from 'react';
import { Paper, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function PaperDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "elevation": 1,
  "variant": "elevation",
  "square": false
});

  const schema: PropSchema[] = [
  {
    "name": "elevation",
    "type": "select",
    "options": ["0", "1", "3", "6", "12", "24"]
  },
  {
    "name": "variant",
    "type": "select",
    "options": [
      "elevation",
      "outlined"
    ]
  },
  {
    "name": "square",
    "type": "boolean"
  }
];

  const codeExample = `
import { Paper } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Paper 
  elevation={props.elevation}
  variant={props.variant}
  square={props.square}
/>`;

  return (
    <>
      <DemoFrame title="Paper - Interactive">
        
        <Paper {...props} sx={{ p: 2, minHeight: 100 }}>
          Paper content
        </Paper>
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack direction="row" spacing={2}>
            <Paper elevation={1} sx={{ p: 2, width: 100 }}>Elevation 1</Paper>
            <Paper elevation={6} sx={{ p: 2, width: 100 }}>Elevation 6</Paper>
            <Paper variant="outlined" sx={{ p: 2, width: 100 }}>Outlined</Paper>
            <Paper square sx={{ p: 2, width: 100 }}>Square</Paper>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
