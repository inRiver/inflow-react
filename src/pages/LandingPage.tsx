import { useState } from 'react';
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
import { ThemedCard } from '../components/themed/ThemedCard';
import { ThemedChip } from '../components/themed/ThemedChip';
import { ThemedAlert } from '../components/themed/ThemedAlert';
import { ThemedTabs, ThemedTabPanel } from '../components/themed/ThemedTabs';
import { ThemedTable, type Column } from '../components/themed/ThemedTable';
import { ExampleScreensOverview, PopularComponentsOverview } from './LandingOverviewSections';

const muiVersion = (await import('@mui/material/package.json')).version;
const reactVersion = (await import('react/package.json')).version;

const reactMajor = reactVersion.split('.')[0];
const [muiMajor, muiMinor] = muiVersion.split('.');
const checkpointTag = `react${reactMajor}-mui${muiMajor}.${muiMinor}`;

const categoryIcons: Readonly<Record<string, SvgIconComponent>> = {
  AccountTree: Icons.AccountTree,
  Campaign: Icons.Campaign,
  Category: Icons.Category,
  Dashboard: Icons.Dashboard,
  Edit: Icons.Edit,
  Explore: Icons.Explore,
  TableRows: Icons.TableRows,
};

// --- Live proof section: a miniature product surface built from themed components ---

type ProductRow = { id: string; name: string; status: string; owner: string };

const productRows: ProductRow[] = [
  { id: '1', name: 'Summer catalog', status: 'Active', owner: 'Retail' },
  { id: '2', name: 'Outlet feed', status: 'Draft', owner: 'Channels' },
  { id: '3', name: 'Asset enrichment', status: 'Active', owner: 'Studio' },
];

const productColumns: Column<ProductRow>[] = [
  { id: 'name', label: 'Workspace' },
  { id: 'status', label: 'Status' },
  { id: 'owner', label: 'Team' },
];

const liveProofTabs = [
  { label: 'Table', icon: 'table_rows' },
  { label: 'Status', icon: 'toggle_on' },
  { label: 'Notify', icon: 'notifications' },
];

function LiveProductSurface() {
  const [tab, setTab] = useState(0);
  return (
    <Box
      sx={(theme) => ({
        border: 1,
        borderColor: 'inflow.outlineVariant',
        borderRadius: 2,
        backgroundColor: theme.palette.inflow.surfaceLowest,
        p: { xs: 2, sm: 3 },
      })}
    >
      <Box sx={{ overflowX: 'auto' }}>
        <ThemedTabs
          tabs={liveProofTabs}
          value={tab}
          onChange={(_, i) => setTab(i)}
          ariaLabel="Live component preview"
          style={{ flexWrap: 'wrap' }}
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <ThemedTabPanel value={tab} index={0}>
          <ThemedTable
            columns={productColumns}
            data={productRows}
            size="small"
            aria-label="Example product workspaces"
          />
        </ThemedTabPanel>
        <ThemedTabPanel value={tab} index={1}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            <ThemedChip label="Active" color="primary" leadingIcon="check_circle" />
            <ThemedChip label="Draft" variant="outlined" leadingIcon="edit" />
            <ThemedChip label="Scheduled" variant="filled-primary" leadingIcon="schedule" />
            <ThemedChip label="Archived" variant="outlined" leadingIcon="archive" />
          </Stack>
        </ThemedTabPanel>
        <ThemedTabPanel value={tab} index={2}>
          <ThemedAlert severity="success" title="Publish complete">
            The summer catalog was published to 3 channels.
          </ThemedAlert>
        </ThemedTabPanel>
      </Box>
    </Box>
  );
}

// --- Feature cards ---

const features = [
  {
    icon: Icons.Palette,
    title: 'Theming & tokens',
    body: 'One canonical theme drives palette, type, shape and elevation, with token values also exposed as scoped CSS variables you can override per provider.',
    to: '/theming',
    cta: 'Explore theming',
  },
  {
    icon: Icons.Terminal,
    title: 'Agent-ready CLI',
    body: 'The zero-dependency inflow CLI answers component, token and docs lookups from the terminal or a coding agent, with typed JSON output.',
    to: '/cli',
    cta: 'Read the CLI reference',
  },
  {
    icon: Icons.AccountTree,
    title: 'Production patterns',
    body: 'Copy-paste page recipes for the flows Inriver teams build most — data tables, detail views and panel layouts.',
    to: '/components',
    cta: 'Browse patterns',
  },
] as const;

export function LandingPage() {
  const totalComponents = getAllComponents().length;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Stack spacing={{ xs: 6, md: 9 }}>
        {/* Hero */}
        <Box component="section" sx={{ textAlign: 'center', pt: { xs: 2, md: 4 } }}>
          <Typography
            variant="overline"
            color="primary.main"
            sx={{ letterSpacing: '0.08em', fontWeight: 700 }}
          >
            Inflow Design System
          </Typography>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 700, maxWidth: 720, mx: 'auto', mt: 1 }}
          >
            Build Inriver product UIs that feel like one product
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: 620, mx: 'auto', mt: 2 }}
          >
            A shared MUI theme, design tokens, and themed components — plus an agent-ready
            CLI — so every team ships consistent, accessible interfaces faster.
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: 'center', mt: 4, flexWrap: 'wrap', gap: 2 }}
          >
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/getting-started"
              endIcon={<Icons.ArrowForward />}
            >
              Get started
            </Button>
            <Button variant="outlined" size="large" component={Link} to="/components">
              Browse components
            </Button>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: 'center', mt: 4, flexWrap: 'wrap', gap: 1 }}
          >
            <Chip label={`v${pkg.version}`} size="small" color="primary" />
            <Chip label={`React ${reactVersion}`} size="small" variant="outlined" />
            <Chip label={`MUI ${muiVersion}`} size="small" variant="outlined" />
            <Chip label={`tag: ${checkpointTag}`} size="small" variant="outlined" />
          </Stack>
        </Box>

        {/* Live proof */}
        <Box component="section" aria-labelledby="live-proof-heading">
          <Stack spacing={1} sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="overline" color="primary.main">
              Built with our own components
            </Typography>
            <Typography id="live-proof-heading" variant="h5">
              One system, every surface
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 560, mx: 'auto' }}>
              This preview is composed from the same ThemedTabs, ThemedTable, ThemedChip and
              ThemedAlert you ship — proof the building blocks hold up together.
            </Typography>
          </Stack>
          <LiveProductSurface />
        </Box>

        {/* Features */}
        <Box component="section" aria-labelledby="features-heading">
          <Typography id="features-heading" variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
            Everything a product team needs
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature) => {
              const FeatureIcon = feature.icon;
              return (
                <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
                  <ThemedCard
                    title={
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            display: 'grid',
                            placeItems: 'center',
                            borderRadius: 1,
                            color: 'primary.main',
                            backgroundColor: 'inflow.rowSelected',
                          }}
                        >
                          <FeatureIcon fontSize="small" />
                        </Box>
                        <Typography variant="h6">{feature.title}</Typography>
                      </Stack>
                    }
                    actions={
                      <Button component={Link} to={feature.to} endIcon={<Icons.ArrowForward />}>
                        {feature.cta}
                      </Button>
                    }
                    sx={{ height: '100%' }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {feature.body}
                    </Typography>
                  </ThemedCard>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Divider />

        {/* Browsable index (kept) */}
        <Box component="section" aria-labelledby="browse-heading">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            sx={{ alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', mb: 3 }}
          >
            <Box>
              <Typography id="browse-heading" variant="h5" gutterBottom>
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
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <ExampleScreensOverview />
        <PopularComponentsOverview totalComponents={totalComponents} />
      </Stack>
    </Container>
  );
}
