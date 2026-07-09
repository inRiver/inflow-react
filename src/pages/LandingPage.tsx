import { Container, Typography, Button, Stack, Card, CardActionArea, CardContent, Box, Grid, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { COMPONENT_CATEGORIES, EXAMPLE_PAGES, getAllComponents } from '../showcase/categories';
import * as Icons from '@mui/icons-material';

const categoryIcons = {
  Campaign: Icons.Campaign,
  Category: Icons.Category,
  Dashboard: Icons.Dashboard,
  Edit: Icons.Edit,
  Explore: Icons.Explore,
  TableRows: Icons.TableRows,
};

const exampleIcons = {
  Dashboard: Icons.Dashboard,
  Dialog: Icons.RateReview,
  Inbox: Icons.Inbox,
  Login: Icons.Login,
  TableChart: Icons.TableChart,
};

export function LandingPage() {
  const totalComponents = getAllComponents().length;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={6}>
        <Box>
          <Typography variant="h3" gutterBottom>
            Inflow Design System Showcase
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Explore all {totalComponents} Material UI components themed for Inflow
          </Typography>
        </Box>

        <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h5" gutterBottom>
                Browse all {totalComponents} showcase components
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Open the full component index to explore every category and jump straight to any demo.
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/components"
              endIcon={<Icons.ArrowForward />}
            >
              Browse All Components
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {Object.values(COMPONENT_CATEGORIES).map((category) => {
            const Icon = categoryIcons[category.icon as keyof typeof categoryIcons] || Icons.Category;
            return (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 3 }}>
                    <Icon color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h6" component="div">
                      {category.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      {category.components.length} Components
                    </Typography>
                    <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ fontStyle: 'italic' }}>
                      Browse in sidebar or open the full index
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h5" gutterBottom>
            Example Screens
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Full-page examples showing components in realistic layouts
          </Typography>
          <Grid container spacing={2}>
            {EXAMPLE_PAGES.map((example) => {
              const Icon = exampleIcons[example.icon as keyof typeof exampleIcons] || Icons.ViewModule;
              return (
                <Grid item xs={12} sm={6} md={4} key={example.id}>
                  <Card>
                    <CardActionArea component={Link} to={`/examples/${example.id}`} sx={{ p: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Icon color="primary" />
                        <Box>
                          <Typography variant="subtitle1">{example.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {example.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h5" gutterBottom>
                Popular Components
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quick access to commonly used components
              </Typography>
            </Box>
            <Button component={Link} to="/components" endIcon={<Icons.ArrowForward />}>
              View all {totalComponents} components
            </Button>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Button variant="contained" component={Link} to="/components/button">
              Button
            </Button>
            <Button variant="contained" component={Link} to="/components/textfield">
              Text Field
            </Button>
            <Button variant="contained" component={Link} to="/components/select">
              Select
            </Button>
            <Button variant="contained" component={Link} to="/components/checkbox">
              Checkbox
            </Button>
            <Button variant="contained" component={Link} to="/components/table">
              Table
            </Button>
            <Button variant="contained" component={Link} to="/components/card">
              Card
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h5" gutterBottom>
            More Resources
          </Typography>
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Button 
              variant="outlined" 
              component={Link} 
              to="/guidelines"
              startIcon={<Icons.IntegrationInstructions />}
            >
              Import Guidelines
            </Button>
            <Button 
              variant="outlined" 
              component={Link} 
              to="/tokens"
              startIcon={<Icons.Palette />}
            >
              Design Tokens
            </Button>
            <Button 
              variant="outlined" 
              component={Link} 
              to="/pre-rendered"
              startIcon={<Icons.Code />}
            >
              Pre-Rendered Page
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
