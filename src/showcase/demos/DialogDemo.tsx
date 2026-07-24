import { useRef, useState } from 'react';
import { DialogTitle, DialogContent, DialogContentText, DialogActions, Stack, Paper, Box } from '@mui/material';
import { ThemedButton, ThemedDialog } from '../../components/themed';
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
import { ThemedDialog, ThemedButton } from '@inriver/inflow-react';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<ThemedDialog
  open={open}
  onClose={() => setOpen(false)}
  maxWidth={props.maxWidth}
  fullWidth={props.fullWidth}
  title="Dialog Title"
  actions={
    <>
      <ThemedButton variant="text" onClick={() => setOpen(false)}>Cancel</ThemedButton>
      <ThemedButton onClick={() => setOpen(false)}>Agree</ThemedButton>
    </>
  }
>
  Dialog content goes here.
</ThemedDialog>`;

  return (
    <>
      <DemoFrame title="Dialog - Interactive">
        <Box ref={containerRef} sx={{ position: 'relative', minHeight: 60 }}>
          <ThemedButton onClick={() => setOpen(true)}>Open Dialog</ThemedButton>
          <ThemedDialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth={props.maxWidth}
            fullWidth={!!props.fullWidth}
            container={containerRef.current}
            title="Dialog Title"
            actions={
              <>
                <ThemedButton variant="text" onClick={() => setOpen(false)}>Cancel</ThemedButton>
                <ThemedButton onClick={() => setOpen(false)}>Agree</ThemedButton>
              </>
            }
          >
            Dialog content goes here.
          </ThemedDialog>
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
              <ThemedButton variant="text">Cancel</ThemedButton>
              <ThemedButton variant="contained">Confirm</ThemedButton>
            </DialogActions>
          </Paper>
        </Stack>
      </DemoFrame>
    </>
  );
}
