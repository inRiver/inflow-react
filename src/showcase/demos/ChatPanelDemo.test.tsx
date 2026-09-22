import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ChatPanelDemo } from './ChatPanelDemo';

function selectOption(control: string, option: string) {
  fireEvent.mouseDown(screen.getByRole('combobox', { name: control }));
  fireEvent.click(screen.getByRole('option', { name: option }));
}

function toggle(name: string) {
  fireEvent.click(screen.getByRole('checkbox', { name }));
}

function openPanel() {
  fireEvent.click(screen.getByRole('button', { name: 'Open chat assistant' }));
}

describe('ChatPanelDemo', { timeout: 20000 }, () => {
  it('starts with the input hint visible to match the standalone reference', () => {
    renderWithInflow(<ChatPanelDemo />);

    expect(screen.getByRole('checkbox', { name: 'Show input hint' })).toBeChecked();
  });

  it('documents active and completed assistant reasoning states', () => {
    renderWithInflow(<ChatPanelDemo />);

    expect(screen.getByText('While processing')).toBeInTheDocument();
    expect(screen.getByText('After completion')).toBeInTheDocument();
    const activeStep = screen.getByRole('list').querySelector("[aria-current='step']");
    expect(activeStep).toHaveTextContent('Using tool: Extracting data');
    expect(screen.getByRole('button', { name: 'Reasoning' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Tool used: Extracting data')).toBeInTheDocument();
  });

  it('embeds collapsed history and streaming reasoning in the chat thread', () => {
    renderWithInflow(<ChatPanelDemo />);

    openPanel();

    const historyButtons = screen.getAllByRole('button', { name: 'Reasoning' });
    expect(historyButtons.length).toBeGreaterThan(0);
    historyButtons.forEach((button) => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    const activeSteps = screen.getAllByRole('list')
      .flatMap((list) => Array.from(list.querySelectorAll("[aria-current='step']")));
    const inChatActive = activeSteps.find((el) => el.textContent?.includes('Extracting data'));
    expect(inChatActive).toBeDefined();

    expect(screen.getByText('Show the missing fields first.')).toBeInTheDocument();
    expect(screen.getByText('Update my prompt from remembered preferences')).toBeInTheDocument();
    expect(screen.getByText(/Classifying document type/)).toBeInTheDocument();
  });

  it('exposes the assistant selector menu, the composer tools menu, and selectable chips and actions', () => {
    renderWithInflow(<ChatPanelDemo />);
    openPanel();

    expect(screen.getByRole('button', { name: 'Summarize changes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show missing fields' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Review products' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create a task' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Custom Assistant' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Expression Assistant' }));
    expect(screen.getByRole('button', { name: 'Expression Assistant' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Add tools' }));
    const toolItems = screen.getAllByRole('menuitem');
    expect(toolItems.some((item) => item.textContent === 'Search catalog')).toBe(true);
    const disabledTool = toolItems.find((item) => item.textContent === 'Generate images');
    expect(disabledTool).toHaveAttribute('aria-disabled', 'true');
  });

  it('switches the attachment fixture between completed, uploading, error and empty states', () => {
    renderWithInflow(<ChatPanelDemo />);
    openPanel();

    expect(document.querySelector("[data-attachment-status='done']")).toBeInTheDocument();

    selectOption('Attachment state', 'Uploading');
    const uploading = document.querySelector("[data-attachment-status='uploading']");
    expect(uploading).toBeInTheDocument();
    expect(uploading?.querySelector('.MuiLinearProgress-root')).toBeInTheDocument();

    selectOption('Attachment state', 'Error');
    expect(document.querySelector("[data-attachment-status='error']")).toBeInTheDocument();

    selectOption('Attachment state', 'None');
    expect(document.querySelector('[data-attachment-status]')).not.toBeInTheDocument();
  });

  it('restores the attachment fixture after removal when the state changes again', () => {
    renderWithInflow(<ChatPanelDemo />);
    openPanel();

    const deleteIcon = document.querySelector("[data-attachment-status='done'] .MuiChip-deleteIcon");
    expect(deleteIcon).toBeInTheDocument();
    fireEvent.click(deleteIcon as Element);
    expect(document.querySelector('[data-attachment-status]')).not.toBeInTheDocument();

    selectOption('Attachment state', 'Error');
    expect(document.querySelector("[data-attachment-status='error']")).toBeInTheDocument();
  });

  it('exposes typing, streaming and disabled composer states', () => {
    renderWithInflow(<ChatPanelDemo />);
    toggle('Show typing indicator');
    toggle('Show streaming stop control');
    toggle('Disable composer input');
    openPanel();

    expect(within(screen.getByTestId('themed-chat-panel')).getByTestId('default-typing-indicator')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stop generating' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('How can I help?')).toBeDisabled();
  });

  it('renders a long conversation fixture that keeps the composer reachable', () => {
    renderWithInflow(<ChatPanelDemo />);
    selectOption('Conversation', 'Long');
    openPanel();

    const thread = screen.getByTestId('chat-message-thread');
    expect(within(thread).getAllByText(/Long conversation turn/).length).toBeGreaterThanOrEqual(20);
    expect(screen.getByTestId('chat-composer')).toBeInTheDocument();
  });

  it('renders an empty conversation fixture without collapsing the shell', () => {
    renderWithInflow(<ChatPanelDemo />);
    selectOption('Conversation', 'Empty');
    openPanel();

    const thread = screen.getByTestId('chat-message-thread');
    expect(within(thread).queryByText('Show the missing fields first.')).not.toBeInTheDocument();
    expect(screen.getByTestId('chat-composer')).toBeInTheDocument();
  });

  it('stresses a 40+ character assistant label and unbroken content', () => {
    renderWithInflow(<ChatPanelDemo />);
    selectOption('Conversation', 'Stress');
    toggle('Use long assistant label');
    openPanel();

    const label = screen.getAllByText('Content Onboarding and Enrichment Assistant')[0];
    expect(label).toBeInTheDocument();
    expect(label.textContent?.length).toBeGreaterThanOrEqual(40);

    const unbroken = screen.getByTestId('chat-stress-unbroken');
    expect(unbroken.textContent).toMatch(/^\S{120,}$/);
    expect(window.getComputedStyle(unbroken).overflowWrap).toBe('anywhere');
  });

  it('drives the header selector title from the long-label toggle and keeps ellipsis styles', () => {
    renderWithInflow(<ChatPanelDemo />);
    toggle('Use long assistant label');
    openPanel();

    const selector = screen.getByRole('button', { name: 'Content Onboarding and Enrichment Assistant' });
    const selectorStyle = window.getComputedStyle(selector);
    expect(selectorStyle.overflow).toBe('hidden');
    expect(selectorStyle.textOverflow).toBe('ellipsis');
    expect(selectorStyle.whiteSpace).toBe('nowrap');

    expect(screen.queryByRole('button', { name: 'Query Assistant' })).not.toBeInTheDocument();
    expect(within(screen.getByTestId('chat-message-thread')).getAllByText('Content Onboarding and Enrichment Assistant').length).toBeGreaterThan(0);
  });

  it('defaults to Custom Assistant with the showcase conversation and swaps to per-assistant fixtures', () => {
    renderWithInflow(<ChatPanelDemo />);
    openPanel();

    // Default is the Custom Assistant, which hosts the current showcase conversation.
    expect(screen.getByRole('button', { name: 'Custom Assistant' })).toBeInTheDocument();
    expect(screen.getByText('Show the missing fields first.')).toBeInTheDocument();

    // Switching to Enrich Assistant swaps in that assistant's own mock conversation.
    fireEvent.click(screen.getByRole('button', { name: 'Custom Assistant' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Enrich Assistant' }));

    const thread = screen.getByTestId('chat-message-thread');
    expect(within(thread).getByText(/Which target languages should I translate into/)).toBeInTheDocument();
    expect(within(thread).getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(within(thread).queryByText('Show the missing fields first.')).not.toBeInTheDocument();
  });

  it('exposes while-processing status icons through the playground', () => {
    renderWithInflow(<ChatPanelDemo />);

    expect(screen.queryByRole('checkbox', { name: 'Steps as chips' })).not.toBeInTheDocument();

    toggle('While-processing status icons');
    expect(screen.getAllByText('check_circle').length).toBeGreaterThan(0);
  });

  it('applies the while-processing status icons toggle inside the ChatPanel thread', () => {
    renderWithInflow(<ChatPanelDemo />);

    toggle('While-processing status icons');
    openPanel();

    const thread = screen.getByTestId('chat-message-thread');
    expect(within(thread).getAllByText('check_circle').length).toBeGreaterThan(0);
  });

  it('cycles the panel through three expand widths', () => {
    renderWithInflow(<ChatPanelDemo />);
    openPanel();

    const panel = screen.getByRole('complementary', { name: 'AI assistant chat panel' });
    expect(panel).toHaveStyle({ width: '400px' });

    const expand = screen.getByRole('button', { name: 'Expand chat panel' });
    fireEvent.click(expand);
    expect(panel).toHaveStyle({ width: '520px' });
    fireEvent.click(expand);
    expect(panel).toHaveStyle({ width: '320px' });
    fireEvent.click(expand);
    expect(panel).toHaveStyle({ width: '400px' });
  });
});
