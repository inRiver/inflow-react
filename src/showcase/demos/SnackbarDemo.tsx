import { useState } from 'react';
import { Button, Stack, SnackbarContent } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function SnackbarDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "anchorOrigin": {
    "vertical": "bottom",
    "horizontal": "left"
  }
});

  const schema: PropSchema[] = [];

  const codeExample = `
import { Snackbar } from '@mui/material';

<Snackbar 
  open={true}
  message="Note archived"
/>`;

  return (
    <>
      <DemoFrame title="Snackbar - Interactive">
        <SnackbarContent message="Snackbar content preview" action={<Button color="secondary" size="small">UNDO</Button>} />
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
            <SnackbarContent message="With action" action={<Button color="secondary" size="small">UNDO</Button>} />
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
