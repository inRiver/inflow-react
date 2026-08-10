import { useState } from 'react';
import { Stack, Box, Stepper, Step, StepLabel, StepButton } from '@mui/material';
import { ThemedStepper } from '../../components/themed';
import type { ThemedStep } from '../../components/themed';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';
import { DemoVariantTabs, type DemoVariant } from '../DemoVariantTabs';
import { getThemedComponentInfo } from '../themedComponentInfo';

const STEPS: ThemedStep[] = [
  { label: 'Configure' },
  { label: 'Options' },
  { label: 'Test' },
  { label: 'Review' },
];

const CLICKABLE_STEPS: ThemedStep[] = [
  { label: 'Select Source' },
  { label: 'Map Fields' },
  { label: 'Validate' },
  { label: 'Run Import' },
];

const MUI_STEPS = STEPS.map((step) => String(step.label));

const themedInfo = getThemedComponentInfo('stepper');

export function StepperDemo() {
  const [variant, setVariant] = useState<DemoVariant>('mui');
  const [props, setProps] = useState<Record<string, any>>({
    activeStep: 1,
  });
  const [clickableActiveStep, setClickableActiveStep] = useState(1);
  const [muiClickableActiveStep, setMuiClickableActiveStep] = useState(1);

  const schema: PropSchema[] = [
    {
      name: 'activeStep',
      type: 'select',
      options: ['0', '1', '2', '3'],
    },
  ];

  const activeStep = Number(props.activeStep);

  const muiCodeExample = `
import { Stepper, Step, StepLabel } from '@mui/material';

<Stepper activeStep={${activeStep}}>
  <Step>
    <StepLabel>Configure</StepLabel>
  </Step>
  <Step>
    <StepLabel>Options</StepLabel>
  </Step>
  <Step>
    <StepLabel>Test</StepLabel>
  </Step>
  <Step>
    <StepLabel>Review</StepLabel>
  </Step>
</Stepper>`;

  const themedCodeExample = `
import { ThemedStepper } from '@inriver/inflow-react';

const steps = [
  { label: 'Configure' },
  { label: 'Options' },
  { label: 'Test' },
  { label: 'Review' },
];

<ThemedStepper activeStep={${activeStep}} steps={steps} />`;

  const clickableThemedCodeExample = `
import { useState } from 'react';
import { ThemedStepper } from '@inriver/inflow-react';

const steps = [
  { label: 'Select Source' },
  { label: 'Map Fields' },
  { label: 'Validate' },
  { label: 'Run Import' },
];

const [activeStep, setActiveStep] = useState(${clickableActiveStep});

<ThemedStepper
  nonLinear
  activeStep={activeStep}
  steps={steps}
  onStepClick={setActiveStep}
/>`;

  const clickableMuiCodeExample = `
import { useState } from 'react';
import { Stepper, Step, StepButton } from '@mui/material';

const steps = ['Select Source', 'Map Fields', 'Validate', 'Run Import'];

const [activeStep, setActiveStep] = useState(${muiClickableActiveStep});

<Stepper nonLinear activeStep={activeStep}>
  {steps.map((label, index) => (
    <Step key={label}>
      <StepButton onClick={() => setActiveStep(index)}>
        {label}
      </StepButton>
    </Step>
  ))}
</Stepper>`;

  return (
    <>
      <DemoVariantTabs
        value={variant}
        onChange={setVariant}
        muiLabel="MUI Stepper"
        themedLabel="ThemedStepper"
        themedReason={themedInfo?.reason}
      />

      <DemoFrame title="Clickable Steps - onStepClick">
        {variant === 'mui' ? (
          <Stack spacing={2}>
            <Box>Active step: {muiClickableActiveStep}</Box>
            <Stepper nonLinear activeStep={muiClickableActiveStep}>
              {CLICKABLE_STEPS.map((step) => String(step.label)).map((label, index) => (
                <Step key={label}>
                  <StepButton onClick={() => setMuiClickableActiveStep(index)}>
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          </Stack>
        ) : (
          <Stack spacing={2}>
            <Box>Active step: {clickableActiveStep}</Box>
            <ThemedStepper
              nonLinear
              activeStep={clickableActiveStep}
              steps={CLICKABLE_STEPS}
              onStepClick={setClickableActiveStep}
            />
          </Stack>
        )}
      </DemoFrame>

      <DemoFrame title="Stepper - Interactive">
        <Box sx={{ width: '100%' }}>
          {variant === 'mui' ? (
            <Stepper activeStep={activeStep}>
              {MUI_STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          ) : (
            <ThemedStepper activeStep={activeStep} steps={STEPS} />
          )}
        </Box>
      </DemoFrame>

      <PropsPlayground
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={variant === 'mui' ? muiCodeExample : themedCodeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={4} direction="column">
          {variant === 'mui' ? (
            <>
              <Stepper activeStep={0}>
                {MUI_STEPS.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Stepper activeStep={1}>
                {MUI_STEPS.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Stepper activeStep={2}>
                {MUI_STEPS.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Stepper activeStep={3}>
                {MUI_STEPS.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </>
          ) : (
            <>
              <ThemedStepper activeStep={0} steps={STEPS} />
              <ThemedStepper activeStep={1} steps={STEPS} />
              <ThemedStepper activeStep={2} steps={STEPS} />
              <ThemedStepper activeStep={3} steps={STEPS} />
            </>
          )}
        </Stack>
      </DemoFrame>

      <CodeBlock
        code={variant === 'mui' ? clickableMuiCodeExample : clickableThemedCodeExample}
        language="tsx"
      />
    </>
  );
}
