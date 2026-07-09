import { useState } from 'react';
import { Favorite, Home, LocationOn } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Box, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function BottomNavigationDemo() {
  const [value, setValue] = useState(0);
  const [props, setProps] = useState<Record<string, any>>({
    showLabels: true,
  });

  const schema: PropSchema[] = [
    {
      name: 'showLabels',
      type: 'boolean',
    },
  ];

  const codeExample = `
import { BottomNavigation, BottomNavigationAction } from '@mui/material';

<BottomNavigation value={value} showLabels={props.showLabels} onChange={(event, newValue) => setValue(newValue)}>
  <BottomNavigationAction label="Home" icon={<Home />} />
</BottomNavigation>`;

  return (
    <>
      <DemoFrame title="BottomNavigation - Interactive">
        <Box sx={{ width: 420, maxWidth: '100%' }}>
          <BottomNavigation
            value={value}
            showLabels={props.showLabels}
            onChange={(_event, newValue) => setValue(newValue)}
          >
            <BottomNavigationAction label="Home" icon={<Home />} />
            <BottomNavigationAction label="Favorites" icon={<Favorite />} />
            <BottomNavigationAction label="Nearby" icon={<LocationOn />} />
          </BottomNavigation>
        </Box>
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Box sx={{ width: 320 }}>
              <BottomNavigation value={0} showLabels>
                <BottomNavigationAction label="Home" icon={<Home />} />
                <BottomNavigationAction label="Favorites" icon={<Favorite />} />
                <BottomNavigationAction label="Nearby" icon={<LocationOn />} />
              </BottomNavigation>
            </Box>
            <Box sx={{ width: 320 }}>
              <BottomNavigation value={1}>
                <BottomNavigationAction label="Home" icon={<Home />} />
                <BottomNavigationAction label="Favorites" icon={<Favorite />} />
                <BottomNavigationAction label="Nearby" icon={<LocationOn />} />
              </BottomNavigation>
            </Box>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
