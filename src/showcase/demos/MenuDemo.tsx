import { useState } from 'react';
import { Button, MenuItem, MenuList, Paper, Stack } from '@mui/material';
import { ThemedMenu } from '../../components/themed/ThemedMenu';
import type { ThemedMenuItemDef } from '../../components/themed/ThemedMenu';
import { inflowTokens } from '../../theme';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { DemoVariantTabs, type DemoVariant } from '../DemoVariantTabs';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';
import { getThemedComponentInfo } from '../themedComponentInfo';

const themedInfo = getThemedComponentInfo('menu');

const themedItems: ThemedMenuItemDef[] = [
  { id: 'profile', label: 'Profile', icon: 'person', shortcut: '⌘P', selected: true },
  { id: 'account', label: 'My account', icon: 'settings', shortcut: '⌘,' },
  { id: 'export', label: 'Export', icon: 'download', dividerBefore: true },
  { id: 'logout', label: 'Log out', icon: 'logout', disabled: true, dividerBefore: true },
];

const schema: PropSchema[] = [{ name: 'dense', type: 'boolean' }];

const muiCodeExample = `
import { MenuList } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<MenuList dense={props.dense} />`;

const themedCodeExample = `
import { ThemedMenu } from '@inriver/inflow-react';

const items = [
  { id: 'profile', label: 'Profile', icon: 'person', shortcut: '⌘P', selected: true },
  { id: 'export', label: 'Export', icon: 'download', dividerBefore: true },
  { id: 'logout', label: 'Log out', disabled: true, dividerBefore: true },
];

<ThemedMenu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={() => setAnchorEl(null)}
  items={items}
  dense={dense}
/>`;

export function MenuDemo() {
  const [variant, setVariant] = useState<DemoVariant>('mui');
  const [props, setProps] = useState<Record<string, unknown>>({ dense: false });
  const [themedAnchorEl, setThemedAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [denseAnchorEl, setDenseAnchorEl] = useState<HTMLButtonElement | null>(null);
  const dense = props.dense === true;

  return (
    <>
      <DemoVariantTabs
        value={variant}
        onChange={setVariant}
        muiLabel="MUI MenuList"
        themedLabel="ThemedMenu"
        themedReason={themedInfo?.reason}
      />

      {variant === 'mui' ? (
        <>
          <DemoFrame title="MenuList - Interactive">
            <Paper sx={{ width: 200, maxWidth: '100%', borderRadius: `${inflowTokens.radius.xs}px` }}>
              <MenuList dense={dense}>
                <MenuItem selected>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
              </MenuList>
            </Paper>
          </DemoFrame>

          <PropsPlayground schema={schema} values={props} onChange={setProps} />

          <CodeBlock code={muiCodeExample} language="tsx" />

          <DemoFrame title="All States">
            <Stack spacing={2} direction="column">
              <Stack direction="row" spacing={4}>
                <Paper sx={{ borderRadius: `${inflowTokens.radius.xs}px` }}>
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
      ) : (
        <>
          <DemoFrame title="ThemedMenu - Interactive">
            <Button
              variant="contained"
              onClick={(event) => {
                setDenseAnchorEl(null);
                setThemedAnchorEl(event.currentTarget);
              }}
            >
              Open menu
            </Button>
            <ThemedMenu
              anchorEl={themedAnchorEl}
              open={Boolean(themedAnchorEl)}
              onClose={() => setThemedAnchorEl(null)}
              items={themedItems}
              dense={dense}
            />
          </DemoFrame>

          <PropsPlayground schema={schema} values={props} onChange={setProps} />

          <CodeBlock code={themedCodeExample} language="tsx" />

          <DemoFrame title="ThemedMenu - Dense">
            <Button
              variant="outlined"
              onClick={(event) => {
                setThemedAnchorEl(null);
                setDenseAnchorEl(event.currentTarget);
              }}
            >
              Open dense menu
            </Button>
            <ThemedMenu
              anchorEl={denseAnchorEl}
              open={Boolean(denseAnchorEl)}
              onClose={() => setDenseAnchorEl(null)}
              items={themedItems}
              dense
            />
          </DemoFrame>
        </>
      )}
    </>
  );
}
