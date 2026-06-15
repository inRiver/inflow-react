import { useState } from 'react';
import { Tabs, Tab, Stack, Box } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function TabsDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "textColor": "primary",
  "indicatorColor": "primary",
  "variant": "standard"
});

  const schema: PropSchema[] = [
  {
    "name": "textColor",
    "type": "select",
    "options": [
      "secondary",
      "primary",
      "inherit"
    ]
  },
  {
    "name": "indicatorColor",
    "type": "select",
    "options": [
      "secondary",
      "primary"
    ]
  },
  {
    "name": "variant",
    "type": "select",
    "options": [
      "standard",
      "scrollable",
      "fullWidth"
    ]
  }
];

  const codeExample = `
import { Tabs } from '@mui/material';

<Tabs 
  textColor={props.textColor}
  indicatorColor={props.indicatorColor}
  variant={props.variant}
/>`;

  return (
    <>
      <DemoFrame title="Tabs - Interactive">
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={0} {...props}>
            <Tab label="Item One" />
            <Tab label="Item Two" />
            <Tab label="Item Three" />
          </Tabs>
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
          
          <Stack spacing={4}>
            <Tabs value={0}><Tab label="Active" /><Tab label="Default" /><Tab label="Disabled" disabled /></Tabs>
            <Tabs value={0} textColor="secondary" indicatorColor="secondary"><Tab label="Secondary" /><Tab label="Two" /></Tabs>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
