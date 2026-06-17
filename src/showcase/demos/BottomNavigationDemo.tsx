import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, Favorite, LocationOn } from '@mui/icons-material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

export function BottomNavigationDemo() {
  const [value, setValue] = useState(0);

  const codeExample = `<BottomNavigation value={value} onChange={(e, newValue) => setValue(newValue)}>
  <BottomNavigationAction label="Home" icon={<Home />} />
  <BottomNavigationAction label="Favorites" icon={<Favorite />} />
</BottomNavigation>`;

  return (
    <DemoFrame title="BottomNavigation">
      <BottomNavigation
        value={value}
        onChange={(_event, newValue) => setValue(newValue)}
        showLabels
      >
        <BottomNavigationAction label="Home" icon={<Home />} />
        <BottomNavigationAction label="Favorites" icon={<Favorite />} />
        <BottomNavigationAction label="Nearby" icon={<LocationOn />} />
      </BottomNavigation>
      <CodeBlock code={codeExample} />
    </DemoFrame>
  );
}
