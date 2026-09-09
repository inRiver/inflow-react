
import { useCallback, useState } from 'react';
import { Box, Chip, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DataTable } from '../../components/DataTable';
import {
  createFocusedCellReply,
  type DataTableCellContext,
} from '../../components/DataTable.data';
import { ThemedAppNav } from '../../components/themed/ThemedAppNav';
import {
  ThemedChatPanel,
  type ThemedChatMessageDef,
} from '../../components/themed/ThemedChatPanel';
import { ThemedPageHeader } from '../../components/themed/ThemedPageHeader';
import { ThemedRightPanel } from '../../components/themed/ThemedRightPanel';

const initialMessages: ThemedChatMessageDef[] = [
  {
    id: 'assistant-intro',
    role: 'assistant',
    content: 'Focus an editable grid cell, change it if needed, then ask me for the latest value.',
  },
];

export default function TableScreen() {
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down('md'));
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [focusedCell, setFocusedCell] = useState<DataTableCellContext | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ThemedChatMessageDef[]>(initialMessages);

  const handleSendMessage = useCallback((text: string) => {
    setMessages((current) => [
      ...current,
      { id: `user-${current.length}`, role: 'user', content: text },
      {
        id: `assistant-${current.length + 1}`,
        role: 'assistant',
        content: createFocusedCellReply(focusedCell),
      },
    ]);
    setInputValue('');
  }, [focusedCell]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          minHeight: { xs: 560, md: 640 },
          overflow: 'hidden',
          border: 1,
          borderColor: 'inflow.outlineVariant',
          bgcolor: 'inflow.appBackground',
        }}
      >
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <ThemedAppNav
            items={[
              { label: 'Dashboard', icon: 'dashboard', href: '#/examples/dashboard' },
              { label: 'Products', icon: 'inventory_2', href: '#/examples/table', active: true },
              { label: 'Channels', icon: 'hub', href: '#/publishers/ag-grid' },
              { label: 'Tasks', icon: 'task_alt', href: '#/guidelines' },
            ]}
            footer={[{ label: 'Settings', icon: 'settings', href: '#/guidelines' }]}
          />
        </Box>

        <Box sx={{ display: 'flex', flex: 1, minWidth: 0, flexDirection: 'column' }}>
          <ThemedPageHeader
            eyebrow="Product workspace"
            title="Data Table"
            actions={[{ label: 'Ask assistant', variant: 'filled', onClick: () => setAssistantOpen(true) }]}
          />

          <Stack spacing={2} sx={{ minWidth: 0, p: { xs: 2, md: 3 } }}>
            <Box>
              <Typography variant="h5" component="h2">
                Products
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AG Grid owns sorting, filtering, row selection, keyboard focus, and inline editing.
              </Typography>
            </Box>

            <Box
              role="status"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minHeight: 40,
                px: 2,
                py: 1,
                bgcolor: 'inflow.surfaceLow',
                border: 1,
                borderColor: 'inflow.outlineVariant',
              }}
            >
              <Chip size="small" color={focusedCell ? 'primary' : 'default'} label="Assistant context" />
              <Typography variant="body2">
                {focusedCell
                  ? `${focusedCell.rowId} · ${focusedCell.columnLabel}: ${focusedCell.value}`
                  : 'Focus a cell to give the assistant live grid context.'}
              </Typography>
            </Box>

            <DataTable onFocusedCellChange={setFocusedCell} />
          </Stack>
        </Box>
      </Box>

      <ThemedRightPanel
        open={assistantOpen}
        mode={isNarrow ? 'overlay' : 'push'}
        width={isNarrow ? 'narrow' : 'medium'}
        variant="assistant"
        aria-label="AI data assistant"
        onClose={() => setAssistantOpen(false)}
      >
        <ThemedChatPanel
          title="Data Assistant"
          dropdownOptions={['Data Assistant']}
          messages={messages}
          inputValue={inputValue}
          inputPlaceholder="Ask about the focused cell"
          showCredits={false}
          onClose={() => setAssistantOpen(false)}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
        />
      </ThemedRightPanel>
    </>
  );
}
