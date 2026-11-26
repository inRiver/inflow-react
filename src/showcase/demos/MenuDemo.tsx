import { useState } from 'react';
import { Button, Checkbox, ListItemIcon, ListItemText, ListSubheader, MenuItem, MenuList, Paper, Radio, Stack } from '@mui/material';
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

const upsellItems: ThemedMenuItemDef[] = [
  { id: 'signal-center', label: 'Signal Center', locked: true, lockedTooltip: 'Enable Orchestrate to get access to Projects and Signals.' },
  { id: 'projects', label: 'Projects', locked: true, lockedTooltip: 'Enable Orchestrate to get access to Projects and Signals.' },
];

const filterItems: ThemedMenuItemDef[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'review', label: 'In review' },
  { id: 'approved', label: 'Approved' },
  { id: 'archived', label: 'Archived' },
];

const sortOptions = [
  { id: 'name', label: 'Name' },
  { id: 'modified', label: 'Last modified' },
  { id: 'created', label: 'Date created' },
];

const groupedItems: ThemedMenuItemDef[] = [
  { id: 'rename', label: 'Rename', groupLabel: 'Edit' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'export-csv', label: 'Export as CSV', groupLabel: 'Export', dividerBefore: true },
  { id: 'export-pdf', label: 'Export as PDF' },
  { id: 'delete', label: 'Delete', groupLabel: 'Danger zone', dividerBefore: true },
];

const iconItems: ThemedMenuItemDef[] = [
  { id: 'cut', label: 'Cut', icon: 'content_cut', shortcut: '⌘X' },
  { id: 'copy', label: 'Copy', icon: 'content_copy', shortcut: '⌘C' },
  { id: 'paste', label: 'Paste', icon: 'content_paste', shortcut: '⌘V' },
];

const schema: PropSchema[] = [{ name: 'dense', type: 'boolean' }];

const muiCodeExample = `
import { MenuList } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<MenuList dense={props.dense}>
  {/* Multi-select: a checkbox on each row, and the menu stays open. */}
  <MenuItem role="menuitemcheckbox" aria-checked={checked}>
    <ListItemIcon><Checkbox size="small" checked={checked} disableRipple tabIndex={-1} sx={{ p: 0 }} /></ListItemIcon>
    <ListItemText>Draft</ListItemText>
  </MenuItem>
</MenuList>`;

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
  header="Orchestrate"
  cta={{ label: 'Enable Orchestrate', onClick: handleEnable }}
  dense={dense}
/>

// Pick one: a radio button on each item; choosing an item closes the menu.
<ThemedMenu radio anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
  items={sortOptions.map((option) => ({ ...option, selected: option.id === sortBy }))} onSelect={setSortBy} />

// Sections: put groupLabel on the first item of each group (dividerBefore draws a line above the heading).
const grouped = [
  { id: 'rename', label: 'Rename', groupLabel: 'Edit' },
  { id: 'export', label: 'Export as CSV', groupLabel: 'Export', dividerBefore: true },
];

// Multi-select: a checkbox on each item, and the menu stays open while you toggle.
<ThemedMenu
  multiple
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={() => setAnchorEl(null)}
  items={statuses.map((status) => ({ ...status, selected: selectedIds.includes(status.id) }))}
  onSelect={(id) =>
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]))
  }
/>`;

export function MenuDemo() {
  const [variant, setVariant] = useState<DemoVariant>('mui');
  const [props, setProps] = useState<Record<string, unknown>>({ dense: false });
  const [themedAnchorEl, setThemedAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [incompleteAnchorEl, setIncompleteAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [upsellAnchorEl, setUpsellAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [denseAnchorEl, setDenseAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [multipleAnchorEl, setMultipleAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['draft', 'approved']);
  const [mutedChecks, setMutedChecks] = useState<string[]>(['draft']);
  const [extraMenu, setExtraMenu] = useState<{ id: 'radio' | 'grouped' | 'icons'; anchor: HTMLButtonElement } | null>(null);
  const [sortBy, setSortBy] = useState('modified');
  const [mutedSort, setMutedSort] = useState('name');
  const dense = props.dense === true;
  const toggle = (ids: string[], id: string) => (ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]);

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

          <DemoFrame title="MenuList - With checkboxes">
            <Paper sx={{ width: 200, maxWidth: '100%', borderRadius: `${inflowTokens.radius.xs}px` }}>
              <MenuList dense={dense}>
                {filterItems.map((item) => {
                  const checked = mutedChecks.includes(item.id);
                  return (
                    <MenuItem
                      key={item.id}
                      role="menuitemcheckbox"
                      aria-checked={checked}
                      onClick={() => setMutedChecks((ids) => toggle(ids, item.id))}
                    >
                      <ListItemIcon sx={{ '&&&': { minWidth: 30 } }}>
                        <Checkbox
                          size="small"
                                checked={checked}
                          disableRipple
                          tabIndex={-1}
                          slotProps={{ input: { 'aria-hidden': true, tabIndex: -1 } }}
                          sx={{ p: 0, pointerEvents: 'none' }}
                        />
                      </ListItemIcon>
                      <ListItemText slotProps={{ primary: { variant: 'body2' } }}>{item.label}</ListItemText>
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Paper>
          </DemoFrame>

          <DemoFrame title="MenuList - Radio items and groups">
            <Paper sx={{ width: 220, maxWidth: '100%', borderRadius: `${inflowTokens.radius.xs}px` }}>
              <MenuList dense={dense}>
                <ListSubheader>Sort by</ListSubheader>
                {sortOptions.map((option) => {
                  const checked = mutedSort === option.id;
                  return (
                    <MenuItem
                      key={option.id}
                      role="menuitemradio"
                      aria-checked={checked}
                      onClick={() => setMutedSort(option.id)}
                    >
                      <ListItemIcon sx={{ '&&&': { minWidth: 30 } }}>
                        <Radio
                          size="small"
                          checked={checked}
                          disableRipple
                          tabIndex={-1}
                          slotProps={{ input: { 'aria-hidden': true, tabIndex: -1 } }}
                          sx={{ p: 0, pointerEvents: 'none' }}
                        />
                      </ListItemIcon>
                      <ListItemText slotProps={{ primary: { variant: 'body2' } }}>{option.label}</ListItemText>
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Paper>
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

          <DemoFrame title="Example: Upsell navigation menu">
            <Button
              variant="outlined"
              onClick={(event) => {
                setThemedAnchorEl(null);
                setIncompleteAnchorEl(null);
                setDenseAnchorEl(null);
                setUpsellAnchorEl(event.currentTarget);
              }}
            >
              Open upsell menu
            </Button>
            <ThemedMenu
              anchorEl={upsellAnchorEl}
              open={Boolean(upsellAnchorEl)}
              onClose={() => setUpsellAnchorEl(null)}
              header="Orchestrate"
              items={upsellItems}
              cta={{ label: 'Enable Orchestrate', onClick: () => undefined }}
              dense={dense}
            />
          </DemoFrame>

          <DemoFrame title="ThemedMenu - Multiple (checkboxes)">
            <Button
              variant="outlined"
              onClick={(event) => {
                setThemedAnchorEl(null);
                setIncompleteAnchorEl(null);
                setDenseAnchorEl(null);
                setUpsellAnchorEl(null);
                setMultipleAnchorEl(event.currentTarget);
              }}
            >
              Filter by status ({selectedStatuses.length})
            </Button>
            <ThemedMenu
              multiple
              anchorEl={multipleAnchorEl}
              open={Boolean(multipleAnchorEl)}
              onClose={() => setMultipleAnchorEl(null)}
              items={filterItems.map((item) => ({ ...item, selected: selectedStatuses.includes(item.id) }))}
              onSelect={(id) => setSelectedStatuses((ids) => toggle(ids, id))}
              dense={dense}
            />
          </DemoFrame>

          <DemoFrame title="ThemedMenu - Single choice (radio)">
            <Button variant="outlined" onClick={(event) => setExtraMenu({ id: 'radio', anchor: event.currentTarget })}>
              Sort by: {sortOptions.find((option) => option.id === sortBy)?.label}
            </Button>
            <ThemedMenu
              radio
              anchorEl={extraMenu?.id === 'radio' ? extraMenu.anchor : null}
              open={extraMenu?.id === 'radio'}
              onClose={() => setExtraMenu(null)}
              items={sortOptions.map((option) => ({ ...option, selected: option.id === sortBy }))}
              onSelect={setSortBy}
              dense={dense}
            />
          </DemoFrame>

          <DemoFrame title="ThemedMenu - Grouped sections">
            <Button variant="outlined" onClick={(event) => setExtraMenu({ id: 'grouped', anchor: event.currentTarget })}>
              Open grouped menu
            </Button>
            <ThemedMenu
              anchorEl={extraMenu?.id === 'grouped' ? extraMenu.anchor : null}
              open={extraMenu?.id === 'grouped'}
              onClose={() => setExtraMenu(null)}
              items={groupedItems}
              dense={dense}
            />
          </DemoFrame>

          <DemoFrame title="ThemedMenu - Icons and shortcuts">
            <Button variant="outlined" onClick={(event) => setExtraMenu({ id: 'icons', anchor: event.currentTarget })}>
              Open icon menu
            </Button>
            <ThemedMenu
              anchorEl={extraMenu?.id === 'icons' ? extraMenu.anchor : null}
              open={extraMenu?.id === 'icons'}
              onClose={() => setExtraMenu(null)}
              items={iconItems}
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
