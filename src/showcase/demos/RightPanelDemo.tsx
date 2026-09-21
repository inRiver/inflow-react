import { useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Icon,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { ThemedButton } from '../../components/themed/ThemedButton';
import { ThemedChatPanel, type ThemedChatMessageDef } from '../../components/themed/ThemedChatPanel';
import { ThemedDetailPanel, ThemedDetailPanelSection } from '../../components/themed/ThemedDetailPanel';
import {
  ThemedRightPanel,
  type ThemedRightPanelMode,
  type ThemedRightPanelVariant,
  type ThemedRightPanelWidth,
} from '../../components/themed/ThemedRightPanel';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { PropsPlayground, type PropSchema } from '../PropsPlayground';

const SAMPLE_MESSAGES: ThemedChatMessageDef[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    chips: ['Action chip active', 'Chip selected'],
  },
  {
    id: '2',
    role: 'user',
    content: 'Lorem ipsum dolor sit amet.',
  },
  {
    id: '3',
    role: 'assistant',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.',
    actions: ['Action button', 'Action button'],
  },
];

const CONDITIONS = ['Equals', 'Not equals', 'Contains', 'Is empty'];

const selectedToggleSx = {
  fontFamily: 'inherit',
  '&.Mui-selected, &.Mui-selected:hover': {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    borderColor: 'primary.main',
  },
};

function ConditionRow({ onDelete, infoIcon = false, size = 'small' }: { onDelete?: () => void; infoIcon?: boolean; size?: 'small' | 'medium' }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Autocomplete
        options={['Attribute A', 'Attribute B', 'Attribute C']}
        size={size}
        sx={{ flex: 1 }}
        renderInput={(params) => <TextField {...params} size={size} label="Value" />}
      />
      <Autocomplete
        options={CONDITIONS}
        defaultValue="Equals"
        size={size}
        sx={{ flex: 1 }}
        renderInput={(params) => <TextField {...params} size={size} label="Condition" />}
      />
      <Autocomplete
        options={['Value 1', 'Value 2', 'Value 3']}
        size={size}
        sx={{ flex: 1 }}
        renderInput={(params) => <TextField {...params} size={size} label="Value" />}
      />
      {infoIcon && (
        <IconButton size="small" aria-label="More info" sx={{ color: 'text.secondary' }}>
          <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 20 }}>info</Icon>
        </IconButton>
      )}
      {onDelete && (
        <IconButton size="small" aria-label="Delete condition" onClick={onDelete} sx={{ color: 'text.secondary' }}>
          <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 20 }}>delete</Icon>
        </IconButton>
      )}
    </Stack>
  );
}

const widths: ThemedRightPanelWidth[] = ['narrow', 'medium', 'wide'];
const variants: ThemedRightPanelVariant[] = ['assistant', 'editor', 'modal'];

type RightPanelScenario = 'assistant' | 'query-editor' | 'default' | 'custom';

const scenarioOptions: Array<{
  id: Exclude<RightPanelScenario, 'custom'>;
  label: string;
  mode: ThemedRightPanelMode;
  variant: ThemedRightPanelVariant;
  width: ThemedRightPanelWidth;
  resizable: boolean;
}> = [
  { id: 'assistant',    label: 'Assistant',    mode: 'push',    variant: 'assistant', width: 'medium', resizable: true },
  { id: 'query-editor', label: 'Query editor', mode: 'push',    variant: 'editor',    width: 'wide',   resizable: true },
  { id: 'default',      label: 'Default',      mode: 'overlay', variant: 'modal',     width: 'wide',   resizable: false },
];

const rightPanelSchema: PropSchema[] = [
  { name: 'mode',              type: 'select',  options: ['push', 'overlay'] },
  { name: 'variant',           type: 'select',  options: variants },
  { name: 'open',              type: 'boolean' },
  { name: 'width',             type: 'select',  options: widths },
  { name: 'resizable',         type: 'boolean' },
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

  // Query editor state
  const [qeAndOr, setQeAndOr] = useState<'and' | 'or'>('and');
  const [qeAlertEnabled, setQeAlertEnabled] = useState(true);

  // Default panel state
  const [defAndOr, setDefAndOr] = useState<'and' | 'or'>('and');
  const [defSectionEnabled, setDefSectionEnabled] = useState(true);

  const selectedScenario = scenarioOptions.find((o) => o.id === scenario);
  const scenarioLabel = selectedScenario?.label ?? 'Custom';

  const applyScenario = (next: Exclude<RightPanelScenario, 'custom'>) => {
    const config = scenarioOptions.find((o) => o.id === next)!;
    setScenario(next);
    setMode(config.mode);
    setVariant(config.variant);
    setWidth(config.width);
    setResizable(config.resizable);
    setHasUnsavedChanges(false);
  };

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
                onChange={(e) => {
                  const next = e.target.value as RightPanelScenario;
                  if (next !== 'custom') applyScenario(next);
                }}
              >
                {scenarioOptions.map((o) => <MenuItem key={o.id} value={o.id}>{o.label}</MenuItem>)}
                {scenario === 'custom' && <MenuItem value="custom">Custom</MenuItem>}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="right-panel-width-label">Width</InputLabel>
              <Select
                labelId="right-panel-width-label"
                label="Width"
                value={width}
                onChange={(e) => {
                  setScenario('custom');
                  setWidth(e.target.value as ThemedRightPanelWidth);
                }}
              >
                {widths.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
          <Box sx={{ width: '100%', minHeight: 120, p: 2, bgcolor: 'background.default', border: 1, borderColor: 'divider' }}>
            <Typography variant="body2">
              {mode === 'push'
                ? 'The panel sits below the global header. Host content shifts left and remains interactive.'
                : 'The panel covers the global header. A semi-transparent backdrop blocks the host content.'}
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
    <ThemedChatPanel onClose={requestClose} {/* or ThemedDetailPanel */} />
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
        {({ requestClose }) => {

          /* ── Assistant ──────────────────────────────────────── */
          if (scenario === 'assistant') {
            return (
              <ThemedChatPanel
                title="Query Assistant"
                messages={SAMPLE_MESSAGES}
                attachedFile="Attached file"
                onRemoveAttachment={() => {}}
                credits={{ used: 235, total: 2500 }}
                showCredits
                showCharCount
                showInputHint={false}
                onClose={requestClose}
                onExpand={() => {}}
                onMore={() => {}}
              />
            );
          }

          /* ── Query editor ───────────────────────────────────── */
          if (scenario === 'query-editor') {
            return (
              <ThemedDetailPanel
                title="Query editor"
                onClose={requestClose}
                actions={
                  <>
                    <ThemedButton variant="outlined" onClick={requestClose}>Cancel</ThemedButton>
                    <ThemedButton variant="contained" onClick={() => setOpen(false)}>Save</ThemedButton>
                  </>
                }
              >
                <ThemedDetailPanelSection title="Filters">
                  <Autocomplete
                    options={['Products', 'Assets', 'Categories']}
                    fullWidth
                    size="medium"
                    renderInput={(params) => <TextField {...params} label="Entity type" size="medium" />}
                  />
                  <ConditionRow infoIcon size="medium" />
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={qeAndOr}
                    onChange={(_, val) => val && setQeAndOr(val)}
                  >
                    <ToggleButton value="and" sx={selectedToggleSx}>And</ToggleButton>
                    <ToggleButton value="or"  sx={selectedToggleSx}>Or</ToggleButton>
                  </ToggleButtonGroup>
                  <ConditionRow onDelete={() => {}} size="medium" />
                  <Stack direction="row" spacing={2}>
                    <Button variant="text" size="small" sx={{ color: 'primary.main', p: 0, minWidth: 0, fontSize: '0.875rem' }}>+ Add condition</Button>
                    <Button variant="text" size="small" sx={{ color: 'primary.main', p: 0, minWidth: 0, fontSize: '0.875rem' }}>+ Add completeness condition</Button>
                  </Stack>
                </ThemedDetailPanelSection>

                <ThemedDetailPanelSection
                  title="Alert"
                  headerAction={
                    <Switch
                      checked={qeAlertEnabled}
                      onChange={(e) => setQeAlertEnabled(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                >
                  <Stack direction="row" spacing={1}>
                    <Autocomplete
                      options={['Alert A', 'Alert B']}
                      size="medium"
                      sx={{ flex: 1 }}
                      renderInput={(params) => <TextField {...params} label="Alert name" size="medium" />}
                    />
                    <Autocomplete
                      options={['Email', 'SMS', 'In-app']}
                      defaultValue="Email"
                      size="medium"
                      sx={{ flex: 1 }}
                      renderInput={(params) => <TextField {...params} label="Notify by" size="medium" />}
                    />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    {['Status', 'Status'].map((label, i) => (
                      <Autocomplete
                        key={i}
                        options={['Draft', 'Active', 'Archived']}
                        size="medium"
                        sx={{ flex: 1 }}
                        renderInput={(params) => <TextField {...params} label={label} size="medium" />}
                      />
                    ))}
                  </Stack>
                </ThemedDetailPanelSection>
              </ThemedDetailPanel>
            );
          }

          /* ── Default ────────────────────────────────────────── */
          if (scenario === 'default') {
            return (
              <ThemedDetailPanel
                title="Title"
                onClose={requestClose}
                actions={
                  <>
                    <ThemedButton variant="outlined" onClick={requestClose}>Button</ThemedButton>
                    <ThemedButton variant="contained" onClick={() => setOpen(false)}>Button</ThemedButton>
                  </>
                }
              >
                <ThemedDetailPanelSection title="Subtitle">
                  <Autocomplete
                    options={['Option A', 'Option B', 'Option C']}
                    fullWidth
                    size="medium"
                    renderInput={(params) => <TextField {...params} label="Label" size="medium" />}
                  />
                  <ConditionRow infoIcon size="medium" />
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={defAndOr}
                    onChange={(_, val) => val && setDefAndOr(val)}
                  >
                    <ToggleButton value="and" sx={selectedToggleSx}>And</ToggleButton>
                    <ToggleButton value="or"  sx={selectedToggleSx}>Or</ToggleButton>
                  </ToggleButtonGroup>
                  <ConditionRow onDelete={() => {}} size="medium" />
                  <Stack direction="row" spacing={2}>
                    <Button variant="text" size="small" sx={{ color: 'primary.main', p: 0, minWidth: 0, fontSize: '0.875rem' }}>+ Label</Button>
                    <Button variant="text" size="small" sx={{ color: 'primary.main', p: 0, minWidth: 0, fontSize: '0.875rem' }}>+ Label</Button>
                  </Stack>
                </ThemedDetailPanelSection>

                <ThemedDetailPanelSection
                  title="Subtitle"
                  headerAction={
                    <Switch
                      checked={defSectionEnabled}
                      onChange={(e) => setDefSectionEnabled(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                >
                  <Autocomplete
                    options={['Option A', 'Option B']}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Label" size="medium" />}
                  />
                  <Autocomplete
                    options={['Option A', 'Option B']}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Label" size="medium" />}
                  />
                </ThemedDetailPanelSection>
              </ThemedDetailPanel>
            );
          }

          /* ── Custom (props playground) ──────────────────────── */
          return (
            <ThemedDetailPanel
              title="Custom panel"
              onClose={requestClose}
              actions={<ThemedButton variant="outlined" onClick={requestClose}>Close</ThemedButton>}
            >
              <ThemedDetailPanelSection title="Identification">
                {['Name', 'Description', 'External ID'].map((item) => (
                  <Box key={item} sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">{item}</Typography>
                  </Box>
                ))}
              </ThemedDetailPanelSection>
              <ThemedDetailPanelSection title="Classification">
                {['Category', 'Tags', 'Status'].map((item) => (
                  <Box key={item} sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">{item}</Typography>
                  </Box>
                ))}
              </ThemedDetailPanelSection>
            </ThemedDetailPanel>
          );
        }}
      </ThemedRightPanel>
    </>
  );
}
