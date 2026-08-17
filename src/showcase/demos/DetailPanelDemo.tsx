import { useState } from 'react';
import { Box, Switch, TextField } from '@mui/material';
import { ThemedButton } from '../../components/themed/ThemedButton';
import { ThemedDetailPanel, ThemedDetailPanelSection } from '../../components/themed/ThemedDetailPanel';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { PropsPlayground, type PropSchema } from '../PropsPlayground';

const codeExample = `import { ThemedDetailPanel, ThemedDetailPanelSection } from '@inriver/inflow-react';

<ThemedDetailPanel
  title="Edit product"
  onClose={handleClose}
  actions={<ThemedButton variant="contained">Save</ThemedButton>}
>
  <ThemedDetailPanelSection title="Details">
    <TextField label="Product name" fullWidth />
  </ThemedDetailPanelSection>
</ThemedDetailPanel>`;

const detailPanelSchema: PropSchema[] = [
  { name: 'title', type: 'text' },
  { name: 'showActions', type: 'boolean', label: 'Show footer actions' },
  { name: 'showClose', type: 'boolean', label: 'Show close button' },
];

export function DetailPanelDemo() {
  const [playgroundProps, setPlaygroundProps] = useState<Record<string, unknown>>({
    title: 'Edit product',
    showActions: true,
    showClose: true,
  });
  const title = typeof playgroundProps.title === 'string' ? playgroundProps.title : 'Edit product';
  const showActions = playgroundProps.showActions === true;
  const showClose = playgroundProps.showClose === true;

  return (
    <>
      <DemoFrame title="Detail panel">
        <Box sx={{ height: 480, maxWidth: 480, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
          <ThemedDetailPanel
            title={title}
            onClose={showClose ? () => undefined : undefined}
            actions={showActions ? (
              <>
                <ThemedButton variant="outlined">Cancel</ThemedButton>
                <ThemedButton variant="contained">Save changes</ThemedButton>
              </>
            ) : undefined}
          >
            <ThemedDetailPanelSection title="Details">
              <TextField label="Product name" defaultValue="Canvas backpack" fullWidth />
              <TextField label="SKU" defaultValue="BAG-1042" fullWidth />
            </ThemedDetailPanelSection>
            <ThemedDetailPanelSection
              title="Publication"
              headerAction={<Switch defaultChecked slotProps={{ input: { 'aria-label': 'Publish product' } }} />}
            >
              <TextField label="Catalog" defaultValue="Spring collection" fullWidth />
            </ThemedDetailPanelSection>
          </ThemedDetailPanel>
        </Box>
      </DemoFrame>

      <PropsPlayground schema={detailPanelSchema} values={playgroundProps} onChange={setPlaygroundProps} />

      <CodeBlock code={codeExample} language="tsx" />
    </>
  );
}
