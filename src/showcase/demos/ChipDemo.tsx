import { useState } from 'react';
import { Chip, Stack, Avatar } from '@mui/material';
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
import { Chip } from '@mui/material';

<Chip 
  variant={props.variant}
  color={props.color}
  size={props.size}
  disabled={props.disabled}
  label={props.label}
/>`;

  return (
    <>
      <DemoFrame title="Chip - Interactive">
        <Chip {...props} />
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
