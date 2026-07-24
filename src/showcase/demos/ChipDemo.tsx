import { useState } from 'react';
import { Chip, Stack, Avatar } from '@mui/material';
import { ThemedChip } from '../../components/themed';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';
import { DemoVariantTabs, type DemoVariant } from '../DemoVariantTabs';
import { getThemedComponentInfo } from '../themedComponentInfo';

const themedInfo = getThemedComponentInfo('chip');

export function ChipDemo() {
  const [variant, setVariant] = useState<DemoVariant>('mui');
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

  const muiCodeExample = `
import { Chip } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Chip 
  variant={props.variant}
  color={props.color}
  size={props.size}
  disabled={props.disabled}
  label={props.label}
/>`;

  const themedCodeExample = `
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
      <DemoVariantTabs
        value={variant}
        onChange={setVariant}
        muiLabel="MUI Chip"
        themedLabel="ThemedChip"
        themedReason={themedInfo?.reason}
      />

      <DemoFrame title="Chip - Interactive">
        {variant === 'mui' ? (
          <Chip {...props} onDelete={() => {}} />
        ) : (
          <ThemedChip {...props} onDelete={() => {}} />
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
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip label="Default" />
            <Chip label="Outlined" variant="outlined" />
            <Chip label="Disabled" disabled />
            <Chip label="Clickable" onClick={() => {}} />
            <Chip label="Deletable" onDelete={() => {}} />
            <Chip label="Avatar" avatar={<Avatar>M</Avatar>} />
            <Chip label="Error" color="error" />
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
