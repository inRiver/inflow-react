import { Card, CardContent, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { CodeBlock } from '../showcase/CodeBlock';

const install = `npm install @inriver/inflow-react @mui/material@">=9.0.0 <10.0.0" @emotion/react@^11.13.0 @emotion/styled@^11.13.0 react@^19 react-dom@^19`;
const setup = `import { InflowProvider, ThemedChip } from '@inriver/inflow-react';

export function App() {
  return (
    <InflowProvider cacheKey="product">
      <ThemedChip label="Active" color="primary" />
    </InflowProvider>
  );
}`;
const fonts = `import '@inriver/inflow-react/local-assets.css';`;
const dark = `<InflowProvider mode="dark" cacheKey="product">
  <ThemedChip label="Active" color="primary" />
</InflowProvider>`;

export function GettingStartedPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={4}>
        <Typography variant="h3">Getting started</Typography>
        <Card variant="outlined"><CardContent><Stack spacing={2}>
          <Typography variant="h5">Install</Typography>
          <Typography>Install the package and its React 19, MUI 9 and Emotion peer dependencies. The package is public on npm; no registry credentials are required.</Typography>
          <CodeBlock code={install} language="bash" plain />
        </Stack></CardContent></Card>
        <Card variant="outlined"><CardContent><Stack spacing={2}>
          <Typography variant="h5">Provider and first component</Typography>
          <Typography>Wrap your application in InflowProvider and import components from the package root. The provider scopes the baseline and theme variables to its own root.</Typography>
          <CodeBlock code={setup} plain />
          <Typography>For independently deployed microfrontends on the same page, give each provider a distinct Emotion cacheKey (the default is inflow). For a Shadow DOM or iframe, pass a caller-owned emotionCache targeting that container; it takes precedence over cacheKey.</Typography>
          <Typography>Browse the <Link to="/components" style={{ color: 'inherit', fontWeight: 700 }}>component catalog</Link> for more examples.</Typography>
        </Stack></CardContent></Card>
        <Card variant="outlined"><CardContent><Stack spacing={2}>
          <Typography variant="h5">Optional local fonts and icons</Typography>
          <Typography>The library does not import fonts by default. To opt into bundled Inter and Material Icons, import the combined stylesheet once in your framework's global CSS entry:</Typography>
          <CodeBlock code={fonts} language="tsx" plain />
          <Typography>Font registrations are global, not scoped to the provider. See <Link to="/local-assets" style={{ color: 'inherit', fontWeight: 700 }}>Local assets</Link> for narrower imports and deployment tradeoffs.</Typography>
        </Stack></CardContent></Card>
        <Card variant="outlined"><CardContent><Stack spacing={2}>
          <Typography variant="h5">Dark mode</Typography>
          <Typography>Pass mode="light" or mode="dark"; light is the default. Your app owns the preference and system color-scheme tracking; the provider does not select a mode automatically.</Typography>
          <CodeBlock code={dark} plain />
          <Typography>For a complete system preference example, see <Link to="/guidelines" style={{ color: 'inherit', fontWeight: 700 }}>Import Guidelines</Link>. Learn about mode-aware values in <Link to="/theming" style={{ color: 'inherit', fontWeight: 700 }}>Theming</Link>.</Typography>
        </Stack></CardContent></Card>
      </Stack>
    </Container>
  );
}
