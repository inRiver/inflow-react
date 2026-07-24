import { useState } from 'react';
import { Stack, Avatar } from '@mui/material';
import { ThemedChip } from '../../components/themed';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function ChipDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "variant": "filled",
  "color": "default",
  "disabled": false,
  "size": "medium",
  "label": "Chip"
});

  const schema: PropSchema[] = [
  {
    "name": "variant",
    "type": "select",
    "options": [
      "filled",
      "outlined"
    ]
  },
  {
    "name": "color",
    "type": "select",
    "options": [
      "default",
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
  }
];

  const codeExample = `
import { ThemedChip } from '@inriver/inflow-react';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<ThemedChip 
  variant={props.variant}
  color={props.color}
  size={props.size}
  disabled={props.disabled}
  label={props.label}
/>`;

  return (
    <>
      <DemoFrame title="Chip - Interactive">
        <ThemedChip {...props} onDelete={() => {}} />
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack direction="row" spacing={2} alignItems="center">
            <ThemedChip label="Default" />
            <ThemedChip label="Outlined" variant="outlined" />
            <ThemedChip label="Disabled" disabled />
            <ThemedChip label="Clickable" onClick={() => {}} />
            <ThemedChip label="Deletable" onDelete={() => {}} />
            <ThemedChip label="Avatar" avatar={<Avatar>M</Avatar>} />
            <ThemedChip label="Error" color="error" />
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
