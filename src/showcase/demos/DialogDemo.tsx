import { useRef, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Stack, Paper, Box } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function DialogDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "maxWidth": "sm",
  "fullWidth": false
});
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
        <Box ref={containerRef} sx={{ position: 'relative', minHeight: 60 }}>
          <Button onClick={() => setOpen(true)}>Open Dialog</Button>
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth={props.maxWidth}
            fullWidth={!!props.fullWidth}
            container={containerRef.current}
          >
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogContent>
              <DialogContentText>Dialog content goes here.</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Agree</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Paper
            variant="outlined"
            sx={{
              maxWidth: 480,
              width: '100%',
              mx: 'auto',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <DialogTitle>Review product changes</DialogTitle>
            <DialogContent>
              <DialogContentText>
                This static preview shows the themed dialog title, content, and action layout without requiring interaction.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="text">Cancel</Button>
              <Button variant="contained">Confirm</Button>
            </DialogActions>
          </Paper>
        </Stack>
      </DemoFrame>
    </>
  );
}
