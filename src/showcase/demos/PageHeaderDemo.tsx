import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import {
  ThemedPageHeader,
  type PageHeaderAction,
} from '../../components/themed/ThemedPageHeader';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

const schema: PropSchema[] = [
  { name: 'eyebrow', type: 'boolean', label: 'Show eyebrow' },
  { name: 'back', type: 'boolean', label: 'Show back button' },
  { name: 'actions', type: 'boolean', label: 'Show actions' },
];

export function PageHeaderDemo() {
  const [showEyebrow, setShowEyebrow] = useState(true);
  const [showBack, setShowBack] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const [activity, setActivity] = useState('No action selected.');

  const actions: PageHeaderAction[] = [
    { label: 'Cancel', onClick: () => setActivity('Cancel selected.') },
    { label: 'Save changes', variant: 'filled', onClick: () => setActivity('Save changes selected.') },
  ];
  const values = { eyebrow: showEyebrow, back: showBack, actions: showActions };
  const codeExample = `import { ThemedPageHeader } from '@inriver/inflow-react';

<ThemedPageHeader
  eyebrow="Product information"
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
        <Stack spacing={2} sx={{ width: '100%' }}>
          <ThemedPageHeader
            actions={showActions ? actions : undefined}
            eyebrow={showEyebrow ? 'Product information' : undefined}
            onBack={showBack ? () => setActivity('Back selected.') : undefined}
            title="Winter collection"
          />
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

      <DemoFrame title="Minimal page header">
        <ThemedPageHeader title="Products" />
      </DemoFrame>
    </>
  );
}
