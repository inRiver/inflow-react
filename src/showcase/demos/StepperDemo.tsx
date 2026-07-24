import { useState } from 'react';
import { Stepper, Step, StepLabel, Stack, Box } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function StepperDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "alternativeLabel": false,
  "orientation": "horizontal"
});

  const schema: PropSchema[] = [
  {
    "name": "alternativeLabel",
    "type": "boolean"
  },
  {
    "name": "orientation",
    "type": "select",
    "options": [
      "horizontal",
      "vertical"
    ]
  }
];

  const codeExample = `
import { Stepper } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Stepper 
  activeStep={1}
  alternativeLabel={props.alternativeLabel}
  orientation={props.orientation}
/>`;

  return (
    <>
      <DemoFrame title="Stepper - Interactive">
        
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={1} {...props}>
            <Step><StepLabel>Step 1</StepLabel></Step>
            <Step><StepLabel>Step 2</StepLabel></Step>
            <Step><StepLabel>Step 3</StepLabel></Step>
          </Stepper>
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
            <Stepper activeStep={1}>
              <Step><StepLabel>Completed</StepLabel></Step>
              <Step><StepLabel>Active</StepLabel></Step>
              <Step><StepLabel>Pending</StepLabel></Step>
            </Stepper>
            <Stepper activeStep={0}>
              <Step><StepLabel error>Error</StepLabel></Step>
            </Stepper>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
