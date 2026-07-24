import { useState } from 'react';
import { Pagination, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function PaginationDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "color": "standard",
  "size": "medium",
  "variant": "text",
  "shape": "circular"
});

  const schema: PropSchema[] = [
  {
    "name": "color",
    "type": "select",
    "options": [
      "primary",
      "secondary",
      "standard"
    ]
  },
  {
    "name": "size",
    "type": "select",
    "options": [
      "small",
      "medium",
      "large"
    ]
  },
  {
    "name": "variant",
    "type": "select",
    "options": [
      "text",
      "outlined"
    ]
  },
  {
    "name": "shape",
    "type": "select",
    "options": [
      "circular",
      "rounded"
    ]
  }
];

  const codeExample = `
import { Pagination } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Pagination 
  count={10}
  color={props.color}
  size={props.size}
  variant={props.variant}
  shape={props.shape}
/>`;

  return (
    <>
      <DemoFrame title="Pagination - Interactive">
        <Pagination count={10} {...props} />
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
            <Pagination count={10} />
            <Pagination count={10} disabled />
            <Pagination count={10} color="primary" />
            <Pagination count={10} variant="outlined" shape="rounded" />
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
