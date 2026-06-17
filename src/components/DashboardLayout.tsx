import React from 'react';
import { Box } from '@mui/material';
import { GlobalHeader } from './GlobalHeader';
import { PageHeader } from './PageHeader';
import { NavRail, type NavRailItem } from './NavRail';

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS: NavRailItem[] = [
  { label: 'Dashboard', icon: 'dashboard', active: true },
  { label: 'Products', icon: 'inventory_2' },
  { label: 'Enrich', icon: 'edit_note' },
  { label: 'Validate', icon: 'check_circle' },
  { label: 'Channels', icon: 'share' },
  { label: 'Print', icon: 'print' },
  { label: 'Insights', icon: 'analytics' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <NavRail items={NAV_ITEMS} />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <GlobalHeader />
        <PageHeader 
          eyebrow="Catalog" 
          title="Projects" 
          actions={[
            { label: 'Export', variant: 'outlined', icon: 'file_download', onClick: () => {} },
            { label: 'New Project', variant: 'filled', icon: 'add', onClick: () => {} }
          ]} 
        />
        <Box component="main" sx={{ flex: 1, bgcolor: 'inriver.navy100', overflow: 'auto', p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
