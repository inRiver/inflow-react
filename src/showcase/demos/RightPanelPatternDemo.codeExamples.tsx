import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { ThemedChatPanel, ThemedDetailPanel, ThemedRightPanel, type ThemedChatMessageDef } from '../../components/themed';

type Scenario = 'push' | 'overlay' | 'chat';
const messages: ThemedChatMessageDef[] = [
  { id: 'welcome', role: 'assistant', content: 'How can I help with this publisher?' },
];

export function PanelLayouts() {
  const [scenario, setScenario] = useState<Scenario>('push');
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [thread, setThread] = useState(messages);
  const mode = scenario === 'overlay' ? 'overlay' : 'push';
  const openScenario = (next: Scenario) => { setScenario(next); setOpen(true); };

  return (
    <>
      {/* Apply the provider width once to the page content, not to an ancestor too. */}
      <Box sx={{ marginRight: 'var(--infl-right-panel-width, 0px)' }}>
        <Typography>Choose a panel layout. Push keeps the page interactive; overlay blocks it.</Typography>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <Button onClick={() => openScenario('push')}>Open push panel</Button>
          <Button onClick={() => openScenario('overlay')}>Open overlay panel</Button>
          <Button onClick={() => openScenario('chat')}>Open chat panel</Button>
        </Stack>
      </Box>
      <ThemedRightPanel open={open} onClose={() => setOpen(false)} mode={mode} variant={scenario === 'chat' ? 'assistant' : 'editor'} aria-label="Layout example panel">
        {({ requestClose }) => scenario === 'chat' ? (
          <ThemedChatPanel title="Publisher assistant" messages={thread} onClose={requestClose} inputValue={input} onInputChange={setInput} onSendMessage={(text) => { setThread((current) => [...current, { id: String(current.length), role: 'user', content: text }]); setInput(''); }} />
        ) : (
          <ThemedDetailPanel title={scenario === 'push' ? 'Push panel' : 'Overlay panel'} onClose={requestClose}>
            <Typography>Panel content stays owned by the application.</Typography>
          </ThemedDetailPanel>
        )}
      </ThemedRightPanel>
    </>
  );
}
