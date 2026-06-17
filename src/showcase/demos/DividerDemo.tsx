import { Divider, Stack, Typography } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

export function DividerDemo() {
  const codeExample = `<Divider />
<Divider textAlign="center">OR</Divider>
<Divider orientation="vertical" />`;

  return (
    <DemoFrame title="Divider">
      <Stack spacing={2}>
        <Typography>Section 1</Typography>
        <Divider />
        <Typography>Section 2</Typography>
        <Divider textAlign="center">OR</Divider>
        <Typography>Section 3</Typography>
      </Stack>
      <CodeBlock code={codeExample} />
    </DemoFrame>
  );
}
