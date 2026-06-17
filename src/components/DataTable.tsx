import React, { useState } from 'react';
import {
  Paper,
  Box,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableSortLabel,
  TableBody,
  Chip,
  LinearProgress,
  Icon
} from '@mui/material';

const MI = ({ size = 24, children }: { size?: number, children: string }) => (
  <Icon baseClassName="material-icons-outlined" sx={{ fontSize: size }}>{children}</Icon>
);

const ROWS = [
  { sku: 'ABX-200', name: 'Running shoe', channel: 'Amazon', status: 'Active', pct: 98 },
  { sku: 'TJ-014', name: 'Trail jacket', channel: 'Shopify', status: 'Draft', pct: 61 },
  { sku: 'WB-077', name: 'Wool beanie', channel: 'Salsify', status: 'Active', pct: 100 },
  { sku: 'MS-310', name: 'Merino socks', channel: 'Print', status: 'Archived', pct: 44 },
  { sku: 'HP-512', name: 'Hydration pack', channel: 'Amazon', status: 'Draft', pct: 73 },
];

const SC: Record<string, 'success' | 'warning' | 'default'> = { 
  Active: 'success', 
  Draft: 'warning', 
  Archived: 'default' 
};

export const DataTable: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [sel, setSel] = useState<string[]>(['WB-077']);
  
  const toggle = (s: string) => setSel((p) => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  return (
    <Paper variant="outlined">
      <Box sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', flexWrap: { xs: 'wrap', sm: 'nowrap' }, alignItems: 'center', gap: 1 }}>
          <Tabs
            value={tab}
            onChange={(_e, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ flex: 1, minWidth: 0 }}
          >
            <Tab label="All products" />
            <Tab label="Active" />
            <Tab label="Draft" />
            <Tab label="Archived" />
          </Tabs>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: { xs: '100%', sm: 'auto' } }}>
            <Tooltip title="Filter">
              <IconButton><MI size={20}>filter_list</MI></IconButton>
            </Tooltip>
            <Tooltip title="Columns">
              <IconButton><MI size={20}>view_column</MI></IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      
      {sel.length > 0 && (
        <Box sx={{ px: 2, py: 1, bgcolor: 'inriver.surfaceLow', display: 'flex', alignItems: 'center', gap: 2 }} data-testid="bulk-action-bar">
          <Typography variant="body2" color="primary.main">{sel.length} selected</Typography>
          <Button size="small" variant="text" startIcon={<MI size={16}>publish</MI>}>Publish</Button>
          <Button size="small" variant="text" startIcon={<MI size={16}>auto_fix_high</MI>}>Enrich</Button>
          <Button size="small" variant="text" color="error" startIcon={<MI size={16}>delete</MI>}>Delete</Button>
        </Box>
      )}
      
      <TableContainer sx={{ maxWidth: '100%', overflow: 'auto' }}>
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox 
                  size="small" 
                  checked={sel.length === ROWS.length}
                  indeterminate={sel.length > 0 && sel.length < ROWS.length}
                  onChange={(e) => setSel(e.target.checked ? ROWS.map(r => r.sku) : [])} 
                />
              </TableCell>
              <TableCell><TableSortLabel active direction="asc">SKU</TableSortLabel></TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Channel</TableCell>
              <TableCell>Status</TableCell>
              <TableCell sx={{ width: 180 }}>Completeness</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ROWS.map((r) => {
              const on = sel.includes(r.sku);
              return (
                <TableRow 
                  key={r.sku} 
                  hover 
                  selected={on} 
                  sx={{ cursor: 'pointer' }} 
                  onClick={() => toggle(r.sku)}
                >
                  <TableCell padding="checkbox"><Checkbox size="small" checked={on} /></TableCell>
                  <TableCell sx={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{r.sku}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.channel}</TableCell>
                  <TableCell>
                    <Chip 
                      size="small" 
                      label={r.status} 
                      color={SC[r.status]} 
                      variant={r.status === 'Archived' ? 'outlined' : 'filled'} 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress variant="determinate" value={r.pct} sx={{ flex: 1, height: 6 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ width: 32 }}>{r.pct}%</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
