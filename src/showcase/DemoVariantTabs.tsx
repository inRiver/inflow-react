import { Box, Tab, Tabs, Typography } from '@mui/material';

export type DemoVariant = 'mui' | 'themed';

interface DemoVariantTabsProps {
  value: DemoVariant;
  onChange: (value: DemoVariant) => void;
  muiLabel: string;
  themedLabel: string;
  themedReason?: string;
}

/**
 * Tabs for switching a demo between the plain MUI component and its
 * Themed* wrapper equivalent. Defaults to the plain MUI tab being shown
 * first (selected by the caller's initial state), since most components
 * only need the theme + InflowProvider - the Themed* tab is opt-in extra
 * context for the components where a wrapper genuinely adds something.
 */
export function DemoVariantTabs({ value, onChange, muiLabel, themedLabel, themedReason }: DemoVariantTabsProps) {
  return (
    <Box sx={{ mb: 1 }}>
      <Tabs
        value={value}
        onChange={(_event, newValue: DemoVariant) => onChange(newValue)}
        sx={{
          minHeight: 36,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': { minHeight: 36, textTransform: 'none', fontWeight: 600 },
        }}
      >
        <Tab value="mui" label={muiLabel} />
        <Tab value="themed" label={themedLabel} />
      </Tabs>
      {value === 'themed' && themedReason && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          Why {themedLabel} exists: {themedReason}
        </Typography>
      )}
    </Box>
  );
}
