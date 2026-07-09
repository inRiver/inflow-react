import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function BoxDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    display: 'block',
  });

  const schema: PropSchema[] = [
    {
      name: 'display',
      type: 'select',
      options: ['block', 'flex', 'inline-block'],
    },
  ];

  const codeExample = `
import { Box, Typography } from '@mui/material';

<Box display={props.display} sx={{ bgcolor: 'primary.main', color: 'white', p: 2, borderRadius: 1 }}>
  <Typography>Box with theme colors</Typography>
</Box>`;

  return (
    <>
      <DemoFrame title="Box - Interactive">
        <Box
          display={props.display}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            p: 2,
            borderRadius: 1,
            gap: 2,
            alignItems: 'center',
            justifyContent: props.display === 'flex' ? 'space-between' : undefined,
            width: props.display === 'inline-block' ? 'auto' : '100%',
            maxWidth: 480,
          }}
        >
          <Typography>Primary Box</Typography>
          <Typography sx={{ opacity: 0.8 }}>Layout primitive with theme colors</Typography>
        </Box>
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Stack spacing={2}>
            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, borderRadius: 1 }}>
              <Typography>Primary Box</Typography>
            </Box>
            <Box sx={{ bgcolor: 'secondary.main', color: 'white', p: 2, borderRadius: 1 }}>
              <Typography>Secondary Box</Typography>
            </Box>
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, border: 1, borderColor: 'grey.300' }}>
              <Typography>Grey Box with Border</Typography>
            </Box>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
