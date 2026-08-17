import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { ThemedButton } from '../../components/themed/ThemedButton';
import { ThemedToast, type ThemedToastSeverity } from '../../components/themed/ThemedToast';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

const severityOptions: ThemedToastSeverity[] = ['info', 'success', 'warning', 'error'];

const schema: PropSchema[] = [
  { name: 'severity', type: 'select', options: severityOptions },
  { name: 'title', type: 'boolean', label: 'Show title' },
];

function isToastSeverity(value: unknown): value is ThemedToastSeverity {
  return typeof value === 'string' && severityOptions.some((option) => option === value);
}

export function ToastDemo() {
  const [severity, setSeverity] = useState<ThemedToastSeverity>('info');
  const [showTitle, setShowTitle] = useState(true);
  const [actionCount, setActionCount] = useState(0);
  const [isDismissibleVisible, setDismissibleVisible] = useState(true);

  const props = { severity, title: showTitle };
  const codeExample = `import { ThemedToast } from '@inriver/inflow-react';

<ThemedToast
  severity="${severity}"
  title="Changes saved"
  message="Your product information is up to date."
  action={{ label: 'View details', onClick: handleDetails }}
  onClose={handleDismiss}
/>`;

  return (
    <>
      <DemoFrame title="Toast - Interactive">
        <ThemedToast
          severity={severity}
          title={showTitle ? 'Changes saved' : undefined}
          message="Your product information is up to date."
        />
      </DemoFrame>

      <PropsPlayground
        schema={schema}
        values={props}
        onChange={(values) => {
          if (isToastSeverity(values.severity)) setSeverity(values.severity);
          setShowTitle(values.title === true);
        }}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All severities">
        <Stack spacing={2} sx={{ width: '100%' }}>
          {severityOptions.map((option) => (
            <ThemedToast
              key={option}
              severity={option}
              title={`${option.charAt(0).toUpperCase()}${option.slice(1)} notification`}
              message={`This is a ${option} toast message.`}
            />
          ))}
        </Stack>
      </DemoFrame>

      <DemoFrame title="Action and dismiss">
        <Stack spacing={2} sx={{ width: '100%', alignItems: 'flex-start' }}>
          <ThemedToast
            severity="info"
            title="Product archived"
            message="The product is no longer visible in the catalog."
            action={{ label: 'Undo', onClick: () => setActionCount((count) => count + 1) }}
          />
          <Typography variant="body2">Undo selected {actionCount} times.</Typography>
          {isDismissibleVisible ? (
            <ThemedToast
              severity="warning"
              title="Review required"
              message="Some changes still need approval."
              onClose={() => setDismissibleVisible(false)}
            />
          ) : (
            <ThemedButton size="small" variant="text" onClick={() => setDismissibleVisible(true)}>
              Restore dismissible toast
            </ThemedButton>
          )}
        </Stack>
      </DemoFrame>

      <DemoFrame title="Stacked notifications">
        <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 560 }}>
          <ThemedToast severity="success" message="Product published." />
          <ThemedToast severity="info" message="Catalog synchronization is in progress." />
          <ThemedToast severity="warning" message="Two fields need review." />
        </Stack>
      </DemoFrame>
    </>
  );
}
