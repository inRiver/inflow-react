import { useState } from 'react';
import { Badge, Stack } from '@mui/material';
import type { BadgeProps } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import { ThemedBadge } from '../../components/themed/ThemedBadge';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';
import { DemoVariantTabs, type DemoVariant } from '../DemoVariantTabs';
import { getThemedComponentInfo } from '../themedComponentInfo';

const themedInfo = getThemedComponentInfo('badge');

export function BadgeDemo() {
  const [variant, setVariant] = useState<DemoVariant>('mui');
  const [props, setProps] = useState<BadgeProps & Record<string, unknown>>({
  "color": "primary",
  "variant": "standard",
  "invisible": false,
  "max": 99
});
  const [themedProps, setThemedProps] = useState<Record<string, unknown>>({
    color: 'primary',
    variant: 'standard',
    invisible: false,
    max: '99',
  });

  const schema: PropSchema[] = [
  {
    "name": "color",
    "type": "select",
    "options": [
      "primary",
      "secondary",
      "error",
      "info",
      "success",
      "warning",
      "default"
    ]
  },
  {
    "name": "variant",
    "type": "select",
    "options": [
      "standard",
      "dot"
    ]
  },
  {
    "name": "invisible",
    "type": "boolean"
  }
];

  const themedSchema: PropSchema[] = [
    { name: 'color', type: 'select', options: ['error', 'primary', 'success'] },
    { name: 'variant', type: 'select', options: ['standard', 'dot'] },
    { name: 'invisible', type: 'boolean' },
    { name: 'max', type: 'text' },
  ];

  const themedColor = themedProps.color === 'error' || themedProps.color === 'success'
    ? themedProps.color
    : 'primary';
  const themedVariant = themedProps.variant === 'dot' ? 'dot' : 'standard';
  const parsedThemedMax = Number.parseInt(String(themedProps.max), 10);
  const themedMax = Number.isFinite(parsedThemedMax) ? parsedThemedMax : 99;

  const muiCodeExample = `
import { Badge } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Badge 
  color={props.color}
  variant={props.variant}
  invisible={props.invisible}
  badgeContent={4}
/>`;

  const themedCodeExample = `
import { ThemedBadge } from '@inriver/inflow-react';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<ThemedBadge color="error" badgeContent={4}>
  <MailIcon color="action" />
</ThemedBadge>`;

  return (
    <>
      <DemoVariantTabs
        value={variant}
        onChange={setVariant}
        muiLabel="MUI Badge"
        themedLabel="ThemedBadge"
        themedReason={themedInfo?.reason}
      />

      {variant === 'mui' ? (
        <>
          <DemoFrame title="Badge - Interactive">
            <Badge {...props} badgeContent={4}>
              <MailIcon color="action" />
            </Badge>
          </DemoFrame>

          <PropsPlayground schema={schema} values={props} onChange={setProps} />

          <CodeBlock code={muiCodeExample} language="tsx" />

          <DemoFrame title="All States">
            <Stack spacing={2} direction="column">
              <Stack direction="row" spacing={4}>
                <Badge badgeContent={4} color="primary"><MailIcon color="action" /></Badge>
                <Badge badgeContent={100} color="secondary"><MailIcon color="action" /></Badge>
                <Badge variant="dot" color="error"><MailIcon color="action" /></Badge>
                <Badge invisible badgeContent={4}><MailIcon color="action" /></Badge>
              </Stack>
            </Stack>
          </DemoFrame>
        </>
      ) : (
        <>
          <DemoFrame title="ThemedBadge - Interactive">
            <ThemedBadge
              color={themedColor}
              variant={themedVariant}
              invisible={themedProps.invisible === true}
              max={themedMax}
              badgeContent={120}
            >
              <MailIcon color="action" />
            </ThemedBadge>
          </DemoFrame>

          <PropsPlayground schema={themedSchema} values={themedProps} onChange={setThemedProps} />

          <DemoFrame title="ThemedBadge - Color and Variant Matrix">
            <Stack spacing={3}>
              {(['error', 'primary', 'success'] as const).map((color) => (
                <Stack key={color} direction="row" spacing={4} sx={{ alignItems: 'center' }}>
                  <ThemedBadge color={color} badgeContent={4}><MailIcon color="action" /></ThemedBadge>
                  <ThemedBadge color={color} variant="dot"><MailIcon color="action" /></ThemedBadge>
                  <ThemedBadge color={color} badgeContent={120} max={99}><MailIcon color="action" /></ThemedBadge>
                </Stack>
              ))}
            </Stack>
          </DemoFrame>

          <CodeBlock code={themedCodeExample} language="tsx" />
        </>
      )}
    </>
  );
}
