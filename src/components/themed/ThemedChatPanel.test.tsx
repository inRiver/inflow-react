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
    const chipRoot = chip.closest('.MuiChip-root');

    expect(chipRoot).toHaveClass('MuiChip-outlined');
    expect(chipRoot).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(chip);
    expect(chipRoot).toHaveClass('MuiChip-filled');
    expect(chipRoot).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders unselected suggestion chips with a neutral outline, primary text and 12px padding', async () => {
    renderChatPanel();
    const chipRoot = (await screen.findByText('Summarize')).closest('.MuiChip-root');

    expect(chipRoot).toHaveClass('MuiChip-outlined');
    expect(chipRoot).toHaveStyle({
      borderColor: 'rgb(194, 198, 216)',
      color: 'rgb(11, 45, 110)',
      paddingLeft: '12px',
      paddingRight: '12px',
    });
  });

  it('opens the assistant switcher and calls onSelectOption', async () => {
    const onSelectOption = vi.fn();
    renderChatPanel({ dropdownOptions: ['Query Assistant', 'Content Assistant'], onSelectOption });

    const trigger = await screen.findByRole('button', { name: /query assistant/i });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', screen.getByRole('menu').id);
    fireEvent.click(await screen.findByRole('menuitem', { name: /content assistant/i }));

    expect(onSelectOption).toHaveBeenCalledWith('Content Assistant');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('calls its own header close callback and labels icon buttons accessibly', async () => {
    const { panelClose } = renderChatPanel({ onExpand: vi.fn(), onMore: vi.fn() });

    fireEvent.click(await screen.findByRole('button', { name: 'Close chat panel' }));
    expect(panelClose).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Expand chat panel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More chat options' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
  });

  it('omits the header entirely when hideHeader is set', async () => {
    renderChatPanel({ hideHeader: true, onExpand: vi.fn(), onMore: vi.fn() });

    await screen.findByTestId('themed-chat-panel');
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close chat panel' })).not.toBeInTheDocument();
  });

  it('renders the header by default (hideHeader omitted)', async () => {
    renderChatPanel({ onClose: vi.fn() });

    await screen.findByTestId('themed-chat-panel');
    expect(screen.getByRole('banner')).toBeInTheDocument();
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
    expect(screen.getByTestId('default-typing-indicator')).toHaveAccessibleName('Assistant is typing');
    expect(screen.getByTestId('default-typing-indicator')).toHaveAttribute('role', 'status');
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
    const toolsTrigger = await screen.findByRole('button', { name: 'Add tools' });
    expect(toolsTrigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(toolsTrigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toolsTrigger);
    expect(toolsTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(toolsTrigger).toHaveAttribute('aria-controls', screen.getByRole('menu').id);
    expect(screen.getByRole('menuitem', { name: 'Add files' })).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Report an issue' }));
    expect(onToolSelect).toHaveBeenCalledWith('report_issue');
    expect(toolsTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('merges attach into the tools menu instead of rendering a second add button', async () => {
    const onAttachFile = vi.fn();
    const onToolSelect = vi.fn();
    renderChatPanel({
      onAttachFile,
      tools: [{ id: 'report_issue', label: 'Report an issue' }],
      onToolSelect,
    });

    // No standalone attach button: the composer shows a single add trigger.
    expect(screen.queryByRole('button', { name: 'Attach files' })).not.toBeInTheDocument();
    const trigger = await screen.findByRole('button', { name: 'Add tools' });

    fireEvent.click(trigger);
    const menu = screen.getByRole('menu');
    const attachItem = within(menu).getByRole('menuitem', { name: 'Attach files' });
    expect(within(menu).getByRole('menuitem', { name: 'Report an issue' })).toBeInTheDocument();

    const fileInput = screen.getByTestId('chat-file-input');
    const clickSpy = vi.spyOn(fileInput, 'click');
    fireEvent.click(attachItem);
    expect(clickSpy).toHaveBeenCalledOnce();
  });

  it('animates the default typing indicator dots', async () => {
    renderChatPanel({ isTyping: true });
    const indicator = await screen.findByTestId('default-typing-indicator');
    const dots = Array.from(indicator.children);

    expect(dots).toHaveLength(3);
    dots.forEach((dot) => expect(dot).toHaveStyle({ animationDuration: '1.4s' }));
  });

  it('renders a solid inline send glyph rather than the outlined icon font', async () => {
    renderChatPanel({ inputValue: 'hi', onSendMessage: vi.fn() });
    const sendBtn = await screen.findByRole('button', { name: 'Send message' });
    expect(sendBtn.querySelector('svg')).toBeInTheDocument();
    expect(within(sendBtn).queryByText('send')).not.toBeInTheDocument();
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

  describe('header, selector, and action parity', () => {
    const PIN_END_PATH =
      'M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v240h-80v-240H160v480h400v80H160Zm398-225L440-503v89h-80v-226h226v80h-90l118 118-56 57Zm202 225q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z';

    it('keeps the assistant selector compact and ellipsis-safe', async () => {
      renderChatPanel({ title: 'Content Onboarding Assistant For Enrichment' });

      const selector = await screen.findByRole('button', { name: /content onboarding assistant/i });
      expect(selector).toHaveStyle({
        height: '24px',
        maxWidth: '100%',
        paddingLeft: '12px',
        paddingRight: '6px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      });
      expect(selector.querySelector('.MuiButton-endIcon')).toHaveStyle({ marginLeft: '4px', marginRight: '0px' });
    });

    it('matches the reference dropdown geometry and selected row treatment', async () => {
      renderChatPanel({ dropdownOptions: ['Query Assistant', 'Enrich Assistant'] });

      fireEvent.click(await screen.findByRole('button', { name: /query assistant/i }));

      const menu = await screen.findByRole('menu');
      expect(menu.closest('.MuiPaper-root')).toHaveStyle({ minWidth: '248px' });
      expect(menu).toHaveStyle({ paddingTop: '8px', paddingBottom: '8px' });

      const selectedItem = screen.getByRole('menuitem', { name: /query assistant/i });
      expect(selectedItem).toHaveStyle({
        fontSize: '1rem',
        padding: '12px 16px',
        gap: '12px',
        backgroundColor: 'rgb(235, 241, 252)',
      });
    });

    it('shows the check marker only on the selected assistant', async () => {
      renderChatPanel({ dropdownOptions: ['Query Assistant', 'Enrich Assistant'] });

      fireEvent.click(await screen.findByRole('button', { name: /query assistant/i }));

      const selectedCheck = within(screen.getByRole('menuitem', { name: /query assistant/i })).getByText('check');
      const unselectedCheck = within(screen.getByRole('menuitem', { name: /enrich assistant/i })).getByText('check');
      expect(selectedCheck).toHaveStyle({ visibility: 'visible' });
      expect(unselectedCheck).toHaveStyle({ visibility: 'hidden' });
    });

    it('renders 32px square header controls that keep their labels and callbacks', async () => {
      const onExpand = vi.fn();
      const onMore = vi.fn();
      const { panelClose } = renderChatPanel({ onExpand, onMore });

      const expand = await screen.findByRole('button', { name: 'Expand chat panel' });
      const more = screen.getByRole('button', { name: 'More chat options' });
      const close = screen.getByRole('button', { name: 'Close chat panel' });

      for (const control of [expand, more, close]) {
        expect(control).toHaveStyle({ width: '32px', height: '32px' });
      }

      fireEvent.click(expand);
      fireEvent.click(more);
      fireEvent.click(close);
      expect(onExpand).toHaveBeenCalledOnce();
      expect(onMore).toHaveBeenCalledOnce();
      expect(panelClose).toHaveBeenCalledOnce();
    });

    it('renders the official pin_end vector through SvgIcon instead of an icon font', async () => {
      renderChatPanel({ onExpand: vi.fn() });

      const expand = await screen.findByRole('button', { name: 'Expand chat panel' });
      const svg = expand.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 -960 960 960');
      expect(svg?.querySelector('path')?.getAttribute('d')).toBe(PIN_END_PATH);
      expect(expand.querySelector('.material-icons-outlined')).toBeNull();
      expect(expand.querySelector('.material-symbols-outlined')).toBeNull();
    });
  });

  describe('message, chip, attachment, and tool parity', () => {
    const NAVY_100 = 'rgb(235, 241, 252)';

    it('renders role rows with 24px icons, 12px sender labels, and 10px head spacing', async () => {
      renderChatPanel();

      const assistantHead = (await screen.findByText('Assistant')).parentElement as HTMLElement;
      const userHead = screen.getByText('Me').parentElement as HTMLElement;
      expect(assistantHead).toHaveStyle({ gap: '10px', alignItems: 'center' });
      expect(userHead).toHaveStyle({ gap: '10px', justifyContent: 'flex-end' });
      expect(screen.getByText('smart_toy')).toHaveStyle({ fontSize: '24px' });
      expect(screen.getByText('person')).toHaveStyle({ fontSize: '24px' });
      expect(screen.getByText('Assistant')).toHaveStyle({ fontSize: '12px', fontWeight: '500', lineHeight: '20px' });
    });

    it('keeps the 16px thread rhythm and 8px intra-message spacing', async () => {
      renderChatPanel();

      const thread = await screen.findByTestId('chat-message-thread');
      expect(thread).toHaveStyle({ gap: '16px', padding: '8px 16px 16px' });
      expect(screen.getByText('How can I help?').closest('[data-chat-role="assistant"]')).toHaveStyle({ gap: '8px' });
    });

    it('renders the user bubble with the reference radius, padding, and alignment', async () => {
      renderChatPanel();

      expect(await screen.findByTestId('chat-user-bubble')).toHaveStyle({
        borderRadius: '10px',
        padding: '10px',
        maxWidth: '75%',
        minWidth: '0',
        textAlign: 'right',
      });
      expect(screen.getByText('Summarize this product.')).toHaveStyle({ overflowWrap: 'anywhere' });
    });

    it('marks a selected suggestion chip with the navy-100 selected treatment', async () => {
      renderChatPanel();

      const chip = await screen.findByText('Summarize');
      const chipRoot = chip.closest('.MuiChip-root') as HTMLElement;
      expect(chipRoot).not.toHaveStyle({ backgroundColor: NAVY_100 });

      fireEvent.click(chip);
      expect(chipRoot).toHaveStyle({ backgroundColor: NAVY_100, borderColor: 'rgb(11, 45, 110)' });
    });

    it('keeps action buttons inert until a host-owned action contract exists', async () => {
      renderChatPanel();

      const action = await screen.findByRole('button', { name: 'Show products' });
      expect(action).not.toHaveAttribute('aria-pressed');
      expect(action).toHaveStyle({ height: '32px' });

      fireEvent.click(action);
      expect(action).not.toHaveAttribute('aria-pressed');
      expect(action).not.toHaveStyle({ backgroundColor: NAVY_100 });
      expect(screen.getByText('How can I help?')).toBeInTheDocument();
      expect(screen.getByText('Summarize').closest('.MuiChip-root')).toHaveClass('MuiChip-outlined');
    });

    it('exposes attachment status so error uploads stay named and readable', async () => {
      renderChatPanel({
        attachments: [
          { id: 'ok', name: 'done.csv', status: 'done' },
          { id: 'bad', name: 'broken-upload-with-a-very-long-name.csv', status: 'error' },
        ],
      });

      const failed = await screen.findByText('broken-upload-with-a-very-long-name.csv');
      const wrapper = failed.closest('[data-attachment-status]') as HTMLElement;
      expect(wrapper).toHaveAttribute('data-attachment-status', 'error');
      expect(wrapper).toHaveAttribute('role', 'alert');
      expect(wrapper).toHaveAccessibleName('Attachment broken-upload-with-a-very-long-name.csv failed to upload');
      expect(wrapper).toHaveStyle({ minWidth: '0', maxWidth: '100%' });
      expect(failed.closest('.MuiChip-root')).toHaveStyle({ maxWidth: '100%' });
      expect(screen.getByText('done.csv').closest('[data-attachment-status]')).toHaveAttribute('data-attachment-status', 'done');
    });

    it('renders the default typing indicator with 8px disabled-tone dots', async () => {
      renderChatPanel({ isTyping: true });

      const indicator = await screen.findByTestId('default-typing-indicator');
      expect(indicator).toHaveStyle({ gap: '4px', padding: '10px' });
      expect(indicator.firstElementChild).toHaveStyle({
        width: '8px',
        height: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.38)',
      });
    });

    it('labels the leading control by its single mode (attach-only vs tools-only)', async () => {
      const { rerender } = renderChatPanel({ onAttachFile: vi.fn() });
      expect(await screen.findByRole('button', { name: 'Attach files' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Add tools' })).not.toBeInTheDocument();

      rerender(
        <ThemedRightPanel open onClose={vi.fn()} aria-label="Assistant panel" resizable={false}>
          <ThemedChatPanel messages={messages} showAttach={false} tools={[{ id: 'report_issue', label: 'Report an issue' }]} />
        </ThemedRightPanel>,
      );
      expect(await screen.findByRole('button', { name: 'Add tools' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Attach files' })).not.toBeInTheDocument();
    });

    it('overrides the tools label through toolsAriaLabel and keeps attachAriaLabel on the merged attach item', async () => {
      const onToolSelect = vi.fn();
      renderChatPanel({
        onAttachFile: vi.fn(),
        attachAriaLabel: 'Add documents',
        toolsAriaLabel: 'Pick a tool',
        tools: [{ id: 'report_issue', label: 'Report an issue' }],
        onToolSelect,
      });

      // Attach folds into the single tools trigger's menu (no standalone attach button).
      expect(screen.queryByRole('button', { name: 'Add documents' })).not.toBeInTheDocument();
      fireEvent.click(await screen.findByRole('button', { name: 'Pick a tool' }));
      const menu = screen.getByRole('menu');
      expect(within(menu).getByRole('menuitem', { name: 'Add documents' })).toBeInTheDocument();
      fireEvent.click(within(menu).getByRole('menuitem', { name: 'Report an issue' }));
      expect(onToolSelect).toHaveBeenCalledExactlyOnceWith('report_issue');
    });

    it('keeps long unbroken assistant content horizontally contained', async () => {
      const unbroken = 'A'.repeat(180);
      renderChatPanel({ messages: [{ id: 'long', role: 'assistant', content: unbroken }] });

      expect(await screen.findByText(unbroken)).toHaveStyle({ overflowWrap: 'break-word', minWidth: '0px' });
      expect(screen.getByTestId('chat-message-thread')).toHaveStyle({ overflowY: 'auto' });
    });
  });

  describe('composer and metadata footer parity', () => {
    const cssRulesFor = (element: HTMLElement) =>
      Array.from(document.querySelectorAll('style'))
        .flatMap((style) => Array.from(style.sheet?.cssRules ?? []))
        .map((rule) => rule.cssText)
        .filter((text) => Array.from(element.classList).some((className) => text.includes(`.${className}`)));

    it('keeps the navy-100 composer surface at the reference geometry', async () => {
      renderChatPanel({ onAttachFile: vi.fn() });

      expect(await screen.findByTestId('chat-composer')).toHaveStyle({
        backgroundColor: 'rgb(235, 241, 252)',
        borderRadius: '5px',
        padding: '8px 4px 8px 12px',
        gap: '8px',
        minHeight: '56px',
        alignItems: 'center',
      });
    });

    it('renders the leading attach control and the 16px composer input', async () => {
      renderChatPanel({ onAttachFile: vi.fn() });

      const attach = await screen.findByRole('button', { name: 'Attach files' });
      expect(attach).toHaveStyle({ width: '32px', height: '32px' });
      expect(within(attach).getByText('add')).toHaveStyle({ fontSize: '24px' });

      expect(screen.getByRole('textbox', { name: 'How can I help?' })).toHaveStyle({
        fontSize: '1rem',
        letterSpacing: '0.15px',
        padding: '4px 0px',
      });
    });

    it('renders 48px circular send and stop controls with hover feedback', async () => {
      const { rerender } = renderChatPanel({ inputValue: 'ready' });

      const send = await screen.findByRole('button', { name: 'Send message' });
      expect(send).toHaveStyle({ width: '48px', height: '48px', borderRadius: '50%' });
      expect(cssRulesFor(send).join(' ')).toContain(':hover');

      rerender(
        <ThemedRightPanel open onClose={vi.fn()} aria-label="Assistant panel" resizable={false}>
          <ThemedChatPanel messages={messages} inputValue="ready" isStreaming onStop={vi.fn()} />
        </ThemedRightPanel>,
      );

      expect(screen.getByRole('button', { name: 'Stop generating' })).toHaveStyle({
        width: '48px',
        height: '48px',
        borderRadius: '50%',
      });
    });

    it('keeps the send control focusable when enabled and disabled when it cannot send', async () => {
      const { rerender } = renderChatPanel({ inputValue: 'ready' });

      const send = await screen.findByRole('button', { name: 'Send message' });
      send.focus();
      expect(send).toHaveFocus();
      expect(send).toBeEnabled();

      rerender(
        <ThemedRightPanel open onClose={vi.fn()} aria-label="Assistant panel" resizable={false}>
          <ThemedChatPanel messages={messages} inputValue="" />
        </ThemedRightPanel>,
      );

      const disabledSend = screen.getByRole('button', { name: 'Send message' });
      expect(disabledSend).toBeDisabled();
      expect(disabledSend).toHaveClass('Mui-disabled');
    });

    it('aligns the metadata row and keeps the existing count wording', async () => {
      renderChatPanel({ credits: { used: 8, total: 10 }, charCount: 124, charLimit: 2000 });

      const count = await screen.findByText('124 / 2000');
      const metadataRow = count.parentElement as HTMLElement;
      expect(metadataRow).toHaveStyle({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '4px',
      });
      expect(count).toHaveStyle({ fontSize: '0.75rem', lineHeight: '16px', letterSpacing: '0.4px' });

      const credits = screen.getByText('Credits 8/10');
      expect(credits).toHaveStyle({ fontSize: '0.75rem', lineHeight: '16px', letterSpacing: '0.4px' });
      expect(credits.parentElement).toHaveStyle({ gap: '4px', alignItems: 'center' });
      expect(within(credits.parentElement as HTMLElement).getByText('info')).toHaveStyle({ fontSize: '16px' });
    });

    it('centers the disclaimer 4px below the metadata row', async () => {
      renderChatPanel();

      expect(await screen.findByText('AI can make mistakes. Check important info.')).toHaveStyle({
        textAlign: 'center',
        fontSize: '0.6875rem',
        fontWeight: '500',
        lineHeight: '16px',
        letterSpacing: '0.5px',
        marginTop: '4px',
      });
    });
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
