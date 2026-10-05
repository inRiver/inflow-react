import { useState } from 'react';
import { Alert, Button, Stack } from '@mui/material';
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

  return (
    <>
      <Alert severity="warning" sx={{ mb: 2 }}>
        ThemedButton is deprecated and will be removed in the next major release. A plain MUI
        Button inside InflowProvider is visually identical — the theme applies all Inflow button
        styling automatically. Use Button from @mui/material directly.
      </Alert>

      <DemoFrame title="Button - Interactive">
        <Button {...props} startIcon={<AddIcon />}>Interactive Button</Button>
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={muiCodeExample} language="tsx" />

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
