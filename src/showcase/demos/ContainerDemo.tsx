import { useState } from 'react';
import { Container, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function ContainerDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "maxWidth": "sm",
  "disableGutters": false,
  "fixed": false
});

  const schema: PropSchema[] = [
   {
     "name": "maxWidth",
     "type": "select",
     "options": [
       "xs",
       "sm",
       "md",
       "lg",
       "xl",
       "false"
     ]
   },
  {
    "name": "disableGutters",
    "type": "boolean"
  },
  {
    "name": "fixed",
    "type": "boolean"
  }
];

  const codeExample = `
import { Container } from '@mui/material';

<Container 
  maxWidth={props.maxWidth}
  disableGutters={props.disableGutters}
  fixed={props.fixed}
/>`;

  return (
    <>
      <DemoFrame title="Container - Interactive">
        
        <Container {...props} sx={{ bgcolor: 'cfe8fc', height: '10vh' }}>
          Container Content
        </Container>
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack spacing={2}>
            <Container maxWidth="sm" sx={{ bgcolor: 'cfe8fc' }}>maxWidth="sm"</Container>
            <Container disableGutters sx={{ bgcolor: 'cfe8fc' }}>disableGutters</Container>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
