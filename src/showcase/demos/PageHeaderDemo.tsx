import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import {
  ThemedPageHeader,
  type PageHeaderAction,
} from '../../components/themed/ThemedPageHeader';
import { ThemedBreadcrumbs } from '../../components/themed/ThemedBreadcrumbs';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

const schema: PropSchema[] = [
  { name: 'eyebrow', type: 'boolean', label: 'Show eyebrow (title only)' },
  { name: 'back', type: 'boolean', label: 'Show back button' },
  { name: 'actions', type: 'boolean', label: 'Show actions' },
];

export function PageHeaderDemo() {
  const [showEyebrow, setShowEyebrow] = useState(false);
  const [showBack, setShowBack] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const [activity, setActivity] = useState('No action selected.');

  const actions: PageHeaderAction[] = [
    { label: 'Cancel', onClick: () => setActivity('Cancel selected.') },
    { label: 'Save changes', variant: 'filled', onClick: () => setActivity('Save changes selected.') },
  ];
  const values = { eyebrow: showEyebrow, back: showBack, actions: showActions };
  const codeExample = `import { ThemedBreadcrumbs, ThemedPageHeader } from '@inriver/inflow-react';

<ThemedPageHeader
  breadcrumbs={<ThemedBreadcrumbs items={items} />}
  title="Winter collection"
  onBack={handleBack}
  actions={[
    { label: 'Cancel', onClick: handleCancel },
    { label: 'Save changes', variant: 'filled', onClick: handleSave },
  ]}
/>`;

  return (
    <>
      <DemoFrame title="Full page header">
        <Stack spacing={3} sx={{ width: '100%' }}>
          <Stack spacing={1}>
            <Typography variant="caption">Title only</Typography>
            <ThemedPageHeader
              actions={showActions ? actions : undefined}
              eyebrow={showEyebrow ? 'Product information' : undefined}
              onBack={showBack ? () => setActivity('Back selected.') : undefined}
              title="Winter collection"
            />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="caption">With breadcrumbs</Typography>
            <ThemedPageHeader
              actions={showActions ? actions : undefined}
              breadcrumbs={
                <ThemedBreadcrumbs
                  items={[
                    { label: 'Catalog', href: '#' },
                    { label: 'Collections', href: '#' },
                  ]}
                />
              }
              onBack={showBack ? () => setActivity('Back selected.') : undefined}
              title="Winter collection"
            />
          </Stack>
          <Typography variant="body2">{activity}</Typography>
        </Stack>
      </DemoFrame>

      <PropsPlayground
        schema={schema}
        values={values}
        onChange={(nextValues) => {
          setShowEyebrow(nextValues.eyebrow === true);
          setShowBack(nextValues.back === true);
          setShowActions(nextValues.actions === true);
        }}
      />

      <CodeBlock code={codeExample} language="tsx" />
    </>
  );
}
