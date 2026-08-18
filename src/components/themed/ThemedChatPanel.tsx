import {
  Box,
  Icon,
  IconButton,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { forwardRef, useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { inflowTokens } from '../../theme';
import { ThemedButton } from './ThemedButton';
import { ThemedChip } from './ThemedChip';

export type ThemedChatMessageRole = 'assistant' | 'user';

export interface ThemedChatAttachment {
  id: string;
  name: string;
  status?: 'pending' | 'uploading' | 'done' | 'error';
  progress?: number;
}

export interface ThemedChatMessageDef {
  id: string;
  role: ThemedChatMessageRole;
  content: ReactNode;
  /** App-owned classification; tool detection remains outside the DS. */
  kind?: 'text' | 'tool';
  /** Suggestion chips below assistant message. */
  chips?: string[];
  /** Action buttons below assistant message. */
  actions?: string[];
}

export interface ThemedChatPanelProps {
  /** Currently selected assistant name shown in the header pill. */
  title?: string;
  /** Options in the assistant-switcher dropdown. */
  dropdownOptions?: string[];
  onSelectOption?: (name: string) => void;
  messages?: ThemedChatMessageDef[];
  onClose?: () => void;
  onExpand?: () => void;
  onMore?: () => void;
  attachedFile?: string;
  attachments?: ThemedChatAttachment[];
  onAttachFile?: (files: File[]) => void;
  onRemoveAttachment?: (id?: string) => void;
  renderAttachment?: (attachment: ThemedChatAttachment) => ReactNode;
  /** @deprecated Use onSendMessage to receive the composed text. */
  onSend?: () => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  onSendMessage?: (text: string) => void;
  isStreaming?: boolean;
  onStop?: () => void;
  isTyping?: boolean;
  renderTypingIndicator?: () => ReactNode;
  renderToolMessage?: (message: ThemedChatMessageDef) => ReactNode;
  inputPlaceholder?: string;
  inputHint?: string;
  creditsLabel?: ((used: number, total: number) => ReactNode) | string;
  aiDisclaimer?: ReactNode;
  userLabel?: string;
  assistantLabel?: string;
  expandAriaLabel?: string;
  moreAriaLabel?: string;
  closeAriaLabel?: string;
  sendAriaLabel?: string;
  stopAriaLabel?: string;
  credits?: { used: number; total: number };
  charCount?: number;
  charLimit?: number;
}

const DEFAULT_OPTIONS = [
  'Query Assistant',
  'Content Onboarding Assistant',
  'Expression Assistant',
  'Project Assistant',
  'Enrich Assistant',
];

const DEFAULT_STRINGS = {
  title: 'Query Assistant',
  inputPlaceholder: 'How can I help?',
  inputHint: 'Type / to switch assistants',
  creditsLabel: 'Credits',
  aiDisclaimer: 'AI can make mistakes. Check important info.',
  userLabel: 'Me',
  assistantLabel: 'Assistant',
  expandAriaLabel: 'Expand chat panel',
  moreAriaLabel: 'More chat options',
  closeAriaLabel: 'Close chat panel',
  sendAriaLabel: 'Send message',
  stopAriaLabel: 'Stop generating',
} as const;

const iconButtonSx = {
  width: 32,
  height: 32,
  borderRadius: 1,
  color: 'text.secondary',
  '&:hover': { backgroundColor: 'action.hover' },
} as const;

/**
 * The AI assistant conversation content intended for composition inside a
 * `ThemedRightPanel`. The panel host owns layout and Escape behavior; this
 * component owns its chat header controls, including close.
 */
export const ThemedChatPanel = forwardRef<HTMLDivElement, ThemedChatPanelProps>(
  function ThemedChatPanel(
    {
      title = DEFAULT_STRINGS.title,
      dropdownOptions = DEFAULT_OPTIONS,
      onSelectOption,
      messages = [],
      onClose,
      onExpand,
      onMore,
      attachedFile,
      attachments,
      onAttachFile,
      onRemoveAttachment,
      renderAttachment,
      onSend,
      inputValue = '',
      onInputChange,
      onSendMessage,
      isStreaming = false,
      onStop,
      isTyping = false,
      renderTypingIndicator,
      renderToolMessage,
      inputPlaceholder = DEFAULT_STRINGS.inputPlaceholder,
      inputHint = DEFAULT_STRINGS.inputHint,
      creditsLabel = DEFAULT_STRINGS.creditsLabel,
      aiDisclaimer = DEFAULT_STRINGS.aiDisclaimer,
      userLabel = DEFAULT_STRINGS.userLabel,
      assistantLabel = DEFAULT_STRINGS.assistantLabel,
      expandAriaLabel = DEFAULT_STRINGS.expandAriaLabel,
      moreAriaLabel = DEFAULT_STRINGS.moreAriaLabel,
      closeAriaLabel = DEFAULT_STRINGS.closeAriaLabel,
      sendAriaLabel = DEFAULT_STRINGS.sendAriaLabel,
      stopAriaLabel = DEFAULT_STRINGS.stopAriaLabel,
      credits,
      charCount = 0,
      charLimit = 2000,
    },
    ref,
  ) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [selected, setSelected] = useState(title);
    const [prevTitle, setPrevTitle] = useState(title);

    if (prevTitle !== title) {
      setPrevTitle(title);
      setSelected(title);
    }

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [messages]);

    const handleSelect = useCallback((option: string) => {
      setSelected(option);
      setAnchorEl(null);
      onSelectOption?.(option);
    }, [onSelectOption]);

    const handleSend = () => {
      if (inputValue.trim() === '' && !attachedFile) return;

      onSendMessage?.(inputValue);
      onSend?.();
    };

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;

      event.preventDefault();
      handleSend();
    };

    const sendDisabled = inputValue.trim() === '' && !attachedFile && !attachments?.length;
    const displayedAttachments = attachments ?? (attachedFile ? [{ id: 'legacy-attachment', name: attachedFile }] : []);

    return (
      <Box
        ref={ref}
        data-testid="themed-chat-panel"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: 0,
          bgcolor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        <Box
          component="header"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            p: (theme) => theme.spacing(1.5, 2),
            flexShrink: 0,
          }}
        >
          <ThemedButton
            size="small"
            endIcon={<Icon baseClassName="material-icons-outlined" sx={{ fontSize: 18 }}>arrow_drop_down</Icon>}
            onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={{
              height: 24,
              borderRadius: inflowTokens.radius.full,
              border: 1,
              borderColor: 'divider',
              color: 'primary.main',
              fontSize: 13,
              fontWeight: 400,
              px: 1.5,
              py: 0,
              minWidth: 0,
              maxWidth: 220,
              bgcolor: 'background.paper',
              textTransform: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            {selected}
          </ThemedButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            slotProps={{
              paper: {
                sx: {
                  minWidth: 248,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  boxShadow: 3,
                  mt: 0.5,
                },
              },
            }}
          >
            {dropdownOptions.map((option) => (
              <MenuItem
                key={option}
                selected={option === selected}
                onClick={() => handleSelect(option)}
                sx={{ fontSize: 16, py: 1.5, px: 2, gap: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 20 }}>
                  <Icon
                    baseClassName="material-icons-outlined"
                    sx={{
                      fontSize: 20,
                      color: 'primary.main',
                      visibility: option === selected ? 'visible' : 'hidden',
                    }}
                  >
                    check
                  </Icon>
                </ListItemIcon>
                {option}
              </MenuItem>
            ))}
          </Menu>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
            {onExpand && (
              <IconButton aria-label={expandAriaLabel} size="small" onClick={onExpand} sx={iconButtonSx}>
                <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 22 }}>view_sidebar</Icon>
              </IconButton>
            )}
            {onMore && (
              <IconButton aria-label={moreAriaLabel} size="small" onClick={onMore} sx={iconButtonSx}>
                <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 22 }}>more_vert</Icon>
              </IconButton>
            )}
            {onClose && (
              <IconButton aria-label={closeAriaLabel} size="small" onClick={onClose} sx={iconButtonSx}>
                <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 22 }}>close</Icon>
              </IconButton>
            )}
          </Box>
        </Box>

        <Box
          ref={scrollRef}
          data-testid="chat-message-thread"
          sx={{
            flex: '1 1 auto',
            minHeight: 0,
            overflowY: 'auto',
            p: (theme) => theme.spacing(1, 2, 2),
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {messages.map((message) => {
            if (message.kind === 'tool') {
              return renderToolMessage ? <Box key={message.id}>{renderToolMessage(message)}</Box> : null;
            }

            return <ChatMessage key={message.id} message={message} userLabel={userLabel} assistantLabel={assistantLabel} />;
          })}
          {isTyping && (renderTypingIndicator ? renderTypingIndicator() : (
            <Box data-testid="default-typing-indicator" sx={{ display: 'flex', gap: 0.5, color: 'text.secondary' }}>
              {[0, 1, 2].map((dot) => <Box key={dot} sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />)}
            </Box>
          ))}
        </Box>

        {displayedAttachments.length > 0 && (
          <Box sx={{ flexShrink: 0, px: 2, pb: 1 }}>
            {displayedAttachments.map((attachment) => renderAttachment ? (
              <Box key={attachment.id}>{renderAttachment(attachment)}</Box>
            ) : (
              <ThemedChip key={attachment.id} label={attachment.name} onDelete={() => onRemoveAttachment?.(attachment.id)} size="sm" variant="filled-primary" />
            ))}
          </Box>
        )}

        <Box component="footer" sx={{ flexShrink: 0, p: (theme) => theme.spacing(1, 2, 1.5) }}>
          <Box
            sx={{
              bgcolor: 'inflow.navy100',
              borderRadius: (theme) => theme.shape.borderRadius,
              p: (theme) => theme.spacing(1, 0.5, 1, 1.5),
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minHeight: 56,
            }}
          >
            <input ref={fileInputRef} data-testid="chat-file-input" type="file" hidden multiple onChange={(event) => {
              const files = event.target.files;
              if (files) onAttachFile?.(Array.from(files));
              event.target.value = '';
            }} />
            <IconButton aria-label="Attach files" onClick={() => fileInputRef.current?.click()} sx={{ color: 'text.secondary', width: 32, height: 32 }}>
              <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 24 }}>add</Icon>
            </IconButton>
            <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
              <InputBase
                value={inputValue}
                onChange={(event) => onInputChange?.(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={inputPlaceholder}
                inputProps={{ 'aria-label': inputPlaceholder }}
                sx={{ color: 'text.primary', fontSize: '1rem', lineHeight: 1.5, letterSpacing: '0.15px', width: '100%' }}
              />
              {inputHint && (
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: '16px', letterSpacing: '0.4px' }}>
                  {inputHint}
                </Typography>
              )}
            </Box>
            {isStreaming && onStop ? (
              <IconButton aria-label={stopAriaLabel} onClick={onStop} sx={{ color: 'text.secondary', width: 48, height: 48 }}>
                <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 24 }}>stop</Icon>
              </IconButton>
            ) : (
              <IconButton aria-label={sendAriaLabel} onClick={handleSend} disabled={sendDisabled} sx={{ color: 'text.secondary', width: 48, height: 48 }}>
                <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 24 }}>send</Icon>
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.5 }}>
            {credits ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" color="text.disabled">
                  {typeof creditsLabel === 'function'
                    ? creditsLabel(credits.used, credits.total)
                    : `${creditsLabel} ${credits.used}/${credits.total}`}
                </Typography>
                <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 16, color: 'text.disabled' }}>info</Icon>
              </Box>
            ) : <span />}
            <Typography variant="caption" color="primary" sx={{ letterSpacing: '0.4px' }}>
              {charCount} / {charLimit}
            </Typography>
          </Box>

          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ display: 'block', textAlign: 'center', fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.5px', mt: 0.25 }}
          >
            {aiDisclaimer}
          </Typography>
        </Box>
      </Box>
    );
  },
);

ThemedChatPanel.displayName = 'ThemedChatPanel';

function ChatMessage({
  message,
  userLabel,
  assistantLabel,
}: {
  message: ThemedChatMessageDef;
  userLabel: string;
  assistantLabel: string;
}) {
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set());
  const isAssistant = message.role === 'assistant';

  const toggleChip = (chip: string) => {
    setSelectedChips((previous) => {
      const next = new Set(previous);
      if (next.has(chip)) next.delete(chip);
      else next.add(chip);
      return next;
    });
  };

  if (!isAssistant) {
    return (
      <Box data-chat-role="user" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 500, lineHeight: '20px', letterSpacing: '0.14px', color: 'text.secondary' }}>
            {userLabel}
          </Typography>
          <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 24, color: 'info.main' }}>person</Icon>
        </Box>
        <Box
          data-testid="chat-user-bubble"
          sx={{
            bgcolor: 'inflow.navy100',
            borderRadius: 2,
            p: 1.25,
            maxWidth: '75%',
          }}
        >
          <Typography variant="body2" color="text.primary" sx={{ lineHeight: '20px', letterSpacing: '0.17px' }}>
            {message.content}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box data-chat-role="assistant" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 24, color: 'info.main', flexShrink: 0 }}>smart_toy</Icon>
        <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 500, lineHeight: '20px', letterSpacing: '0.14px', color: 'text.secondary' }}>
          {assistantLabel}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.primary" sx={{ lineHeight: '20px', letterSpacing: '0.17px' }}>
        {message.content}
      </Typography>
      {message.chips && message.chips.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {message.chips.map((chip) => (
            <ThemedChip
              key={chip}
              label={chip}
              variant={selectedChips.has(chip) ? 'filled-primary' : 'outlined-primary'}
              size="sm"
              onClick={() => toggleChip(chip)}
            />
          ))}
        </Box>
      )}
      {message.actions && message.actions.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {message.actions.map((action) => (
            <ThemedButton key={action} variant="outlined" size="small" sx={{ height: 32 }}>
              {action}
            </ThemedButton>
          ))}
        </Box>
      )}
    </Box>
  );
}
