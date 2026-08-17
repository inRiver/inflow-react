import { useState } from 'react';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import { ThemedTabPanel, ThemedTabs, type ThemedTabItem } from '../../components/themed/ThemedTabs';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { DemoVariantTabs, type DemoVariant } from '../DemoVariantTabs';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';
import { getThemedComponentInfo } from '../themedComponentInfo';

const themedInfo = getThemedComponentInfo('tabs');

const themedTabs: ThemedTabItem[] = [
  { label: 'Recent orders' },
  { label: 'Saved items', icon: 'bookmark' },
  { label: 'Account settings' },
  { label: 'Disabled tab', disabled: true },
];

const schema: PropSchema[] = [
  { name: 'textColor', type: 'select', options: ['secondary', 'primary', 'inherit'] },
  { name: 'indicatorColor', type: 'select', options: ['secondary', 'primary'] },
  { name: 'variant', type: 'select', options: ['standard', 'scrollable', 'fullWidth'] },
];
const themedSchema: PropSchema[] = [
  { name: 'showDisabledTab', type: 'boolean', label: 'Show disabled tab' },
];

export function TabsDemo() {
  const [variant, setVariant] = useState<DemoVariant>('mui');
  const [props, setProps] = useState<Record<string, unknown>>({
    textColor: 'primary',
    indicatorColor: 'primary',
    variant: 'standard',
  });
  const [activeTab, setActiveTab] = useState(0);
  const [themedProps, setThemedProps] = useState<Record<string, unknown>>({ showDisabledTab: true });
  const textColor = props.textColor === 'secondary' || props.textColor === 'inherit' ? props.textColor : 'primary';
  const indicatorColor = props.indicatorColor === 'secondary' ? 'secondary' : 'primary';
  const tabsVariant = props.variant === 'scrollable' || props.variant === 'fullWidth' ? props.variant : 'standard';
  const interactiveThemedTabs = themedProps.showDisabledTab === true ? themedTabs : themedTabs.slice(0, 3);

  return (
    <>
      <DemoVariantTabs
        value={variant}
        onChange={setVariant}
        muiLabel="MUI Tabs"
        themedLabel="ThemedTabs"
        themedReason={themedInfo?.reason}
      />

      {variant === 'mui' ? (
        <>
          <DemoFrame title="Tabs - Interactive">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={0} textColor={textColor} indicatorColor={indicatorColor} variant={tabsVariant}>
                <Tab label="Recent orders" />
                <Tab label="Saved items" />
                <Tab label="Account settings" />
              </Tabs>
            </Box>
          </DemoFrame>

          <PropsPlayground schema={schema} values={props} onChange={setProps} />

          <CodeBlock
            code={`import { Tabs } from '@mui/material';

<Tabs textColor="primary" indicatorColor="primary" variant="standard" />`}
            language="tsx"
          />

          <DemoFrame title="All States">
            <Stack spacing={4}>
              <Tabs value={0}><Tab label="Active" /><Tab label="Default" /><Tab label="Disabled" disabled /></Tabs>
              <Tabs value={0} textColor="secondary" indicatorColor="secondary"><Tab label="Secondary" /><Tab label="Two" /></Tabs>
            </Stack>
          </DemoFrame>
        </>
      ) : (
        <>
          <DemoFrame title="ThemedTabs - Interactive">
            <ThemedTabs tabs={interactiveThemedTabs} value={activeTab} onChange={(_, index) => setActiveTab(index)} />
            <Box sx={{ pt: 3 }}>
              <ThemedTabPanel value={activeTab} index={0}>Recent orders panel</ThemedTabPanel>
              <ThemedTabPanel value={activeTab} index={1}>Saved items panel</ThemedTabPanel>
              <ThemedTabPanel value={activeTab} index={2}>Account settings panel</ThemedTabPanel>
            </Box>
          </DemoFrame>

          <PropsPlayground schema={themedSchema} values={themedProps} onChange={setThemedProps} />

          <CodeBlock
            code={`import { ThemedTabPanel, ThemedTabs } from '@inriver/inflow-react';

const tabs = [
  { label: 'Recent orders' },
  { label: 'Saved items', icon: 'bookmark' },
];

<ThemedTabs tabs={tabs} value={activeTab} onChange={(_, index) => setActiveTab(index)} />
<ThemedTabPanel value={activeTab} index={0}>Orders</ThemedTabPanel>`}
            language="tsx"
          />

          <DemoFrame title="ThemedTabs - All States">
            <Stack spacing={3}>
              <ThemedTabs tabs={themedTabs} />
              <ThemedTabs
                tabs={[
                  { label: 'Icon tab', icon: 'dashboard' },
                  { label: 'Default tab' },
                  { label: 'Disabled tab', disabled: true },
                ]}
              />
            </Stack>
          </DemoFrame>
        </>
      )}
    </>
  );
}
