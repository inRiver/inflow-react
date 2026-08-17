import { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';
import { DemoVariantTabs, type DemoVariant } from '../DemoVariantTabs';
import { getThemedComponentInfo } from '../themedComponentInfo';
import { ThemedAccordion } from '../../components/themed/ThemedAccordion';

const themedInfo = getThemedComponentInfo('accordion');

const singleItems = [
  { id: 'account', summary: 'Account settings', details: 'Manage your account preferences.' },
  { id: 'notifications', summary: 'Notifications', details: 'Manage notification preferences.' },
  { id: 'billing', summary: 'Billing', details: 'Billing is currently unavailable.', disabled: true },
];

const multipleItems = [
  { id: 'profile', summary: 'Profile', details: 'Update your profile information.' },
  { id: 'security', summary: 'Security', details: 'Review your security settings.' },
  { id: 'integrations', summary: 'Integrations', details: 'Manage your connected integrations.' },
];

type MuiAccordionPlaygroundProps = {
  disabled: boolean;
  defaultExpanded: boolean;
};

export function AccordionDemo() {
  const [variant, setVariant] = useState<DemoVariant>('mui');
  const [props, setProps] = useState<MuiAccordionPlaygroundProps>({
  "disabled": false,
  "defaultExpanded": false
});
  const [themedProps, setThemedProps] = useState<Record<string, unknown>>({
    multiple: false,
    disabled: false,
  });
  const [singleExpanded, setSingleExpanded] = useState<string | undefined>('account');
  const [multipleExpanded, setMultipleExpanded] = useState<string[]>(['profile']);
  const [playgroundSingleExpanded, setPlaygroundSingleExpanded] = useState<string | undefined>('account');
  const [playgroundMultipleExpanded, setPlaygroundMultipleExpanded] = useState<string[]>(['account']);

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

  const themedSchema: PropSchema[] = [
    { name: 'multiple', type: 'boolean' },
    { name: 'disabled', type: 'boolean' },
  ];

  const themedMultiple = themedProps.multiple === true;
  const playgroundItems = singleItems.map((item) => (
    item.id === 'billing' ? { ...item, disabled: themedProps.disabled === true } : item
  ));
  const handleMuiPropsChange = (newProps: Record<string, unknown>) => {
    setProps({
      disabled: newProps.disabled === true,
      defaultExpanded: newProps.defaultExpanded === true,
    });
  };

  const codeExample = `
import { Accordion } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Accordion 
  disabled={props.disabled}
  defaultExpanded={props.defaultExpanded}
/>`;

  return (
    <>
      <DemoVariantTabs
        value={variant}
        onChange={setVariant}
        muiLabel="MUI Accordion"
        themedLabel="ThemedAccordion"
        themedReason={themedInfo?.reason}
      />

      {variant === 'mui' ? (
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

          <PropsPlayground schema={schema} values={props} onChange={handleMuiPropsChange} />

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
      ) : (
        <>
          <DemoFrame title="ThemedAccordion - Interactive">
            <ThemedAccordion
              items={playgroundItems}
              expanded={themedMultiple ? playgroundMultipleExpanded : playgroundSingleExpanded}
              multiple={themedMultiple}
              onChange={(id, isExpanded) => {
                if (themedMultiple) {
                  setPlaygroundMultipleExpanded((current) => (
                    isExpanded ? [...current, id] : current.filter((expandedId) => expandedId !== id)
                  ));
                  return;
                }

                setPlaygroundSingleExpanded(isExpanded ? id : undefined);
              }}
            />
          </DemoFrame>

          <PropsPlayground schema={themedSchema} values={themedProps} onChange={setThemedProps} />

          <DemoFrame title="ThemedAccordion - Single expand">
            <ThemedAccordion
              items={singleItems}
              expanded={singleExpanded}
              onChange={(id, isExpanded) => setSingleExpanded(isExpanded ? id : undefined)}
            />
          </DemoFrame>

          <DemoFrame title="ThemedAccordion - Multiple expand">
            <ThemedAccordion
              items={multipleItems}
              expanded={multipleExpanded}
              multiple
              onChange={(id, isExpanded) => {
                setMultipleExpanded((current) => (
                  isExpanded ? [...current, id] : current.filter((expandedId) => expandedId !== id)
                ));
              }}
            />
          </DemoFrame>

          <CodeBlock
            code={`import { ThemedAccordion } from '@inriver/inflow-react';

const items = [
  { id: 'account', summary: 'Account settings', details: 'Manage your account preferences.' },
];

<ThemedAccordion
  items={items}
  expanded="account"
  onChange={(id, isExpanded) => console.log(id, isExpanded)}
/>`}
            language="tsx"
          />
        </>
      )}
    </>
  );
}
