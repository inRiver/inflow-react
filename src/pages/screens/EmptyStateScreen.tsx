
import {
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

export default function EmptyStateScreen() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 2,
        }}
      >
        <InboxIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />

        <Typography variant="h5" component="h1" gutterBottom>
          No Data Available
        </Typography>

        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          There's nothing to display right now. Start by creating your first item.
        </Typography>

        <Button variant="contained" size="large">
          Create New Item
        </Button>
      </Box>
    </Container>
  );
}
