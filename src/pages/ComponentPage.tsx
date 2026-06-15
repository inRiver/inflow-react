import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';

export function ComponentPage() {
  const { componentName } = useParams();
  
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ textTransform: 'capitalize', mb: 2 }}>
        {componentName} Demo
      </Typography>
      <Typography color="text.secondary">
        Demo will be loaded here (Wave 1B)
      </Typography>
    </Container>
  );
}
