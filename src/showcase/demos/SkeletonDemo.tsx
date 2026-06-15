import { useState } from 'react';
import { Skeleton, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function SkeletonDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "variant": "text",
  "animation": "pulse"
});

  const schema: PropSchema[] = [
  {
    "name": "variant",
    "type": "select",
    "options": [
      "text",
      "circular",
      "rectangular",
      "rounded"
    ]
  },
  {
    "name": "animation",
    "type": "select",
    "options": [
      "pulse",
      "wave",
      "false"
    ]
  }
];

  const codeExample = `
import { Skeleton } from '@mui/material';

<Skeleton 
  variant={props.variant}
  animation={props.animation}
/>`;

  return (
    <>
      <DemoFrame title="Skeleton - Interactive">
        <Skeleton {...props} width={210} height={props.variant === 'circular' ? 60 : 60} />
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack spacing={1}>
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={210} height={60} />
            <Skeleton variant="rounded" width={210} height={60} />
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
