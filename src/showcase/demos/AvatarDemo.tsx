import { useState } from 'react';
import { Avatar, Stack } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { ThemedAvatar, ThemedAvatarGroup } from '../../components/themed/ThemedAvatar';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { DemoVariantTabs, type DemoVariant } from '../DemoVariantTabs';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';
import { getThemedComponentInfo } from '../themedComponentInfo';

const themedInfo = getThemedComponentInfo('avatar');

const muiSchema: PropSchema[] = [
  {
    name: 'variant',
    type: 'select',
    options: ['circular', 'rounded', 'square'],
  },
];

const themedSchema: PropSchema[] = [
  {
    name: 'size',
    type: 'select',
    options: ['40', '32', '24', '18'],
  },
  {
    name: 'shape',
    type: 'select',
    options: ['circular', 'rounded', 'square'],
  },
  {
    name: 'badge',
    type: 'boolean',
  },
];

function getMuiVariant(value: unknown): 'circular' | 'rounded' | 'square' {
  return value === 'rounded' || value === 'square' ? value : 'circular';
}

function getThemedSize(value: unknown): 40 | 32 | 24 | 18 {
  if (value === '32') return 32;
  if (value === '24') return 24;
  if (value === '18') return 18;
  return 40;
}

function getThemedShape(value: unknown): 'circular' | 'rounded' | 'square' {
  return value === 'rounded' || value === 'square' ? value : 'circular';
}

export function AvatarDemo() {
  const [variant, setVariant] = useState<DemoVariant>('mui');
  const [muiProps, setMuiProps] = useState<Record<string, unknown>>({ variant: 'circular' });
  const [themedProps, setThemedProps] = useState<Record<string, unknown>>({
    size: '40',
    shape: 'circular',
    badge: false,
  });

  const muiCodeExample = `
import { Avatar } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Avatar variant="${getMuiVariant(muiProps.variant)}">H</Avatar>`;

  const themedSize = getThemedSize(themedProps.size);
  const themedShape = getThemedShape(themedProps.shape);
  const themedBadge = themedProps.badge === true;
  const themedCodeExample = `
import { ThemedAvatar } from '@inriver/inflow-react';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<ThemedAvatar size={${themedSize}} shape="${themedShape}" badge={${themedBadge}}>IR</ThemedAvatar>`;

  return (
    <>
      <DemoVariantTabs
        value={variant}
        onChange={setVariant}
        muiLabel="MUI Avatar"
        themedLabel="ThemedAvatar"
        themedReason={themedInfo?.reason}
      />

      {variant === 'mui' ? (
        <>
          <DemoFrame title="Avatar - Interactive">
            <Avatar variant={getMuiVariant(muiProps.variant)}>H</Avatar>
          </DemoFrame>

          <PropsPlayground schema={muiSchema} values={muiProps} onChange={setMuiProps} />

          <CodeBlock code={muiCodeExample} language="tsx" />

          <DemoFrame title="All States">
            <Stack spacing={2} direction="column">
              <Stack direction="row" spacing={2}>
                <Avatar>H</Avatar>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>N</Avatar>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <FolderIcon />
                </Avatar>
                <Avatar variant="rounded" sx={{ bgcolor: 'success.main' }}>
                  R
                </Avatar>
                <Avatar variant="square" sx={{ bgcolor: 'info.main' }}>
                  S
                </Avatar>
              </Stack>
            </Stack>
          </DemoFrame>
        </>
      ) : (
        <>
          <DemoFrame title="ThemedAvatar - Interactive">
            <ThemedAvatar size={themedSize} shape={themedShape} badge={themedBadge}>
              IR
            </ThemedAvatar>
          </DemoFrame>

          <PropsPlayground schema={themedSchema} values={themedProps} onChange={setThemedProps} />

          <CodeBlock code={themedCodeExample} language="tsx" />

          <DemoFrame title="Sizes and Shapes">
            <Stack spacing={2}>
              {(['circular', 'rounded', 'square'] as const).map((shape) => (
                <Stack key={shape} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  {([40, 32, 24, 18] as const).map((size) => (
                    <ThemedAvatar key={`${shape}-${size}`} size={size} shape={shape}>
                      IR
                    </ThemedAvatar>
                  ))}
                </Stack>
              ))}
            </Stack>
          </DemoFrame>

          <DemoFrame title="Group Overflow and Status">
            <Stack direction="row" spacing={4} sx={{ alignItems: 'center' }}>
              <ThemedAvatarGroup max={3} size={32}>
                <ThemedAvatar size={32}>AL</ThemedAvatar>
                <ThemedAvatar size={32}>BM</ThemedAvatar>
                <ThemedAvatar size={32}>CK</ThemedAvatar>
                <ThemedAvatar size={32}>DT</ThemedAvatar>
                <ThemedAvatar size={32}>ES</ThemedAvatar>
              </ThemedAvatarGroup>
              <ThemedAvatar size={40} badge>
                ON
              </ThemedAvatar>
            </Stack>
          </DemoFrame>
        </>
      )}
    </>
  );
}
