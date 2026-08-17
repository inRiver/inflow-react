import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { ThemedButton } from '../../components/themed/ThemedButton';
import { ThemedChatPanel, type ThemedChatMessageDef } from '../../components/themed/ThemedChatPanel';
import { ThemedRightPanel } from '../../components/themed/ThemedRightPanel';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { PropsPlayground, type PropSchema } from '../PropsPlayground';

const messages: ThemedChatMessageDef[] = [
  {
    id: 'assistant-intro',
    role: 'assistant',
    content: 'I found three fields that could use a more complete product description.',
    chips: ['Summarize changes', 'Show missing fields'],
    actions: ['Review products'],
  },
  {
    id: 'user-request',
    role: 'user',
    content: 'Show the missing fields first.',
  },
  {
    id: 'assistant-followup',
    role: 'assistant',
    content: 'The product summary, material composition, and care instructions need review.',
    actions: ['Create a task', 'Export list'],
  },
];

const chatPanelSchema: PropSchema[] = [
  { name: 'assistant', type: 'select', options: ['Query Assistant', 'Content Onboarding Assistant', 'Expression Assistant'], label: 'Assistant' },
  { name: 'attachmentVisible', type: 'boolean', label: 'Show attachment chip' },
];

export function ChatPanelDemo() {
  const [open, setOpen] = useState(false);
  const [assistant, setAssistant] = useState('Query Assistant');
  const [attachmentVisible, setAttachmentVisible] = useState(true);

  return (
    <>
      <DemoFrame title="AI assistant chat panel">
        <Stack spacing={1.5} sx={{ width: '100%', alignItems: 'flex-start' }}>
          <Typography variant="body2" color="text.secondary">
            An Inflow PIM assistant composes its full chat experience into the right-panel host.
          </Typography>
          <ThemedButton variant="contained" onClick={() => setOpen(true)}>
            Open chat assistant
          </ThemedButton>
        </Stack>
      </DemoFrame>

      <PropsPlayground
        schema={chatPanelSchema}
        values={{ assistant, attachmentVisible }}
        onChange={(values) => {
          setAssistant(
            values.assistant === 'Content Onboarding Assistant' || values.assistant === 'Expression Assistant'
              ? values.assistant
              : 'Query Assistant',
          );
          setAttachmentVisible(values.attachmentVisible === true);
        }}
      />

      <CodeBlock
        language="tsx"
        code={`<ThemedRightPanel open={open} onClose={handleClose} variant="assistant">
  <ThemedChatPanel
    title="${assistant}"
    dropdownOptions={['Query Assistant', 'Content Onboarding Assistant']}
    messages={messages}
    attachedFile="spring-catalog.csv"
    credits={{ used: 8, total: 10 }}
    charCount={124}
    charLimit={2000}
    onClose={handleClose}
    onSelectOption={setAssistant}
    onSend={handleSend}
  />
</ThemedRightPanel>`}
      />

      <ThemedRightPanel
        open={open}
        width="medium"
        variant="assistant"
        aria-label="AI assistant chat panel"
        onClose={() => setOpen(false)}
      >
        <ThemedChatPanel
          title={assistant}
          dropdownOptions={['Query Assistant', 'Content Onboarding Assistant', 'Expression Assistant']}
          messages={messages}
          attachedFile={attachmentVisible ? 'spring-catalog.csv' : undefined}
          credits={{ used: 8, total: 10 }}
          charCount={124}
          charLimit={2000}
          onClose={() => setOpen(false)}
          onExpand={() => undefined}
          onMore={() => undefined}
          onSelectOption={setAssistant}
          onRemoveAttachment={() => setAttachmentVisible(false)}
          onSend={() => undefined}
        />
      </ThemedRightPanel>
    </>
  );
}
