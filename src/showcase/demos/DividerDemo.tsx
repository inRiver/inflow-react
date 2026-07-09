import { useState } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function DividerDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    variant: 'fullWidth',
    orientation: 'horizontal',
  });

  const schema: PropSchema[] = [
    {
      name: 'variant',
      type: 'select',
      options: ['fullWidth', 'inset', 'middle'],
    },
    {
      name: 'orientation',
      type: 'select',
      options: ['horizontal', 'vertical'],
    },
  ];

  const codeExample = `
import { Divider } from '@mui/material';

<Divider
  variant={props.variant}
  orientation={props.orientation}
>
  OR
</Divider>`;

  const interactiveDivider = props.orientation === 'vertical'
    ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: 120 }}>
          <Typography>Left</Typography>
          <Divider flexItem orientation="vertical" variant={props.variant}>
            OR
          </Divider>
          <Typography>Right</Typography>
        </Box>
      )
    : (
        <Stack spacing={2}>
          <Typography>Section 1</Typography>
          <Divider variant={props.variant}>OR</Divider>
          <Typography>Section 2</Typography>
        </Stack>
      );

  return (
    <>
      <DemoFrame title="Divider - Interactive">{interactiveDivider}</DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Stack spacing={2}>
            <Typography>Section 1</Typography>
            <Divider />
            <Typography>Section 2</Typography>
            <Divider textAlign="center">OR</Divider>
            <Typography>Section 3</Typography>
          </Stack>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: 96 }}>
            <Typography>Alpha</Typography>
            <Divider orientation="vertical" flexItem />
            <Typography>Beta</Typography>
            <Divider orientation="vertical" flexItem variant="middle" />
            <Typography>Gamma</Typography>
          </Box>
        </Stack>
      </DemoFrame>
    </>
  );
}
