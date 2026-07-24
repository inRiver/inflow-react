import { useState } from 'react';
import { Avatar, Stack } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function AvatarDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "variant": "circular"
});

  const schema: PropSchema[] = [
  {
    "name": "variant",
    "type": "select",
    "options": [
      "circular",
      "rounded",
      "square"
    ]
  }
];

  const codeExample = `
import { Avatar } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Avatar 
  variant={props.variant}
/>`;

  return (
    <>
      <DemoFrame title="Avatar - Interactive">
        <Avatar {...props}>H</Avatar>
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack direction="row" spacing={2}>
            <Avatar>H</Avatar>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>N</Avatar>
            <Avatar sx={{ bgcolor: 'error.main' }}><FolderIcon /></Avatar>
            <Avatar variant="rounded" sx={{ bgcolor: 'success.main' }}>R</Avatar>
            <Avatar variant="square" sx={{ bgcolor: 'info.main' }}>S</Avatar>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
