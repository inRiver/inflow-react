import { useState } from 'react';
import { Rating, Stack, Typography } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

export function RatingDemo() {
  const [value, setValue] = useState<number | null>(3);
  
  const codeExample = `<Rating value={value} onChange={(e, newValue) => setValue(newValue)} />`;

  return (
    <DemoFrame title="Rating">
      <Stack spacing={2}>
        <Rating value={value} onChange={(_e, newValue) => setValue(newValue)} />
        <Rating value={4} readOnly />
        <Rating value={3} disabled />
        <Typography>Selected: {value} stars</Typography>
      </Stack>
      <CodeBlock code={codeExample} />
    </DemoFrame>
  );
}
