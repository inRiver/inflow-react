import { useState } from 'react';
import { Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ThemedButton } from '../../components/themed';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';
import { DemoVariantTabs, type DemoVariant } from '../DemoVariantTabs';
import { getThemedComponentInfo } from '../themedComponentInfo';

const themedInfo = getThemedComponentInfo('button');

export function ButtonDemo() {
  const [variant, setVariant] = useState<DemoVariant>('mui');
  const [props, setProps] = useState<Record<string, any>>({
  "variant": "contained",
  "color": "primary",
  "disabled": false,
  "size": "medium"
});

  const schema: PropSchema[] = [
  {
    "name": "variant",
    "type": "select",
    "options": [
      "text",
      "outlined",
      "contained"
    ]
  },
  {
    "name": "color",
    "type": "select",
    "options": [
      "primary",
      "secondary",
      "error",
      "info",
      "success",
      "warning"
    ]
  },
  {
    "name": "size",
    "type": "select",
    "options": [
      "small",
      "medium",
      "large"
    ]
  },
  {
    "name": "disabled",
    "type": "boolean"
  }
];

  const muiCodeExample = `
import { Button } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Button 
  variant={props.variant}
  color={props.color}
  size={props.size}
  disabled={props.disabled}
  onClick={() => {}}
/>`;

  const themedCodeExample = `
import { ThemedButton } from '@inriver/inflow-react';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<ThemedButton 
  variant={props.variant}
  color={props.color}
  size={props.size}
  disabled={props.disabled}
  onClick={() => {}}
/>`;

  return (
    <>
      <DemoVariantTabs
        value={variant}
        onChange={setVariant}
        muiLabel="MUI Button"
        themedLabel="ThemedButton"
        themedReason={themedInfo?.reason}
      />

      <DemoFrame title="Button - Interactive">
        {variant === 'mui' ? (
          <Button {...props} startIcon={<AddIcon />}>Interactive Button</Button>
        ) : (
          <ThemedButton {...props} startIcon={<AddIcon />}>Interactive Button</ThemedButton>
        )}
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={variant === 'mui' ? muiCodeExample : themedCodeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack direction="row" spacing={2}>
            <Button variant="contained">Default</Button>
            <Button variant="contained" disabled>Disabled</Button>
            <Button variant="contained" color="error">Error</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text</Button>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
