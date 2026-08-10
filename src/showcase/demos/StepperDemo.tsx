import { useState } from 'react';
import { Stack, Box, Stepper, Step, StepLabel, StepButton, Button } from '@mui/material';
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
  const [themedClickableActiveStep, setThemedClickableActiveStep] = useState(1);
  const [themedClickableSelectedStep, setThemedClickableSelectedStep] = useState(1);
  const [themedExternalActiveStep, setThemedExternalActiveStep] = useState(1);
  const [themedExternalSelectedStep, setThemedExternalSelectedStep] = useState(1);
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

const [furthestStep, setFurthestStep] = useState(1);
const [selectedStep, setSelectedStep] = useState(1);

<ThemedStepper
  nonLinear
  activeStep={furthestStep}
  selectedStep={selectedStep}
  steps={steps}
  onStepClick={(index) => {
    setSelectedStep(index);
    if (index > furthestStep) setFurthestStep(index);
  }}
/>`;

  const clickableMuiCodeExample = `
import { useState } from 'react';
import { Stepper, Step, StepButton } from '@mui/material';

const steps = ['Select Source', 'Map Fields', 'Validate', 'Run Import'];

const [activeStep, setActiveStep] = useState(${muiClickableActiveStep});

<Stepper nonLinear activeStep={activeStep}>
  {steps.map((label, index) => (
    <Step key={label} completed={index < activeStep}>
      <StepButton disableRipple onClick={() => setActiveStep(index)}>
        {label}
      </StepButton>
    </Step>
  ))}
</Stepper>`;

  const externalThemedCodeExample = `
import { useState } from 'react';
import { ThemedStepper } from '@inriver/inflow-react';
import { Button, Stack } from '@mui/material';

const steps = [
  { label: 'Select Source' },
  { label: 'Map Fields' },
  { label: 'Validate' },
  { label: 'Run Import' },
];

const [furthestStep, setFurthestStep] = useState(1);
const [selectedStep, setSelectedStep] = useState(1);

<Stack spacing={2}>
  <ThemedStepper
    nonLinear
    activeStep={furthestStep}
    selectedStep={selectedStep}
    steps={steps}
    disableStepClick
  />
  <Stack direction="row" spacing={2}>
    <Button
      variant="outlined"
      disabled={selectedStep === 0}
      onClick={() => setSelectedStep((s) => s - 1)}
    >
      Back
    </Button>
    <Button
      variant="contained"
      disabled={selectedStep === steps.length - 1}
      onClick={() =>
        setSelectedStep((s) => {
          const next = s + 1;
          setFurthestStep((f) => Math.max(f, next));
          return next;
        })
      }
    >
      {selectedStep === steps.length - 1 ? 'Finish' : 'Next'}
    </Button>
  </Stack>
</Stack>`;

  const externalMuiCodeExample = `
import { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Stack } from '@mui/material';

const steps = ['Select Source', 'Map Fields', 'Validate', 'Run Import'];

const [activeStep, setActiveStep] = useState(${themedExternalActiveStep});

<Stack spacing={2}>
  <Stepper activeStep={activeStep}>
    {steps.map((label) => (
      <Step key={label}>
        <StepLabel>{label}</StepLabel>
      </Step>
    ))}
  </Stepper>
  <Stack direction="row" spacing={2}>
    <Button
      variant="outlined"
      disabled={activeStep === 0}
      onClick={() => setActiveStep((s) => s - 1)}
    >
      Back
    </Button>
    <Button
      variant="contained"
      disabled={activeStep === steps.length - 1}
      onClick={() => setActiveStep((s) => s + 1)}
    >
      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
    </Button>
  </Stack>
</Stack>`;

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
                <Step key={label} completed={index < muiClickableActiveStep}>
                  <StepButton disableRipple onClick={() => setMuiClickableActiveStep(index)}>
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          </Stack>
        ) : (
          <Stack spacing={2}>
            <Box>Selected step: {themedClickableSelectedStep}</Box>
            <ThemedStepper
              nonLinear
              activeStep={themedClickableActiveStep}
              selectedStep={themedClickableSelectedStep}
              steps={CLICKABLE_STEPS}
              onStepClick={(index) => {
                setThemedClickableSelectedStep(index);
                if (index > themedClickableActiveStep) {
                  setThemedClickableActiveStep(index);
                }
              }}
            />
          </Stack>
        )}
      </DemoFrame>

      <DemoFrame title="External Navigation - disableStepClick">
        {variant === 'mui' ? (
          <Stack spacing={2}>
            <Box>Active step: {themedExternalActiveStep}</Box>
            <Stepper activeStep={themedExternalActiveStep}>
              {CLICKABLE_STEPS.map((step) => String(step.label)).map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                disabled={themedExternalActiveStep === 0}
                onClick={() => setThemedExternalActiveStep((s) => s - 1)}
              >
                Back
              </Button>
              <Button
                variant="contained"
                disabled={themedExternalActiveStep === CLICKABLE_STEPS.length - 1}
                onClick={() => setThemedExternalActiveStep((s) => s + 1)}
              >
                {themedExternalActiveStep === CLICKABLE_STEPS.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={2}>
            <Box>Selected step: {themedExternalSelectedStep}</Box>
            <ThemedStepper
              nonLinear
              activeStep={themedExternalActiveStep}
              selectedStep={themedExternalSelectedStep}
              steps={CLICKABLE_STEPS}
              disableStepClick
            />
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                disabled={themedExternalSelectedStep === 0}
                onClick={() => setThemedExternalSelectedStep((s) => s - 1)}
              >
                Back
              </Button>
              <Button
                variant="contained"
                disabled={themedExternalSelectedStep === CLICKABLE_STEPS.length - 1}
                onClick={() =>
                  setThemedExternalSelectedStep((s) => {
                    const next = s + 1;
                    setThemedExternalActiveStep((f) => Math.max(f, next));
                    return next;
                  })
                }
              >
                {themedExternalSelectedStep === CLICKABLE_STEPS.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Stack>
          </Stack>
        )}
      </DemoFrame>

      <CodeBlock
        code={variant === 'mui' ? externalMuiCodeExample : externalThemedCodeExample}
        language="tsx"
      />

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
