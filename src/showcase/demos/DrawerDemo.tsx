import { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, Box, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function DrawerDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "anchor": "left",
  "variant": "permanent"
});
  const [previewContainer, setPreviewContainer] = useState<HTMLDivElement | null>(null);

  const isHorizontalAnchor = props.anchor === 'top' || props.anchor === 'bottom';

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

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Drawer 
  anchor={props.anchor}
  variant={props.variant}
  open={true}
/>`;

  return (
    <>
      <DemoFrame title="Drawer - Interactive">
        
        <Box ref={setPreviewContainer} sx={{ position: 'relative', height: 200, border: '1px solid grey', overflow: 'hidden' }}>
          <Drawer
            {...props}
            open
            hideBackdrop
            ModalProps={{ container: previewContainer, disableScrollLock: true, keepMounted: true }}
            sx={{
              position: 'absolute',
              inset: 0,
              '& .MuiDrawer-paper': isHorizontalAnchor
                ? {
                    position: 'absolute',
                    top: props.anchor === 'top' ? 0 : 'auto',
                    right: 0,
                    bottom: props.anchor === 'bottom' ? 0 : 'auto',
                    left: 0,
                    width: '100%',
                    height: 120,
                  }
                : {
                    position: 'absolute',
                    width: 120,
                    height: '100%',
                  },
            }}
          >
            <List>
              <ListItem disablePadding>
                <ListItemButton selected>
                  <ListItemText primary="Inbox" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText primary="Starred" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText primary="Sent mail" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText primary="Drafts" />
                </ListItemButton>
              </ListItem>
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
                 <List>
                   <ListItem disablePadding>
                     <ListItemButton>
                       <ListItemText primary="Inbox" />
                     </ListItemButton>
                   </ListItem>
                   <ListItem disablePadding>
                     <ListItemButton>
                       <ListItemText primary="Starred" />
                     </ListItemButton>
                   </ListItem>
                   <ListItem disablePadding>
                     <ListItemButton>
                       <ListItemText primary="Drafts" />
                     </ListItemButton>
                   </ListItem>
                 </List>
                </Drawer>
             </Box>
           </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
