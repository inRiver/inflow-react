import { useState } from 'react';
import { Alert, Stack, Button } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function AlertDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "severity": "success",
  "variant": "standard"
});

  const schema: PropSchema[] = [
  {
    "name": "severity",
    "type": "select",
    "options": [
      "error",
      "warning",
      "info",
      "success"
    ]
  },
  {
    "name": "variant",
    "type": "select",
    "options": [
      "standard",
      "filled",
      "outlined"
    ]
  }
];

  const codeExample = `
import { Alert } from '@mui/material';

<Alert 
  severity={props.severity}
  variant={props.variant}
/>`;

  return (
    <>
      <DemoFrame title="Alert - Interactive">
        <Alert {...props}>This is an alert message.</Alert>
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack spacing={2}>
            <Alert severity="success">Success alert</Alert>
            <Alert severity="info">Info alert</Alert>
            <Alert severity="warning">Warning alert</Alert>
            <Alert severity="error">Error alert</Alert>
            <Alert severity="error" action={<Button color="inherit" size="small">UNDO</Button>}>Action alert</Alert>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
