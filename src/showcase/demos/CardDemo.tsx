import { useState } from 'react';
import { Typography, Stack } from '@mui/material';
import { ThemedButton, ThemedCard } from '../../components/themed';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function CardDemo() {
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

  const codeExample = `
import { ThemedCard, ThemedButton } from '@inriver/inflow-react';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<ThemedCard
  variant={props.variant}
  disableContentPadding={props.disableContentPadding}
  title="Project Title"
  subheader="Created on Jan 1, 2026"
  actions={<ThemedButton size="small">View Details</ThemedButton>}
>
  Main content goes here
</ThemedCard>`;

  return (
    <>
      <DemoFrame title="Card - Interactive">
        <ThemedCard
          sx={{ minWidth: 275 }}
          {...props}
          title="Card Title"
          subheader="Card subtitle"
          actions={<ThemedButton size="small">Learn More</ThemedButton>}
        >
          <Typography variant="body2">Card content</Typography>
        </ThemedCard>
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          
          <Stack direction="row" spacing={2}>
            <ThemedCard sx={{ minWidth: 200 }} title="Elevation Card">
              <Typography>Default styling</Typography>
            </ThemedCard>
            <ThemedCard sx={{ minWidth: 200 }} variant="outlined" title="Outlined Card">
              <Typography>Outlined variant</Typography>
            </ThemedCard>
            <ThemedCard
              sx={{ minWidth: 200, bgcolor: 'action.disabledBackground' }}
              title="Disabled-like Card"
              actions={<ThemedButton size="small" disabled>Learn More</ThemedButton>}
            >
              <Typography>Disabled-like state</Typography>
            </ThemedCard>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
