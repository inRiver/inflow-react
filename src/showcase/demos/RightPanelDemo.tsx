import { useState } from 'react';
import { Box, FormControl, Icon, IconButton, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { ThemedButton } from '../../components/themed/ThemedButton';
import {
  ThemedRightPanel,
  type ThemedRightPanelMode,
  type ThemedRightPanelVariant,
  type ThemedRightPanelWidth,
} from '../../components/themed/ThemedRightPanel';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { PropsPlayground, type PropSchema } from '../PropsPlayground';

const widths: ThemedRightPanelWidth[] = ['narrow', 'medium', 'wide'];
const variants: ThemedRightPanelVariant[] = ['assistant', 'editor', 'modal'];

type RightPanelScenario = 'assistant' | 'query-editor' | 'create-signal' | 'create-project' | 'custom';

const scenarioOptions: Array<{
  id: Exclude<RightPanelScenario, 'custom'>;
  label: string;
  mode: ThemedRightPanelMode;
  variant: ThemedRightPanelVariant;
  width: ThemedRightPanelWidth;
  resizable: boolean;
}> = [
  { id: 'assistant', label: 'Assistant', mode: 'push', variant: 'assistant', width: 'medium', resizable: true },
  { id: 'query-editor', label: 'Query editor', mode: 'push', variant: 'editor', width: 'wide', resizable: true },
  { id: 'create-signal', label: 'Create signal', mode: 'overlay', variant: 'modal', width: 'wide', resizable: false },
  { id: 'create-project', label: 'Create project', mode: 'overlay', variant: 'modal', width: 'wide', resizable: false },
];

const rightPanelSchema: PropSchema[] = [
  { name: 'mode', type: 'select', options: ['push', 'overlay'] },
  { name: 'variant', type: 'select', options: variants },
  { name: 'open', type: 'boolean' },
  { name: 'width', type: 'select', options: widths },
  { name: 'resizable', type: 'boolean' },
  { name: 'hasUnsavedChanges', type: 'boolean' },
];

export function RightPanelDemo() {
  const [open, setOpen] = useState(false);
  const [scenario, setScenario] = useState<RightPanelScenario>('assistant');
  const [mode, setMode] = useState<ThemedRightPanelMode>('push');
  const [variant, setVariant] = useState<ThemedRightPanelVariant>('assistant');
  const [width, setWidth] = useState<ThemedRightPanelWidth>('medium');
  const [resizable, setResizable] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [secondaryView, setSecondaryView] = useState(false);

  const selectedScenario = scenarioOptions.find((option) => option.id === scenario);
  const scenarioLabel = selectedScenario?.label ?? 'Custom';

  const applyScenario = (nextScenario: Exclude<RightPanelScenario, 'custom'>) => {
    const config = scenarioOptions.find((option) => option.id === nextScenario)!;
    setScenario(nextScenario);
    setMode(config.mode);
    setVariant(config.variant);
    setWidth(config.width);
    setResizable(config.resizable);
    setHasUnsavedChanges(false);
    setSecondaryView(false);
  };

  const panelTitle = secondaryView
    ? 'Query Assistant'
    : scenario === 'query-editor'
      ? 'Query editor'
      : scenario === 'create-signal'
        ? 'Create signal'
        : scenario === 'create-project'
          ? 'Create project'
          : 'Assistant';

  return (
    <>
      <DemoFrame title="Right panel - push and overlay">
        <Stack spacing={2} sx={{ width: '100%', alignItems: 'flex-start' }}>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <ThemedButton variant="contained" onClick={() => setOpen(true)}>
              Open {scenarioLabel.toLowerCase()}
            </ThemedButton>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="right-panel-scenario-label">Scenario</InputLabel>
              <Select
                labelId="right-panel-scenario-label"
                label="Scenario"
                value={scenario}
                onChange={(event) => {
                  const nextScenario = event.target.value as RightPanelScenario;
                  if (nextScenario !== 'custom') applyScenario(nextScenario);
                }}
              >
                {scenarioOptions.map((option) => <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>)}
                {scenario === 'custom' && <MenuItem value="custom">Custom</MenuItem>}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="right-panel-width-label">Width</InputLabel>
              <Select
                labelId="right-panel-width-label"
                label="Width"
                value={width}
                onChange={(event) => {
                  setScenario('custom');
                  setWidth(event.target.value as ThemedRightPanelWidth);
                }}
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
            <Typography variant="body2">
              {mode === 'push'
                ? 'The panel sits below the global header. Host content shifts left and remains interactive.'
                : 'The panel covers the global header. A half-opacity backdrop blocks and locks the host content.'}
            </Typography>
          </Box>
        </Stack>
      </DemoFrame>

      <PropsPlayground
        schema={rightPanelSchema}
        values={{ mode, variant, open, width, resizable, hasUnsavedChanges }}
        onChange={(values) => {
          setScenario('custom');
          setMode(values.mode === 'overlay' ? 'overlay' : 'push');
          setVariant(values.variant === 'editor' || values.variant === 'modal' ? values.variant : 'assistant');
          setOpen(values.open === true);
          setWidth(values.width === 'narrow' || values.width === 'wide' ? values.width : 'medium');
          setResizable(values.resizable === true);
          setHasUnsavedChanges(values.hasUnsavedChanges === true);
          setSecondaryView(false);
        }}
      />

      <CodeBlock
        language="tsx"
        code={`<ThemedRightPanel
  open={open}
  mode="${mode}"
  variant="${variant}"
  width="${width}"
  resizable={${resizable}}
  hasUnsavedChanges={${hasUnsavedChanges}}
  onClose={() => setOpen(false)}
>
  {({ requestClose }) => (
    <ChatOrDetailPanel
      onCancel={requestClose}
      onClose={requestClose}
    />
  )}
</ThemedRightPanel>`}
      />

      <ThemedRightPanel
        open={open}
        mode={mode}
        variant={variant}
        width={width}
        resizable={resizable}
        hasUnsavedChanges={hasUnsavedChanges}
        aria-label="Right panel example"
        onClose={() => setOpen(false)}
      >
        {({ requestClose }) => (
          <>
            <Box component="header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                {secondaryView && (
                  <IconButton aria-label="Back to create signal" size="small" onClick={() => setSecondaryView(false)}>
                    <Icon baseClassName="material-icons-outlined">arrow_back</Icon>
                  </IconButton>
                )}
                <Typography variant="h6">{panelTitle}</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5}>
                <IconButton aria-label="More panel actions" size="small">
                  <Icon baseClassName="material-icons-outlined">more_vert</Icon>
                </IconButton>
                <IconButton aria-label="Close panel" size="small" onClick={requestClose}>
                  <Icon baseClassName="material-icons-outlined">close</Icon>
                </IconButton>
              </Stack>
            </Box>
            <Stack spacing={2} sx={{ flex: '1 1 auto', minHeight: 0, overflow: 'auto', p: 3 }}>
              <Typography variant="body2">
                {secondaryView
                  ? 'This assistant replaces the creation form in place and inherits the same 520px panel width.'
                  : resizable
                    ? 'Drag the left edge to resize this panel or choose one of the width presets.'
                    : 'Creation panels use a fixed 520px overlay and do not expose a resize handle.'}
              </Typography>
              {scenario === 'create-signal' && !secondaryView && (
                <ThemedButton variant="outlined" onClick={() => setSecondaryView(true)}>
                  Open Query Assistant
                </ThemedButton>
              )}
              {Array.from({ length: 16 }, (_, index) => (
                <Box key={index} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="subtitle2">Activity {index + 1}</Typography>
                  <Typography variant="body2" color="text.secondary">Scrollable content remains inside the composed panel body.</Typography>
                </Box>
              ))}
            </Stack>
            <Box component="footer" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
              <ThemedButton variant="outlined" onClick={requestClose}>Cancel</ThemedButton>
              {secondaryView && <ThemedButton variant="contained" onClick={() => setSecondaryView(false)}>Apply</ThemedButton>}
              {!secondaryView && variant === 'modal' && <ThemedButton variant="contained" onClick={() => setOpen(false)}>Save</ThemedButton>}
            </Box>
          </>
        )}
      </ThemedRightPanel>
    </>
  );
}
