import { useState } from 'react';
import { Card, CardActions, CardContent, CardHeader, Button, Typography, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function CardDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "variant": "elevation"
});

  const schema: PropSchema[] = [
  {
    "name": "variant",
    "type": "select",
    "options": [
      "elevation",
      "outlined"
    ]
  }
];

  const codeExample = `
import { Card } from '@mui/material';

<Card 
  variant={props.variant}
/>`;

  return (
    <>
      <DemoFrame title="Card - Interactive">
        
        <Card sx={{ minWidth: 275 }} {...props}>
          <CardHeader title="Card Title" subheader="Card subtitle" />
          <CardContent>
            <Typography variant="body2">Card content</Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
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
