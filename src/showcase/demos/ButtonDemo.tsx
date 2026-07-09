import { useState } from 'react';
import { Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
import { Button } from '@mui/material';

<Button 
  variant={props.variant}
  color={props.color}
  size={props.size}
  disabled={props.disabled}
  onClick={() => {}}
/>`;

  return (
    <>
      <DemoFrame title="Button - Interactive">
        <Button {...props} startIcon={<AddIcon />}>Interactive Button</Button>
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
