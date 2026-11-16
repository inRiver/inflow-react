import { useState } from 'react';
import {
  Box,
  Button,
  CardActionArea,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CampaignIcon from '@mui/icons-material/Campaign';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EditIcon from '@mui/icons-material/Edit';
import ExploreIcon from '@mui/icons-material/Explore';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import PaletteIcon from '@mui/icons-material/Palette';
import TableRowsIcon from '@mui/icons-material/TableRows';
import TerminalIcon from '@mui/icons-material/Terminal';
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
  AccountTree: AccountTreeIcon,
  Campaign: CampaignIcon,
  Category: CategoryIcon,
  Dashboard: DashboardIcon,
  Edit: EditIcon,
  Explore: ExploreIcon,
  TableRows: TableRowsIcon,
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

// --- Feature cards ---

const features = [
  {
    icon: PaletteIcon,
    title: 'Theming & tokens',
    body: 'One canonical theme drives palette, type, shape and elevation, with token values also exposed as scoped CSS variables you can override per provider.',
    to: '/theming',
    cta: 'Explore theming',
  },
  {
    icon: TerminalIcon,
    title: 'Agent-ready CLI',
    body: 'The zero-dependency inflow CLI answers component, token and docs lookups from the terminal or a coding agent, with typed JSON output.',
    to: '/cli',
    cta: 'Read the CLI reference',
  },
  {
    icon: AccountTreeIcon,
    title: 'Production patterns',
    body: 'Copy-paste page recipes for the flows Inriver teams build most — data tables, detail views and panel layouts.',
    to: '/components',
    cta: 'Browse patterns',
  },
] as const;

export function LandingPage() {
  const [tab, setTab] = useState(0);
  const categories = Object.values(COMPONENT_CATEGORIES);
  const totalComponents = getAllComponents().length;

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 }, py: { xs: 2, md: 5 } }}>
      <Stack
        spacing={{ xs: 5, md: 8 }}
        sx={{
          '@media (prefers-reduced-motion: reduce)': {
            '& .MuiCard-root, & .MuiCardActionArea-root, & .category-arrow': {
              transition: 'none',
            },
          },
        }}
      >
        {/* Hero */}
        <Box
          component="section"
          aria-labelledby="hero-heading"
          sx={(theme) => ({
            border: 1,
            borderColor: 'inflow.outlineVariant',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: theme.shadows[1],
            backgroundImage: `linear-gradient(135deg, ${theme.palette.inflow.surfaceLowest} 0%, ${theme.palette.inflow.surfaceLow} 58%, ${theme.palette.inflow.surfaceContainer} 100%)`,
          })}
        >
          <Box sx={(theme) => ({ height: theme.spacing(0.5), backgroundColor: 'primary.main' })} />
          <Box sx={{ p: { xs: 2.5, sm: 4, md: 6 } }}>
            <Grid container spacing={{ xs: 3, md: 5 }} sx={{ alignItems: 'center' }}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
                  <LayersOutlinedIcon fontSize="small" color="primary" aria-hidden="true" />
                  <Typography
                    variant="overline"
                    color="primary.main"
                    sx={{ fontWeight: 700 }}
                  >
                    Inflow Design System
                  </Typography>
                </Stack>
                <Typography
                  id="hero-heading"
                  variant="h4"
                  component="h1"
                  sx={(theme) => ({
                    [theme.breakpoints.up('md')]: theme.typography.h3,
                    fontWeight: 700,
                    maxWidth: theme.spacing(85),
                  })}
                >
                  Build Inriver product UIs that feel like one product
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="p"
                  color="text.secondary"
                  sx={(theme) => ({ maxWidth: theme.spacing(75), mt: 2 })}
                >
                  A shared MUI theme, design tokens, and themed components — plus an agent-ready
                  CLI — so every team ships consistent, accessible interfaces faster.
                </Typography>
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ mt: 3.5, flexWrap: 'wrap', gap: 1.5 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    to="/getting-started"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Get started
                  </Button>
                  <Button variant="outlined" size="large" component={Link} to="/components">
                    Browse components
                  </Button>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, lg: 4 }}>
                <Box
                  sx={(theme) => ({
                    p: 2.5,
                    borderRadius: 2,
                    border: 1,
                    borderColor: 'inflow.outlineVariant',
                    backgroundColor: theme.palette.inflow.surfaceLowest,
                    boxShadow: theme.shadows[1],
                  })}
                >
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ fontWeight: 700, display: 'block' }}
                  >
                    Release & compatibility
                  </Typography>
                  <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                    <Chip label={`v${pkg.version}`} size="small" color="primary" />
                    <Chip label={`React ${reactVersion}`} size="small" variant="outlined" />
                    <Chip label={`MUI ${muiVersion}`} size="small" variant="outlined" />
                    <Chip label={`tag: ${checkpointTag}`} size="small" variant="outlined" />
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography
                        variant="h5"
                        component="p"
                        color="primary.main"
                        sx={{ fontWeight: 700 }}
                      >
                        {totalComponents}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Showcase components
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="h5"
                        component="p"
                        color="primary.main"
                        sx={{ fontWeight: 700 }}
                      >
                        {categories.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Categories
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Live proof */}
        <Box component="section" aria-labelledby="live-proof-heading">
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700 }}>
              Built with our own components
            </Typography>
            <Typography id="live-proof-heading" variant="h5" component="h2" sx={{ fontWeight: 700 }}>
              One system, every surface
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={(theme) => ({ maxWidth: theme.spacing(72) })}
            >
              This preview is composed from the same ThemedTabs, ThemedTable, ThemedChip and
              ThemedAlert you ship — proof the building blocks hold up together.
            </Typography>
          </Stack>
          <Box
            sx={(theme) => ({
              border: 1,
              borderColor: 'inflow.outlineVariant',
              borderRadius: 2,
              overflow: 'hidden',
              backgroundColor: theme.palette.inflow.surfaceLowest,
              boxShadow: theme.shadows[3],
            })}
          >
            {/* Window chrome */}
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
                px: { xs: 2, sm: 3 },
                py: 1.5,
                backgroundColor: 'inflow.surfaceContainer',
                borderBottom: 1,
                borderColor: 'inflow.outlineVariant',
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
                <Stack direction="row" spacing={0.75} aria-hidden="true">
                  {[0, 1, 2].map((dot) => (
                    <Box
                      key={dot}
                      sx={(theme) => ({
                        width: theme.spacing(1.25),
                        height: theme.spacing(1.25),
                        borderRadius: `${theme.inflow.radius.full}px`,
                        backgroundColor: 'inflow.outlineVariant',
                      })}
                    />
                  ))}
                </Stack>
                <Typography variant="caption" color="text.primary" sx={{ fontWeight: 600 }}>
                  Product Enrichment Workspace
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                InflowProvider
              </Typography>
            </Stack>

            {/* Interactive surface tabs */}
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                py: 1.5,
                backgroundColor: 'inflow.surfaceLow',
                borderBottom: 1,
                borderColor: 'inflow.outlineVariant',
                overflowX: 'auto',
              }}
            >
              <ThemedTabs
                tabs={liveProofTabs}
                value={tab}
                onChange={(_, i) => setTab(i)}
                ariaLabel="Live component preview"
                style={{ flexWrap: 'wrap' }}
              />
            </Box>

            {/* Mounted surface panels toggled via hidden so aria-controls targets always exist */}
            <div hidden={tab !== 0}>
              <ThemedTabPanel value={0} index={0} style={{ border: 0 }}>
                <ThemedTable
                  columns={productColumns}
                  data={productRows}
                  size="small"
                  aria-label="Example product workspaces"
                />
              </ThemedTabPanel>
            </div>
            <div hidden={tab !== 1}>
              <ThemedTabPanel value={1} index={1} style={{ border: 0 }}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <ThemedChip label="Active" color="primary" leadingIcon="check_circle" />
                  <ThemedChip label="Draft" variant="outlined" leadingIcon="edit" />
                  <ThemedChip label="Scheduled" variant="filled-primary" leadingIcon="schedule" />
                  <ThemedChip label="Archived" variant="outlined" leadingIcon="archive" />
                </Stack>
              </ThemedTabPanel>
            </div>
            <div hidden={tab !== 2}>
              <ThemedTabPanel value={2} index={2} style={{ border: 0 }}>
                <Box
                  sx={{
                    '&& .MuiAlert-message': {
                      whiteSpace: 'normal',
                      overflow: 'visible',
                      textOverflow: 'unset',
                    },
                  }}
                >
                  <ThemedAlert severity="success" title="Publish complete">
                    The summer catalog was published to 3 channels.
                  </ThemedAlert>
                </Box>
              </ThemedTabPanel>
            </div>

            {/* Artifact caption */}
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                py: 1.5,
                borderTop: 1,
                borderColor: 'inflow.outlineVariant',
                backgroundColor: 'inflow.surfaceLow',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Live artifact rendered with ThemedTabs, ThemedTable, ThemedChip, and ThemedAlert
                in the active theme mode.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Features */}
        <Box component="section" aria-labelledby="features-heading">
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700 }}>
              Core pillars
            </Typography>
            <Typography id="features-heading" variant="h5" component="h2" sx={{ fontWeight: 700 }}>
              Everything a product team needs
            </Typography>
          </Stack>
          <Grid container spacing={3}>
            {features.map((feature) => {
              const FeatureIcon = feature.icon;
              return (
                <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
                  <ThemedCard
                    title={
                      <Stack
                        component="span"
                        direction="row"
                        spacing={1.5}
                        sx={{ display: 'inline-flex', alignItems: 'center' }}
                      >
                        <Box
                          component="span"
                          sx={(theme) => ({
                            width: theme.spacing(5),
                            height: theme.spacing(5),
                            flex: '0 0 auto',
                            display: 'inline-grid',
                            placeItems: 'center',
                            borderRadius: 1,
                            color: 'primary.main',
                            backgroundColor: 'inflow.rowSelected',
                          })}
                        >
                          <FeatureIcon fontSize="small" aria-hidden="true" />
                        </Box>
                        <Typography variant="subtitle1" component="span" sx={{ fontWeight: 700 }}>
                          {feature.title}
                        </Typography>
                      </Stack>
                    }
                    actions={
                      <Button
                        variant="text"
                        component={Link}
                        to={feature.to}
                        endIcon={<ArrowForwardIcon aria-hidden="true" />}
                        sx={{ px: 1 }}
                      >
                        {feature.cta}
                      </Button>
                    }
                    sx={(theme) => ({
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: 1,
                      borderColor: 'inflow.outlineVariant',
                      borderRadius: 2,
                      '& .MuiCardContent-root': {
                        flexGrow: 1,
                        pt: 1.5,
                      },
                      transition: theme.transitions.create(
                        ['box-shadow', 'border-color', 'transform'],
                        { duration: theme.transitions.duration.short },
                      ),
                      '&:hover': {
                        transform: `translateY(-${theme.spacing(0.25)})`,
                        boxShadow: theme.shadows[3],
                        borderColor: theme.palette.primary.main,
                      },
                      '@media (prefers-reduced-motion: reduce)': {
                        transition: 'none',
                        '&:hover': {
                          transform: 'none',
                        },
                      },
                    })}
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

        {/* Browsable index */}
        <Box component="section" aria-labelledby="browse-heading">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            sx={{
              alignItems: { xs: 'flex-start', md: 'flex-end' },
              justifyContent: 'space-between',
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700 }}>
                Component catalog
              </Typography>
              <Typography
                id="browse-heading"
                variant="h5"
                component="h2"
                sx={{ fontWeight: 700, mt: 0.5, mb: 0.5 }}
              >
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
              endIcon={<ArrowForwardIcon />}
              sx={{ flexShrink: 0 }}
            >
              Browse All Components
            </Button>
          </Stack>
          <Box
            sx={(theme) => ({
              overflow: 'hidden',
              border: 1,
              borderColor: 'inflow.outlineVariant',
              borderRadius: 2,
              backgroundColor: 'inflow.outlineVariant',
              display: 'grid',
              gridTemplateColumns: {
                xs: 'minmax(0, 1fr)',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))',
              },
              gap: theme.spacing(0.125),
              '& > :last-child': {
                gridColumn: { sm: '1 / -1', lg: '1 / -1' },
              },
            })}
          >
            {categories.map((category) => {
              const Icon = categoryIcons[category.icon] ?? CategoryIcon;
              return (
                <CardActionArea
                  key={category.id}
                  component={Link}
                  to="/components"
                  sx={(theme) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 2,
                    p: 2.5,
                    minWidth: 0,
                    height: '100%',
                    borderRadius: 0,
                    backgroundColor: theme.palette.background.paper,
                    transition: theme.transitions.create('background-color', {
                      duration: theme.transitions.duration.shortest,
                    }),
                    '& .category-arrow': {
                      transition: theme.transitions.create('transform', {
                        duration: theme.transitions.duration.shortest,
                      }),
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.inflow.surfaceLow,
                      '& .category-arrow': {
                        transform: `translateX(${theme.spacing(0.5)})`,
                      },
                    },
                    '&:focus-visible': {
                      zIndex: 1,
                      outline: `2px solid ${theme.palette.primary.main}`,
                      outlineOffset: '-2px',
                    },
                    '@media (prefers-reduced-motion: reduce)': {
                      transition: 'none',
                      '& .category-arrow': {
                        transition: 'none',
                      },
                      '&:hover .category-arrow': {
                        transform: 'none',
                      },
                    },
                  })}
                >
                  <Box
                    sx={(theme) => ({
                      width: theme.spacing(5),
                      height: theme.spacing(5),
                      flex: '0 0 auto',
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: 1,
                      color: 'primary.main',
                      backgroundColor: 'inflow.rowSelected',
                    })}
                  >
                    <Icon fontSize="small" aria-hidden="true" />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle1" component="span" sx={{ fontWeight: 600, display: 'block' }}>
                      {category.label}
                    </Typography>
                    <Typography variant="body2" component="span" color="text.secondary" sx={{ display: 'block' }}>
                      {category.components.length} Components
                    </Typography>
                  </Box>
                  <ArrowForwardIcon
                    className="category-arrow"
                    aria-hidden="true"
                    fontSize="small"
                    sx={{ ml: 'auto', color: 'text.secondary' }}
                  />
                </CardActionArea>
              );
            })}
          </Box>
        </Box>

        <ExampleScreensOverview />
        <PopularComponentsOverview totalComponents={totalComponents} />
      </Stack>
    </Container>
  );
}
