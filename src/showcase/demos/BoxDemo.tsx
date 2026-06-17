import { Box, Typography } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

export function BoxDemo() {
  const codeExample = `<Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, borderRadius: 1 }}>
  <Typography>Box with theme colors</Typography>
</Box>`;

  return (
    <DemoFrame title="Box">
      <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, borderRadius: 1, mb: 2 }}>
        <Typography>Primary Box</Typography>
      </Box>
      <Box sx={{ bgcolor: 'secondary.main', color: 'white', p: 2, borderRadius: 1, mb: 2 }}>
        <Typography>Secondary Box</Typography>
      </Box>
      <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, border: 1, borderColor: 'grey.300' }}>
        <Typography>Grey Box with Border</Typography>
      </Box>
      <CodeBlock code={codeExample} />
    </DemoFrame>
  );
}
