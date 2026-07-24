import { useState } from 'react';
import { Button, Stack, Snackbar, SnackbarContent } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function SnackbarDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "vertical": "bottom",
  "horizontal": "left"
});
  const [open, setOpen] = useState(false);

  const schema: PropSchema[] = [
  {
    "name": "vertical",
    "type": "select",
    "options": [
      "top",
      "bottom"
    ]
  },
  {
    "name": "horizontal",
    "type": "select",
    "options": [
      "left",
      "center",
      "right"
    ]
  }
];

  const codeExample = `
import { Snackbar } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Snackbar 
  open={true}
  message="Note archived"
/>`;

  return (
    <>
      <DemoFrame title="Snackbar - Interactive">
        <Button onClick={() => setOpen(true)}>Open Snackbar</Button>
        <Snackbar
          open={open}
          onClose={() => setOpen(false)}
          anchorOrigin={{
            vertical: props.vertical,
            horizontal: props.horizontal,
          }}
        >
          <SnackbarContent
            message="Snackbar content preview"
            action={
              <Button
                size="small"
                variant="text"
                sx={{ fontWeight: 700 }}
                onClick={() => setOpen(false)}
              >
                UNDO
              </Button>
            }
          />
        </Snackbar>
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
              <SnackbarContent message="Default snackbar" />
            <SnackbarContent
              message="With action"
              action={
                <Button
                  size="small"
                  variant="text"
                  sx={{ fontWeight: 700 }}
                >
                  UNDO
                </Button>
              }
            />
           </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
