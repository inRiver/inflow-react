import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

export function TableDemo() {
  const [props, setProps] = useState<Record<string, any>>({
  "size": "medium",
  "padding": "normal"
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
  }
];

  const codeExample = `
import { Table } from '@mui/material';

<Table 
  size={props.size}
  padding={props.padding}
/>`;

  return (
    <>
      <DemoFrame title="Table - Interactive">
        
        <TableContainer component={Paper}>
          <Table {...props}>
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
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

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
