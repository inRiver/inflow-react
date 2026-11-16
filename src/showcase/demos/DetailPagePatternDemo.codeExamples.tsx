import { useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { ThemedDetailPageShell, ThemedDetailPanelSection, ThemedPageHeader } from '../../components/themed';

export function PublisherDetail() {
  const [open, setOpen] = useState(false);
  return (
    <ThemedDetailPageShell
      panel={{
        panelProps: { open, onClose: () => setOpen(false), mode: 'push', variant: 'editor', 'aria-label': 'Publisher details panel' },
        detailProps: {
          title: 'Publisher information',
          children: <ThemedDetailPanelSection title="Contact"><Typography>catalog@example.com</Typography></ThemedDetailPanelSection>,
        },
      }}
    >
      <ThemedPageHeader title="Northstar" eyebrow="Publisher" />
      <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Typography>Review publisher information alongside the page.</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Open publisher panel</Button>
      </Stack>
    </ThemedDetailPageShell>
  );
}
