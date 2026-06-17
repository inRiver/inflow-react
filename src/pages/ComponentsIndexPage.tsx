import { Container, Typography, Stack, Box, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import * as Icons from '@mui/icons-material';
import { COMPONENT_CATEGORIES, getAllComponents, getComponentLabel } from '../showcase/categories';

export function ComponentsIndexPage() {
  const totalComponents = getAllComponents().length;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h3" gutterBottom>
            All Components
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Browse all {totalComponents} showcase components by category.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {Object.values(COMPONENT_CATEGORIES).map((category) => {
            const Icon = (Icons as any)[category.icon] || Icons.Category;

            return (
              <Grid item xs={12} md={6} key={category.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Icon color="primary" sx={{ fontSize: 32 }} />
                      <Box>
                        <Typography variant="h6">{category.label}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {category.components.length} components
                        </Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {category.components.map((component) => (
                        <Button
                          key={component}
                          variant="outlined"
                          size="small"
                          component={Link}
                          to={`/components/${component}`}
                        >
                          {getComponentLabel(component)}
                        </Button>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    </Container>
  );
}
