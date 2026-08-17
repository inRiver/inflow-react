import { useState } from 'react';
import { Breadcrumbs, Link, Typography, Stack } from '@mui/material';
import { ThemedBreadcrumbs } from '../../components/themed/ThemedBreadcrumbs';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';
import { DemoVariantTabs, type DemoVariant } from '../DemoVariantTabs';
import { getThemedComponentInfo } from '../themedComponentInfo';

const themedInfo = getThemedComponentInfo('breadcrumbs');
const themedShortTrail = [
  { label: 'Home', href: '/' },
  { label: 'Catalog', href: '/catalog', icon: 'category' },
  { label: 'Accessories' },
];
const themedLongTrail = [
  { label: 'Home', href: '/' },
  { label: 'Catalog', href: '/catalog' },
  { label: 'Accessories', href: '/accessories' },
  { label: 'Audio', href: '/audio' },
  { label: 'Headphones', href: '/headphones' },
  { label: 'Wireless' },
];

export function BreadcrumbsDemo() {
  const [variant, setVariant] = useState<DemoVariant>('mui');
  const [props, setProps] = useState<Record<string, unknown>>({
  "separator": "/",
    "maxItems": 8
  });
  const [themedProps, setThemedProps] = useState<Record<string, unknown>>({
    separator: 'chevron',
    maxItems: '3',
  });

  const schema: PropSchema[] = [
  {
    "name": "separator",
    "type": "select",
    "options": [
      "/",
      ">",
      "•"
    ]
  },
  {
    "name": "maxItems",
    "type": "select",
    "options": [
      "8",
      "3",
      "2"
    ]
  }
  ];
  const themedSchema: PropSchema[] = [
    { name: 'separator', type: 'select', options: ['chevron', 'slash'] },
    { name: 'maxItems', type: 'select', options: ['6', '3', '2'] },
  ];

  const muiCodeExample = `
import { Breadcrumbs } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Breadcrumbs 
  separator={props.separator}
  maxItems={Number(props.maxItems)}
/>`;
  const themedCodeExample = `
import { ThemedBreadcrumbs } from '@inriver/inflow-react';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Catalog', href: '/catalog', icon: 'category' },
  { label: 'Accessories' },
];

<ThemedBreadcrumbs items={items} separator="chevron" maxItems={3} />`;
  const muiSeparator = typeof props.separator === 'string' ? props.separator : '/';
  const muiMaxItems = typeof props.maxItems === 'string' || typeof props.maxItems === 'number'
    ? Number(props.maxItems)
    : 8;
  const themedSeparator = themedProps.separator === 'slash' ? 'slash' : 'chevron';
  const parsedThemedMaxItems = Number.parseInt(String(themedProps.maxItems), 10);
  const themedMaxItems = Number.isFinite(parsedThemedMaxItems) ? parsedThemedMaxItems : 3;

  return (
    <>
      <DemoVariantTabs
        value={variant}
        onChange={setVariant}
        muiLabel="MUI Breadcrumbs"
        themedLabel="ThemedBreadcrumbs"
        themedReason={themedInfo?.reason}
      />

      {variant === 'mui' ? (
        <>
          <DemoFrame title="Breadcrumbs - Interactive">
            <Breadcrumbs aria-label="breadcrumb" separator={muiSeparator} maxItems={muiMaxItems}>
              <Link underline="hover" color="inherit" href="/">Home</Link>
              <Link underline="hover" color="inherit" href="/catalog">Catalog</Link>
              <Typography color="text.primary">Accessories</Typography>
            </Breadcrumbs>
          </DemoFrame>

          <PropsPlayground schema={schema} values={props} onChange={(newValues) => setProps(newValues)} />

          <CodeBlock code={muiCodeExample} language="tsx" />

          <DemoFrame title="All States">
            <Stack spacing={2} direction="column">
              <Stack spacing={2}>
                <Breadcrumbs>
                  <Link underline="hover" color="inherit" href="/">Home</Link>
                  <Typography color="text.primary">Current</Typography>
                </Breadcrumbs>
                <Breadcrumbs separator=">">
                  <Link underline="hover" color="inherit" href="/">Home</Link>
                  <Typography color="text.primary">Custom Separator</Typography>
                </Breadcrumbs>
              </Stack>
            </Stack>
          </DemoFrame>
        </>
      ) : (
        <>
          <DemoFrame title="ThemedBreadcrumbs - Interactive">
            <ThemedBreadcrumbs items={themedLongTrail} separator={themedSeparator} maxItems={themedMaxItems} />
          </DemoFrame>

          <PropsPlayground schema={themedSchema} values={themedProps} onChange={setThemedProps} />

          <DemoFrame title="Themed Breadcrumbs">
            <Stack spacing={2}>
              <ThemedBreadcrumbs items={themedShortTrail} separator="chevron" />
              <ThemedBreadcrumbs items={themedShortTrail} separator="slash" />
              <ThemedBreadcrumbs items={themedLongTrail} maxItems={3} />
            </Stack>
          </DemoFrame>

          <CodeBlock code={themedCodeExample} language="tsx" />
        </>
      )}
    </>
  );
}
