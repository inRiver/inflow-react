import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Stack, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function AppBarDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "color": "primary",
  "position": "static"
});

  const schema: PropSchema[] = [
  {
    "name": "color",
    "type": "select",
    "options": [
      "inherit",
      "primary",
      "secondary",
      "default",
      "transparent"
    ]
  },
  {
    "name": "position",
    "type": "select",
    "options": [
      "static",
      "fixed",
      "absolute",
      "sticky",
      "relative"
    ]
  }
];

  const codeExample = `
import { AppBar } from '@mui/material';

<AppBar 
  color={props.color}
  position={props.position}
/>`;

  return (
    <>
      <DemoFrame title="AppBar - Interactive">
        
        <Box sx={{ flexGrow: 1 }}>
          <AppBar {...props}>
            <Toolbar>
              <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                News
              </Typography>
              <Button color="inherit">Login</Button>
            </Toolbar>
          </AppBar>
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
          
          <Stack spacing={4}>
            <AppBar position="static">
              <Toolbar><Typography>Primary</Typography></Toolbar>
            </AppBar>
            <AppBar position="static" color="secondary">
              <Toolbar><Typography>Secondary</Typography></Toolbar>
            </AppBar>
            <AppBar position="static" color="inherit">
              <Toolbar><Typography>Inherit</Typography></Toolbar>
            </AppBar>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
