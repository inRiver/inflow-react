import { useState } from 'react';
import { MenuItem, Stack, Paper, MenuList } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function MenuDemo() {
  const [props, setProps] = useState<Record<string, any>>({});

  const schema: PropSchema[] = [];

  const codeExample = `
import { Menu } from '@mui/material';

<Menu 
/>`;

  return (
    <>
      <DemoFrame title="Menu - Interactive">
        
        <Paper sx={{ width: 200, maxWidth: '100%' }}>
          <MenuList>
            <MenuItem>Profile</MenuItem>
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
            <Paper>
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
