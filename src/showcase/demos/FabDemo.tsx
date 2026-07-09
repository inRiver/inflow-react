import { useState } from 'react';
import { Add, Edit, Navigation } from '@mui/icons-material';
import { Fab, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function FabDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    size: 'medium',
    color: 'primary',
    disabled: false,
  });

  const schema: PropSchema[] = [
    {
      name: 'size',
      type: 'select',
      options: ['small', 'medium', 'large'],
    },
    {
      name: 'color',
      type: 'select',
      options: ['primary', 'secondary'],
    },
    {
      name: 'disabled',
      type: 'boolean',
    },
  ];

  const codeExample = `
import { Fab } from '@mui/material';

<Fab size={props.size} color={props.color} disabled={props.disabled}>
  <Add />
</Fab>`;

  return (
    <>
      <DemoFrame title="Fab - Interactive">
        <Fab size={props.size} color={props.color} disabled={props.disabled}>
          <Add />
        </Fab>
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Fab color="primary"><Add /></Fab>
            <Fab color="secondary"><Edit /></Fab>
            <Fab variant="extended" color="primary">
              <Navigation sx={{ mr: 1 }} />
              Navigate
            </Fab>
            <Fab size="small" color="primary"><Add /></Fab>
            <Fab disabled><Edit /></Fab>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
