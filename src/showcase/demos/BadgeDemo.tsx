import { useState } from 'react';
import { Badge, Stack } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function BadgeDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "color": "primary",
  "variant": "standard",
  "invisible": false,
  "max": 99
});

  const schema: PropSchema[] = [
  {
    "name": "color",
    "type": "select",
    "options": [
      "primary",
      "secondary",
      "error",
      "info",
      "success",
      "warning",
      "default"
    ]
  },
  {
    "name": "variant",
    "type": "select",
    "options": [
      "standard",
      "dot"
    ]
  },
  {
    "name": "invisible",
    "type": "boolean"
  }
];

  const codeExample = `
import { Badge } from '@mui/material';

<Badge 
  color={props.color}
  variant={props.variant}
  invisible={props.invisible}
  badgeContent={4}
/>`;

  return (
    <>
      <DemoFrame title="Badge - Interactive">
        
        <Badge {...props} badgeContent={4}>
          <MailIcon color="action" />
        </Badge>
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack direction="row" spacing={4}>
            <Badge badgeContent={4} color="primary"><MailIcon color="action" /></Badge>
            <Badge badgeContent={100} color="secondary"><MailIcon color="action" /></Badge>
            <Badge variant="dot" color="error"><MailIcon color="action" /></Badge>
            <Badge invisible badgeContent={4}><MailIcon color="action" /></Badge>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
