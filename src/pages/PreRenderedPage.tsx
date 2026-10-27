import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Divider, Stack, IconButton, Snackbar } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  ThemedCard,
  ThemedChip,
  ThemedDialog,
  ThemedTable,
} from '../components/themed';

const componentsList = [
  {
    name: 'Button',
    description: 'A plain MUI Button styled by the Inflow theme inside InflowProvider.',
    code: `<Button variant="contained">Primary Action</Button>
<Button variant="outlined">Secondary</Button>
<Button variant="text">Text Button</Button>`,
    component: (
      <Stack direction="row" spacing={2}>
        <Button variant="contained">Primary Action</Button>
        <Button variant="outlined">Secondary</Button>
        <Button variant="text">Text Button</Button>
      </Stack>
    )
  },
  {
    name: 'TextField',
    description: 'A plain MUI TextField styled by the Inflow theme inside InflowProvider (outlined + small by default).',
    code: `<TextField label="Username" placeholder="Enter username" />
<TextField label="Password" type="password" error helperText="Incorrect password" />`,
    component: (
      <Stack direction="row" spacing={2}>
        <TextField label="Username" placeholder="Enter username" />
        <TextField label="Password" type="password" error helperText="Incorrect password" />
      </Stack>
    )
  },
  {
    name: 'ThemedCard',
    description: 'A card component with Inflow tokens.',
    code: `<ThemedCard 
  title="Project Title" 
  subheader="Created on Jan 1, 2026"
  actions={<Button size="small">View Details</Button>}
>
  <Typography variant="body2">This is the main content area of the themed card.</Typography>
</ThemedCard>`,
    component: (
      <Box sx={{ maxWidth: 400 }}>
        <ThemedCard 
          title="Project Title" 
          subheader="Created on Jan 1, 2026"
          actions={<Button size="small">View Details</Button>}
        >
          <Typography variant="body2">This is the main content area of the themed card.</Typography>
        </ThemedCard>
      </Box>
    )
  },
  {
    name: 'ThemedChip',
    description: 'A chip component with Inflow tokens.',
    code: `<ThemedChip label="Active" color="primary" />
<ThemedChip label="Removed" color="error" onDelete={() => {}} />
<ThemedChip label="Added" color="success" />
<ThemedChip label="Filter" variant="outlined" onDelete={() => {}} />`,
    component: (
      <Stack direction="row" spacing={2}>
        <ThemedChip label="Active" color="primary" />
        <ThemedChip label="Removed" color="error" onDelete={() => {}} />
        <ThemedChip label="Added" color="success" />
        <ThemedChip label="Filter" variant="outlined" onDelete={() => {}} />
      </Stack>
    )
  },
  {
    name: 'ThemedTable',
    description: 'A table component with Inflow tokens.',
    code: `const columns = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Name' },
  { id: 'status', label: 'Status', render: (row: any) => <ThemedChip label={row.status} color="primary" size="small" /> }
];
const data = [
  { id: 1, name: 'Item 1', status: 'Active' },
  { id: 2, name: 'Item 2', status: 'Pending' }
];

<ThemedTable columns={columns} data={data} striped />`,
    component: (
      <ThemedTable 
        columns={[
          { id: 'id', label: 'ID' },
          { id: 'name', label: 'Name' },
          { id: 'status', label: 'Status', render: (row: any) => <ThemedChip label={row.status} color="primary" size="small" /> }
        ]} 
        data={[
          { id: 1, name: 'Item 1', status: 'Active' },
          { id: 2, name: 'Item 2', status: 'Pending' }
        ]} 
        striped 
      />
    )
  }
];

export const PreRenderedPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>Pre-Rendered Themed Components</Typography>
      <Typography variant="body1" color="text.secondary" component="p" sx={{ mb: 2 }}>
        Production-ready components utilizing Inflow design tokens that can be easily copy-pasted into projects.
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Stack spacing={6}>
        {componentsList.map((comp) => (
          <Box key={comp.name}>
            <Typography variant="h5" gutterBottom>{comp.name}</Typography>
            <Typography variant="body2" color="text.secondary" component="p" sx={{ mb: 2 }}>{comp.description}</Typography>
            
            <Paper variant="outlined" sx={{ p: 3, mb: 2, backgroundColor: '#f9f9fa' }}>
              {comp.component}
            </Paper>

            <Box sx={{ position: 'relative' }}>
              <Paper 
                sx={{ 
                  p: 2, 
                  backgroundColor: '#282c34', 
                  color: '#abb2bf', 
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  borderRadius: 1
                }}
              >
                <pre style={{ margin: 0 }}><code>{comp.code}</code></pre>
              </Paper>
              <IconButton 
                onClick={() => handleCopy(comp.code)}
                sx={{ position: 'absolute', top: 8, right: 8, color: '#abb2bf' }}
                aria-label="copy code"
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}

        {/* ThemedDialog needs special handling for open/close state */}
         <Box>
           <Typography variant="h5" gutterBottom>ThemedDialog</Typography>
           <Typography variant="body2" color="text.secondary" component="p" sx={{ mb: 2 }}>
             A dialog component with Inflow tokens.
           </Typography>
          
          <Paper variant="outlined" sx={{ p: 3, mb: 2, backgroundColor: '#f9f9fa' }}>
            <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
            
             <ThemedDialog
               open={dialogOpen}
               onClose={() => setDialogOpen(false)}
               title="Edit Settings"
               actions={
                 <Stack direction="row" spacing={1}>
                   <Button variant="outlined" onClick={() => setDialogOpen(false)}>Cancel</Button>
                   <Button onClick={() => setDialogOpen(false)}>Save Changes</Button>
                 </Stack>
               }
              >
               <Typography>
                 Configure the settings below. This dialog uses Inflow tokens for border-radius and background colors.
               </Typography>
             </ThemedDialog>
          </Paper>

          <Box sx={{ position: 'relative' }}>
            <Paper 
              sx={{ 
                p: 2, 
                backgroundColor: '#282c34', 
                color: '#abb2bf', 
                fontFamily: 'monospace',
                overflowX: 'auto',
                borderRadius: 1
              }}
            >
              <pre style={{ margin: 0 }}><code>{`<ThemedDialog
  open={dialogOpen}
  onClose={() => setDialogOpen(false)}
  title="Edit Settings"
  actions={
    <Stack direction="row" spacing={1}>
      <Button variant="outlined" onClick={() => setDialogOpen(false)}>Cancel</Button>
      <Button onClick={() => setDialogOpen(false)}>Save Changes</Button>
    </Stack>
  }
>
  <Typography>Dialog content goes here.</Typography>
</ThemedDialog>`}</code></pre>
            </Paper>
            <IconButton 
              onClick={() => handleCopy(`<ThemedDialog
  open={dialogOpen}
  onClose={() => setDialogOpen(false)}
  title="Edit Settings"
  actions={
    <Stack direction="row" spacing={1}>
      <Button variant="outlined" onClick={() => setDialogOpen(false)}>Cancel</Button>
      <Button onClick={() => setDialogOpen(false)}>Save Changes</Button>
    </Stack>
  }
>
  <Typography>Dialog content goes here.</Typography>
</ThemedDialog>`)}
              sx={{ position: 'absolute', top: 8, right: 8, color: '#abb2bf' }}
              aria-label="copy code"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Code copied to clipboard"
      />
    </Box>
  );
};
