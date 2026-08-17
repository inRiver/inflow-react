import { fireEvent, screen } from '@testing-library/react';
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

  it('removes an attached file and renders usage metadata', async () => {
    const onRemoveAttachment = vi.fn();
    renderChatPanel({ attachedFile: 'catalog.csv', onRemoveAttachment, credits: { used: 8, total: 10 }, charCount: 120, charLimit: 2000 });

    const deleteIcon = await screen.findByText('catalog.csv');
    fireEvent.click(deleteIcon.closest('.MuiChip-root')?.querySelector('.MuiChip-deleteIcon') as Element);

    expect(onRemoveAttachment).toHaveBeenCalledOnce();
    expect(screen.getByText('Credits 8/10')).toBeInTheDocument();
    expect(screen.getByText('120 / 2000')).toBeInTheDocument();
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
});
