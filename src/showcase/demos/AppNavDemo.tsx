import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { ThemedAppNav, ThemedAppNavPlaceholder } from '../../components/themed/ThemedAppNav';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { PropsPlayground, type PropSchema } from '../PropsPlayground';

const appNavExample = `import { ThemedAppNav } from '@inriver/inflow-react';

<ThemedAppNav
  items={[
    { label: 'Products', icon: 'inventory_2', active: true },
    { label: 'Catalogs', icon: 'category' },
    { label: 'Assets', icon: 'perm_media' },
  ]}
  footer={[{ label: 'Settings', icon: 'settings' }]}
/>`;

const appNavSchema: PropSchema[] = [
  { name: 'activeItem', type: 'select', options: ['Products', 'Catalogs', 'Assets', 'Workflows'], label: 'Active item' },
  { name: 'showFooter', type: 'boolean', label: 'Show footer actions' },
];

export function AppNavDemo() {
  const [playgroundProps, setPlaygroundProps] = useState<Record<string, unknown>>({
    activeItem: 'Products',
    showFooter: true,
  });
  const activeItem = typeof playgroundProps.activeItem === 'string' ? playgroundProps.activeItem : 'Products';
  const showFooter = playgroundProps.showFooter === true;

  return (
    <>
      <DemoFrame title="App Nav - Interactive">
        <Stack direction="row" spacing={3} sx={{ width: '100%', minHeight: 420 }}>
          <ThemedAppNav
            items={[
              { label: 'Products', icon: 'inventory_2', active: activeItem === 'Products' },
              { label: 'Catalogs', icon: 'category', active: activeItem === 'Catalogs' },
              { label: 'Assets', icon: 'perm_media', active: activeItem === 'Assets' },
              { label: 'Workflows', icon: 'account_tree', active: activeItem === 'Workflows' },
            ]}
            footer={showFooter ? [{ label: 'Help', icon: 'help_outline' }, { label: 'Settings', icon: 'settings' }] : []}
          />
          <Typography variant="body2" sx={{ alignSelf: 'center' }}>
            Select the active navigation destination or hide the utility footer.
          </Typography>
        </Stack>
      </DemoFrame>

      <PropsPlayground schema={appNavSchema} values={playgroundProps} onChange={setPlaygroundProps} />

      <DemoFrame title="App Nav - Pinned footer">
        <Stack direction="row" spacing={3} sx={{ width: '100%', minHeight: 420 }}>
          <ThemedAppNav
            items={[
              { label: 'Products', icon: 'inventory_2', active: true },
              { label: 'Catalogs', icon: 'category' },
              { label: 'Assets', icon: 'perm_media' },
              { label: 'Workflows', icon: 'account_tree' },
            ]}
            footer={[
              { label: 'Help', icon: 'help_outline' },
              { label: 'Settings', icon: 'settings' },
            ]}
          />
          <Typography variant="body2" sx={{ alignSelf: 'center' }}>
            Primary navigation stays at the top while utility actions remain pinned to the rail footer.
          </Typography>
        </Stack>
      </DemoFrame>

      <CodeBlock code={appNavExample} language="tsx" />

      <DemoFrame title="App Nav - Placeholder">
        <Stack direction="row" spacing={3} sx={{ width: '100%', minHeight: 300 }}>
          <ThemedAppNavPlaceholder count={5} />
          <Typography variant="body2" sx={{ alignSelf: 'center' }}>
            Use the placeholder rail while application navigation is loading or still being defined.
          </Typography>
        </Stack>
      </DemoFrame>
    </>
  );
}
