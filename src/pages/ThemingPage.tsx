import { Card, CardContent, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { CodeBlock } from '../showcase/CodeBlock';

const jsTokens = `import { inflowTokens } from '@inriver/inflow-react';

const radius = inflowTokens.radius.md;`;
const providerOverride = `<InflowProvider sx={{ '--infl-radius-md': '12px' }}>
  <div className="product-card">Product</div>
</InflowProvider>`;
const cssOverride = `.product-root[data-inflow-root] {
  --infl-radius-md: 12px;
}
.product-root .product-card {
  border-radius: var(--infl-radius-md);
}`;
const cssRoot = `<InflowProvider className="product-root">
  <div className="product-card">Product</div>
</InflowProvider>`;

export function ThemingPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={4}>
        <Typography variant="h3">Theming</Typography>
        <Card variant="outlined"><CardContent><Stack spacing={2}>
          <Typography variant="h5">JavaScript tokens and CSS variables</Typography>
          <Typography>The MUI theme is the source of component defaults and palette values. Use theme values for MUI styles and the exported inflowTokens for static JavaScript token values; the colors in that export are the light defaults.</Typography>
          <CodeBlock code={jsTokens} plain />
          <Typography>Each InflowProvider also emits 112 resolved --infl-* variables: 88 colors, 6 radii, 6 spacing, 4 grid, 3 shadows and 5 font variables. Use them in CSS when styles should follow the provider's resolved theme and mode.</Typography>
          <Typography>See <Link to="/tokens" style={{ color: 'inherit', fontWeight: 700 }}>Design Tokens</Link> for names and current values.</Typography>
        </Stack></CardContent></Card>
        <Card variant="outlined"><CardContent><Stack spacing={2}>
          <Typography variant="h5">Override one provider</Typography>
          <Typography>Set variables with the provider's sx prop, or target its root with a sufficiently specific CSS selector. The override affects styles that consume the variable; it does not change the JavaScript tokens, MUI theme or styles that read the theme directly.</Typography>
          <CodeBlock code={providerOverride} plain />
          <Typography>Alternatively, assign a class to the provider and scope the CSS to that root:</Typography>
          <CodeBlock code={cssRoot} plain />
          <CodeBlock code={cssOverride} language="css" plain />
          <Typography>Variables live on [data-inflow-root] and inherit through its DOM descendants. Never put Inflow overrides on :root: provider roots set their own values, and global styles can affect other applications. Nested providers have their own values.</Typography>
        </Stack></CardContent></Card>
        <Card variant="outlined"><CardContent><Stack spacing={2}>
          <Typography variant="h5">Dark mode and portals</Typography>
          <Typography>Changing mode from light to dark recomputes the theme and its scoped variables. Explicit overrides remain in effect, so choose values that work in each mode. The app controls the mode; it is not automatically tied to the system preference.</Typography>
          <Typography>MUI portals such as dialogs, menus, tooltips and select popups normally mount under document.body, outside [data-inflow-root]. React theme context still reaches them, but scoped CSS variables do not. Prefer MUI theme values there, or configure a portal container inside the appropriate provider root when using var(--infl-*).</Typography>
          <Typography>Start with <Link to="/getting-started" style={{ color: 'inherit', fontWeight: 700 }}>Getting started</Link> for provider setup.</Typography>
        </Stack></CardContent></Card>
      </Stack>
    </Container>
  );
}
