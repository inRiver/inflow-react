import { Alert, Card, CardContent, Container, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { CodeBlock } from '../showcase/CodeBlock';

const componentAfter = `import { Button, TextField } from '@mui/material';
import { InflowProvider } from '@inriver/inflow-react';

<InflowProvider>
  <Button variant="contained">Save</Button>
  <TextField label="Email address" />
</InflowProvider>`;

const datetimeImports = `import { formatDate, configureDateTime, dateColumn } from '@inriver/inflow-react/datetime';
import { InflowLocalizationProvider } from '@inriver/inflow-react/datetime/client';`;

const removed = [
  {
    label: 'ThemedButton / ThemedButtonProps',
    description: 'Use Button from @mui/material inside InflowProvider.',
  },
  {
    label: 'ThemedTextField / ThemedTextFieldProps',
    description: 'Use TextField from @mui/material inside InflowProvider.',
  },
  {
    label: 'createDefaultTheme / defaultTheme',
    description: 'Use createInflowTheme / inflowTheme, or createTheme from @mui/material/styles for an unthemed baseline.',
  },
  {
    label: 'ThemedChatPanel onSend',
    description: 'Use onSendMessage(text), which receives the composed text. Adapt no-argument handlers as needed.',
  },
];

export function MigrationPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={4}>
        <Typography variant="h3">Migration</Typography>
        <Typography variant="body1">
          What to change when upgrading to Inflow 4.0.0. See the changelog for the full list of releases.
        </Typography>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">Removed APIs</Typography>
              <Alert severity="warning">These APIs were removed in 4.0.0.</Alert>
              <List disablePadding>
                {removed.map((item) => (
                  <ListItem key={item.label} disableGutters>
                    <ListItemText primary={item.label} secondary={item.description} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="body1">
                ThemedButton&apos;s inflowVariant has no direct MUI prop equivalent. Choose Button
                variant="contained", variant="outlined", or variant="text" as appropriate; the Inflow
                theme styles MUI components inside InflowProvider.
              </Typography>
              <CodeBlock code={componentAfter} language="tsx" />
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">Date and time entry points</Typography>
              <Typography variant="body1">
                Preferences, formatters, and grid column fragments remain on the server-safe
                @inriver/inflow-react/datetime entry. InflowLocalizationProvider moved to
                @inriver/inflow-react/datetime/client for MUI X pickers. The package root and
                /datetime/client carry &apos;use client&apos; boundaries, so root exports (including
                createInflowTheme and token objects) are client-side in React Server Components;
                import /datetime and /ag-grid on the server, and keep /datetime and
                /datetime/client in the same module format (ESM or CJS) when sharing configureDateTime state.
              </Typography>
              <CodeBlock code={datetimeImports} language="tsx" />
              <Typography variant="body1">
                The server-safe entry needs dayjs; picker rendering also needs @mui/x-date-pickers.
                On the server, pass request-specific options to formatters or provider props instead
                of calling configureDateTime per request, since it changes module-wide state.
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">TypeScript and compatibility checkpoint</Typography>
              <Typography variant="body1">
                NodeNext and Node16 resolution use dual .d.ts and .d.cts exports for ESM and
                CommonJS. The current React 19 / MUI 9.6 checkpoint is react19-mui9.6.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
