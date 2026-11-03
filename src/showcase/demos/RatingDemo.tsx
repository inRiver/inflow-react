import { useState } from 'react';
import { Rating, Stack, Typography } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function RatingDemo() {
  const [value, setValue] = useState<number | null>(3);
  const [props, setProps] = useState<Record<string, any>>({
    size: 'medium',
    disabled: false,
    readOnly: false,
  });

  const schema: PropSchema[] = [
    {
      name: 'size',
      type: 'select',
      options: ['small', 'medium', 'large'],
    },
    {
      name: 'disabled',
      type: 'boolean',
    },
    {
      name: 'readOnly',
      type: 'boolean',
      label: 'readOnly',
    },
  ];

  const codeExample = `
import { Rating } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Rating
  value={value}
  size={props.size}
  disabled={props.disabled}
  readOnly={props.readOnly}
  onChange={(event, newValue) => setValue(newValue)}
/>`;

  return (
    <>
      <DemoFrame title="Rating - Interactive">
        <Stack spacing={2}>
          <Rating
            value={value}
            size={props.size}
            disabled={props.disabled}
            readOnly={props.readOnly}
            onChange={(_event, newValue) => setValue(newValue)}
          />
          <Typography>Selected: {value ?? 0} stars</Typography>
        </Stack>
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
            <Stack spacing={0.5}>
              <Rating name="rating-interactive" value={value} onChange={(_event, newValue) => setValue(newValue)} />
              <Typography variant="caption" color="text.secondary">Interactive: click to rate</Typography>
            </Stack>
            <Stack spacing={0.5}>
              <Rating value={4} readOnly />
              <Typography variant="caption" color="text.secondary">Read-only: 4 out of 5</Typography>
            </Stack>
            <Stack spacing={0.5}>
              <Rating value={3} disabled />
              <Typography variant="caption" color="text.secondary">Disabled: 3 out of 5</Typography>
            </Stack>
            <Stack spacing={0.5}>
              <Rating name="rating-half" defaultValue={2} precision={0.5} />
              <Typography variant="caption" color="text.secondary">Half-star precision: starts at 2</Typography>
            </Stack>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
