import { useState } from 'react';
import { Breadcrumbs, Link, Typography, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function BreadcrumbsDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "separator": "/",
  "maxItems": 8
});

  const schema: PropSchema[] = [
  {
    "name": "separator",
    "type": "select",
    "options": [
      "/",
      ">",
      "•"
    ]
  },
  {
    "name": "maxItems",
    "type": "select",
    "options": [
      "8",
      "3",
      "2"
    ]
  }
];

  const codeExample = `
import { Breadcrumbs } from '@mui/material';

<Breadcrumbs 
  separator={props.separator}
  maxItems={Number(props.maxItems)}
/>`;

  return (
    <>
      <DemoFrame title="Breadcrumbs - Interactive">
        
        <Breadcrumbs aria-label="breadcrumb" {...props} maxItems={Number(props.maxItems)}>
          <Link underline="hover" color="inherit" href="/">Home</Link>
          <Link underline="hover" color="inherit" href="/catalog">Catalog</Link>
          <Typography color="text.primary">Accessories</Typography>
        </Breadcrumbs>
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
            <Breadcrumbs>
              <Link underline="hover" color="inherit" href="/">Home</Link>
              <Typography color="text.primary">Current</Typography>
            </Breadcrumbs>
            <Breadcrumbs separator=">">
              <Link underline="hover" color="inherit" href="/">Home</Link>
              <Typography color="text.primary">Custom Separator</Typography>
            </Breadcrumbs>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
