import { useState } from 'react';
import { TextField, Stack } from '@mui/material';
import { ThemedTextField } from '../../components/themed';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';
import { DemoVariantTabs, type DemoVariant } from '../DemoVariantTabs';
import { getThemedComponentInfo } from '../themedComponentInfo';

const themedInfo = getThemedComponentInfo('textfield');

export function TextFieldDemo() {
  const [variant, setVariant] = useState<DemoVariant>('mui');
  const [props, setProps] = useState<Record<string, any>>({
  "variant": "outlined",
  "color": "primary",
  "disabled": false,
  "error": false,
  "size": "medium",
  "label": "Label"
});

  const schema: PropSchema[] = [
  {
    "name": "variant",
    "type": "select",
    "options": [
      "outlined",
      "filled",
      "standard"
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
      "medium"
    ]
  },
  {
    "name": "disabled",
    "type": "boolean"
  },
  {
    "name": "error",
    "type": "boolean"
  }
];

  const muiCodeExample = `
import { TextField } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<TextField 
  variant={props.variant}
  color={props.color}
  size={props.size}
  disabled={props.disabled}
  error={props.error}
  label="Label"
/>`;

  const themedCodeExample = `
import { ThemedTextField } from '@inriver/inflow-react';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<ThemedTextField 
  variant={props.variant}
  color={props.color}
  size={props.size}
  disabled={props.disabled}
  error={props.error}
  label="Label"
/>`;

  return (
    <>
      <DemoVariantTabs
        value={variant}
        onChange={setVariant}
        muiLabel="MUI TextField"
        themedLabel="ThemedTextField"
        themedReason={themedInfo?.reason}
      />

      <DemoFrame title="Text Field - Interactive">
        {variant === 'mui' ? <TextField {...props} /> : <ThemedTextField {...props} />}
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
            <TextField label="Default" />
            <TextField label="Disabled" disabled />
            <TextField label="Error" error helperText="Incorrect entry." />
            <TextField label="Focused" focused />
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
