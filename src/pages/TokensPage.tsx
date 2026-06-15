import { Container, Typography, Stack, Box, Card, Grid, Paper } from '@mui/material';
import { inriverTokens } from '../theme/tokens';

export function TokensPage() {
  return (
    <Container maxWidth="lg">
      <Stack spacing={6} sx={{ py: 4 }}>
        <Typography variant="h3">Design Tokens</Typography>
        
        {/* Palette Section */}
        <Box>
          <Typography variant="h5" gutterBottom>Palette</Typography>
          <Grid container spacing={2}>
            {/* Primary colors */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2 }}>
                <Box sx={{ width: '100%', height: 60, bgcolor: 'primary.main', borderRadius: 1, mb: 1 }} />
                <Typography variant="caption">primary.main</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2 }}>
                <Box sx={{ width: '100%', height: 60, bgcolor: 'secondary.main', borderRadius: 1, mb: 1 }} />
                <Typography variant="caption">secondary.main</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2 }}>
                <Box sx={{ width: '100%', height: 60, bgcolor: 'error.main', borderRadius: 1, mb: 1 }} />
                <Typography variant="caption">error.main</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2 }}>
                <Box sx={{ width: '100%', height: 60, bgcolor: 'warning.main', borderRadius: 1, mb: 1 }} />
                <Typography variant="caption">warning.main</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2 }}>
                <Box sx={{ width: '100%', height: 60, bgcolor: 'info.main', borderRadius: 1, mb: 1 }} />
                <Typography variant="caption">info.main</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2 }}>
                <Box sx={{ width: '100%', height: 60, bgcolor: 'success.main', borderRadius: 1, mb: 1 }} />
                <Typography variant="caption">success.main</Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Tokens extracted */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Inriver Extracted Palette Tokens</Typography>
          <Grid container spacing={2}>
            {Object.entries(inriverTokens.colors).map(([key, value]) => {
              if (typeof value === 'string') {
                return (
                  <Grid item xs={12} sm={4} md={2} key={key}>
                    <Card sx={{ p: 2 }}>
                      <Box sx={{ width: '100%', height: 40, bgcolor: value, borderRadius: 1, mb: 1, border: '1px solid #ccc' }} />
                      <Typography variant="caption" display="block">{key}</Typography>
                      <Typography variant="caption" color="text.secondary">{value}</Typography>
                    </Card>
                  </Grid>
                );
              }
              return null;
            })}
          </Grid>
        </Box>
        
        {/* Typography Section */}
        <Box>
          <Typography variant="h5" gutterBottom>Typography</Typography>
          <Stack spacing={2}>
            <Typography variant="h1">Heading 1</Typography>
            <Typography variant="h2">Heading 2</Typography>
            <Typography variant="h3">Heading 3</Typography>
            <Typography variant="body1">Body 1</Typography>
            <Typography variant="body2">Body 2</Typography>
            <Typography variant="caption">Caption</Typography>
          </Stack>
        </Box>
        
        {/* Spacing Section */}
        <Box>
          <Typography variant="h5" gutterBottom>Spacing</Typography>
          <Stack spacing={2}>
            {[1, 2, 3, 4, 6, 8].map(unit => (
              <Box key={unit} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: theme => theme.spacing(unit), height: 40, bgcolor: 'primary.main', borderRadius: 1 }} />
                <Typography>{unit} = {unit * 8}px</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
        
        {/* Shadows Section */}
        <Box>
          <Typography variant="h5" gutterBottom>Shadows</Typography>
          <Grid container spacing={2}>
            {[0, 1, 2, 4, 8, 16, 24].map(level => (
              <Grid item xs={6} sm={4} md={3} key={level}>
                <Paper elevation={level} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography>Shadow {level}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}
