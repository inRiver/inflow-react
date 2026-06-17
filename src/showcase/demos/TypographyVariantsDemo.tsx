import { Typography, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

export function TypographyVariantsDemo() {
  const codeExample = `<Typography variant="h1">Heading 1</Typography>
<Typography variant="body1">Body text</Typography>
<Typography variant="caption">Caption text</Typography>`;

  return (
    <DemoFrame title="Typography Variants">
      <Stack spacing={2}>
        <Typography variant="h1">h1. Heading</Typography>
        <Typography variant="h2">h2. Heading</Typography>
        <Typography variant="h3">h3. Heading</Typography>
        <Typography variant="h4">h4. Heading</Typography>
        <Typography variant="h5">h5. Heading</Typography>
        <Typography variant="h6">h6. Heading</Typography>
        <Typography variant="subtitle1">subtitle1. Text</Typography>
        <Typography variant="subtitle2">subtitle2. Text</Typography>
        <Typography variant="body1">body1. Lorem ipsum dolor sit amet.</Typography>
        <Typography variant="body2">body2. Lorem ipsum dolor sit amet.</Typography>
        <Typography variant="button">button text</Typography>
        <Typography variant="caption">caption text</Typography>
        <Typography variant="overline">overline text</Typography>
      </Stack>
      <CodeBlock code={codeExample} />
    </DemoFrame>
  );
}
