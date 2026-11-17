import { Button, Card, CardContent, Container, Stack, Typography } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { Link } from 'react-router-dom';
import { CodeBlock } from '../showcase/CodeBlock';
import llmsTxt from '../../public/llms.txt?raw';

// Served from public/; resolve against the Vite base so the links work on the
// GitHub Pages subpath (/inflow-react/) as well as locally.
const llmsTxtUrl = `${import.meta.env.BASE_URL}llms.txt`;

export function LlmsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={4}>
        <Typography variant="h3">llms.txt</Typography>
        <Typography>
          The showcase publishes an llms.txt index for coding agents and LLM tools: a curated,
          machine-readable map of the library, its provider setup, the{' '}
          <Link to="/cli" style={{ color: 'inherit', fontWeight: 700 }}>inflow CLI</Link>, and these
          docs. Point an agent at it, or download the file and attach it to a prompt.
        </Typography>
        <Card variant="outlined"><CardContent><Stack spacing={2}>
          <Typography variant="h5">Get the file</Typography>
          <Typography>
            It is served from the site root, so an agent can fetch it directly from the URL below.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Button
              variant="contained"
              component="a"
              href={llmsTxtUrl}
              download="llms.txt"
              startIcon={<DownloadOutlinedIcon />}
              sx={{ textTransform: 'none' }}
            >
              Download llms.txt
            </Button>
            <Button
              variant="outlined"
              component="a"
              href={llmsTxtUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textTransform: 'none' }}
            >
              Open llms.txt
            </Button>
          </Stack>
        </Stack></CardContent></Card>
        <Card variant="outlined"><CardContent><Stack spacing={2}>
          <Typography variant="h5">Contents</Typography>
          <Typography>This is the file exactly as published.</Typography>
          <CodeBlock code={llmsTxt} language="text" plain />
        </Stack></CardContent></Card>
      </Stack>
    </Container>
  );
}
