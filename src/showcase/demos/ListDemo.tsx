import { useState } from 'react';
import { List, ListItem, ListItemText, ListItemButton, ListItemIcon, Stack, Paper } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function ListDemo() {
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
import { List } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<List 
  dense={props.dense}
/>`;

  return (
    <>
      <DemoFrame title="List - Interactive">
        
        <Paper variant="outlined">
          <List {...props}>
            <ListItem>
              <ListItemText primary="Item 1" secondary="Secondary text" />
            </ListItem>
            <ListItemButton>
              <ListItemIcon><InboxIcon /></ListItemIcon>
              <ListItemText primary="Button Item" />
            </ListItemButton>
          </List>
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
          
          <Stack direction="row" spacing={2}>
            <Paper variant="outlined" sx={{ width: 200 }}>
              <List>
                <ListItem><ListItemText primary="Default" /></ListItem>
                <ListItemButton disabled><ListItemText primary="Disabled" /></ListItemButton>
                <ListItemButton><ListItemText primary="Hover/Click me" /></ListItemButton>
              </List>
            </Paper>
            <Paper variant="outlined" sx={{ width: 200 }}>
              <List dense>
                <ListItem><ListItemText primary="Dense Default" /></ListItem>
                <ListItemButton selected><ListItemText primary="Selected" /></ListItemButton>
              </List>
            </Paper>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
