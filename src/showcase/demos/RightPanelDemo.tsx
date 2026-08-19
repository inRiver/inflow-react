import { useState } from 'react';
import { Box, FormControl, Icon, IconButton, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { ThemedButton } from '../../components/themed/ThemedButton';
import {
  ThemedRightPanel,
  type ThemedRightPanelMode,
  type ThemedRightPanelWidth,
} from '../../components/themed/ThemedRightPanel';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { PropsPlayground, type PropSchema } from '../PropsPlayground';

const widths: ThemedRightPanelWidth[] = ['narrow', 'medium', 'wide'];
const rightPanelSchema: PropSchema[] = [
  { name: 'mode', type: 'select', options: ['push', 'overlay'] },
  { name: 'open', type: 'boolean' },
  { name: 'width', type: 'select', options: widths },
];

export function RightPanelDemo() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ThemedRightPanelMode>('push');
  const [width, setWidth] = useState<ThemedRightPanelWidth>('medium');

  return (
    <>
      <DemoFrame title="Right panel - push and overlay">
        <Stack spacing={2} sx={{ width: '100%', alignItems: 'flex-start' }}>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <ThemedButton variant="contained" onClick={() => setOpen(true)}>
              Open {mode} panel
            </ThemedButton>
            <ThemedButton variant="outlined" onClick={() => setMode((current) => current === 'push' ? 'overlay' : 'push')}>
              Switch to {mode === 'push' ? 'overlay' : 'push'}
            </ThemedButton>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="right-panel-width-label">Width</InputLabel>
              <Select
                labelId="right-panel-width-label"
                label="Width"
                value={width}
                onChange={(event) => setWidth(event.target.value as ThemedRightPanelWidth)}
              >
                {widths.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
          <Box
            sx={{
              width: '100%',
              minHeight: 120,
              p: 2,
              bgcolor: 'background.default',
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2">Host content shifts left in push mode. Overlay mode leaves it in place.</Typography>
          </Box>
        </Stack>
      </DemoFrame>

      <PropsPlayground
        schema={rightPanelSchema}
        values={{ mode, open, width }}
        onChange={(values) => {
          setMode(values.mode === 'overlay' ? 'overlay' : 'push');
          setOpen(values.open === true);
          setWidth(values.width === 'narrow' || values.width === 'wide' ? values.width : 'medium');
        }}
      />

      <CodeBlock
        language="tsx"
        code={`<ThemedRightPanel
  open={open}
  mode="${mode}"
  width="${width}"
  resizable
  onClose={() => setOpen(false)}
>
  <ChatOrDetailPanel />
</ThemedRightPanel>`}
      />

      <ThemedRightPanel
        open={open}
        mode={mode}
        width={width}
        resizable
        aria-label="Right panel example"
        onClose={() => setOpen(false)}
      >
        <Box component="header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Composed content</Typography>
          <IconButton aria-label="Close panel" size="small" onClick={() => setOpen(false)}>
            <Icon baseClassName="material-icons-outlined">close</Icon>
          </IconButton>
        </Box>
        <Stack spacing={2} sx={{ flex: '1 1 auto', minHeight: 0, overflow: 'auto', p: 3 }}>
          <Typography variant="body2">Drag the left edge to resize this panel. Its children own the header, body, and footer layout.</Typography>
          {Array.from({ length: 16 }, (_, index) => (
            <Box key={index} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2">Activity {index + 1}</Typography>
              <Typography variant="body2" color="text.secondary">Scrollable content remains inside the composed panel body.</Typography>
            </Box>
          ))}
        </Stack>
        <Box component="footer" sx={{ display: 'flex', justifyContent: 'flex-end', px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
          <ThemedButton variant="outlined" onClick={() => setOpen(false)}>Cancel</ThemedButton>
        </Box>
      </ThemedRightPanel>
    </>
  );
}
