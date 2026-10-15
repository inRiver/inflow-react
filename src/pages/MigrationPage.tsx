import { Alert, Card, CardContent, Container, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { CodeBlock } from '../showcase/CodeBlock';

const buttonBefore = `import { ThemedButton } from '@inriver/inflow-react';

<ThemedButton variant="contained">Save</ThemedButton>`;

const buttonAfter = `import { Button } from '@mui/material';

<Button variant="contained">Save</Button>`;

const textFieldBefore = `import { ThemedTextField } from '@inriver/inflow-react';

<ThemedTextField label="Email address" />`;

const textFieldAfter = `import { TextField } from '@mui/material';

<TextField label="Email address" />`;

const deprecated = [
  {
    label: 'ThemedButton',
    description: 'Use Button from @mui/material.',
  },
  {
    label: 'ThemedTextField',
    description: 'Use TextField from @mui/material.',
  },
];

export function MigrationPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={4}>
        <Typography variant="h3">Migration</Typography>
        <Typography variant="body1">
          What to change when upgrading Inflow. See the changelog for the full list of releases.
        </Typography>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">Deprecated Components</Typography>
              <Alert severity="warning">
                These components are deprecated as of 3.9.1 and will be removed in the next major release.
              </Alert>
              <List disablePadding>
                {deprecated.map((item) => (
                  <ListItem key={item.label} disableGutters>
                    <ListItemText primary={item.label} secondary={item.description} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="body1">
                Inside InflowProvider, the theme already gives MUI's Button and TextField the Inflow styling, so the
                wrappers add nothing. Both remain exported until the next major version.
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">ThemedButton to Button</Typography>
              <CodeBlock code={buttonBefore} language="tsx" />
              <CodeBlock code={buttonAfter} language="tsx" />
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">ThemedTextField to TextField</Typography>
              <CodeBlock code={textFieldBefore} language="tsx" />
              <CodeBlock code={textFieldAfter} language="tsx" />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
