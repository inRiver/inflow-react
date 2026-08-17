import { useState } from 'react';
import { Alert, Button, Stack } from '@mui/material';
import { ThemedAlert } from '../../components/themed/ThemedAlert';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { DemoVariantTabs, type DemoVariant } from '../DemoVariantTabs';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';
import { getThemedComponentInfo } from '../themedComponentInfo';

const themedInfo = getThemedComponentInfo('alert');

export function AlertDemo() {
  const [variant, setVariant] = useState<DemoVariant>('mui');
  const [muiProps, setMuiProps] = useState<Record<string, unknown>>({
    severity: 'success',
    variant: 'standard',
  });
  const [themedProps, setThemedProps] = useState<Record<string, unknown>>({
    severity: 'error',
    showTitle: true,
    showClose: true,
  });

  const schema: PropSchema[] = [
    {
      name: 'severity',
      type: 'select',
      options: ['error', 'warning', 'info', 'success'],
    },
    {
      name: 'variant',
      type: 'select',
      options: ['standard', 'filled', 'outlined'],
    },
  ];
  const themedSchema: PropSchema[] = [
    { name: 'severity', type: 'select', options: ['error', 'warning', 'info', 'success'] },
    { name: 'showTitle', type: 'boolean', label: 'Show title' },
    { name: 'showClose', type: 'boolean', label: 'Show close button' },
  ];
  const muiSeverity = muiProps.severity === 'error' || muiProps.severity === 'warning' || muiProps.severity === 'info'
    ? muiProps.severity
    : 'success';
  const muiVariant = muiProps.variant === 'filled' || muiProps.variant === 'outlined' ? muiProps.variant : 'standard';
  const themedSeverity = themedProps.severity === 'warning' || themedProps.severity === 'info' || themedProps.severity === 'success'
    ? themedProps.severity
    : 'error';

  const muiCodeExample = `
import { Alert } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Alert
  severity={props.severity}
  variant={props.variant}
>
  This is an alert message.
</Alert>`;

  const themedCodeExample = `
import { ThemedAlert } from '@inriver/inflow-react';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<ThemedAlert severity="error" title="Unable to save" onClose={() => {}}>
  Review the highlighted fields and try again.
</ThemedAlert>`;

  return (
    <>
      <DemoVariantTabs
        value={variant}
        onChange={setVariant}
        muiLabel="MUI Alert"
        themedLabel="ThemedAlert"
        themedReason={themedInfo?.reason}
      />

      {variant === 'mui' ? (
        <>
          <DemoFrame title="Alert - Interactive">
            <Alert severity={muiSeverity} variant={muiVariant}>This is an alert message.</Alert>
          </DemoFrame>

          <PropsPlayground schema={schema} values={muiProps} onChange={setMuiProps} />

          <CodeBlock code={muiCodeExample} language="tsx" />

          <DemoFrame title="All States">
            <Stack spacing={2}>
              <Alert severity="success">Success alert</Alert>
              <Alert severity="info">Info alert</Alert>
              <Alert severity="warning">Warning alert</Alert>
              <Alert severity="error">Error alert</Alert>
              <Alert
                severity="error"
                action={(
                  <Button color="inherit" size="small" variant="text">
                    UNDO
                  </Button>
                )}
              >
                Action alert
              </Alert>
            </Stack>
          </DemoFrame>
        </>
      ) : (
        <>
          <DemoFrame title="ThemedAlert - Interactive">
            <ThemedAlert
              severity={themedSeverity}
              title={themedProps.showTitle === true ? 'Unable to save' : undefined}
              onClose={themedProps.showClose === true ? () => undefined : undefined}
            >
              Review the highlighted fields and try again.
            </ThemedAlert>
          </DemoFrame>

          <PropsPlayground schema={themedSchema} values={themedProps} onChange={setThemedProps} />

          <DemoFrame title="ThemedAlert - All Severities">
            <Stack spacing={2}>
              <ThemedAlert severity="error" title="Unable to save" onClose={() => {}}>
                Review the highlighted fields and try again.
              </ThemedAlert>
              <ThemedAlert severity="warning">
                This change may affect existing product data.
              </ThemedAlert>
              <ThemedAlert severity="info" title="New workflow available">
                Try the updated product enrichment experience.
              </ThemedAlert>
              <ThemedAlert severity="success" onClose={() => {}}>
                Product information was saved successfully.
              </ThemedAlert>
            </Stack>
          </DemoFrame>

          <CodeBlock code={themedCodeExample} language="tsx" />
        </>
      )}
    </>
  );
}
