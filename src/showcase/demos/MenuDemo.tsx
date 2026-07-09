import { useState } from 'react';
import { MenuItem, Stack, Paper, MenuList } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';
import { inriverTokens } from '../../theme';

export function MenuDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "dense": false
});

  const schema: PropSchema[] = [
  {
    "name": "dense",
    "type": "boolean"
  }
];

  const codeExample = `
 import { MenuList } from '@mui/material';

<MenuList 
  dense={props.dense}
/>`;

  return (
    <>
      <DemoFrame title="Menu - Interactive">
        
        <Paper sx={{ width: 200, maxWidth: '100%', borderRadius: `${inriverTokens.radius.xs}px` }}>
          <MenuList dense={props.dense}>
            <MenuItem selected>Profile</MenuItem>
            <MenuItem>My account</MenuItem>
            <MenuItem>Logout</MenuItem>
          </MenuList>
        </Paper>
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
            <Paper sx={{ borderRadius: `${inriverTokens.radius.xs}px` }}>
              <MenuList>
                <MenuItem>Default</MenuItem>
                <MenuItem disabled>Disabled</MenuItem>
                <MenuItem selected>Selected</MenuItem>
              </MenuList>
            </Paper>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
