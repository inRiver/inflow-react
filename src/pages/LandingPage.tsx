import { Container, Typography, Button, Stack, Card, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <Container maxWidth="lg">
      <Stack spacing={6} sx={{ py: 8 }}>
        <Box textAlign="center">
          <Typography variant="h2" gutterBottom>Inriver MUI Theme</Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Production-ready design system. Zero magic numbers. Theme-first.
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary">764</Typography>
              <Typography>Violations Eliminated</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary">40%</Typography>
              <Typography>Maintenance Reduction</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary">80%</Typography>
              <Typography>AI Efficiency Gain</Typography>
            </Card>
          </Grid>
        </Grid>
        
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" size="large" component={Link} to="/components/button">
            View Components
          </Button>
          <Button variant="outlined" size="large" component={Link} to="/tokens">
            Explore Tokens
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
