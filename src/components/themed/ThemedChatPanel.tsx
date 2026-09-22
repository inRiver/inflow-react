import {
  Box,
  Icon,
  IconButton,
  InputBase,
  ListItemIcon,
  LinearProgress,
  Menu,
  MenuItem,
  SvgIcon,
  Typography,
} from '@mui/material';
import { forwardRef, useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
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

export interface ThemedChatThreadRenderContext {
  /** Invokes the panel's configured tool-message slot with DS-owned wrapping. */
  renderToolMessage: (message: ThemedChatMessageDef) => ReactNode;
  /** Invokes the panel's configured or default typing indicator when typing is active. */
  renderTypingIndicator: () => ReactNode;
}

export interface ThemedChatTool {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  disabledLabel?: string;
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
  /** When true, the built-in header is not rendered (host provides its own). */
  hideHeader?: boolean;
  attachedFile?: string;
  attachments?: ThemedChatAttachment[];
  onAttachFile?: (files: File[]) => void;
  onRemoveAttachment?: (id?: string) => void;
  renderAttachment?: (attachment: ThemedChatAttachment) => ReactNode;
  /** Defaults to whether an attachment callback is supplied for existing consumers. */
  showAttach?: boolean;
  attachAriaLabel?: string;
  toolsAriaLabel?: string;
  tools?: ThemedChatTool[];
  onToolSelect?: (toolId: string) => void;
  /** Aggregate host-owned upload progress, paired with attachment status/progress. */
  uploadProgress?: number;
  uploadProgressLabel?: ReactNode;
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
  /** App-owned thread renderer for message types that are outside the DS message model. */
  renderMessageThread?: (context: ThemedChatThreadRenderContext) => ReactNode;
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
  /** Visibility of the credits block. Defaults to whether `credits` is supplied. */
  showCredits?: boolean;
  charCount?: number;
  charLimit?: number;
  /** Visibility of the "count / limit" footer text. */
  showCharCount?: boolean;
  /** Visibility of the small hint line under the input (e.g. "Type / to switch assistants"). */
  showInputHint?: boolean;
  /** Keeps the composer presentational while allowing the host to mirror request state. */
  isRunning?: boolean;
  isInputDisabled?: boolean;
  isSendDisabled?: boolean;
  multiline?: boolean;
  maxRows?: number;
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
  attachAriaLabel: 'Attach files',
  toolsAriaLabel: 'Add tools',
} as const;

const iconButtonSx = {
  width: 32,
  height: 32,
  borderRadius: 1,
  color: 'text.secondary',
  '&:hover': { backgroundColor: 'action.hover' },
} as const;

const sendButtonSx = {
  color: 'text.secondary',
  width: 48,
  height: 48,
  borderRadius: '50%',
  '&:hover': { backgroundColor: 'action.hover' },
} as const;

const selectedSurfaceSx = {
  '&&': {
    backgroundColor: 'inflow.navy100',
    borderColor: 'primary.main',
    color: 'primary.main',
    '&:hover': { backgroundColor: 'inflow.navy100' },
  },
} as const;

/** Official Google Material Symbols `pin_end` vector, inlined to avoid a second icon font. */
const PIN_END_PATH =
  'M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v240h-80v-240H160v480h400v80H160Zm398-225L440-503v89h-80v-226h226v80h-90l118 118-56 57Zm202 225q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z';

function PinEndIcon() {
  return (
    <SvgIcon viewBox="0 -960 960 960" sx={{ fontSize: 22 }}>
      <path d={PIN_END_PATH} />
    </SvgIcon>
  );
}

/** Solid Material `send` glyph, inlined so the composer's submit control stays filled regardless of icon font. */
const SEND_PATH = 'M2.01 21 23 12 2.01 3 2 10l15 2-15 2z';

function SendIcon() {
  return (
    <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 24 }}>
      <path d={SEND_PATH} />
    </SvgIcon>
  );
}

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
      hideHeader = false,
      attachedFile,
      attachments,
      onAttachFile,
      onRemoveAttachment,
      renderAttachment,
      showAttach = Boolean(onAttachFile),
      attachAriaLabel = DEFAULT_STRINGS.attachAriaLabel,
      toolsAriaLabel = DEFAULT_STRINGS.toolsAriaLabel,
      tools,
      onToolSelect,
      uploadProgress,
      uploadProgressLabel,
      onSend,
      inputValue = '',
      onInputChange,
      onSendMessage,
      isStreaming = false,
      onStop,
      isTyping = false,
      renderTypingIndicator,
      renderToolMessage,
      renderMessageThread,
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
      showCredits = Boolean(credits),
      charCount = 0,
      charLimit = 2000,
      showCharCount = true,
      showInputHint = true,
      isRunning = false,
      isInputDisabled = false,
      isSendDisabled = false,
      multiline = false,
      maxRows = 4,
    },
    ref,
  ) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const assistantMenuId = useId();
    const assistantTriggerId = useId();
    const toolsMenuId = useId();
    const toolsTriggerId = useId();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [toolsAnchorEl, setToolsAnchorEl] = useState<HTMLElement | null>(null);
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
    }, [messages.length, isStreaming, isTyping]);

    const handleSelect = useCallback((option: string) => {
      setSelected(option);
      setAnchorEl(null);
      onSelectOption?.(option);
    }, [onSelectOption]);

    const handleSend = () => {
      if ((inputValue.trim() === '' && !attachedFile && !attachments?.length) || isRunning || isSendDisabled) return;

      onSendMessage?.(inputValue);
      onSend?.();
    };

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (event.key !== 'Enter') return;
      if (multiline && (event.ctrlKey || event.metaKey)) return;

      event.preventDefault();
      handleSend();
    };

    const sendDisabled = isRunning || isSendDisabled || (inputValue.trim() === '' && !attachedFile && !attachments?.length);
    const displayedAttachments = attachments ?? (attachedFile ? [{ id: 'legacy-attachment', name: attachedFile }] : []);
    const renderToolMessageSlot = (message: ThemedChatMessageDef) => {
      if (!renderToolMessage) return null;
      return <Box key={message.id} data-chat-message-kind="tool">{renderToolMessage(message)}</Box>;
    };
    const renderTypingIndicatorSlot = () => {
      if (!isTyping) return null;
      if (renderTypingIndicator) return renderTypingIndicator();
      return (
        <Box
          data-testid="default-typing-indicator"
          role="status"
          aria-label={`${assistantLabel} is typing`}
          sx={{ display: 'flex', gap: 0.5, p: 1.25 }}
        >
          {[0, 1, 2].map((dot) => (
            <Box
              key={dot}
              aria-hidden="true"
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'text.disabled',
                '@keyframes inflowChatTypingBounce': {
                  '0%, 60%, 100%': { transform: 'translateY(0)' },
                  '30%': { transform: 'translateY(-6px)' },
                },
                animationName: 'inflowChatTypingBounce',
                animationDuration: '1.4s',
                animationTimingFunction: 'ease',
                animationIterationCount: 'infinite',
                animationDelay: `${dot * 0.2}s`,
              }}
            />
          ))}
        </Box>
      );
    };

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
        {!hideHeader && (
        <Box
          component="header"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            p: (theme) => theme.spacing(1.5, 1.5, 1.5, 2),
            flexShrink: 0,
          }}
        >
          <Box sx={{ position: 'relative', minWidth: 0 }}>
          <ThemedButton
            id={assistantTriggerId}
            size="small"
            endIcon={<Icon baseClassName="material-icons-outlined" sx={{ fontSize: 18 }}>arrow_drop_down</Icon>}
            aria-haspopup="menu"
            aria-expanded={Boolean(anchorEl)}
            aria-controls={anchorEl ? assistantMenuId : undefined}
            onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={{
              height: 24,
              borderRadius: inflowTokens.radius.full,
              border: 1,
              borderColor: 'divider',
              color: 'primary.main',
              fontSize: 13,
              fontWeight: 400,
              pl: 1.5,
              pr: 0.75,
              py: 0,
              minWidth: 0,
              maxWidth: '100%',
              bgcolor: 'background.paper',
              textTransform: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              '& .MuiButton-endIcon': { ml: 0.5, mr: 0 },
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            {selected}
          </ThemedButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            slotProps={{
              list: {
                id: assistantMenuId,
                'aria-labelledby': assistantTriggerId,
              },
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
                sx={{
                  fontSize: '1rem',
                  py: 1.5,
                  px: 2,
                  gap: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'inflow.navy100',
                    '&:hover': { bgcolor: 'inflow.navy100' },
                  },
                }}
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
                <PinEndIcon />
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
        )}

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
          {renderMessageThread ? renderMessageThread({
            renderToolMessage: renderToolMessageSlot,
            renderTypingIndicator: renderTypingIndicatorSlot,
          }) : messages.map((message) => {
            if (message.kind === 'tool') {
              return renderToolMessageSlot(message);
            }

            return <ChatMessage key={message.id} message={message} userLabel={userLabel} assistantLabel={assistantLabel} />;
          })}
          {!renderMessageThread && renderTypingIndicatorSlot()}
        </Box>

        {displayedAttachments.length > 0 && (
          <Box sx={{ flexShrink: 0, px: 2, pt: 1 }}>
            {displayedAttachments.map((attachment) => renderAttachment ? (
              <Box
                key={attachment.id}
                data-attachment-status={attachment.status ?? 'done'}
                role={attachment.status === 'error' ? 'alert' : undefined}
                aria-label={attachment.status === 'error' ? `Attachment ${attachment.name} failed to upload` : undefined}
              >
                {renderAttachment(attachment)}
              </Box>
            ) : (
              <Box
                key={attachment.id}
                data-attachment-status={attachment.status ?? 'done'}
                role={attachment.status === 'error' ? 'alert' : undefined}
                aria-label={attachment.status === 'error' ? `Attachment ${attachment.name} failed to upload` : undefined}
                sx={{ display: 'inline-flex', flexDirection: 'column', width: 'fit-content', minWidth: 0, maxWidth: '100%', mr: 1, mb: 0.5 }}
              >
                <ThemedChip
                  label={attachment.name}
                  onDelete={() => onRemoveAttachment?.(attachment.id)}
                  size="sm"
                  variant="filled-primary"
                  sx={{ maxWidth: '100%', '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }}
                />
                {(attachment.status === 'pending' || attachment.status === 'uploading') && (
                  <LinearProgress variant="determinate" value={Math.min(attachment.progress ?? 0, 100)} sx={{ mt: 0.5, borderRadius: 999 }} />
                )}
              </Box>
            ))}
          </Box>
        )}
        {uploadProgress !== undefined && (
          <Box sx={{ flexShrink: 0, px: 2, pb: 0.5 }}>
            <LinearProgress variant="determinate" value={Math.min(uploadProgress, 100)} sx={{ borderRadius: 999 }} />
            {uploadProgressLabel && <Typography variant="caption" color="text.secondary">{uploadProgressLabel}</Typography>}
          </Box>
        )}

        <Box component="footer" sx={{ flexShrink: 0, p: (theme) => theme.spacing(1, 2, 1.5) }}>
          <Box
            data-testid="chat-composer"
            sx={{
              bgcolor: 'inflow.navy100',
              borderRadius: `${inflowTokens.radius.sm}px`,
              p: (theme) => theme.spacing(1, 0.5, 1, 1.5),
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minHeight: 56,
            }}
          >
            {showAttach && (
              <input ref={fileInputRef} data-testid="chat-file-input" type="file" hidden multiple onChange={(event) => {
                const files = event.target.files;
                if (files) onAttachFile?.(Array.from(files));
                event.target.value = '';
              }} />
            )}
            {tools?.length ? (
              // A single leading `+` opens one menu; when attach is also enabled it
              // becomes the menu's first item so the composer never shows two `+`.
              <>
                <IconButton
                  id={toolsTriggerId}
                  aria-label={toolsAriaLabel}
                  aria-haspopup="menu"
                  aria-expanded={Boolean(toolsAnchorEl)}
                  aria-controls={toolsAnchorEl ? toolsMenuId : undefined}
                  onClick={(event) => setToolsAnchorEl(event.currentTarget)}
                  sx={{ color: 'text.secondary', width: 32, height: 32 }}
                >
                  <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 24 }}>add</Icon>
                </IconButton>
                <Menu
                  anchorEl={toolsAnchorEl}
                  open={Boolean(toolsAnchorEl)}
                  onClose={() => setToolsAnchorEl(null)}
                  slotProps={{ list: { id: toolsMenuId, 'aria-labelledby': toolsTriggerId } }}
                >
                  {showAttach && (
                    <MenuItem key="__attach" onClick={() => {
                      setToolsAnchorEl(null);
                      fileInputRef.current?.click();
                    }}>
                      {attachAriaLabel}
                    </MenuItem>
                  )}
                  {tools.map((tool) => (
                    <MenuItem key={tool.id} disabled={tool.disabled} title={tool.disabled ? tool.disabledLabel : undefined} onClick={() => {
                      setToolsAnchorEl(null);
                      onToolSelect?.(tool.id);
                    }}>
                      {tool.label}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : showAttach ? (
              <IconButton aria-label={attachAriaLabel} onClick={() => fileInputRef.current?.click()} sx={{ color: 'text.secondary', width: 32, height: 32 }}>
                <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 24 }}>add</Icon>
              </IconButton>
            ) : null}
            <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
              <InputBase
                value={inputValue}
                onChange={(event) => onInputChange?.(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={inputPlaceholder}
                disabled={isInputDisabled}
                multiline={multiline}
                maxRows={multiline ? maxRows : undefined}
                inputProps={{ 'aria-label': inputPlaceholder, maxLength: charLimit }}
                sx={{
                  color: 'text.primary',
                  width: '100%',
                  '& .MuiInputBase-input': { fontSize: '1rem', lineHeight: 1.5, letterSpacing: '0.15px', p: '4px 0' },
                }}
              />
              {showInputHint && inputHint && (
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: '16px', letterSpacing: '0.4px' }}>
                  {inputHint}
                </Typography>
              )}
            </Box>
            {isStreaming && onStop ? (
              <IconButton aria-label={stopAriaLabel} onClick={onStop} sx={sendButtonSx}>
                <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 24 }}>stop</Icon>
              </IconButton>
            ) : (
              <IconButton aria-label={sendAriaLabel} onClick={handleSend} disabled={sendDisabled} sx={sendButtonSx}>
                <SendIcon />
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.5 }}>
            {showCredits && credits ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.75rem', lineHeight: '16px', letterSpacing: '0.4px' }}>
                  {typeof creditsLabel === 'function'
                    ? creditsLabel(credits.used, credits.total)
                    : `${creditsLabel} ${credits.used}/${credits.total}`}
                </Typography>
                <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 16, color: 'text.disabled' }}>info</Icon>
              </Box>
            ) : <span />}
            {showCharCount && (
              <Typography variant="caption" color="primary" sx={{ fontSize: '0.75rem', lineHeight: '16px', letterSpacing: '0.4px' }}>
                {charCount} / {charLimit}
              </Typography>
            )}
          </Box>

          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ display: 'block', textAlign: 'center', fontSize: '0.6875rem', fontWeight: 500, lineHeight: '16px', letterSpacing: '0.5px', mt: 0.5 }}
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.25 }}>
          <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 500, lineHeight: '20px', letterSpacing: '0.14px', color: 'text.secondary' }}>
            {userLabel}
          </Typography>
          <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 24, color: 'info.main' }}>person</Icon>
        </Box>
        <Box
          data-testid="chat-user-bubble"
          sx={{
            bgcolor: 'inflow.navy100',
            borderRadius: '10px',
            p: 1.25,
            maxWidth: '75%',
            minWidth: 0,
            textAlign: 'right',
          }}
        >
          <Typography variant="body2" color="text.primary" sx={{ lineHeight: '20px', letterSpacing: '0.17px', overflowWrap: 'anywhere' }}>
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
      <Typography
        variant="body2"
        color="text.primary"
        component="div"
        sx={{
          lineHeight: '20px',
          letterSpacing: '0.17px',
          overflowWrap: 'break-word',
          wordBreak: 'keep-all',
          minWidth: 0,
        }}
      >
        {message.content}
      </Typography>
      {message.chips && message.chips.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {message.chips.map((chip) => (
            <ThemedChip
              key={chip}
              label={chip}
              variant={selectedChips.has(chip) ? 'filled-primary' : 'outlined'}
              color="primary"
              size="sm"
              aria-pressed={selectedChips.has(chip)}
              onClick={() => toggleChip(chip)}
              sx={[
                { '&&.MuiChip-sizeSmall': { paddingLeft: '12px', paddingRight: '12px' } },
                selectedChips.has(chip) ? selectedSurfaceSx : {},
              ]}
            />
          ))}
        </Box>
      )}
      {message.actions && message.actions.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {message.actions.map((action) => (
            <ThemedButton
              key={action}
              variant="outlined"
              size="small"
              sx={{ height: 32, px: 2 }}
            >
              {action}
            </ThemedButton>
          ))}
        </Box>
      )}
    </Box>
  );
}
