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

export function TokensPage() {
  const theme = useTheme();
  const radiusRows = Object.entries(inflowTokens.radius).map(([name, value]) => [
    name,
    value === 9999 ? 'Full (pill)' : `${value}px`,
    radiusUsage[name] ?? '',
  ]);
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
          <Grid container spacing={2}>
            {/* Primary colors */}
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <Card sx={{ p: 2 }}>
                <Box sx={{ width: '100%', height: 60, bgcolor: 'primary.main', borderRadius: 1, mb: 1 }} />
                <Typography variant="caption">primary.main</Typography>
              </Card>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <Card sx={{ p: 2 }}>
                <Box sx={{ width: '100%', height: 60, bgcolor: 'secondary.main', borderRadius: 1, mb: 1 }} />
                <Typography variant="caption">secondary.main</Typography>
              </Card>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <Card sx={{ p: 2 }}>
                <Box sx={{ width: '100%', height: 60, bgcolor: 'error.main', borderRadius: 1, mb: 1 }} />
                <Typography variant="caption">error.main</Typography>
              </Card>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <Card sx={{ p: 2 }}>
                <Box sx={{ width: '100%', height: 60, bgcolor: 'warning.main', borderRadius: 1, mb: 1 }} />
                <Typography variant="caption">warning.main</Typography>
              </Card>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <Card sx={{ p: 2 }}>
                <Box sx={{ width: '100%', height: 60, bgcolor: 'info.main', borderRadius: 1, mb: 1 }} />
                <Typography variant="caption">info.main</Typography>
              </Card>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <Card sx={{ p: 2 }}>
                <Box sx={{ width: '100%', height: 60, bgcolor: 'success.main', borderRadius: 1, mb: 1 }} />
                <Typography variant="caption">success.main</Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Tokens extracted */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Inflow Extracted Palette Tokens</Typography>
          <Grid container spacing={2}>
            {Object.entries(inflowTokens.colors).map(([key, value]) => {
              if (typeof value === 'string') {
                return (
                  <Grid
                    key={key}
                    size={{
                      xs: 12,
                      sm: 4,
                      md: 2
                    }}>
                    <Card sx={{ p: 2 }}>
                      <Box sx={{ width: '100%', height: 40, bgcolor: value, borderRadius: 1, mb: 1, border: '1px solid #ccc' }} />
                      <Typography variant="caption" sx={{ display: 'block' }}>{key}</Typography>
                      <Typography variant="caption" color="text.secondary">{value}</Typography>
                    </Card>
                  </Grid>
                );
              }
              return null;
            })}
          </Grid>
        </Box>
        
        {/* Typography Section */}
        <Box>
          <Typography variant="h5" gutterBottom>Typography</Typography>
          <Stack spacing={2}>
            <Typography variant="h1">Heading 1</Typography>
            <Typography variant="h2">Heading 2</Typography>
            <Typography variant="h3">Heading 3</Typography>
            <Typography variant="body1">Body 1</Typography>
            <Typography variant="body2">Body 2</Typography>
            <Typography variant="caption">Caption</Typography>
          </Stack>
        </Box>
        
        {/* Spacing Section */}
        <Box>
          <Typography variant="h5" gutterBottom>Spacing</Typography>
          <Stack spacing={2}>
            {[1, 2, 3, 4, 6, 8].map(unit => (
              <Box key={unit} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: theme => theme.spacing(unit), height: 40, bgcolor: 'primary.main', borderRadius: 1 }} />
                <Typography>{unit} = {unit * 8}px</Typography>
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
          <Grid container spacing={2}>
            {[0, 1, 2, 4, 8, 16, 24].map(level => (
              <Grid
                key={level}
                size={{
                  xs: 6,
                  sm: 4,
                  md: 3
                }}>
                <Paper elevation={level} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography>Shadow {level}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}
