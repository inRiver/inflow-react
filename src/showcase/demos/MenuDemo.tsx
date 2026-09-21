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

const regularItems: ThemedMenuItemDef[] = [
  { id: 'profile', label: 'Profile', selected: true },
  { id: 'account', label: 'My account' },
  { id: 'export', label: 'Export', locked: true, lockedTooltip: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: 'logout', label: 'Log out', disabled: true },
];

const incompleteItems: ThemedMenuItemDef[] = [
  { id: 'incomplete', label: 'Incomplete Products', selected: true },
  { id: 'merch', label: 'Merchandising', locked: true, lockedTooltip: 'Used by "Compliance copy fixes". A work area query can only be assigned to one signal at a time.' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'content', label: 'Content Operations' },
  { id: 'localization', label: 'Localization' },
  { id: 'compliance', label: 'Compliance', locked: true, lockedTooltip: 'Already assigned to another signal.' },
];

const schema: PropSchema[] = [{ name: 'dense', type: 'boolean' }];

const muiCodeExample = `
import { MenuList } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<MenuList dense={props.dense} />`;

const themedCodeExample = `
import { ThemedMenu } from '@inriver/inflow-react';

const items = [
  { id: 'incomplete', label: 'Incomplete Products', selected: true },
  { id: 'merch', label: 'Merchandising', locked: true, lockedTooltip: 'Used by "Compliance copy fixes". A work area query can only be assigned to one signal at a time.' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'compliance', label: 'Compliance', locked: true, lockedTooltip: 'Already assigned to another signal.' },
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
  const [incompleteAnchorEl, setIncompleteAnchorEl] = useState<HTMLButtonElement | null>(null);
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
          <DemoFrame title="ThemedMenu - Regular">
            <Button
              variant="contained"
              onClick={(event) => {
                setIncompleteAnchorEl(null);
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
              items={regularItems}
              dense={dense}
            />
          </DemoFrame>

          <DemoFrame title="ThemedMenu - With locked items">
            <Button
              variant="outlined"
              onClick={(event) => {
                setThemedAnchorEl(null);
                setDenseAnchorEl(null);
                setIncompleteAnchorEl(event.currentTarget);
              }}
            >
              Open work area menu
            </Button>
            <ThemedMenu
              anchorEl={incompleteAnchorEl}
              open={Boolean(incompleteAnchorEl)}
              onClose={() => setIncompleteAnchorEl(null)}
              items={incompleteItems}
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
                setIncompleteAnchorEl(null);
                setDenseAnchorEl(event.currentTarget);
              }}
            >
              Open dense menu
            </Button>
            <ThemedMenu
              anchorEl={denseAnchorEl}
              open={Boolean(denseAnchorEl)}
              onClose={() => setDenseAnchorEl(null)}
              items={regularItems}
              dense
            />
          </DemoFrame>
        </>
      )}
    </>
  );
}
