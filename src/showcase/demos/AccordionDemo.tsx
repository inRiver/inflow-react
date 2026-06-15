import { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function AccordionDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "disabled": false,
  "defaultExpanded": false
});

  const schema: PropSchema[] = [
  {
    "name": "disabled",
    "type": "boolean"
  },
  {
    "name": "defaultExpanded",
    "type": "boolean"
  }
];

  const codeExample = `
import { Accordion } from '@mui/material';

<Accordion 
  disabled={props.disabled}
  defaultExpanded={props.defaultExpanded}
/>`;

  return (
    <>
      <DemoFrame title="Accordion - Interactive">
        
        <Accordion {...props}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Accordion 1</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Content 1</Typography>
          </AccordionDetails>
        </Accordion>
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
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>Default</Typography></AccordionSummary>
              <AccordionDetails><Typography>Content</Typography></AccordionDetails>
            </Accordion>
            <Accordion disabled>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>Disabled</Typography></AccordionSummary>
              <AccordionDetails><Typography>Content</Typography></AccordionDetails>
            </Accordion>
            <Accordion expanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>Expanded</Typography></AccordionSummary>
              <AccordionDetails><Typography>Content</Typography></AccordionDetails>
            </Accordion>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
