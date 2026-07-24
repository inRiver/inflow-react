import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack } from '@mui/material';
import { ThemedTable } from '../../components/themed';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';
import { DemoVariantTabs, type DemoVariant } from '../DemoVariantTabs';
import { getThemedComponentInfo } from '../themedComponentInfo';

const themedInfo = getThemedComponentInfo('table');

const dessertColumns = [
  { id: 'dessert', label: 'Dessert' },
  { id: 'calories', label: 'Calories', align: 'right' as const },
];

const dessertData = [
  { dessert: 'Frozen yoghurt', calories: 159 },
  { dessert: 'Ice cream sandwich', calories: 237 },
];

export function TableDemo() {
  const [variant, setVariant] = useState<DemoVariant>('mui');
  const [props, setProps] = useState<Record<string, any>>({
  "size": "medium",
  "padding": "normal",
  "striped": false
});

  const schema: PropSchema[] = [
  {
    "name": "size",
    "type": "select",
    "options": [
      "small",
      "medium"
    ]
  },
  {
    "name": "padding",
    "type": "select",
    "options": [
      "normal",
      "checkbox",
      "none"
    ]
  },
  {
    "name": "striped",
    "type": "boolean"
  }
];

  const muiCodeExample = `
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<TableContainer component={Paper}>
  <Table size={props.size} padding={props.padding}>
    <TableHead>
      <TableRow>
        <TableCell>Dessert</TableCell>
        <TableCell align="right">Calories</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Frozen yoghurt</TableCell>
        <TableCell align="right">159</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>`;

  const themedCodeExample = `
import { ThemedTable } from '@inriver/inflow-react';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
const columns = [
  { id: 'dessert', label: 'Dessert' },
  { id: 'calories', label: 'Calories', align: 'right' },
];

const data = [
  { dessert: 'Frozen yoghurt', calories: 159 },
  { dessert: 'Ice cream sandwich', calories: 237 },
];

<ThemedTable
  columns={columns}
  data={data}
  size={props.size}
  padding={props.padding}
  striped={props.striped}
/>`;

  return (
    <>
      <DemoVariantTabs
        value={variant}
        onChange={setVariant}
        muiLabel="MUI Table"
        themedLabel="ThemedTable"
        themedReason={themedInfo?.reason}
      />

      <DemoFrame title="Table - Interactive">
        {variant === 'mui' ? (
          <TableContainer component={Paper}>
            <Table size={props.size} padding={props.padding}>
              <TableHead>
                <TableRow>
                  <TableCell>Dessert</TableCell>
                  <TableCell align="right">Calories</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Frozen yoghurt</TableCell>
                  <TableCell align="right">159</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <ThemedTable columns={dessertColumns} data={dessertData} {...props} />
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
          
          <Stack spacing={4}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Default</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow><TableCell>Data</TableCell></TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Dense</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow><TableCell>Data</TableCell></TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
