import { 
  AppBar, 
  Toolbar, 
  Box, 
  Paper, 
  Tooltip, 
  IconButton, 
  Avatar, 
  InputBase, 
  Icon 
} from '@mui/material';

export function GlobalHeader() {
  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: '#fff', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ gap: 2 }}>
        <Box sx={{ flex: 1 }} />
        <Paper sx={{ width: 400, display: 'flex', alignItems: 'center', px: 1.5, py: 0.25, bgcolor: 'inriver.navy100', boxShadow: 'none', borderRadius: '4px' }}>
          <Icon baseClassName="material-icons-outlined" sx={{ fontSize: 20, color: 'primary.main' }}>search</Icon>
          <InputBase placeholder="Search products, attributes…" sx={{ ml: 1, flex: 1, fontSize: 14 }} />
        </Paper>
        <Box sx={{ flex: 1 }} />
        <Tooltip title="Assistant"><IconButton color="primary"><Icon baseClassName="material-icons-outlined">smart_toy</Icon></IconButton></Tooltip>
        <Tooltip title="Assignments"><IconButton color="primary"><Icon baseClassName="material-icons-outlined">assignment</Icon></IconButton></Tooltip>
        <Avatar sx={{ width: 40, height: 40, fontSize: 14 }}>AN</Avatar>
      </Toolbar>
    </AppBar>
  );
}
