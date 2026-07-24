import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function TypographyVariantsDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    align: 'left',
  });

  const schema: PropSchema[] = [
    {
      name: 'align',
      type: 'select',
      options: ['left', 'center', 'right'],
    },
  ];

  const codeExample = `
import { Typography } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Typography variant="h1" align={props.align}>Heading 1</Typography>
<Typography variant="body1" align={props.align}>Body text</Typography>
<Typography variant="caption" align={props.align}>Caption text</Typography>`;

  return (
    <>
      <DemoFrame title="Typography Variants - Interactive">
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Typography variant="h1" align={props.align}>h1. Heading</Typography>
          <Typography variant="h2" align={props.align}>h2. Heading</Typography>
          <Typography variant="h3" align={props.align}>h3. Heading</Typography>
          <Typography variant="h4" align={props.align}>h4. Heading</Typography>
          <Typography variant="h5" align={props.align}>h5. Heading</Typography>
          <Typography variant="h6" align={props.align}>h6. Heading</Typography>
          <Typography variant="body1" align={props.align}>body1. Lorem ipsum dolor sit amet.</Typography>
          <Typography variant="caption" align={props.align}>caption text</Typography>
        </Stack>
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
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
        </Stack>
      </DemoFrame>
    </>
  );
}
