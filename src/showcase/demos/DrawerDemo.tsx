import { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Box, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function DrawerDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "anchor": "left",
  "variant": "permanent"
});

  const schema: PropSchema[] = [
  {
    "name": "anchor",
    "type": "select",
    "options": [
      "left",
      "right",
      "top",
      "bottom"
    ]
  },
  {
    "name": "variant",
    "type": "select",
    "options": [
      "permanent",
      "persistent",
      "temporary"
    ]
  }
];

  const codeExample = `
import { Drawer } from '@mui/material';

<Drawer 
  anchor={props.anchor}
  variant={props.variant}
  open={true}
/>`;

  return (
    <>
      <DemoFrame title="Drawer - Interactive">
        
        <Box sx={{ position: 'relative', height: 200, border: '1px solid grey', overflow: 'hidden' }}>
          <Drawer {...props} sx={{ position: 'absolute', '& .MuiDrawer-paper': { position: 'absolute', width: 120 } }}>
            <List>
              <ListItem><ListItemText primary="Item 1" /></ListItem>
            </List>
          </Drawer>
        </Box>
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack spacing={2}>
            <Box sx={{ position: 'relative', height: 100, border: '1px solid grey' }}>
               <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper': { position: 'absolute', width: 120 } }}>
                 <List><ListItem><ListItemText primary="Permanent" /></ListItem></List>
               </Drawer>
            </Box>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
