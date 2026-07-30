import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Stack, Paper, Box } from '@mui/material';
import { ThemedButton, ThemedDialog } from '../../components/themed';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';
import { DemoVariantTabs, type DemoVariant } from '../DemoVariantTabs';
import { getThemedComponentInfo } from '../themedComponentInfo';

const themedInfo = getThemedComponentInfo('dialog');

export function DialogDemo() {
  const [variant, setVariant] = useState<DemoVariant>('mui');
  const [props, setProps] = useState<Record<string, any>>({
  "maxWidth": "sm",
  "fullWidth": false
});
  const [open, setOpen] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

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

  const muiCodeExample = `
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  maxWidth={props.maxWidth}
  fullWidth={props.fullWidth}
>
  <DialogTitle>Dialog Title</DialogTitle>
  <DialogContent>
    <DialogContentText>Dialog content goes here.</DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpen(false)}>Cancel</Button>
    <Button onClick={() => setOpen(false)}>Agree</Button>
  </DialogActions>
</Dialog>`;

  const themedCodeExample = `
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
      <DemoVariantTabs
        value={variant}
        onChange={setVariant}
        muiLabel="MUI Dialog"
        themedLabel="ThemedDialog"
        themedReason={themedInfo?.reason}
      />

      <DemoFrame title="Dialog - Interactive">
        <Box ref={setContainer} sx={{ position: 'relative', minHeight: 60 }}>
          {variant === 'mui' ? (
            <>
              <Button onClick={() => setOpen(true)}>Open Dialog</Button>
              <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth={props.maxWidth}
                fullWidth={!!props.fullWidth}
                container={container}
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
            </>
          ) : (
            <>
              <ThemedButton onClick={() => setOpen(true)}>Open Dialog</ThemedButton>
              <ThemedDialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth={props.maxWidth}
                fullWidth={!!props.fullWidth}
                container={container}
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
            </>
          )}
        </Box>
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={variant === 'mui' ? muiCodeExample : themedCodeExample} language="tsx" />

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
                This static preview shows the dialog title, content, and action layout without requiring interaction.
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
