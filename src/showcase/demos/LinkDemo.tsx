import { useState } from 'react';
import { Link, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function LinkDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    underline: 'hover',
    color: 'primary',
  });

  const schema: PropSchema[] = [
    {
      name: 'underline',
      type: 'select',
      options: ['none', 'hover', 'always'],
    },
    {
      name: 'color',
      type: 'select',
      options: ['primary', 'secondary', 'error', 'inherit'],
    },
  ];

  const codeExample = `
import { Link } from '@mui/material';

<Link href="#" underline={props.underline} color={props.color}>
  Interactive link
</Link>`;

  return (
    <>
      <DemoFrame title="Link - Interactive">
        <Link
          href="#"
          underline={props.underline}
          color={props.color}
          onClick={(event) => event.preventDefault()}
        >
          Interactive link
        </Link>
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Stack spacing={2}>
            <Link href="#" underline="none" onClick={(event) => event.preventDefault()}>
              No underline
            </Link>
            <Link href="#" underline="hover" onClick={(event) => event.preventDefault()}>
              Hover underline
            </Link>
            <Link href="#" underline="always" onClick={(event) => event.preventDefault()}>
              Always underline
            </Link>
            <Link href="#" color="secondary" onClick={(event) => event.preventDefault()}>
              Secondary color
            </Link>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
