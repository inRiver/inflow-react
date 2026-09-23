import { useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { ThemedButton } from '../../components/themed/ThemedButton';
import { ThemedChatAccordion, type ThemedChatAccordionStep } from '../../components/themed/ThemedChatAccordion';
import { ThemedChip } from '../../components/themed/ThemedChip';
import { ThemedChatPanel, type ThemedChatAttachment, type ThemedChatMessageDef, type ThemedChatTool } from '../../components/themed/ThemedChatPanel';
import { ThemedRightPanel, type ThemedRightPanelWidth } from '../../components/themed/ThemedRightPanel';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { PropsPlayground, type PropSchema } from '../PropsPlayground';

const reasoningSteps: ThemedChatAccordionStep[] = [
  { id: 'create-session', label: 'Tool used: Creating session' },
  { id: 'load-file', label: 'Tool used: Loading file' },
  { id: 'extract-data', label: 'Using tool: Extracting data', isActive: true },
];

const completedReasoningSteps: ThemedChatAccordionStep[] = reasoningSteps.map((step) => ({
  ...step,
  label: step.isActive ? 'Tool used: Extracting data' : step.label,
  isActive: false,
}));

const streamingReasoningSteps: ThemedChatAccordionStep[] = [
  { id: 'classify', label: <em>Classifying document type (3 voting rounds)</em> },
  { id: 'create-session-stream', label: <em>Tool used: Creating session</em> },
  { id: 'load-file-stream', label: <em>Tool used: Loading file</em> },
  { id: 'extract-data-stream', label: <>Using tool: <strong>Extracting data</strong></>, isActive: true },
];

// The streaming reasoning accordion mirrors the playground's status-icon toggle,
// so the toggle also drives the reasoning rendered inside the ChatPanel thread.
function buildDefaultMessages(stepStatusIcons: boolean): ThemedChatMessageDef[] {
  return [
    {
      id: 'assistant-intro',
      role: 'assistant',
      content: 'I found three fields that could use a more complete product description.',
      chips: ['Summarize changes', 'Show missing fields'],
      actions: ['Review products'],
    },
    {
      id: 'user-request-fields',
      role: 'user',
      content: 'Show the missing fields first.',
    },
    {
      id: 'assistant-reasoning-history',
      role: 'assistant',
      content: <ThemedChatAccordion title="Reasoning" steps={completedReasoningSteps} />,
    },
    {
      id: 'assistant-followup',
      role: 'assistant',
      content: 'The product summary, material composition, and care instructions need review.',
      actions: ['Create a task', 'Export list'],
    },
    {
      id: 'user-request-prompt',
      role: 'user',
      content: 'Update my prompt from remembered preferences',
    },
    {
      id: 'assistant-reasoning-streaming',
      role: 'assistant',
      content: <ThemedChatAccordion title="Reasoning" steps={streamingReasoningSteps} isStreaming stepStatusIcons={stepStatusIcons} />,
    },
  ];
}

const messages = buildDefaultMessages(false);

const UNBROKEN_CONTENT = 'https://pim.inriver.example/exports/spring-catalog-2026-full-enrichment-export-with-attributes-and-variants-and-media-assets.csv';

const LONG_ASSISTANT_LABEL = 'Content Onboarding and Enrichment Assistant';

const longMessages: ThemedChatMessageDef[] = Array.from({ length: 24 }, (_, index) => ({
  id: `long-turn-${index}`,
  role: index % 2 === 0 ? 'assistant' : 'user',
  content: `Long conversation turn ${index + 1}: reviewing enrichment coverage for the spring catalog.`,
}));

const stressMessages: ThemedChatMessageDef[] = [
  {
    id: 'stress-user',
    role: 'user',
    content: 'Where did the export land?',
  },
  {
    id: 'stress-unbroken',
    role: 'assistant',
    content: <Box data-testid="chat-stress-unbroken" sx={{ overflowWrap: 'anywhere' }}>{UNBROKEN_CONTENT}</Box>,
    actions: ['Open export'],
  },
];

const conversationFixtures = {
  Default: messages,
  Empty: [],
  Long: longMessages,
  Stress: stressMessages,
} as const satisfies Record<string, ThemedChatMessageDef[]>;

type ConversationName = keyof typeof conversationFixtures;

// Each mock assistant carries its own conversation, reproduced with DS primitives.
const queryMessages: ThemedChatMessageDef[] = [
  { id: 'query-a1', role: 'assistant', content: 'I can help you build and refine queries across your catalog. What are you looking for?', chips: ['Recently changed', 'Missing images'] },
  { id: 'query-u1', role: 'user', content: 'Show products missing a main image.' },
  { id: 'query-a2', role: 'assistant', content: 'Here is a query that returns products with no main image. Want me to run it or refine it further?', actions: ['Run query', 'Refine query'] },
];

const onboardingMessages: ThemedChatMessageDef[] = [
  { id: 'onboarding-a1', role: 'assistant', content: 'Thank you. I will now be looking for the data in the file and present it in a spreadsheet that you can verify and confirm.', actions: ['Start extracting data'] },
];

const expressionMessages: ThemedChatMessageDef[] = [
  { id: 'expression-a1', role: 'assistant', content: 'Expressions compute values from other fields. Describe what you want to calculate.', chips: ['Concatenate fields', 'Conditional value'] },
  { id: 'expression-u1', role: 'user', content: 'Combine brand and model into a display name.' },
  { id: 'expression-a2', role: 'assistant', content: 'Use CONCAT(brand, " ", model). Apply it to the Display Name field?', actions: ['Apply expression', 'Edit'] },
];

const projectMessages: ThemedChatMessageDef[] = [
  { id: 'project-a1', role: 'assistant', content: 'I can set up a project from a signal. Which signal should I use as the starting point?', chips: ['Spring catalog', 'Low completeness'] },
  { id: 'project-u1', role: 'user', content: 'Use the low completeness signal.' },
  { id: 'project-a2', role: 'assistant', content: 'I will create a project for the 128 products flagged by that signal. Ready to create it?', actions: ['Create project', 'Review products'] },
];

const ENRICH_LANGUAGES: ReadonlyArray<[string, boolean]> = [
  ['Dutch (nl)', true],
  ['French (fr)', true],
  ['German (de)', false],
  ['Swedish (sv)', false],
  ['Italian (it)', false],
];

const ENRICH_OVERWRITE_OPTIONS = [
  'Only fill blank locales (recommended)',
  'Overwrite existing translations',
  'Cancel — let me review languages first',
];

const enrichMessages: ThemedChatMessageDef[] = [
  {
    id: 'enrich-turn',
    role: 'assistant',
    content: (
      <Stack spacing={1.5}>
        <ThemedChatAccordion
          title="Reasoning"
          steps={[{ id: 'enrich-reasoning', label: 'Reviewed the product locales and existing translations before proposing a plan.' }]}
        />
        <Typography variant="body2" color="text.primary">
          I can translate the product name, short description and long description for this product. Before I proceed I need two quick confirmations: which target languages you want translated, and whether I should overwrite existing translations or only fill blank locales.
        </Typography>
        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 700 }}>
          Which target languages should I translate into? (source text = English)
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {ENRICH_LANGUAGES.map(([label, selected]) => (
            <ThemedChip key={label} label={label} size="sm" color="primary" variant={selected ? 'filled-primary' : 'outlined'} />
          ))}
          <ThemedChip label="Add language" size="sm" color="primary" variant="outlined" leadingIcon="add" sx={{ borderStyle: 'dashed' }} />
        </Box>
        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 700 }}>
          If translations already exist for a locale, should I overwrite them?
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
          {ENRICH_OVERWRITE_OPTIONS.map((option) => (
            <ThemedChip key={option} label={option} size="sm" color="primary" variant="outlined" />
          ))}
        </Box>
        <Box>
          <ThemedButton variant="contained" size="small">Confirm</ThemedButton>
        </Box>
      </Stack>
    ),
  },
];

const assistantFixtures = {
  'Query Assistant': queryMessages,
  'Content Onboarding Assistant': onboardingMessages,
  'Expression Assistant': expressionMessages,
  'Project Assistant': projectMessages,
  'Enrich Assistant': enrichMessages,
} as const satisfies Record<string, ThemedChatMessageDef[]>;

// "Custom Assistant" (last option) hosts the current showcase conversation fixtures.
const CUSTOM_ASSISTANT = 'Custom Assistant';
const ASSISTANTS = [...Object.keys(assistantFixtures), CUSTOM_ASSISTANT];

function isAssistantFixtureName(value: string): value is keyof typeof assistantFixtures {
  return value in assistantFixtures;
}

const attachmentFixtures = {
  None: [],
  Completed: [{ id: 'spring-catalog', name: 'spring-catalog.csv', status: 'done' }],
  Uploading: [{ id: 'spring-catalog', name: 'spring-catalog.csv', status: 'uploading', progress: 62 }],
  Error: [{ id: 'spring-catalog', name: 'spring-catalog.csv', status: 'error' }],
} as const satisfies Record<string, readonly ThemedChatAttachment[]>;

type AttachmentStateName = keyof typeof attachmentFixtures;

const chatTools: ThemedChatTool[] = [
  { id: 'search-catalog', label: 'Search catalog' },
  { id: 'generate-images', label: 'Generate images', disabled: true, disabledLabel: 'Not available in this workspace' },
];

const chatPanelSchema: PropSchema[] = [
  { name: 'assistant', type: 'select', options: ASSISTANTS, label: 'Assistant' },
  { name: 'conversation', type: 'select', options: ['Default', 'Empty', 'Long', 'Stress'], label: 'Conversation' },
  { name: 'stepStatusIcons', type: 'boolean', label: 'While-processing status icons' },
  { name: 'attachmentState', type: 'select', options: ['None', 'Completed', 'Uploading', 'Error'], label: 'Attachment state' },
  { name: 'isStreaming', type: 'boolean', label: 'Show streaming stop control' },
  { name: 'isTyping', type: 'boolean', label: 'Show typing indicator' },
  { name: 'isInputDisabled', type: 'boolean', label: 'Disable composer input' },
  { name: 'useLongAssistantLabel', type: 'boolean', label: 'Use long assistant label' },
  { name: 'showCredits', type: 'boolean', label: 'Show credits' },
  { name: 'showCharCount', type: 'boolean', label: 'Show character counter' },
  { name: 'showInputHint', type: 'boolean', label: 'Show input hint' },
  { name: 'charLimit', type: 'select', options: ['2000', '8000'], label: 'Character limit' },
];

function isConversationName(value: unknown): value is ConversationName {
  return typeof value === 'string' && value in conversationFixtures;
}

function isAttachmentStateName(value: unknown): value is AttachmentStateName {
  return typeof value === 'string' && value in attachmentFixtures;
}

export function ChatPanelDemo() {
  const [open, setOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState<ThemedRightPanelWidth>('medium');
  const [assistant, setAssistant] = useState(CUSTOM_ASSISTANT);
  const [conversation, setConversation] = useState<ConversationName>('Default');
  const [stepStatusIcons, setStepStatusIcons] = useState(false);
  const [attachmentState, setAttachmentState] = useState<AttachmentStateName>('Completed');
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [useLongAssistantLabel, setUseLongAssistantLabel] = useState(false);
  const [showCredits, setShowCredits] = useState(true);
  const [showCharCount, setShowCharCount] = useState(true);
  const [showInputHint, setShowInputHint] = useState(true);
  const [charLimit, setCharLimit] = useState(2000);
  const [attachments, setAttachments] = useState<ThemedChatAttachment[]>([...attachmentFixtures.Completed]);

  const activeMessages = useMemo(() => {
    if (isAssistantFixtureName(assistant)) return assistantFixtures[assistant];
    if (conversation === 'Default') return buildDefaultMessages(stepStatusIcons);
    return conversationFixtures[conversation];
  }, [assistant, conversation, stepStatusIcons]);

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

      <DemoFrame title="Assistant reasoning states">
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Typography variant="body2" color="text.secondary">
            Completed tool calls stay readable while the current call is emphasized; after completion, the same history starts collapsed.
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>While processing</Typography>
              <ThemedChatAccordion title="Reasoning" steps={reasoningSteps} isStreaming stepStatusIcons={stepStatusIcons} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>After completion</Typography>
              <ThemedChatAccordion
                title="Reasoning"
                steps={completedReasoningSteps}
              />
            </Box>
          </Stack>
        </Stack>
      </DemoFrame>

      <PropsPlayground
        schema={chatPanelSchema}
        values={{ assistant, conversation, attachmentState, isStreaming, isTyping, isInputDisabled, useLongAssistantLabel, showCredits, showCharCount, showInputHint, charLimit: String(charLimit), stepStatusIcons }}
        onChange={(values) => {
          setAssistant(typeof values.assistant === 'string' && ASSISTANTS.includes(values.assistant) ? values.assistant : CUSTOM_ASSISTANT);
          if (isConversationName(values.conversation)) setConversation(values.conversation);
          setStepStatusIcons(values.stepStatusIcons === true);
          if (isAttachmentStateName(values.attachmentState) && values.attachmentState !== attachmentState) {
            setAttachmentState(values.attachmentState);
            setAttachments([...attachmentFixtures[values.attachmentState]]);
          }
          setIsStreaming(values.isStreaming === true);
          setIsTyping(values.isTyping === true);
          setIsInputDisabled(values.isInputDisabled === true);
          setUseLongAssistantLabel(values.useLongAssistantLabel === true);
          setShowCredits(values.showCredits === true);
          setShowCharCount(values.showCharCount === true);
          setShowInputHint(values.showInputHint === true);
          setCharLimit(values.charLimit === '8000' ? 8000 : 2000);
        }}
      />

      <CodeBlock
        language="tsx"
        code={`<ThemedRightPanel open={open} onClose={handleClose} variant="assistant">
  <ThemedChatPanel
    title="${assistant}"
    dropdownOptions={['Query Assistant', 'Content Onboarding Assistant']}
    messages={messages}
    inputValue={inputValue}
    onInputChange={setInputValue}
    onSendMessage={(text) => console.log(text)}
    isStreaming={isStreaming}
    onStop={() => setIsStreaming(false)}
    isTyping={isTyping}
    renderTypingIndicator={() => <span>Assistant is thinking…</span>}
    renderToolMessage={(message) => <span>Tool: {message.id}</span>}
    attachments={attachments}
    onAttachFile={setFiles}
    onRemoveAttachment={removeAttachment}
    credits={{ used: 8, total: 10 }}
    showCredits={showCredits}
    charCount={124}
    charLimit={charLimit}
    showCharCount={showCharCount}
    showInputHint={showInputHint}
    onClose={handleClose}
    onSelectOption={setAssistant}
  />
</ThemedRightPanel>`}
      />

      <ThemedRightPanel
        open={open}
        width={panelWidth}
        variant="assistant"
        aria-label="AI assistant chat panel"
        onClose={() => setOpen(false)}
      >
        <ThemedChatPanel
          title={useLongAssistantLabel ? LONG_ASSISTANT_LABEL : assistant}
          dropdownOptions={ASSISTANTS}
          messages={activeMessages}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={(text) => setInputValue(text ? '' : inputValue)}
          isStreaming={isStreaming}
          onStop={() => setIsStreaming(false)}
          isTyping={isTyping}
          isInputDisabled={isInputDisabled}
          assistantLabel={useLongAssistantLabel ? LONG_ASSISTANT_LABEL : undefined}
          tools={chatTools}
          renderToolMessage={(message) => <Typography variant="caption" color="text.secondary">Tool output: {message.id}</Typography>}
          attachments={attachments}
          credits={{ used: 8, total: 10 }}
          showCredits={showCredits}
          charCount={124}
          charLimit={charLimit}
          showCharCount={showCharCount}
          showInputHint={showInputHint}
          onClose={() => setOpen(false)}
          onExpand={() => setPanelWidth((current) => current === 'narrow' ? 'medium' : current === 'medium' ? 'wide' : 'narrow')}
          onMore={() => undefined}
          onSelectOption={setAssistant}
          onAttachFile={(files) => setAttachments((current) => [...current, ...files.map((file) => ({ id: `${file.name}-${file.lastModified}`, name: file.name, status: 'pending' as const }))])}
          onRemoveAttachment={(id) => setAttachments((current) => current.filter((attachment) => attachment.id !== id))}
        />
      </ThemedRightPanel>
    </>
  );
}
