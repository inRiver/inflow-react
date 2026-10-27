import {
  Alert,
  Container,
  Typography,
  Stack,
  Box,
  Card,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import { INFLOW_DARK_MODE_ENABLED } from '../theme/featureFlags';
import { inflowTokens } from '../theme/tokens';

// Density values are theme.spacing() units (8px each): #4 = 32px, #9.5 = 76px.
const densityClasses = ['Compact', 'Default (Comfortable)', 'Cozy (Comfy)'] as const;

const pageHeaderDensity = [
  { title: '#4 (32px)', tabs: '#4 (32px)' },
  { title: '#9.5 (76px)', tabs: '#6 (48px)' },
  { title: '#10 (80px)', tabs: '#7 (56px)' },
];

const agGridDensity = [
  { values: '#4 (32px)', fontSize: '12px' },
  { values: '#5 (40px)', fontSize: '14px' },
  { values: '#6 (48px)', fontSize: '14px' },
];

function DensityTable({ label, columns, rows }: { label: string; columns: string[]; rows: string[][] }) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label={label}>
        <TableHead>
          <TableRow>
            <TableCell>Class</TableCell>
            {columns.map((column) => (
              <TableCell key={column}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={densityClasses[index]}>
              <TableCell component="th" scope="row" sx={{ fontWeight: index === 1 ? 700 : 400 }}>
                {densityClasses[index]}
              </TableCell>
              {row.map((value, valueIndex) => (
                <TableCell key={columns[valueIndex]} sx={{ fontWeight: index === 1 ? 700 : 400 }}>
                  {value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ValueTable({ label, columns, rows }: { label: string; columns: string[]; rows: string[][] }) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label={label}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row[0]}>
              {row.map((value, index) => (
                <TableCell
                  key={columns[index]}
                  component={index === 0 ? 'th' : 'td'}
                  scope={index === 0 ? 'row' : undefined}
                  sx={index === 0 ? { fontWeight: 700 } : undefined}
                >
                  {value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const radiusUsage: Record<string, string> = {
  xs: 'Inputs, autocomplete menus, and tooltips',
  sm: 'Buttons, button groups, cards, and the default shape.borderRadius',
  md: 'Snackbar messages',
  lg: 'Themed tabs',
  xl: 'Dialogs',
  full: 'Chips, icon buttons, and progress bars',
};

const spacingUnits = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const paletteColors = ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;
const paletteShades = ['main', 'light', 'dark', 'contrastText'] as const;

const shadowLevels = [
  { name: 'Elevation 1', level: 1, range: '1–2' },
  { name: 'Elevation 2', level: 3, range: '3–8' },
  { name: 'Elevation 3', level: 9, range: '9–24' },
];

function Swatch({ label, value }: { label: string; value: string }) {
  return (
    <Card sx={{ p: 2 }}>
      <Box sx={{ width: '100%', height: 40, bgcolor: value, borderRadius: 1, mb: 1, border: 1, borderColor: 'divider' }} />
      <Typography variant="caption" sx={{ display: 'block' }}>{label}</Typography>
      <Typography variant="caption" color="text.secondary">{value}</Typography>
    </Card>
  );
}

const typographyVariants = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'subtitle1', 'subtitle2',
  'body1', 'body2',
  'button', 'caption', 'overline',
] as const;

const typographyUsage: Record<(typeof typographyVariants)[number], string> = {
  h1: 'Display scale; not used by Inflow components',
  h2: 'Display scale; not used by Inflow components',
  h3: 'Page-level heading on documentation pages',
  h4: 'KPI card values',
  h5: 'Section headings on documentation pages',
  h6: 'Page header and detail panel titles',
  subtitle1: 'Card titles',
  subtitle2: 'Detail panel section headings',
  body1: 'Default body text',
  body2: 'Menus, breadcrumbs, table and chat text, supporting text',
  button: 'Buttons and tabs (capitalized, not uppercase)',
  caption: 'Helper text, timestamps, secondary labels',
  overline: 'Small section labels (uppercase)',
};

const formatRem = (value: string | number | undefined) => {
  if (value === undefined || value === 0) return '0';
  if (typeof value === 'string' && value.endsWith('rem')) return `${value} (${Math.round(parseFloat(value) * 16 * 100) / 100}px)`;
  return String(value);
};

const formatLineHeight = (value: string | number | undefined) =>
  typeof value === 'string' && value.endsWith('rem') ? formatRem(value) : String(value);

export function TokensPage() {
  const theme = useTheme();
  const radiusRows = Object.entries(inflowTokens.radius).map(([name, value]) => [
    name,
    value === 9999 ? 'Full (pill)' : `${value}px`,
    radiusUsage[name] ?? '',
  ]);
  const { text, background, action } = theme.palette;
  const surfaceEntries: [string, string][] = [
    ['text.primary', text.primary],
    ['text.secondary', text.secondary],
    ['text.disabled', text.disabled],
    ['background.default', background.default],
    ['background.paper', background.paper],
    ['divider', theme.palette.divider],
    ['action.hover', action.hover],
    ['action.selected', action.selected],
    ['action.disabled', action.disabled],
    ['action.disabledBackground', action.disabledBackground],
  ];
  const breakpointRows = Object.entries(theme.breakpoints.values).map(([name, value]) => [name, `${value}px`]);
  const zIndexRows = Object.entries(theme.zIndex).map(([name, value]) => [name, String(value)]);
  const durationRows = Object.entries(theme.transitions.duration).map(([name, value]) => [name, `${value}ms`]);
  const easingRows = Object.entries(theme.transitions.easing).map(([name, value]) => [name, value]);

  return (
    <Container maxWidth="lg">
      <Stack spacing={6} sx={{ py: 4 }}>
        <Typography variant="h3">Design Tokens</Typography>
        
        {/* Palette Section */}
        <Box>
          <Typography variant="h5" gutterBottom>Palette</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {theme.palette.mode === 'dark' ? 'Dark' : 'Light'} mode values, read from <code>theme.palette</code>.
            {INFLOW_DARK_MODE_ENABLED && ' Use the Light / Dark switch in the header to compare the two.'}
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>Main colors</Typography>
              <Grid container spacing={2}>
                {paletteColors.flatMap((name) =>
                  paletteShades.map((shade) => (
                    <Grid key={`${name}.${shade}`} size={{ xs: 6, sm: 4, md: 3 }}>
                      <Swatch label={`${name}.${shade}`} value={theme.palette[name][shade]} />
                    </Grid>
                  )),
                )}
              </Grid>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>Text, background, divider, and action</Typography>
              <Grid container spacing={2}>
                {surfaceEntries.map(([label, value]) => (
                  <Grid key={label} size={{ xs: 6, sm: 4, md: 3 }}>
                    <Swatch label={label} value={value} />
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>Inflow palette (<code>theme.palette.inflow</code>)</Typography>
              <Grid container spacing={2}>
                {Object.entries(theme.palette.inflow).map(([key, value]) => (
                  <Grid key={key} size={{ xs: 6, sm: 4, md: 3 }}>
                    <Swatch label={key} value={value} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        </Box>

        {/* Typography Section */}
        <Box>
          <Typography variant="h5" gutterBottom>Typography</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Every MUI typography variant, rendered from <code>theme.typography</code>. Font family: {String(theme.typography.fontFamily).split(',')[0]}.
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Variant</TableCell>
                  <TableCell>Sample</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Line height</TableCell>
                  <TableCell>Letter spacing</TableCell>
                  <TableCell>Used for</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {typographyVariants.map((variant) => {
                  const style = theme.typography[variant];
                  return (
                    <TableRow key={variant}>
                      <TableCell><code>{variant}</code></TableCell>
                      <TableCell>
                        <Typography variant={variant} component="div" noWrap>
                          {variant === 'overline' ? 'Overline text' : 'The quick brown fox'}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatRem(style.fontSize)}</TableCell>
                      <TableCell>{style.fontWeight}</TableCell>
                      <TableCell>{formatLineHeight(style.lineHeight)}</TableCell>
                      <TableCell>{formatRem(style.letterSpacing)}</TableCell>
                      <TableCell>{typographyUsage[variant]}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Spacing Section */}
        <Box>
          <Typography variant="h5" gutterBottom>Spacing</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <code>theme.spacing(n)</code> multiplies n by 8px. Whole units 1–10 match the <code>--spacing-*</code> CSS tokens.
          </Typography>
          <Stack spacing={1}>
            {spacingUnits.map((unit) => (
              <Box key={unit} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ width: 200, flexShrink: 0 }}>
                  <code>spacing({unit})</code> = {theme.spacing(unit)}
                  {Number.isInteger(unit) ? ` · --spacing-${unit}` : ''}
                </Typography>
                <Box sx={{ width: theme.spacing(unit), height: 24, bgcolor: 'primary.main', borderRadius: 1 }} />
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Content Density Section */}
        <Box>
          <Typography variant="h5" gutterBottom>Content Density</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Inflow has three density classes. Default (Comfortable) is used unless a product chooses otherwise.
            Values are spacing units, where each unit is 8px.
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Apply these values in your product. The library's AG Grid defaults are a 52px row and a 48px header,
            so set the row height for your density class on the grid yourself.
          </Alert>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>Page Header</Typography>
              <DensityTable
                label="Page header density"
                columns={['Title', 'Tabs']}
                rows={pageHeaderDensity.map((row) => [row.title, row.tabs])}
              />
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>AG Grid</Typography>
              <DensityTable
                label="AG Grid density"
                columns={['Row Height', 'Font Size in Grid']}
                rows={agGridDensity.map((row) => [row.values, row.fontSize])}
              />
            </Box>
          </Stack>
        </Box>

        {/* Shape Section */}
        <Box>
          <Typography variant="h5" gutterBottom>Shape</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            The default corner radius, <code>theme.shape.borderRadius</code>, is {theme.shape.borderRadius}px.
            Components use the radius tokens below.
          </Typography>
          <ValueTable label="Radius tokens" columns={['Token', 'Value', 'Used For']} rows={radiusRows} />
        </Box>

        {/* Breakpoints Section */}
        <Box>
          <Typography variant="h5" gutterBottom>Breakpoints</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Inflow uses MUI's default breakpoints. Each value is the minimum width where that breakpoint starts.
          </Typography>
          <ValueTable label="Breakpoints" columns={['Breakpoint', 'Minimum Width']} rows={breakpointRows} />
        </Box>

        {/* Z-Index Section */}
        <Box>
          <Typography variant="h5" gutterBottom>Z-Index</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Inflow uses MUI's default stacking order. Use these theme values instead of hard-coded numbers.
          </Typography>
          <ValueTable label="Z-index layers" columns={['Layer', 'Value']} rows={zIndexRows} />
        </Box>

        {/* Transitions Section */}
        <Box>
          <Typography variant="h5" gutterBottom>Transitions</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Inflow uses MUI's default durations and easing curves through <code>theme.transitions</code>.
          </Typography>
          <Stack spacing={3}>
            <ValueTable label="Transition durations" columns={['Duration', 'Value']} rows={durationRows} />
            <ValueTable label="Transition easing" columns={['Easing', 'Curve']} rows={easingRows} />
          </Stack>
        </Box>

        {/* Shadows Section */}
        <Box>
          <Typography variant="h5" gutterBottom>Shadows</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Inflow defines three shadows and maps the 25 MUI elevation levels onto them, so
            <code> elevation=&#123;4&#125;</code> and <code>elevation=&#123;8&#125;</code> render the same.
          </Typography>
          <Grid container spacing={2}>
            {shadowLevels.map(({ name, level, range }) => (
              <Grid key={name} size={{ xs: 12, sm: 4 }}>
                <Paper elevation={level} sx={{ p: 3 }}>
                  <Typography variant="subtitle1">{name}</Typography>
                  <Typography variant="body2" color="text.secondary">elevation {range}</Typography>
                  <Typography variant="caption" component="code" sx={{ display: 'block', mt: 1, wordBreak: 'break-word' }}>
                    {theme.shadows[level]}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}
