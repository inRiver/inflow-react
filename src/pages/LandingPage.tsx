import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import * as Icons from '@mui/icons-material';
import { Link } from 'react-router-dom';
import pkg from '../../package.json';
import { COMPONENT_CATEGORIES, getAllComponents } from '../showcase/categories';
import { ExampleScreensOverview, PopularComponentsOverview } from './LandingOverviewSections';

const muiVersion = (await import('@mui/material/package.json')).version;
const reactVersion = (await import('react/package.json')).version;

const categoryIcons: Readonly<Record<string, SvgIconComponent>> = {
  Campaign: Icons.Campaign,
  Category: Icons.Category,
  Dashboard: Icons.Dashboard,
  Edit: Icons.Edit,
  Explore: Icons.Explore,
  TableRows: Icons.TableRows,
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
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mt: 2, gap: 1 }}>
            <Chip label={`@inriver/inflow-react v${pkg.version}`} size="small" color="primary" />
            <Chip label={`React ${reactVersion}`} size="small" variant="outlined" />
            <Chip label={`MUI ${muiVersion}`} size="small" variant="outlined" />
            <Chip label="tag: react19-mui9.3" size="small" variant="outlined" />
          </Stack>
        </Box>

        <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            sx={{
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
            }}
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
            const Icon = categoryIcons[category.icon] ?? Icons.Category;
            return (
              <Grid key={category.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 3 }}
                  >
                    <Icon color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h6" component="div">
                      {category.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      {category.components.length} Components
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textAlign: 'center', fontStyle: 'italic' }}
                    >
                      Browse in sidebar or open the full index
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <ExampleScreensOverview />
        <PopularComponentsOverview totalComponents={totalComponents} />

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
