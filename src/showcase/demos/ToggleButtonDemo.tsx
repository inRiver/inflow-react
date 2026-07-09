import { useState } from 'react';
import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined } from '@mui/icons-material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function ToggleButtonDemo() {
  const [formats, setFormats] = useState<string[]>(['bold']);
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
      options: ['standard', 'primary', 'secondary'],
    },
    {
      name: 'disabled',
      type: 'boolean',
    },
  ];

  const handleFormat = (_event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setFormats(newFormats);
  };

  const codeExample = `
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

<ToggleButtonGroup
  value={formats}
  size={props.size}
  disabled={props.disabled}
  onChange={handleFormat}
>
  <ToggleButton value="bold" color={props.color}>
    <FormatBold />
  </ToggleButton>
</ToggleButtonGroup>`;

  return (
    <>
      <DemoFrame title="Toggle Button - Interactive">
        <ToggleButtonGroup
          value={formats}
          size={props.size}
          disabled={props.disabled}
          onChange={handleFormat}
        >
          <ToggleButton value="bold" color={props.color} size={props.size} disabled={props.disabled}>
            <FormatBold />
          </ToggleButton>
          <ToggleButton value="italic" color={props.color} size={props.size} disabled={props.disabled}>
            <FormatItalic />
          </ToggleButton>
          <ToggleButton value="underlined" color={props.color} size={props.size} disabled={props.disabled}>
            <FormatUnderlined />
          </ToggleButton>
        </ToggleButtonGroup>
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <ToggleButtonGroup value={['bold']}>
              <ToggleButton value="bold">
                <FormatBold />
              </ToggleButton>
              <ToggleButton value="italic">
                <FormatItalic />
              </ToggleButton>
              <ToggleButton value="underlined">
                <FormatUnderlined />
              </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup value={['italic']} size="small">
              <ToggleButton value="bold">
                <FormatBold />
              </ToggleButton>
              <ToggleButton value="italic">
                <FormatItalic />
              </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup value={[]} disabled>
              <ToggleButton value="bold">
                <FormatBold />
              </ToggleButton>
              <ToggleButton value="italic">
                <FormatItalic />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
