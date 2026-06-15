import { useState } from 'react';
import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Stack, Paper } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function DialogDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "maxWidth": "sm",
  "fullWidth": false
});

  const schema: PropSchema[] = [
  {
    "name": "maxWidth",
    "type": "select",
    "options": [
      "xs",
      "sm",
      "md",
      "lg",
      "xl"
    ]
  },
  {
    "name": "fullWidth",
    "type": "boolean"
  }
];

  const codeExample = `
import { Dialog } from '@mui/material';

<Dialog 
  open={true}
  maxWidth={props.maxWidth}
  fullWidth={props.fullWidth}
/>`;

  return (
    <>
      <DemoFrame title="Dialog - Interactive">
        
        <Paper elevation={24} sx={{ p: 0, m: 2, position: 'relative' }}>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogContent>
            <DialogContentText>Dialog content goes here.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button>Cancel</Button>
            <Button>Agree</Button>
          </DialogActions>
        </Paper>
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack spacing={4}>
            <Paper elevation={24}>
              <DialogTitle>Default</DialogTitle>
              <DialogContent><DialogContentText>Simple text</DialogContentText></DialogContent>
              <DialogActions><Button>OK</Button></DialogActions>
            </Paper>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
