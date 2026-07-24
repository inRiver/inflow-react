import { useState } from 'react';
import { Card, CardActions, CardContent, CardHeader, Button, Typography, Stack } from '@mui/material';
import { ThemedButton, ThemedCard } from '../../components/themed';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';
import { DemoVariantTabs, type DemoVariant } from '../DemoVariantTabs';
import { getThemedComponentInfo } from '../themedComponentInfo';

const themedInfo = getThemedComponentInfo('card');

export function CardDemo() {
  const [variant, setVariant] = useState<DemoVariant>('mui');
  const [props, setProps] = useState<Record<string, any>>({
  "variant": "elevation",
  "disableContentPadding": false
});

  const schema: PropSchema[] = [
  {
    "name": "variant",
    "type": "select",
    "options": [
      "elevation",
      "outlined"
    ]
  },
  {
    "name": "disableContentPadding",
    "type": "boolean"
  }
];

  const muiCodeExample = `
import { Card, CardHeader, CardContent, CardActions, Button, Typography } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Card variant={props.variant} sx={{ minWidth: 275 }}>
  <CardHeader title="Card Title" subheader="Card subtitle" />
  <CardContent sx={props.disableContentPadding ? { p: 0 } : undefined}>
    <Typography variant="body2">Card content</Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Learn More</Button>
  </CardActions>
</Card>`;

  const themedCodeExample = `
import { ThemedCard, ThemedButton } from '@inriver/inflow-react';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<ThemedCard
  variant={props.variant}
  disableContentPadding={props.disableContentPadding}
  title="Card Title"
  subheader="Card subtitle"
  actions={<ThemedButton size="small">Learn More</ThemedButton>}
>
  Card content
</ThemedCard>`;

  return (
    <>
      <DemoVariantTabs
        value={variant}
        onChange={setVariant}
        muiLabel="MUI Card"
        themedLabel="ThemedCard"
        themedReason={themedInfo?.reason}
      />

      <DemoFrame title="Card - Interactive">
        {variant === 'mui' ? (
          <Card sx={{ minWidth: 275 }} variant={props.variant}>
            <CardHeader title="Card Title" subheader="Card subtitle" />
            <CardContent sx={props.disableContentPadding ? { p: 0 } : undefined}>
              <Typography variant="body2">Card content</Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        ) : (
          <ThemedCard
            sx={{ minWidth: 275 }}
            {...props}
            title="Card Title"
            subheader="Card subtitle"
            actions={<ThemedButton size="small">Learn More</ThemedButton>}
          >
            <Typography variant="body2">Card content</Typography>
          </ThemedCard>
        )}
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={variant === 'mui' ? muiCodeExample : themedCodeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack direction="row" spacing={2}>
            <Card sx={{ minWidth: 200 }}>
              <CardContent><Typography>Elevation Card</Typography></CardContent>
            </Card>
            <Card sx={{ minWidth: 200 }} variant="outlined">
              <CardContent><Typography>Outlined Card</Typography></CardContent>
            </Card>
            <Card sx={{ minWidth: 200, bgcolor: 'action.disabledBackground' }}>
              <CardContent><Typography>Disabled-like Card</Typography></CardContent>
            </Card>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
