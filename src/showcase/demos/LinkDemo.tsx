import { Link, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

export function LinkDemo() {
  const codeExample = `<Link href="#" underline="none">No underline</Link>
<Link href="#" underline="hover">Hover</Link>
<Link href="#" underline="always">Always</Link>`;

  return (
    <DemoFrame title="Link">
      <Stack spacing={2}>
        <Link href="#" underline="none">No underline</Link>
        <Link href="#" underline="hover">Hover underline</Link>
        <Link href="#" underline="always">Always underline</Link>
        <Link href="#" color="secondary">Secondary color</Link>
      </Stack>
      <CodeBlock code={codeExample} />
    </DemoFrame>
  );
}
