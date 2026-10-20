import { useState } from 'react';
import { Button, ButtonGroup, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function ButtonGroupDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    variant: 'outlined',
    size: 'medium',
    orientation: 'horizontal',
    disabled: false,
  });

  const schema: PropSchema[] = [
    { name: 'variant', type: 'select', options: ['text', 'outlined', 'contained'] },
    { name: 'size', type: 'select', options: ['small', 'medium', 'large'] },
    { name: 'orientation', type: 'select', options: ['horizontal', 'vertical'] },
    { name: 'disabled', type: 'boolean' },
  ];

  const codeExample = `
import { Button, ButtonGroup } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<ButtonGroup
  variant={props.variant}
  size={props.size}
  orientation={props.orientation}
  disabled={props.disabled}
>
  <Button>One</Button>
  <Button>Two</Button>
  <Button>Three</Button>
</ButtonGroup>`;

  return (
    <>
      <DemoFrame title="Button Group - Interactive">
        <ButtonGroup
          variant={props.variant}
          size={props.size}
          orientation={props.orientation}
          disabled={props.disabled}
        >
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All Variants">
        <Stack spacing={2}>
          <ButtonGroup variant="contained" aria-label="Contained button group">
            <Button>Contained</Button>
            <Button>Contained</Button>
            <Button>Contained</Button>
          </ButtonGroup>
          <ButtonGroup variant="outlined" aria-label="Outlined button group">
            <Button>Outlined</Button>
            <Button>Outlined</Button>
            <Button>Outlined</Button>
          </ButtonGroup>
          <ButtonGroup variant="text" aria-label="Text button group">
            <Button>Text</Button>
            <Button>Text</Button>
            <Button>Text</Button>
          </ButtonGroup>
          <ButtonGroup variant="outlined" disabled aria-label="Disabled button group">
            <Button>Disabled</Button>
            <Button>Disabled</Button>
          </ButtonGroup>
        </Stack>
      </DemoFrame>
    </>
  );
}
