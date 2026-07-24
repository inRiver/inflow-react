import { useState } from 'react';
import { Slider, Box, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function SliderDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "color": "primary",
  "disabled": false,
  "size": "medium",
  "valueLabelDisplay": "auto"
});

  const schema: PropSchema[] = [
  {
    "name": "color",
    "type": "select",
    "options": [
      "primary",
      "secondary"
    ]
  },
  {
    "name": "size",
    "type": "select",
    "options": [
      "small",
      "medium"
    ]
  },
  {
    "name": "valueLabelDisplay",
    "type": "select",
    "options": [
      "on",
      "auto",
      "off"
    ]
  },
  {
    "name": "disabled",
    "type": "boolean"
  }
];

  const codeExample = `
import { Slider } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Slider 
  color={props.color}
  size={props.size}
  disabled={props.disabled}
  valueLabelDisplay={props.valueLabelDisplay}
/>`;

  return (
    <>
      <DemoFrame title="Slider - Interactive">
        <Box sx={{ width: 300, px: 2 }}><Slider defaultValue={30} {...props} /></Box>
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack spacing={4} sx={{ width: 300, px: 2 }}>
            <Slider defaultValue={30} />
            <Slider defaultValue={30} disabled />
            <Slider defaultValue={30} color="secondary" />
            <Slider defaultValue={[20, 37]} marks />
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
