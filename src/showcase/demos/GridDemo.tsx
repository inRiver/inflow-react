import { useState } from 'react';
import { Grid2, Box, Paper, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function GridDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "spacing": 2
});

  const schema: PropSchema[] = [
  {
    "name": "spacing",
    "type": "select",
    "options": [
      "0",
      "1",
      "2",
      "3",
      "4",
      "8"
    ]
  }
];

  const codeExample = `
import { Grid } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Grid 
  container
  spacing={props.spacing}
/>`;

  return (
    <>
      <DemoFrame title="Grid - Interactive">
        
        <Box sx={{ flexGrow: 1 }}>
          <Grid2 container spacing={props.spacing}>
            <Grid2 size={8}><Paper sx={{p:2}}>xs=8</Paper></Grid2>
            <Grid2 size={4}><Paper sx={{p:2}}>xs=4</Paper></Grid2>
            <Grid2 size={4}><Paper sx={{p:2}}>xs=4</Paper></Grid2>
            <Grid2 size={8}><Paper sx={{p:2}}>xs=8</Paper></Grid2>
          </Grid2>
        </Box>
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack spacing={4}>
             <Grid2 container spacing={2}>
               <Grid2 size={6}><Paper sx={{p:2}}>Half</Paper></Grid2>
               <Grid2 size={6}><Paper sx={{p:2}}>Half</Paper></Grid2>
             </Grid2>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
