import { Alert, Box, Card, CardContent, Chip, Container, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { CodeBlock } from '../showcase/CodeBlock';

const defaultCode = `import { InflowProvider } from '@inriver/inflow-react';

// Keep your existing host fonts. No font CSS is loaded by this import.
<InflowProvider>{children}</InflowProvider>`;

const localCode = `// Add once in your framework's supported global CSS entry.
import '@inriver/inflow-react/local-assets.css';
import { InflowProvider } from '@inriver/inflow-react';

<InflowProvider>{children}</InflowProvider>`;

const selectiveCode = `// Prefer only what your host is missing:
import '@inriver/inflow-react/fonts/inter.css';
// Only needed for legacy string-icon props:
import '@inriver/inflow-react/fonts/material-icons.css';`;

const tradeoffs = [
  { title: 'Package size is not page-download size', text: 'Bundled font binaries total about 994 KB. The earlier font-free package was about 207 KB compressed; the local-assets package is about 1.22 MB compressed. These are measured review-build figures, not a size guarantee. Installing the package includes the assets even when you skip the CSS. Browsers request only the font subsets and styles used on a page after you opt in.' },
  { title: 'Global registration, not provider-scoped', text: 'Font faces and legacy icon classes are global within the document. Import once at the host boundary, not once per provider. Coordinate font versions across microfrontends; an existing Inter registration may conflict. Separate iframe documents need their own setup.' },
  { title: 'Bundler and server setup still matter', text: 'Use a bundler that resolves CSS imports and emits relative WOFF2 assets. Serve those files with your app or approved asset CDN. Keep your deployment base path correct, allow that origin in font-src and style-src, and configure CORS when serving fonts cross-origin. Do not weaken your CSP just to load fonts.' },
  { title: 'SSR and compatibility', text: 'The ordinary JavaScript entry remains free of font CSS for ESM, CommonJS and server rendering. Put the optional stylesheet in your framework’s supported global-CSS entry; raw Node.js cannot execute a CSS import. React, MUI and Emotion peer dependencies are still required. Built-in icons now use SVG, so custom CSS targeting old icon spans may need adjustment.' },
  { title: 'No Google Fonts dependency is not full offline support', text: 'The optional stylesheet references bundled local assets, not Google font servers. Your app can render them without third-party font access once its own assets are available. Offline installation, app caching, service workers, remote images and API calls remain the host’s responsibility.' },
  { title: 'Font updates and licenses', text: 'The bundled Inter and Material Icons fonts retain their SIL Open Font License notices. Updates now travel with package versions rather than changing at an external font URL. Preserve the distributed notices when copying or redistributing font files.' },
];

export function LocalAssetsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="overline" color="text.secondary">Consumer setup</Typography>
          <Typography variant="h3" gutterBottom>Local assets</Typography>
          <Typography color="text.secondary">Choose who supplies your fonts. Existing consumers keep their current setup unless they explicitly opt in.</Typography>
        </Box>
        <Alert severity="info">
          <Typography component="p" variant="subtitle2">This showcase opts in to local assets</Typography>
          Inter and the legacy example icon fonts on this site are loaded by the showcase entry. This is not the library default, and changing the theme mode does not turn these global fonts off.
        </Alert>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ alignItems: 'stretch' }}>
          <Card variant="outlined" sx={{ flex: 1, minWidth: 0 }}>
            <CardContent>
              <Stack spacing={2}>
                <Chip label="Default: unchanged" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                <Typography variant="h5">Use host-managed fonts</Typography>
                <Typography>Importing the JavaScript package or mounting InflowProvider does not load or register fonts. Built-in SVG icons work without an icon font.</Typography>
                <Typography color="text.secondary">If your host supplies Inter, it is used. Otherwise text falls back to the theme’s system-font stack. Caller-provided string icons still need compatible Material Icons fonts from the host; without them, icon names may appear as text.</Typography>
                <CodeBlock code={defaultCode} language="tsx" plain />
              </Stack>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ flex: 1, minWidth: 0 }}>
            <CardContent>
              <Stack spacing={2}>
                <Chip label="Optional: explicit import" color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                <Typography variant="h5">Use bundled local assets</Typography>
                <Typography>One stylesheet registers local Inter and filled/outlined Material Icons for legacy string-icon props. It does not change component APIs or automatically opt in other apps.</Typography>
                <Typography color="text.secondary">Inter includes normal and italic styles, variable weights 100–900, optical sizes 14–32 and seven script subsets. The same assets support light and dark themes.</Typography>
                <CodeBlock code={localCode} language="tsx" plain />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">Already providing some assets?</Typography>
              <Typography>Keep the narrower imports if the host already supplies Inter or if you do not use string icons. Do not combine the all-in-one stylesheet with the same narrower imports.</Typography>
              <CodeBlock code={selectiveCode} language="ts" plain />
              <Typography color="text.secondary">String icons remain supported in Chip leading icons, breadcrumb/menu/tab items and App Nav items. Fixed library-owned glyphs do not need either icon-font stylesheet.</Typography>
            </Stack>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" gutterBottom>Tradeoffs and deployment checklist</Typography>
            <List disablePadding>
              {tradeoffs.map(item => <ListItem key={item.title} disableGutters sx={{ alignItems: 'flex-start' }}><ListItemText primary={item.title} secondary={item.text} slotProps={{ primary: { sx: { fontWeight: 600 } } }} /></ListItem>)}
            </List>
          </CardContent>
        </Card>
        <Typography><Link to="/guidelines" style={{ color: 'inherit' }}>Import Guidelines</Link> cover peer dependencies, provider setup and compatibility checkpoints. Adopt this optional export only in a package version that includes it; this page does not change an already installed release.</Typography>
      </Stack>
    </Container>
  );
}
