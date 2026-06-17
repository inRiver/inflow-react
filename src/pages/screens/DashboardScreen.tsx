import { Grid, Card, CardContent, Typography, Box, Container } from '@mui/material';
import { DataTable } from '../../components/DataTable';

const KPIS = [
  { k: 'Total products', v: '12,480', d: '+2.1% this week', c: 'success' },
  { k: 'Needs enrichment', v: '318', d: 'Across 4 channels', c: 'warning' },
  { k: 'Validation errors', v: '27', d: 'Down from 41', c: 'error' },
  { k: 'Channel completeness', v: '92%', d: 'Amazon, Shopify, Print', c: 'primary' },
];

export default function DashboardScreen() {
  return (
    <Container maxWidth="xl" sx={{ py: 3, maxWidth: '100%', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Example
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Catalog overview with KPI cards and data table
      </Typography>
      <Grid container spacing={3}>
        {KPIS.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.k}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="overline" color="text.secondary">{s.k}</Typography>
                <Typography variant="h4" sx={{ my: 0.5, color: 'primary.main' }}>{s.v}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: `${s.c}.main` }} />
                  <Typography variant="caption" color="text.secondary">{s.d}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12}>
          <DataTable />
        </Grid>
      </Grid>
    </Container>
  );
}
