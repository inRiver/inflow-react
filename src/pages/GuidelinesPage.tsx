import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { CodeBlock } from '../showcase/CodeBlock';
import { INFLOW_DARK_MODE_ENABLED } from '../theme';
import { THEMED_COMPONENT_INFO } from '../showcase/themedComponentInfo';

const installCode = `npm install @inriver/inflow-react@react19-mui6.3 @mui/material@\">=6.3.0 <6.4.0\" @emotion/react @emotion/styled react@^19 react-dom@^19`;

const releaseTagCode = `# Release only after validating this checkpoint against consuming apps.
# The package is already publish-ready with "private": false.
INFLOW_THEME_RELEASE_TAG=react19-mui6.3 npm publish --tag react19-mui6.3

# Promote to latest only after teams have intentionally adopted and verified it.
npm dist-tag add @inriver/inflow-react@0.1.0 latest`;

const hardTagCode = `# Create one immutable source anchor for the exact package artifact.
# Format: theme/<compatibility-checkpoint>/v<package-version>
git tag -a theme/react19-mui6.3/v0.1.0 -m "@inriver/inflow-react 0.1.0 - React 19 / MUI 6.3"
git push origin theme/react19-mui6.3/v0.1.0

# Recovery/security reference points:
# - npm exact artifact: @inriver/inflow-react@0.1.0
# - source hard tag: theme/react19-mui6.3/v0.1.0
# - moving channel: @inriver/inflow-react@react19-mui6.3`;

const patchReleaseCode = `# Fix a component issue while staying on React 19 / MUI 6.3.
npm version patch
npm run build

# Publish the new immutable package version to the same moving checkpoint tag.
INFLOW_THEME_RELEASE_TAG=react19-mui6.3 npm publish --tag react19-mui6.3

# Optional: inspect where the compatibility tag points after publishing.
npm dist-tag ls @inriver/inflow-react`;

const wrapperExtensionCode = `import { styled } from '@mui/material/styles';
import { ThemedChip } from '@inriver/inflow-react';

// Local adapter for a legacy consuming UI. Do not backport this into old theme lines.
export const LegacyStatusChip = styled(ThemedChip)(({ theme }) => ({
  minWidth: 96,
  borderColor: theme.palette.divider,
}));`;

const behaviorAdapterCode = `import { ThemedTable, type ThemedTableProps } from '@inriver/inflow-react';

type LegacyRow = Record<string, unknown>;

// Local behavioral adapter for a retired checkpoint consumer.
// Use this only when the app cannot migrate yet and the issue is app-specific.
export function LegacySafeTable(props: ThemedTableProps<LegacyRow>) {
  return (
    <ThemedTable
      {...props}
      data={props.data.filter(Boolean)}
      keyExtractor={(row, index) => String(row.id ?? index)}
    />
  );
}`;

const providerCode = `import { InflowProvider } from '@inriver/inflow-react';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <InflowProvider>
      {children}
    </InflowProvider>
  );
}`;

const colorModeFlagCode = `import { INFLOW_DARK_MODE_ENABLED } from '@inriver/inflow-react';`;

const componentCode = `import { Stack } from '@mui/material';
import { ThemedButton, ThemedChip, ThemedTextField } from '@inriver/inflow-react';

export function ProductStatus() {
  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <ThemedChip label="Active" color="primary" />
      <ThemedTextField label="Product name" />
      <ThemedButton variant="contained">Save</ThemedButton>
    </Stack>
  );
}`;

const styledCode = `import { styled } from '@mui/material/styles';
import { ThemedChip } from '@inriver/inflow-react';

export const CompactStatusChip = styled(ThemedChip)(({ theme }) => ({
  height: 24,
  fontSize: theme.typography.caption.fontSize,
}));`;

const tokenCode = `import { Box } from '@mui/material';
import { inflowTokens } from '@inriver/inflow-react';

export function TokenExample() {
  return (
    <Box
      sx={{
        borderRadius: inflowTokens.radius.sm,
        backgroundColor: inflowTokens.colors.surfaceLow,
        p: 2,
      }}
    />
  );
}`;

const npmLinkSetupCode = `# In the theme package directory (one-time setup):
cd C:\\Development\\inriver-react-theme
npm link

# In your consuming app directory:
cd C:\\Development\\your-app
npm link @inriver/inflow-react`;

const npmLinkCleanupCode = `# When you're done developing:
cd C:\\Development\\your-app
npm unlink @inriver/inflow-react
npm install  # Reinstalls from public npm or your normal lockfile source`;

const publicExports = [
  'inflowTheme and defaultTheme',
  'inflowTokens, inflowCustomColors, and inflowSpacing',
  'ThemedButton, ThemedChip, ThemedTextField, ThemedCard, ThemedDialog, and ThemedTable',
];

const releaseTerms = [
  {
    label: 'Exact package version',
    example: '@inriver/inflow-react@0.1.1',
    description: 'Immutable artifact. Use this when a consuming app wants zero movement until someone updates the lockfile intentionally.',
  },
  {
    label: 'Compatibility checkpoint tag',
    example: '@inriver/inflow-react@react19-mui6.3',
    description: 'Moving release channel for the same React/MUI contract. Component fixes can advance this tag from 0.1.0 to 0.1.1 without changing the checkpoint.',
  },
  {
    label: 'Hard recovery tag',
    example: 'theme/react19-mui6.3/v0.1.1',
    description: 'Immutable source anchor for a specific package artifact. Use this for security review, rollback investigation, or emergency recovery.',
  },
  {
    label: 'New compatibility checkpoint',
    example: 'react19-mui6.4 or react20-mui7',
    description: 'New tag, and usually a new major or minor package line, when the React/MUI compatibility contract changes.',
  },
];

const architectureItems = [
  {
    label: 'Theme source of truth',
    path: 'src/theme/inflow.ts',
    description: 'Owns the MUI createTheme setup: palette, typography, shadows, component defaults, and style overrides.',
  },
  {
    label: 'Token exports',
    path: 'src/theme/tokens.ts',
    description: 'Raw Inflow values for custom surfaces that cannot rely on normal MUI theming.',
  },
  {
    label: 'Public wrapper layer',
    path: 'src/components/themed/',
    description: 'Small reusable components for repeated Inflow-specific UI patterns across apps.',
  },
  {
    label: 'Package boundary',
    path: 'src/index.ts',
    description: 'The only import surface consumers should use. Showcase pages and demos are documentation, not package API.',
  },
];

const dependencyChoices = [
  {
    label: 'Complete freeze',
    example: '@inriver/inflow-react@0.1.0',
    description: 'Use when an app needs zero movement until its lockfile changes intentionally.',
  },
  {
    label: 'Patch-only movement',
    example: '~0.1.0',
    description: 'Allows fixes in 0.1.x while blocking new minor checkpoints and major changes.',
  },
  {
    label: 'Validated checkpoint',
    example: '@inriver/inflow-react@react19-mui6.3',
    description: 'Follows the latest approved patch for the same React/MUI baseline.',
  },
  {
    label: 'Local iteration',
    example: 'npm link @inriver/inflow-react',
    description: 'Use only while developing locally; do not treat this as a release channel.',
  },
];

export function GuidelinesPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            Package usage
          </Typography>
          <Typography variant="h3" gutterBottom>
            Importing the Inflow theme in another project
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Use this repo as a versioned MUI theme and component layer. The package gives teams a
            shared Inflow UI baseline without forcing every app onto unvalidated bleeding-edge
            theme changes.
          </Typography>
        </Box>

        <Alert severity="info">
          This repo is package-ready, not publish-by-default. Releases must go through an approved
          React/MUI compatibility checkpoint; direct publishing to <code>latest</code> is blocked.
        </Alert>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">Color mode support</Typography>
              {INFLOW_DARK_MODE_ENABLED ? (
                <>
                  <Box>
                    <Chip label="Light + dark mode available" color="success" variant="outlined" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Both light and dark mode are currently supported. Consuming apps can request
                    either mode when creating an Inflow theme, and the exported flag is the
                    authoritative runtime check for whether dark mode is available in the current
                    package build.
                  </Typography>
                </>
              ) : (
                <>
                  <Box>
                    <Chip label="Light mode only" color="default" variant="outlined" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Dark mode is currently disabled behind the published
                    <code> INFLOW_DARK_MODE_ENABLED </code>
                    feature flag. If a consuming app calls{' '}
                    <code>createInflowTheme('dark')</code> or{' '}
                    <code>createDefaultTheme('dark')</code> while the flag is off, the request
                    resolves to light mode instead, and development builds log a{' '}
                    <code>console.warn</code>. This is a deliberate product toggle, not a permanent
                    API limitation, so consumers should check the exported flag instead of assuming
                    dark mode availability.
                  </Typography>
                </>
              )}
              <Typography variant="body2" color="text.secondary">
                Consuming apps can read the live package status directly:
              </Typography>
              <CodeBlock code={colorModeFlagCode} language="tsx" />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">Why this package exists</Typography>
              <Typography variant="body2" color="text.secondary">
                Theme work tends to fail in two ways: every app copies local styles and fragments,
                or every app depends on a single moving package and becomes hard-locked to the
                newest design changes. This package is the middle path: one shared design-system
                source, distributed through explicit versions and compatibility channels.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A consuming app can freeze on an exact version, accept patch fixes inside a tested
                checkpoint, or deliberately opt into a new React/MUI baseline when its team is
                ready. That keeps product UI consistent without making adoption unsafe.
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">How the repo is structured</Typography>
              <Typography variant="body2" color="text.secondary">
                The showcase and the library live together, but only the package boundary is stable
                API. Apps should import from <code>@inriver/inflow-react</code>, not from source files,
                showcase pages, or demo components.
              </Typography>
              <List dense disablePadding>
                {architectureItems.map((item) => (
                  <ListItem key={item.label} disableGutters alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                          <Typography component="span" variant="subtitle2">
                            {item.label}
                          </Typography>
                          <Chip label={item.path} size="small" variant="outlined" />
                        </Stack>
                      }
                      secondary={item.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">How apps choose their stability level</Typography>
              <Typography variant="body2" color="text.secondary">
                The right dependency form depends on how much movement the consuming app can
                tolerate. Use exact versions for full freeze, patch ranges for safe fixes, and
                checkpoint tags for validated movement within the same React/MUI contract.
              </Typography>
              <List dense disablePadding>
                {dependencyChoices.map((choice) => (
                  <ListItem key={choice.label} disableGutters alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                          <Typography component="span" variant="subtitle2">
                            {choice.label}
                          </Typography>
                          <Chip label={choice.example} size="small" color="primary" variant="outlined" />
                        </Stack>
                      }
                      secondary={choice.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">Version and tag mental model</Typography>
              <Typography variant="body2" color="text.secondary">
                Published versions never change. Compatibility tags move. That gives consuming UIs
                a choice between pinning an exact artifact or following the latest validated patch
                inside a React/MUI checkpoint.
              </Typography>
              <List dense disablePadding>
                {releaseTerms.map((term) => (
                  <ListItem key={term.label} disableGutters alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                          <Typography component="span" variant="subtitle2">
                            {term.label}
                          </Typography>
                          <Chip label={term.example} size="small" variant="outlined" />
                        </Stack>
                      }
                      secondary={term.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">Local Development with npm link</Typography>
              <Typography variant="body2" color="text.secondary">
                Use <code>npm link</code> when actively developing the theme and you want consuming
                apps to see changes immediately without rebuilding or republishing. This creates a
                symlink from the consuming app's <code>node_modules</code> to your local theme
                directory.
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Setup (one-time per developer):
              </Typography>
              <CodeBlock code={npmLinkSetupCode} language="bash" plain />
              <Typography variant="body2" color="text.secondary">
                Done. Any changes in the theme package are now immediately available in your app
                (just restart your dev server). No rebuild, no publish, no git commits needed.
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                When development is complete:
              </Typography>
              <CodeBlock code={npmLinkCleanupCode} language="bash" plain />
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Use cases:</strong> Active theme iteration, testing changes in real app
                  context, multiple apps consuming the same local theme during prototyping.
                </Typography>
              </Alert>
              <Alert severity="warning" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Not for:</strong> Production deployments (use the published package from
                  public npm instead).
                </Typography>
              </Alert>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">1. Release by compatibility checkpoint</Typography>
              <Typography variant="body2" color="text.secondary">
                Avoid a single rolling design-system package that every UI consumes blindly. Tag
                each verified React/MUI checkpoint so applications can opt in, test, and roll
                forward intentionally. This showcase is verified against React 19 and MUI 6.3, so
                its peer range intentionally stops before MUI 6.4 until that checkpoint is tested.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Every published package version should also get a hard source tag. The npm
                compatibility tag can move, but the hard source tag should never move and should be
                protected in Git. That gives security and recovery work a known source snapshot.
              </Typography>
              <CodeBlock code={releaseTagCode} language="bash" plain />
              <CodeBlock code={hardTagCode} language="bash" plain />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">2. Install the tagged package and peer dependencies</Typography>
              <Typography variant="body2" color="text.secondary">
                The theme package does not bundle React or MUI. The consuming project owns those
                dependencies, which prevents duplicate React trees and duplicate MUI style engines.
                Match the package tag to the app&apos;s React/MUI checkpoint.
              </Typography>
              <CodeBlock code={installCode} language="bash" plain />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">3. Patch within the same checkpoint</Typography>
              <Typography variant="body2" color="text.secondary">
                A checkpoint tag is a release channel, not a frozen artifact. If a component bug is
                fixed without changing the React/MUI compatibility contract, publish a new package
                version and move the same tag forward. Apps pinned to
                <code>@inriver/inflow-react@0.1.0</code> stay frozen; apps using
                <code>@inriver/inflow-react@react19-mui6.3</code> get the latest validated patch for
                that checkpoint when they reinstall or update their lockfile.
              </Typography>
              <CodeBlock code={patchReleaseCode} language="bash" plain />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">4. Handle retired checkpoints and functional bugs</Typography>
              <Typography variant="body2" color="text.secondary">
                Once the team has moved to a newer checkpoint, older checkpoints are considered
                frozen compatibility lines. Visual tweaks can usually be handled with local
                wrappers, <code>styled()</code>, or <code>sx</code>. Functional bugs are different:
                a style wrapper cannot reliably change internal component logic.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Functional fixes belong in the current supported checkpoint and ship as a patch on
                that checkpoint tag. Retired checkpoints do not receive normal component backports;
                an older app should migrate forward or create a local behavioral adapter while it
                waits. Only a team-approved emergency, such as a security or production-blocking
                defect, should reopen a retired checkpoint.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Custom components can expose behavior extension points through explicit props,
                render slots, or callbacks. MUI theme overrides such as <code>defaultProps</code>,
                <code>styleOverrides</code>, and variants are useful for defaults and styling, but
                they are not a substitute for fixing broken internal logic.
              </Typography>
              <CodeBlock code={wrapperExtensionCode} language="tsx" />
              <CodeBlock code={behaviorAdapterCode} language="tsx" />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
                <Typography variant="h5">5. Wrap the app once with InflowProvider</Typography>
                <Typography variant="body2" color="text.secondary">
                  Wrap the application root once with <code>InflowProvider</code> so regular MUI
                  components inherit the shared Inflow theme without changing the host page&apos;s
                  <code>body</code> or <code>:root</code>.
                </Typography>
              <CodeBlock code={providerCode} language="tsx" />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">6. Use Themed components directly</Typography>
              <Typography variant="body2" color="text.secondary">
                Use the exported <code>Themed*</code> wrappers directly for common Inflow UI
                patterns such as actions, status indicators, and form inputs. They package shared
                styling decisions into reusable components that stay consistent across apps.
              </Typography>
              <CodeBlock code={componentCode} language="tsx" />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">6a. When to reach for a Themed wrapper vs. the standard component</Typography>
              <Typography variant="body2" color="text.secondary">
                Every MUI component already inherits Inflow&apos;s palette, typography, and component
                overrides just by rendering inside <code>InflowProvider</code> - no wrapper required.
                Only six components have a <code>Themed*</code> wrapper, and each one exists for a
                specific reason - a forced token that must survive theme overrides, an ergonomic
                default, or a structural API improvement over manual composition:
              </Typography>
              <List dense disablePadding>
                {Object.values(THEMED_COMPONENT_INFO).map((info) => (
                  <ListItem key={info.themedName} disableGutters alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography component="span" variant="subtitle2">
                          {info.themedName}
                        </Typography>
                      }
                      secondary={info.reason}
                    />
                  </ListItem>
                ))}
              </List>
              <Typography variant="body2" color="text.secondary">
                If a component isn&apos;t in this list, the standard MUI version is already the
                right choice - it&apos;s fully themed via <code>InflowProvider</code>, and adding a
                wrapper would only add maintenance cost without changing behavior. The showcase
                sidebar marks components that do have a wrapper with a <code>palette</code> icon,
                and each of those six component pages lets you toggle between the plain MUI and
                Themed version to compare.
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">7. Extend wrappers with styled()</Typography>
              <Typography variant="body2" color="text.secondary">
                For reusable project-specific variants, prefer composition or <code>styled()</code>
                over inheritance. This keeps props, refs, and MUI theme behavior intact.
              </Typography>
              <CodeBlock code={styledCode} language="tsx" />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">8. Use tokens sparingly for custom surfaces</Typography>
              <Typography variant="body2" color="text.secondary">
                Prefer the MUI theme first. Reach for tokens when building custom surfaces that are
                not MUI components or when a value needs to be shared outside <code>sx</code>.
              </Typography>
              <CodeBlock code={tokenCode} language="tsx" />
            </Stack>
          </CardContent>
        </Card>

        <Divider />

        <Box>
          <Typography variant="h5" gutterBottom>
            Public exports
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip label="theme" color="primary" />
            <Chip label="tokens" color="primary" variant="outlined" />
            <Chip label="themed components" color="primary" variant="outlined" />
          </Stack>
          <List dense>
            {publicExports.map((item) => (
              <ListItem key={item} disableGutters>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Stack>
    </Container>
  );
}
