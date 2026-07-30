import { useState } from 'react';
import { Box, Tooltip, Button, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function TooltipDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "placement": "bottom",
  "arrow": false
});
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

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

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Tooltip 
  placement={props.placement}
  arrow={props.arrow}
  title="Tooltip text"
/>`;

  return (
    <>
      <DemoFrame title="Tooltip - Interactive">
        <Box ref={setContainer} sx={{ position: 'relative', display: 'inline-block' }}>
          <Tooltip {...props} title="Interactive tooltip" slotProps={{ popper: { container } }}>
            <Button>Hover Me</Button>
          </Tooltip>
        </Box>
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
