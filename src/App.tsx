import React from 'react';
import { Box, AppBar, Toolbar, Typography, CssBaseline, Container } from '@mui/material';
import { CustomThemeProvider } from './app/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { DemoFrame } from './showcase/DemoFrame';
import { CodeBlock } from './showcase/CodeBlock';
import { PropsPlayground } from './showcase/PropsPlayground';

function AppContent() {
  const [playgroundValues, setPlaygroundValues] = React.useState<Record<string, unknown>>({
    variant: 'contained',
    fullWidth: false,
    label: 'Test Button',
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Inriver Showcase App
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 8, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Infrastructure Components (Wave 1A)
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          These are the core components built for the showcase app. Try toggling the theme in the top right!
        </Typography>

        <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
          1. DemoFrame (Error Boundary)
        </Typography>
        <DemoFrame title="Healthy Component">
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            This component renders successfully.
          </Box>
        </DemoFrame>

        <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
          2. CodeBlock
        </Typography>
        <CodeBlock
          language="tsx"
          code={`import { Button } from '@mui/material';

export function Example() {
  return <Button variant="contained">Hello World</Button>;
}`}
        />

        <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
          3. PropsPlayground
        </Typography>
        <PropsPlayground
          schema={[
            { name: 'label', type: 'text', label: 'Button Label' },
            { name: 'variant', type: 'select', options: ['text', 'outlined', 'contained'], label: 'Variant' },
            { name: 'fullWidth', type: 'boolean', label: 'Full Width' },
          ]}
          values={playgroundValues}
          onChange={setPlaygroundValues}
        />
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" component="pre" sx={{ m: 0 }}>
            {JSON.stringify(playgroundValues, null, 2)}
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}

export default App;
