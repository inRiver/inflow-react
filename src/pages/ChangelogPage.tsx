import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import changelogRaw from '../../CHANGELOG.md?raw';

/** Inline formatter: `code` spans and **bold** runs inside a line of text. */
function renderInline(text: string, keyPrefix: string) {
  // Split on `code` first, then **bold** inside the remaining text runs.
  const nodes: React.ReactNode[] = [];
  const codeParts = text.split(/(`[^`]+`)/g);
  codeParts.forEach((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith('`') && part.endsWith('`')) {
      nodes.push(
        <Typography key={key} component="code" variant="inherit" sx={{ fontFamily: 'monospace' }}>
          {part.slice(1, -1)}
        </Typography>,
      );
      return;
    }
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    boldParts.forEach((sub, j) => {
      const subKey = `${key}-${j}`;
      if (sub.startsWith('**') && sub.endsWith('**')) {
        nodes.push(<strong key={subKey}>{sub.slice(2, -2)}</strong>);
      } else if (sub) {
        nodes.push(<span key={subKey}>{sub}</span>);
      }
    });
  });
  return nodes;
}

interface Release {
  version: string;
  date: string;
  /** Ordered blocks: subsection headings, bullet groups, and plain paragraphs. */
  blocks: Block[];
}

type Block =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'bullets'; items: string[] };

/**
 * Parse the handwritten releases in CHANGELOG.md directly. Mirrors the filtering
 * rules in scripts/generate-changelog-digest.mjs so the page needs no generator
 * step: showcase-only bullets (and their continuation lines) and HTML comment
 * lines are dropped, `(library-facing)` suffixes are stripped, and empty
 * subsections/releases are omitted. The `## [Unreleased]` section and the
 * auto-generated `## For Library Consumers` digest are skipped entirely.
 */
function parseChangelog(raw: string): Release[] {
  const lines = raw.split(/\r?\n/);
  const releases: Release[] = [];
  let current: Release | null = null;
  let currentHasContent = false;
  let subsectionHasContent = false;
  let pendingBullets: string[] = [];
  let droppingBullet = false;
  let skippingConsumersSection = false;

  const flushBullets = () => {
    if (current && pendingBullets.length > 0) {
      current.blocks.push({ kind: 'bullets', items: pendingBullets });
      pendingBullets = [];
      currentHasContent = true;
      subsectionHasContent = true;
    }
  };

  const flushSubsection = () => {
    flushBullets();
    if (current && !subsectionHasContent) {
      // Drop an empty heading block left as the last block.
      const last = current.blocks[current.blocks.length - 1];
      if (last?.kind === 'heading') current.blocks.pop();
    }
    subsectionHasContent = false;
  };

  const flushRelease = () => {
    flushSubsection();
    if (current && !currentHasContent) {
      releases.splice(releases.indexOf(current), 1);
    }
    current = null;
    currentHasContent = false;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // The auto-generated digest section: skip its heading and everything in it.
    // (Its `### [`/`#### ` headers never match the release/subsection grammar
    // below, so only the heading itself and its prose lines need handling.)
    if (/^## For Library Consumers/.test(trimmed)) {
      flushRelease();
      skippingConsumersSection = true;
      continue;
    }

    const releaseMatch = /^## \[(.+?)\](?:\s+-\s+(.+))?$/.exec(trimmed);
    if (releaseMatch) {
      flushRelease();
      skippingConsumersSection = false;
      if (releaseMatch[1] === 'Unreleased') {
        current = null;
        continue;
      }
      current = { version: releaseMatch[1], date: releaseMatch[2] ?? '', blocks: [] };
      releases.push(current);
      droppingBullet = false;
      continue;
    }

    if (skippingConsumersSection || !current) continue;

    const subsectionMatch = /^### (.+)$/.exec(trimmed);
    if (subsectionMatch) {
      flushSubsection();
      current.blocks.push({ kind: 'heading', text: subsectionMatch[1] });
      droppingBullet = false;
      continue;
    }

    // Never render HTML comments (markdownlint pragmas, digest markers).
    if (trimmed.startsWith('<!--')) continue;
    // Ignore the digest's auto-generated italic note if it leaks this far.
    if (trimmed.startsWith('_Auto-generated')) continue;
    if (!trimmed) continue;

    if (/^- /.test(trimmed)) {
      // Drop showcase-only bullets; tolerate a leading ** on the label.
      droppingBullet = /^- (?:\*\*)?Showcase-only:/i.test(trimmed);
      if (droppingBullet) continue;
      pendingBullets.push(
        trimmed.slice(2).replace(/ \(library-facing\)(\.)?$/, '$1'),
      );
      continue;
    }

    if (droppingBullet && /^\s/.test(line)) {
      // More-indented continuation of a dropped showcase-only bullet.
      continue;
    }
    droppingBullet = false;

    // Plain paragraph line inside a release (e.g. the 3.2.0 intro, 3.1.0's note).
    flushBullets();
    current.blocks.push({ kind: 'paragraph', text: trimmed });
    currentHasContent = true;
    subsectionHasContent = true;
  }
  flushRelease();
  return releases;
}

const releases = parseChangelog(changelogRaw);

type SubsectionColor = 'success' | 'info' | 'warning' | 'error' | 'default';

/**
 * Split a subsection heading ("Added — ThemedChatPanel extended API") into its
 * chip label and optional suffix. Accepts em-dash, en-dash, and hyphen separators.
 */
function splitSubsection(text: string): { label: string; suffix: string | null } {
  const match = /^(.+?)\s+[–—-]\s+(.+)$/.exec(text);
  if (!match) return { label: text, suffix: null };
  return { label: match[1].trim(), suffix: match[2].trim() };
}

function subsectionColor(label: string): SubsectionColor {
  switch (label.toLowerCase()) {
    case 'added':
      return 'success';
    case 'changed':
      return 'info';
    case 'fixed':
      return 'warning';
    case 'security':
      return 'error';
    default:
      return 'default';
  }
}

function scrollToRelease(version: string) {
  document.getElementById(`changelog-${version}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function ChangelogPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h3" gutterBottom>
            Changelog
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Library-facing changes in each release, read straight from{' '}
            <Typography component="code" variant="inherit" sx={{ fontFamily: 'monospace' }}>
              CHANGELOG.md
            </Typography>{' '}
            at the repository root. Showcase-only entries are omitted.
          </Typography>
        </Box>

        {releases.length > 1 && (
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
            {releases.map((release) => (
              <Chip
                key={release.version}
                label={release.version}
                size="small"
                variant="outlined"
                onClick={() => scrollToRelease(release.version)}
              />
            ))}
          </Stack>
        )}

        <Stack spacing={3}>
          {releases.map((release) => (
            <Card
              key={`${release.version}-${release.date}`}
              variant="outlined"
              id={`changelog-${release.version}`}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'baseline' }}>
                    <Typography variant="h6">{release.version}</Typography>
                    {release.date && (
                      <Typography variant="caption" color="text.secondary">
                        {release.date}
                      </Typography>
                    )}
                  </Stack>
                  {release.blocks.map((block, i) => {
                    const blockKey = `${release.version}-${i}`;
                    if (block.kind === 'heading') {
                      const { label, suffix } = splitSubsection(block.text);
                      return (
                        <Stack
                          key={blockKey}
                          direction="row"
                          spacing={1}
                          sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.5 }}
                        >
                          <Chip size="small" label={label} color={subsectionColor(label)} />
                          {suffix && (
                            <Typography variant="body2" color="text.secondary">
                              {suffix}
                            </Typography>
                          )}
                        </Stack>
                      );
                    }
                    if (block.kind === 'paragraph') {
                      return (
                        <Typography key={blockKey} variant="body2">
                          {renderInline(block.text, blockKey)}
                        </Typography>
                      );
                    }
                    if (block.kind === 'bullets') {
                      return (
                        <List key={blockKey} disablePadding>
                          {block.items.map((item, j) => (
                            <ListItem
                              key={`${blockKey}-${j}`}
                              disableGutters
                              sx={{ py: 0.75, alignItems: 'flex-start' }}
                            >
                              <ListItemText
                                primary={renderInline(item, `${blockKey}-${j}`)}
                                slotProps={{ primary: { variant: 'body2' } }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      );
                    }
                    return null;
                  })}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
