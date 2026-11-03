import { useState } from 'react';
import { LinearProgress, Stack, Box, Typography } from '@mui/material';
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

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
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
            <Box>
              <Typography id="lp-sync" variant="caption" color="text.secondary">
                Syncing products: ongoing loading animation, no percentage yet
              </Typography>
              <LinearProgress aria-labelledby="lp-sync" />
            </Box>
            <Box>
              <Typography id="lp-import" variant="caption" color="text.secondary">
                Importing catalog: 50% complete
              </Typography>
              <LinearProgress aria-labelledby="lp-import" variant="determinate" value={50} />
            </Box>
            <Box>
              <Typography id="lp-export" variant="caption" color="text.secondary">
                Exporting assets (secondary color): ongoing loading animation
              </Typography>
              <LinearProgress aria-labelledby="lp-export" color="secondary" />
            </Box>
            <Box>
              <Typography id="lp-upload" variant="caption" color="text.secondary">
                Uploading media: 70% complete, error. The upload failed, retry it
              </Typography>
              <LinearProgress aria-labelledby="lp-upload" color="error" variant="determinate" value={70} />
            </Box>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
