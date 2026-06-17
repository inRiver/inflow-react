import { Fab, Stack } from '@mui/material';
import { Add, Edit, Navigation } from '@mui/icons-material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

export function FabDemo() {
  const codeExample = `<Fab color="primary"><Add /></Fab>
<Fab color="secondary"><Edit /></Fab>
<Fab variant="extended"><Navigation /> Navigate</Fab>`;

  return (
    <DemoFrame title="Fab (Floating Action Button)">
      <Stack direction="row" spacing={2}>
        <Fab color="primary"><Add /></Fab>
        <Fab color="secondary"><Edit /></Fab>
        <Fab variant="extended" color="primary">
          <Navigation sx={{ mr: 1 }} />
          Navigate
        </Fab>
      </Stack>
      <CodeBlock code={codeExample} />
    </DemoFrame>
  );
}
