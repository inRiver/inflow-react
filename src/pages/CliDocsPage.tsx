import { Card, CardContent, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { CodeBlock } from '../showcase/CodeBlock';
import { inflowTokens } from '../theme/tokens';

const help = `$ inflow --help
Usage:
  inflow component --list [--json]
  inflow component <Name> [--json]
  inflow tokens [--json]
  inflow search <query> [--json]
  inflow docs <setup|theming|migration> [--json]
  inflow --help [--json]`;
const list = `$ inflow component --list
ThemedAccordion — Adds an items array API with single/multiple-expand control instead of hand-composed Accordion/AccordionSummary/AccordionDetails.
ThemedAlert — Applies a curated outlined-icon mapping and consistent title/radius/alignment so severity alerts look uniform without manual icon wiring.`;
const component = `$ inflow component ThemedChip
ThemedChip
Forces Inflow-specific tokens (radius, color and delete-icon states) and adds DS primary chip variants that stay consistent regardless of global theme overrides.
Deprecated: no
Extends: Omit<ChipProps, 'size' | 'variant'>
Owned props:
  inflowVariant?: boolean
    If true, applies specific inflow colors regardless of global overrides`;
const tokens = `$ inflow tokens
colors:
  navy900: ${inflowTokens.colors.navy900}
  navy800: ${inflowTokens.colors.navy800}
  navy700: ${inflowTokens.colors.navy700}`;
const search = `$ inflow search chip
[component] ThemedChip — inflow component ThemedChip`;
const docs = `$ inflow docs setup
setup
Install @inriver/inflow-react and its React 19, MUI 9 and Emotion peer dependencies. Wrap your app in InflowProvider. Optional local font assets: import @inriver/inflow-react/local-assets.css in your global CSS entry.`;
const json = `$ inflow docs setup --json
{"ok":true,"command":"docs","data":{"topic":"setup","summary":"Install @inriver/inflow-react and its React 19, MUI 9 and Emotion peer dependencies. Wrap your app in InflowProvider. Optional local font assets: import @inriver/inflow-react/local-assets.css in your global CSS entry."}}

$ inflow docs unknown --json
{"ok":false,"command":"docs","error":"Unknown topic: unknown"}`;

export function CliDocsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={4}>
        <Typography variant="h3">CLI reference</Typography>
        <Typography>The zero-dependency inflow CLI ships with @inriver/inflow-react; installing the package makes the inflow binary available (for example via npx inflow). See <Link to="/getting-started" style={{ color: 'inherit', fontWeight: 700 }}>Getting started</Link> for installation.</Typography>
        <Card variant="outlined"><CardContent><Stack spacing={2}>
          <Typography variant="h5">Help</Typography>
          <Typography>Run inflow --help, or inflow with no arguments, for usage.</Typography>
          <CodeBlock code={help} language="text" plain />
        </Stack></CardContent></Card>
        <Card variant="outlined"><CardContent><Stack spacing={2}>
          <Typography variant="h5">Components</Typography>
          <Typography>List all components, including deprecated ones. This output is an excerpt:</Typography>
          <CodeBlock code={list} language="text" plain />
          <Typography>Look up a full component name (case-insensitive) to see its description, deprecation status, owned props and available notes. This output is an excerpt:</Typography>
          <CodeBlock code={component} language="text" plain />
        </Stack></CardContent></Card>
        <Card variant="outlined"><CardContent><Stack spacing={2}>
          <Typography variant="h5">Tokens</Typography>
          <Typography>List the static JavaScript token groups and their values. This output is an excerpt; these are not the provider's mode-resolved CSS variables.</Typography>
          <CodeBlock code={tokens} language="text" plain />
        </Stack></CardContent></Card>
        <Card variant="outlined"><CardContent><Stack spacing={2}>
          <Typography variant="h5">Search</Typography>
          <Typography>Search component names and descriptions, token paths and documentation summaries. Quote queries containing spaces. No matches is a successful result.</Typography>
          <CodeBlock code={search} language="text" plain />
        </Stack></CardContent></Card>
        <Card variant="outlined"><CardContent><Stack spacing={2}>
          <Typography variant="h5">Docs topics</Typography>
          <Typography>Get a short summary for setup, theming, or migration. Topic names are case-insensitive.</Typography>
          <CodeBlock code={docs} language="text" plain />
        </Stack></CardContent></Card>
        <Card variant="outlined"><CardContent><Stack spacing={2}>
          <Typography variant="h5">JSON and exit codes</Typography>
          <Typography>Add --json to any command for a JSON envelope on stdout: success has ok, command and data; failure has ok: false, command and error (data is omitted). Errors are also written to stderr. Data varies by command.</Typography>
          <CodeBlock code={json} language="text" plain />
          <Typography>Successful commands exit 0. Unknown commands, components or topics and invalid arguments exit 1. A search with no matches still exits 0.</Typography>
        </Stack></CardContent></Card>
        <Typography>
          Pointing a coding agent at these docs? See the{' '}
          <Link to="/llms" style={{ color: 'inherit', fontWeight: 700 }}>llms.txt</Link> index, which you can open or download.
        </Typography>
      </Stack>
    </Container>
  );
}
