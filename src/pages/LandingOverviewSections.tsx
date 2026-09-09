import { Box, Button, CardActionArea, Stack, Typography } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import * as Icons from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { EXAMPLE_PAGES } from '../showcase/categories';
import {
  overviewIconSx,
  overviewLinkSx,
  overviewSectionSx,
} from './LandingOverviewSections.styles';

interface PopularComponentsOverviewProps {
  readonly totalComponents: number;
}

const exampleIcons: Readonly<Record<string, SvgIconComponent>> = {
  Dashboard: Icons.Dashboard,
  Dialog: Icons.RateReview,
  Inbox: Icons.Inbox,
  Login: Icons.Login,
  TableChart: Icons.TableChart,
};

const popularComponents = [
  { id: 'button', label: 'Button', group: 'Actions', icon: Icons.SmartButton },
  { id: 'textfield', label: 'Text Field', group: 'Forms', icon: Icons.TextFields },
  { id: 'select', label: 'Select', group: 'Forms', icon: Icons.ArrowDropDownCircleOutlined },
  { id: 'checkbox', label: 'Checkbox', group: 'Forms', icon: Icons.CheckBoxOutlined },
  { id: 'table', label: 'Table', group: 'Data display', icon: Icons.TableRows },
  { id: 'card', label: 'Card', group: 'Data display', icon: Icons.ViewAgendaOutlined },
] as const;

export function ExampleScreensOverview() {
  return (
    <Box component="section" aria-labelledby="example-screens-heading" sx={overviewSectionSx}>
      <Box sx={{ p: 3, backgroundColor: 'background.paper' }}>
        <Typography variant="overline" color="primary.main">
          Product patterns
        </Typography>
        <Typography id="example-screens-heading" variant="h5" gutterBottom>
          Example screens
        </Typography>
        <Typography variant="body2" color="text.secondary">
          See themed components working together in complete product flows.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(5, minmax(0, 1fr))',
          },
          gap: '1px',
          pt: '1px',
          backgroundColor: 'inflow.outlineVariant',
          '& > :last-child': {
            gridColumn: { sm: '1 / -1', lg: 'auto' },
          },
        }}
      >
        {EXAMPLE_PAGES.map((example) => {
          const Icon = exampleIcons[example.icon] ?? Icons.ViewModule;
          return (
            <CardActionArea
              key={example.id}
              component={Link}
              to={`/examples/${example.id}`}
              sx={[
                overviewLinkSx,
                {
                  minHeight: 164,
                  p: 2.5,
                  alignItems: 'stretch',
                  justifyContent: 'flex-start',
                  flexDirection: 'column',
                  gap: 2,
                },
              ]}
            >
              <Stack direction="row" sx={{ width: '100%', justifyContent: 'space-between' }}>
                <Box sx={overviewIconSx}>
                  <Icon aria-hidden="true" fontSize="small" />
                </Box>
                <Icons.ArrowForward
                  className="overview-arrow"
                  aria-hidden="true"
                  sx={{ color: 'text.secondary', fontSize: 20 }}
                />
              </Stack>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {example.label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textWrap: 'pretty' }}>
                  {example.description}
                </Typography>
              </Box>
            </CardActionArea>
          );
        })}
      </Box>
    </Box>
  );
}

export function PopularComponentsOverview({ totalComponents }: PopularComponentsOverviewProps) {
  return (
    <Box component="section" aria-labelledby="popular-components-heading" sx={overviewSectionSx}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          p: 3,
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          backgroundColor: 'background.paper',
        }}
      >
        <Box>
          <Typography variant="overline" color="primary.main">
            Component shortcuts
          </Typography>
          <Typography id="popular-components-heading" variant="h5" gutterBottom>
            Popular components
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start with the building blocks product teams reach for most.
          </Typography>
        </Box>
        <Button component={Link} to="/components" endIcon={<Icons.ArrowForward />}>
          View all {totalComponents}
        </Button>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
          },
          gap: '1px',
          pt: '1px',
          backgroundColor: 'inflow.outlineVariant',
        }}
      >
        {popularComponents.map((component) => {
          const Icon = component.icon;
          return (
            <CardActionArea
              key={component.id}
              component={Link}
              to={`/components/${component.id}`}
              sx={[overviewLinkSx, { minHeight: 92, p: 2.5, alignItems: 'center', gap: 2 }]}
            >
              <Box sx={overviewIconSx}>
                <Icon aria-hidden="true" fontSize="small" />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary">
                  {component.group}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {component.label}
                </Typography>
              </Box>
              <Icons.ArrowForward
                className="overview-arrow"
                aria-hidden="true"
                sx={{ ml: 'auto', color: 'text.secondary', fontSize: 20 }}
              />
            </CardActionArea>
          );
        })}
      </Box>
    </Box>
  );
}
