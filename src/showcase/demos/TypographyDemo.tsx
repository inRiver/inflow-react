import { useState } from 'react';
import { Typography, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function TypographyDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "variant": "body1",
  "color": "text.primary",
  "align": "inherit"
});

  const schema: PropSchema[] = [
  {
    "name": "variant",
    "type": "select",
    "options": [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "subtitle1",
      "subtitle2",
      "body1",
      "body2",
      "caption",
      "button",
      "overline"
    ]
  },
  {
    "name": "color",
    "type": "select",
    "options": [
      "text.primary",
      "text.secondary",
      "primary",
      "secondary",
      "error",
      "info",
      "success",
      "warning"
    ]
  },
  {
    "name": "align",
    "type": "select",
    "options": [
      "inherit",
      "left",
      "center",
      "right",
      "justify"
    ]
  }
];

  const codeExample = `
import { Typography } from '@mui/material';

<Typography 
  variant={props.variant}
  color={props.color}
  align={props.align}
/>`;

  return (
    <>
      <DemoFrame title="Typography - Interactive">
        <Typography {...props}>Interactive Typography</Typography>
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
            <Typography variant="h4">Heading 4</Typography>
            <Typography variant="body1">Body 1</Typography>
            <Typography variant="body2" color="text.secondary">Body 2 Secondary</Typography>
            <Typography variant="caption" color="error">Caption Error</Typography>
            <Typography variant="overline">Overline</Typography>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
