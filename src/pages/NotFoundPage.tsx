import { Container, Typography, Button, Stack, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import * as Icons from '@mui/icons-material';

export function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Stack spacing={4} alignItems="center">
        <Icons.SearchOff sx={{ fontSize: 80, color: 'text.secondary' }} />
        <Box>
          <Typography variant="h3" gutterBottom>
            404 - Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The page you're looking for doesn't exist or has been moved.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            component={Link} 
            to="/"
            startIcon={<Icons.Home />}
          >
            Go Home
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => window.history.back()}
            startIcon={<Icons.ArrowBack />}
          >
            Go Back
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
