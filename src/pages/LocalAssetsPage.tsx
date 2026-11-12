import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { CodeBlock } from '../showcase/CodeBlock';

const localCode = `import '@inriver/inflow-react/local-assets.css';`;
const selectiveCode = `// Inter only
import '@inriver/inflow-react/fonts/inter.css';

// Material Icons only
import '@inriver/inflow-react/fonts/material-icons.css';`;

const notes = [
  { label: 'Size', text: 'About 994 KB of font files ship with every install, even without the CSS import. The review package is about 1.22 MB compressed. Browsers download only the font subsets and styles they use.' },
  { label: 'Shared pages', text: 'Font families and icon classes are global. Import once per host, not per provider. Check for conflicting versions across microfrontends; separate iframe documents need their own CSS.' },
  { label: 'Deployment', text: 'Your bundler must emit the WOFF2 files. Allow their origin in font-src and configure CORS for a font CDN. For SSR, use your framework’s global CSS entry; raw Node.js cannot import CSS.' },
  { label: 'Offline use', text: 'These assets make no Google Fonts requests. Offline first loads still need the app and its assets to be cached. Images and API calls remain the host’s responsibility.' },
  { label: 'Compatibility', text: 'React, MUI and Emotion are still required. Opting in can change text wrapping. Built-in icons use SVG, so CSS targeting their old font spans may need updating.' },
  { label: 'Licenses', text: 'Keep the bundled SIL Open Font License notices when redistributing the fonts. Font updates ship with package versions.' },
];

export function LocalAssetsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={3} sx={{ maxWidth: '80ch' }}>
        <Box>
          <Typography component="h1" variant="h3" gutterBottom>Local assets</Typography>
          <Typography>
            The library and InflowProvider do not import these fonts by default.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            <strong>Exception:</strong> This theme showcase imports and uses the bundled local assets by default.
          </Typography>
        </Box>

        <Box component="section" aria-labelledby="local-assets-setup">
          <Typography id="local-assets-setup" component="h2" variant="h5" gutterBottom>Setup</Typography>
          <Typography>Add this once in your app’s global CSS entry:</Typography>
          <CodeBlock code={localCode} language="ts" plain />
          <Typography variant="body2" color="text.secondary">
            This single import includes both Inter (normal and italic, weights 100–900)
            and the filled/outlined Material Icons fonts used by legacy string icons.
          </Typography>
        </Box>

        <Box component="section" aria-labelledby="local-assets-intranet">
          <Typography id="local-assets-intranet" component="h2" variant="h5" gutterBottom>Local intranets</Typography>
          <Typography>
            Without access to Google Fonts, import both font stylesheets (or the combined import above)
            if your app needs both Inter and legacy string icons. Serve the font files from your intranet.
            Skip Material Icons if you use only SVG icons; skip bundled Inter if your host already
            supplies the text font you want.
          </Typography>
        </Box>

        <Box component="section" aria-labelledby="local-assets-default">
          <Typography id="local-assets-default" component="h2" variant="h5" gutterBottom>Without the import</Typography>
          <Typography>
            Your existing font setup stays in place. Text uses host-supplied Inter or system fallbacks;
            built-in SVG icons work either way. String icons such as <code>home</code> still need
            Material Icons from the host, otherwise the names appear as text.
          </Typography>
        </Box>

        <Box component="details" sx={{
          '& summary': {
            cursor: 'pointer', typography: 'subtitle1',
            '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 4 },
          },
        }}>
          <Box component="summary">Load only the fonts you need</Box>
          <Box sx={{ mt: 2 }}>
            <Typography>Use either import, or both. Don’t add them again if you use the combined stylesheet above.</Typography>
            <CodeBlock code={selectiveCode} language="ts" plain />
          </Box>
        </Box>

        <Divider />

        <Box component="section" aria-labelledby="local-assets-notes">
          <Typography id="local-assets-notes" component="h2" variant="h5" gutterBottom>Before you adopt it</Typography>
          <Box component="dl" sx={{ m: 0 }}>
            {notes.map(({ label, text }) => (
              <Box key={label} sx={{
                display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '8rem 1fr' },
                columnGap: 2, rowGap: 0.5, py: 1.5,
                '& + &': { borderTop: 1, borderColor: 'divider' },
              }}>
                <Typography component="dt" variant="body2" sx={{ fontWeight: 600 }}>{label}</Typography>
                <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>{text}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Typography variant="body2">
          See <Link to="/guidelines" style={{ color: 'inherit' }}>Import Guidelines</Link> for provider and peer-dependency setup.
          Use a package version that includes these CSS exports.
        </Typography>
      </Stack>
    </Container>
  );
}
