import { Card, CardContent, Container, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';

const requirements = [
  {
    label: 'Standard',
    description: 'Target WCAG 2.2 AA.',
  },
  {
    label: 'Contrast',
    description: 'Body text meets 4.5:1. Large text and meaningful non-text UI meet 3:1.',
  },
  {
    label: 'Keyboard and focus',
    description: 'Every control is reachable by keyboard and has a visible focus state and an accessible name.',
  },
  {
    label: 'Not color alone',
    description: 'Information is never conveyed by color alone. For example, the focused-cell assistant context is visible in text.',
  },
  {
    label: 'Small screens',
    description: 'At 375px wide, primary content stays readable without page-level horizontal scrolling. A data grid may scroll within its own region.',
  },
];

const dataTables = [
  'AG Grid owns the semantics and keyboard behavior for every data table example.',
  'Do not rebuild grid keyboard navigation or ARIA roles around it.',
];

const knownGaps = [
  {
    label: 'White text on success green',
    description: 'White on #2c9b4b is 3.6:1 (WCAG 1.4.3, 1.4.11). It meets the 3:1 threshold for large text and UI components but not the 4.5:1 needed for normal text. Workaround: use it for large text or UI components only, or pair it with an icon or text label.',
  },
  {
    label: 'White text on warning orange',
    description: 'White on #ff6424 is 3.0:1, and warning orange as text on white is also 3.0:1 (WCAG 1.4.3, 1.4.11). MUI\'s default warning color has the same limitation. Workaround: avoid small text on this color and never rely on it alone to convey status.',
  },
];

const limitations = [
  'Contrast ratios are calculated from token values, not measured in the rendered UI.',
  'Screen reader behavior has not been tested for Inflow components beyond what MUI provides.',
  'Status is never conveyed by color alone: pair success and warning colors with text or an icon.',
];

const motion = [
  'Motion communicates hover, selection, focus, or panel state only.',
  'Prefer opacity and transform. Avoid decorative animation and animating layout properties.',
  'Honor prefers-reduced-motion in any custom animation or transform.',
];

export function AccessibilityPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={4}>
        <Typography variant="h3">Accessibility</Typography>
        <Typography variant="body1">
          Inflow is built on MUI components, which provide accessible roles, keyboard support, and focus handling by
          default. These are the requirements Inflow adds on top.
        </Typography>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h5">Requirements</Typography>
              <List disablePadding>
                {requirements.map((item) => (
                  <ListItem key={item.label} disableGutters>
                    <ListItemText primary={item.label} secondary={item.description} />
                  </ListItem>
                ))}
              </List>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h5">Data Tables</Typography>
              <List disablePadding>
                {dataTables.map((text) => (
                  <ListItem key={text} disableGutters>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h5">Motion</Typography>
              <List disablePadding>
                {motion.map((text) => (
                  <ListItem key={text} disableGutters>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h5">Known Gaps</Typography>
              <List disablePadding>
                {knownGaps.map((item) => (
                  <ListItem key={item.label} disableGutters>
                    <ListItemText primary={item.label} secondary={item.description} />
                  </ListItem>
                ))}
              </List>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h5">Scope and Limitations</Typography>
              <List disablePadding>
                {limitations.map((text) => (
                  <ListItem key={text} disableGutters>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
