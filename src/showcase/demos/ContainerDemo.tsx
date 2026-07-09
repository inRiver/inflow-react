import { useState } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
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
>
  <Box
    sx={{
      bgcolor: '#e3e9f8',
      border: '1px dashed',
      borderColor: 'primary.main',
      borderRadius: 1,
      py: 4,
      textAlign: 'center',
    }}
  >
    <Typography>
      Container content (maxWidth: {props.maxWidth || 'lg'})
    </Typography>
  </Box>
</Container>`;

  return (
    <>
      <DemoFrame title="Container - Interactive">
        <Container {...props}>
          <Box
            sx={{
              bgcolor: '#e3e9f8',
              border: '1px dashed',
              borderColor: 'primary.main',
              borderRadius: 1,
              py: 4,
              textAlign: 'center',
            }}
          >
            <Typography>
              Container content (maxWidth: {props.maxWidth || 'lg'})
            </Typography>
          </Box>
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
            <Container maxWidth="sm">
              <Box
                sx={{
                  bgcolor: '#e3e9f8',
                  border: '1px dashed',
                  borderColor: 'primary.main',
                  borderRadius: 1,
                  py: 3,
                  textAlign: 'center',
                }}
              >
                <Typography>maxWidth=&quot;sm&quot;</Typography>
              </Box>
            </Container>
            <Container disableGutters>
              <Box
                sx={{
                  bgcolor: '#e3e9f8',
                  border: '1px dashed',
                  borderColor: 'primary.main',
                  borderRadius: 1,
                  py: 3,
                  textAlign: 'center',
                }}
              >
                <Typography>disableGutters</Typography>
              </Box>
            </Container>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
