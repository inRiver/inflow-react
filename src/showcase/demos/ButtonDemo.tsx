import { useState } from 'react';
import { Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ThemedButton } from '../../components/themed';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function ButtonDemo() {
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

  const codeExample = `
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
      <DemoFrame title="Button - Interactive">
        <ThemedButton {...props} startIcon={<AddIcon />}>Interactive Button</ThemedButton>
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
            <ThemedButton variant="contained">Default</ThemedButton>
            <ThemedButton variant="contained" disabled>Disabled</ThemedButton>
            <ThemedButton variant="contained" color="error">Error</ThemedButton>
            <ThemedButton variant="outlined">Outlined</ThemedButton>
            <ThemedButton variant="text">Text</ThemedButton>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
