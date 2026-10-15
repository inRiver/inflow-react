import { Card, CardContent, Container, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const documented = [
  {
    label: 'Migration',
    to: '/migration',
    description: 'What to change when upgrading, including deprecated components.',
  },
  {
    label: 'Accessibility',
    to: '/accessibility',
    description: 'The accessibility requirements every Inflow interface must meet.',
  },
  {
    label: 'Capitalization',
    to: '/capitalization',
    description: 'Which casing to use for buttons, labels, headings, messages, and other interface text.',
  },
  {
    label: 'Design Tokens',
    to: '/tokens',
    description: 'Colors, typography, spacing, and radii that define the Inflow visual language.',
  },
  {
    label: 'Components',
    to: '/components',
    description: 'Accessible UI elements with live demos, usage guidance, and code.',
  },
  {
    label: 'Examples',
    to: '/examples/dashboard',
    description: 'Full-screen examples showing how components combine into real product screens.',
  },
  {
    label: 'Import Guidelines',
    to: '/guidelines',
    description: 'How to install, set up, and version Inflow in a consuming app.',
  },
];

const audiences = [
  { label: 'Designers', description: 'build interfaces and interactions that align with our visual language.' },
  { label: 'Developers', description: 'implement consistent, reusable, and tested components.' },
  { label: 'Product Managers', description: 'understand the boundaries and possibilities of UI design.' },
  { label: 'QA & Accessibility Experts', description: 'validate that solutions meet our accessibility standards.' },
  { label: 'Partners & External Teams', description: 'maintain brand consistency across integrations and extensions.' },
];

export function IntroductionPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={4}>
        <Typography variant="h3">Introduction</Typography>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">Why Inflow Exists</Typography>
              <Typography variant="body1">
                Inflow is the design system for Inriver products. It creates consistent, efficient, and accessible
                user experiences across our platform. As the platform grows, so does the need for a unified approach
                to design and development, one that supports adaptability, streamlines decision-making, and helps
                teams deliver better, faster, and more intuitive solutions.
              </Typography>
              <Typography variant="body1">
                By centralizing design tokens, UI components, and best practices, Inflow gives designers, developers,
                product owners, and other stakeholders a shared language across every product.
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h5">What Inflow Documents</Typography>
              <List disablePadding>
                {documented.map((item) => (
                  <ListItem key={item.label} disableGutters>
                    <ListItemText
                      primary={
                        <Link to={item.to} style={{ color: 'inherit', fontWeight: 700 }}>
                          {item.label}
                        </Link>
                      }
                      secondary={item.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h5">Who It's For</Typography>
              <Typography variant="body1">
                Inflow is for anyone building or contributing to Inriver's user experience.
              </Typography>
              <List disablePadding>
                {audiences.map((item) => (
                  <ListItem key={item.label} disableGutters>
                    <ListItemText primary={item.label} secondary={`To ${item.description}`} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="body1">
                Whether you're designing a new feature, building a custom module, or checking accessibility, this
                is your starting point.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
