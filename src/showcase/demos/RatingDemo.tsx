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
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Rating value={value} onChange={(_event, newValue) => setValue(newValue)} />
            <Rating value={4} readOnly />
            <Rating value={3} disabled />
            <Rating defaultValue={2} precision={0.5} />
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
