import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ThemedChatPanel, type ThemedChatMessageDef } from './ThemedChatPanel';
import { ThemedRightPanel } from './ThemedRightPanel';

const messages: ThemedChatMessageDef[] = [
  { id: 'assistant-1', role: 'assistant', content: 'How can I help?', chips: ['Summarize', 'Find duplicates'], actions: ['Show products'] },
  { id: 'user-1', role: 'user', content: 'Summarize this product.' },
];

function renderChatPanel(props: Partial<React.ComponentProps<typeof ThemedChatPanel>> = {}) {
  const panelClose = vi.fn();
  const result = renderWithInflow(
    <ThemedRightPanel open onClose={vi.fn()} aria-label="Assistant panel" resizable={false}>
      <ThemedChatPanel messages={messages} onClose={panelClose} {...props} />
    </ThemedRightPanel>,
  );

  return { ...result, panelClose };
}

describe('ThemedChatPanel', () => {
  it('renders as children inside ThemedRightPanel', async () => {
    renderChatPanel();

    const rightPanel = await screen.findByRole('complementary', { name: 'Assistant panel' });
    expect(rightPanel).toContainElement(screen.getByTestId('themed-chat-panel'));
  });

  it('renders assistant and user messages with their role styling hooks', async () => {
    renderChatPanel();

    expect(await screen.findByText('Assistant')).toBeInTheDocument();
    expect(screen.getByText('Me')).toBeInTheDocument();
    expect(screen.getByText('smart_toy')).toBeInTheDocument();
    expect(screen.getByText('Summarize this product.').closest('[data-chat-role="user"]')).toBeInTheDocument();
    expect(screen.getByTestId('chat-user-bubble')).toHaveStyle({ maxWidth: '75%' });
    expect(screen.getByText('How can I help?')).toHaveStyle({
      overflowWrap: 'break-word',
      wordBreak: 'keep-all',
    });
  });

  it('toggles suggestion chips between outlined and filled primary variants', async () => {
    renderChatPanel();
    const chip = await screen.findByText('Summarize');

    expect(chip.closest('.MuiChip-root')).toHaveClass('MuiChip-outlined');
    fireEvent.click(chip);
    expect(chip.closest('.MuiChip-root')).toHaveClass('MuiChip-filled');
  });

  it('opens the assistant switcher and calls onSelectOption', async () => {
    const onSelectOption = vi.fn();
    renderChatPanel({ dropdownOptions: ['Query Assistant', 'Content Assistant'], onSelectOption });

    fireEvent.click(await screen.findByRole('button', { name: /query assistant/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /content assistant/i }));

    expect(onSelectOption).toHaveBeenCalledWith('Content Assistant');
  });

  it('calls its own header close callback and labels icon buttons accessibly', async () => {
    const { panelClose } = renderChatPanel({ onExpand: vi.fn(), onMore: vi.fn() });

    fireEvent.click(await screen.findByRole('button', { name: 'Close chat panel' }));
    expect(panelClose).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Expand chat panel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More chat options' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
  });

  it('renders its default strings unchanged', async () => {
    renderChatPanel({ onExpand: vi.fn(), onMore: vi.fn(), credits: { used: 8, total: 10 } });

    expect(await screen.findByText('Query Assistant')).toBeInTheDocument();
    const disclaimer = screen.getByText('AI can make mistakes. Check important info.');
    const footer = disclaimer.closest('footer') as HTMLElement;
    expect(within(footer).getByPlaceholderText('How can I help?')).toBeInTheDocument();
    expect(within(footer).getByText('Type / to switch assistants')).toBeInTheDocument();
    expect(within(footer).getByText('Credits 8/10')).toBeInTheDocument();
    expect(disclaimer).toBeInTheDocument();
    expect(screen.getByText('Assistant')).toBeInTheDocument();
    expect(screen.getByText('Me')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Expand chat panel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More chat options' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close chat panel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
  });

  it('uses the 5px design-system radius for the composer surface', async () => {
    renderChatPanel();

    expect(await screen.findByTestId('chat-composer')).toHaveStyle({ borderRadius: '5px' });
  });

  it('overrides chat strings and accessible labels through props', async () => {
    renderChatPanel({
      onExpand: vi.fn(),
      onMore: vi.fn(),
      credits: { used: 8, total: 10 },
      creditsLabel: (used, total) => `Balance ${used} of ${total}`,
      aiDisclaimer: 'Custom disclaimer',
      userLabel: 'You',
      assistantLabel: 'Bot',
      expandAriaLabel: 'Open full chat',
      moreAriaLabel: 'Open chat menu',
      closeAriaLabel: 'Dismiss chat',
      sendAriaLabel: 'Submit prompt',
      attachAriaLabel: 'Add documents',
      showAttach: true,
      inputPlaceholder: 'Ask the catalog',
      inputHint: 'Press Enter to submit',
    });

    expect(await screen.findByText('Bot')).toBeInTheDocument();
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Balance 8 of 10')).toBeInTheDocument();
    expect(screen.getByText('Custom disclaimer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ask the catalog')).toBeInTheDocument();
    expect(screen.getByText('Press Enter to submit')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open full chat' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open chat menu' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dismiss chat' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit prompt' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add documents' })).toBeInTheDocument();
    expect(screen.queryByText('AI can make mistakes. Check important info.')).not.toBeInTheDocument();
    expect(screen.queryByText('Assistant')).not.toBeInTheDocument();
    expect(screen.queryByText('Me')).not.toBeInTheDocument();
  });

  it('uses a string credits label with the usage counts', async () => {
    renderChatPanel({ credits: { used: 8, total: 10 }, creditsLabel: 'Balance' });

    expect(await screen.findByText('Balance 8/10')).toBeInTheDocument();
  });

  it('removes an attached file and renders usage metadata', async () => {
    const onRemoveAttachment = vi.fn();
    renderChatPanel({ attachedFile: 'catalog.csv', onRemoveAttachment, credits: { used: 8, total: 10 }, charCount: 120, charLimit: 2000 });

    const deleteIcon = await screen.findByText('catalog.csv');
    fireEvent.click(deleteIcon.closest('.MuiChip-root')?.querySelector('.MuiChip-deleteIcon') as Element);

    expect(onRemoveAttachment).toHaveBeenCalledOnce();
    expect(screen.getByText('Credits 8/10')).toBeInTheDocument();
    expect(screen.getByText('120 / 2000')).toBeInTheDocument();
  });

  it('uses a controlled composer and sends its exact text', async () => {
    const onInputChange = vi.fn();
    const onSendMessage = vi.fn();
    renderChatPanel({ inputValue: 'hello', onInputChange, onSendMessage });

    const input = await screen.findByRole('textbox', { name: 'How can I help?' });
    fireEvent.change(input, { target: { value: 'hello world' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));

    expect(input).toHaveValue('hello');
    expect(onInputChange).toHaveBeenCalledWith('hello world');
    expect(onSendMessage).toHaveBeenCalledWith('hello');
  });

  it('sends the current controlled text when Enter is pressed', async () => {
    const onSendMessage = vi.fn();
    renderChatPanel({ inputValue: 'send by keyboard', onSendMessage });

    fireEvent.keyDown(await screen.findByRole('textbox', { name: 'How can I help?' }), { key: 'Enter' });

    expect(onSendMessage).toHaveBeenCalledWith('send by keyboard');
  });

  it('supports host-rendered message threads without applying DS message chrome', async () => {
    renderChatPanel({
      renderMessageThread: () => <div data-testid="host-thread">Event, errors, and retry controls</div>,
      isTyping: true,
    });

    expect(await screen.findByTestId('host-thread')).toHaveTextContent('Event, errors, and retry controls');
    expect(screen.queryByText('How can I help?')).not.toBeInTheDocument();
    expect(screen.queryByTestId('default-typing-indicator')).not.toBeInTheDocument();
  });

  it('exposes DS tool and typing slot delegates to a host-rendered thread', async () => {
    const renderToolMessage = vi.fn((message: ThemedChatMessageDef) => <div data-testid="host-tool-output">{message.content}</div>);
    const renderTypingIndicator = vi.fn(() => <div data-testid="host-typing-output">Working</div>);

    renderChatPanel({
      isTyping: true,
      renderToolMessage,
      renderTypingIndicator,
      renderMessageThread: ({ renderToolMessage: renderTool, renderTypingIndicator: renderTyping }) => (
        <>
          {renderTool({ id: 'host-tool', role: 'assistant', kind: 'tool', content: 'Tool output' })}
          {renderTyping()}
        </>
      ),
    });

    const toolOutput = await screen.findByTestId('host-tool-output');
    expect(toolOutput).toHaveTextContent('Tool output');
    expect(toolOutput.closest('[data-chat-message-kind="tool"]')).toBeInTheDocument();
    expect(screen.getByTestId('host-typing-output')).toHaveTextContent('Working');
    expect(renderToolMessage).toHaveBeenCalledOnce();
    expect(renderTypingIndicator).toHaveBeenCalledOnce();
  });

  it('enforces character limits and submits plain Enter in a multiline composer', async () => {
    const onSendMessage = vi.fn();
    renderChatPanel({ inputValue: 'first line', charLimit: 10, multiline: true, onSendMessage });

    const input = await screen.findByRole('textbox', { name: 'How can I help?' });
    expect(input).toHaveAttribute('maxlength', '10');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSendMessage).toHaveBeenCalledWith('first line');
    // Legacy parity (useSubmitOnEnter): only Ctrl/Meta+Enter insert a newline; Shift+Enter submits.
    fireEvent.keyDown(input, { key: 'Enter', ctrlKey: true });
    fireEvent.keyDown(input, { key: 'Enter', metaKey: true });
    expect(onSendMessage).toHaveBeenCalledOnce();
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    expect(onSendMessage).toHaveBeenCalledTimes(2);
  });

  it('blocks sends while the host reports a non-streaming request or message limit', async () => {
    const onSendMessage = vi.fn();
    renderChatPanel({ inputValue: 'blocked', isRunning: true, isSendDisabled: true, isInputDisabled: true, onSendMessage });

    const input = await screen.findByRole('textbox', { name: 'How can I help?' });
    expect(input).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    expect(onSendMessage).not.toHaveBeenCalled();
  });

  it('uses a Stop control while streaming when onStop is supplied', async () => {
    const onStop = vi.fn();
    renderChatPanel({ isStreaming: true, onStop, stopAriaLabel: 'Stop response' });

    fireEvent.click(await screen.findByRole('button', { name: 'Stop response' }));

    expect(onStop).toHaveBeenCalledOnce();
    expect(screen.queryByRole('button', { name: 'Send message' })).not.toBeInTheDocument();
  });

  it('restores Send when streaming stops without wiring onStop to it', async () => {
    const onStop = vi.fn();
    const { rerender } = renderChatPanel({ inputValue: 'continue', isStreaming: true, onStop });

    expect(await screen.findByRole('button', { name: 'Stop generating' })).toBeInTheDocument();

    rerender(
      <ThemedRightPanel open onClose={vi.fn()} aria-label="Assistant panel" resizable={false}>
        <ThemedChatPanel messages={messages} onClose={vi.fn()} inputValue="continue" isStreaming={false} onStop={onStop} />
      </ThemedRightPanel>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));

    expect(screen.queryByRole('button', { name: 'Stop generating' })).not.toBeInTheDocument();
    expect(onStop).not.toHaveBeenCalled();
  });

  it('keeps Send available when streaming has no onStop callback', async () => {
    renderChatPanel({ isStreaming: true });

    expect(await screen.findByRole('button', { name: 'Send message' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Stop generating' })).not.toBeInTheDocument();
  });

  it('renders a custom typing indicator or the default indicator', async () => {
    const { rerender } = renderChatPanel({ isTyping: true, renderTypingIndicator: () => <div data-testid="my-typing" /> });
    expect(await screen.findByTestId('my-typing')).toBeInTheDocument();

    rerender(<ThemedRightPanel open onClose={vi.fn()} aria-label="Assistant panel" resizable={false}><ThemedChatPanel messages={messages} isTyping /></ThemedRightPanel>);
    expect(screen.getByTestId('default-typing-indicator')).toBeInTheDocument();
  });

  it('renders tool messages through the tool slot without changing text messages', async () => {
    renderChatPanel({
      messages: [...messages, { id: 'tool-1', role: 'assistant', content: null, kind: 'tool' }],
      renderToolMessage: (message) => <div data-testid={`tool-${message.id}`}>Tool output</div>,
    });

    expect(await screen.findByTestId('tool-tool-1')).toBeInTheDocument();
    expect(screen.getByText('How can I help?')).toBeInTheDocument();
  });

  it('skips tool messages when no tool slot is provided', async () => {
    renderChatPanel({ messages: [...messages, { id: 'tool-1', role: 'assistant', content: 'hidden', kind: 'tool' }] });

    expect(screen.queryByText('hidden')).not.toBeInTheDocument();
  });

  it('passes selected files to the attach callback', async () => {
    const onAttachFile = vi.fn();
    renderChatPanel({ onAttachFile });
    const input = await screen.findByTestId('chat-file-input');
    fireEvent.change(input, { target: { files: [new File(['one'], 'one.csv'), new File(['two'], 'two.csv')] } });
    expect(onAttachFile).toHaveBeenCalledWith(expect.arrayContaining([expect.any(File), expect.any(File)]));
  });

  it('hides the native attach picker when requested and presents host-owned tools', async () => {
    const onToolSelect = vi.fn();
    renderChatPanel({
      showAttach: false,
      tools: [{ id: 'report_issue', label: 'Report an issue' }, { id: 'file_upload', label: 'Add files', disabled: true, disabledLabel: 'Not available' }],
      onToolSelect,
    });

    expect(screen.queryByTestId('chat-file-input')).not.toBeInTheDocument();
    fireEvent.click(await screen.findByRole('button', { name: 'Attach files' }));
    expect(screen.getByRole('menuitem', { name: 'Add files' })).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Report an issue' }));
    expect(onToolSelect).toHaveBeenCalledWith('report_issue');
  });

  it('renders attachment and aggregate upload progress from host props', async () => {
    renderChatPanel({
      attachments: [{ id: 'upload-a', name: 'a.csv', status: 'uploading', progress: 40 }],
      uploadProgress: 55,
      uploadProgressLabel: 'Uploading... 55%',
    });

    expect(await screen.findByText('Uploading... 55%')).toBeInTheDocument();
    expect(screen.getAllByRole('progressbar')).toHaveLength(2);
  });

  it('renders attachments and removes them by id', async () => {
    const onRemoveAttachment = vi.fn();
    renderChatPanel({ attachments: [{ id: 'a', name: 'f.csv', status: 'done' }], onRemoveAttachment });
    const chip = await screen.findByText('f.csv');
    fireEvent.click(chip.closest('.MuiChip-root')?.querySelector('.MuiChip-deleteIcon') as Element);
    expect(onRemoveAttachment).toHaveBeenCalledWith('a');
  });

  it('scrolls the thread to its bottom when messages change', async () => {
    const { rerender } = renderChatPanel({ messages: messages.slice(0, 1) });
    const thread = await screen.findByTestId('chat-message-thread');
    const setScrollTop = vi.fn();
    Object.defineProperty(thread, 'scrollHeight', { configurable: true, value: 640 });
    Object.defineProperty(thread, 'scrollTop', { configurable: true, get: () => 0, set: setScrollTop });

    rerender(
      <ThemedRightPanel open onClose={vi.fn()} aria-label="Assistant panel" resizable={false}>
        <ThemedChatPanel messages={messages} onClose={vi.fn()} />
      </ThemedRightPanel>,
    );

    expect(setScrollTop).toHaveBeenCalledWith(640);
  });

  it('does not scroll solely because the host thread renderer identity changes', async () => {
    const { rerender } = renderChatPanel({ renderMessageThread: () => <div>Host thread</div> });
    const thread = await screen.findByTestId('chat-message-thread');
    const setScrollTop = vi.fn();
    Object.defineProperty(thread, 'scrollHeight', { configurable: true, value: 640 });
    Object.defineProperty(thread, 'scrollTop', { configurable: true, get: () => 0, set: setScrollTop });
    setScrollTop.mockClear();

    rerender(
      <ThemedRightPanel open onClose={vi.fn()} aria-label="Assistant panel" resizable={false}>
        <ThemedChatPanel messages={messages} renderMessageThread={() => <div>Host thread</div>} />
      </ThemedRightPanel>,
    );

    expect(setScrollTop).not.toHaveBeenCalled();
  });

  describe('composer metadata visibility', () => {
    it('shows the credits block when credits are supplied and showCredits is not set', async () => {
      renderChatPanel({ credits: { used: 8, total: 10 } });

      expect(await screen.findByText('Credits 8/10')).toBeInTheDocument();
    });

    it('hides the credits block when showCredits is false, even if credits are supplied', async () => {
      renderChatPanel({ credits: { used: 8, total: 10 }, showCredits: false });

      await screen.findByTestId('themed-chat-panel');
      expect(screen.queryByText('Credits 8/10')).not.toBeInTheDocument();
    });

    it('hides the credits block when no credits are supplied', async () => {
      renderChatPanel();

      await screen.findByTestId('themed-chat-panel');
      expect(screen.queryByText(/Credits \d+\/\d+/)).not.toBeInTheDocument();
    });

    it('shows the character counter by default', async () => {
      renderChatPanel({ charCount: 124, charLimit: 2000 });

      expect(await screen.findByText('124 / 2000')).toBeInTheDocument();
    });

    it('hides the character counter when showCharCount is false', async () => {
      renderChatPanel({ charCount: 124, charLimit: 2000, showCharCount: false });

      await screen.findByTestId('themed-chat-panel');
      expect(screen.queryByText('124 / 2000')).not.toBeInTheDocument();
    });

    it('extends the character limit via charLimit', async () => {
      renderChatPanel({ charCount: 124, charLimit: 8000 });

      expect(await screen.findByText('124 / 8000')).toBeInTheDocument();
    });

    it('shows the input hint by default', async () => {
      renderChatPanel();

      expect(await screen.findByText('Type / to switch assistants')).toBeInTheDocument();
    });

    it('hides the input hint when showInputHint is false', async () => {
      renderChatPanel({ showInputHint: false });

      await screen.findByTestId('themed-chat-panel');
      expect(screen.queryByText('Type / to switch assistants')).not.toBeInTheDocument();
    });
  });
});
