import { useState } from 'react';
import { Tooltip, Button, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function TooltipDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "placement": "bottom",
  "arrow": false
});

  const schema: PropSchema[] = [
  {
    "name": "placement",
    "type": "select",
    "options": [
      "top",
      "bottom",
      "left",
      "right"
    ]
  },
  {
    "name": "arrow",
    "type": "boolean"
  }
];

  const codeExample = `
import { Tooltip } from '@mui/material';

<Tooltip 
  placement={props.placement}
  arrow={props.arrow}
  title="Tooltip text"
/>`;

  return (
    <>
      <DemoFrame title="Tooltip - Interactive">
        <Tooltip {...props} title="Interactive tooltip"><Button>Hover Me</Button></Tooltip>
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack direction="row" spacing={2}>
            <Tooltip title="Default"><Button>Default</Button></Tooltip>
            <Tooltip title="With Arrow" arrow><Button>Arrow</Button></Tooltip>
            <Tooltip title="Top" placement="top"><Button>Top</Button></Tooltip>
            <Tooltip title="Bottom" placement="bottom"><Button>Bottom</Button></Tooltip>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
