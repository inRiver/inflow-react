import { useState } from 'react';
import { Stack } from '@mui/material';
import { ThemedTable } from '../../components/themed';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

const dessertColumns = [
  { id: 'dessert', label: 'Dessert' },
  { id: 'calories', label: 'Calories', align: 'right' as const },
];

const dessertData = [
  { dessert: 'Frozen yoghurt', calories: 159 },
  { dessert: 'Ice cream sandwich', calories: 237 },
];

export function TableDemo() {
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

  const codeExample = `
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
      <DemoFrame title="Table - Interactive">
        <ThemedTable columns={dessertColumns} data={dessertData} {...props} />
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
            <ThemedTable columns={dessertColumns} data={dessertData} />
            <ThemedTable columns={dessertColumns} data={dessertData} size="small" />
            <ThemedTable columns={dessertColumns} data={dessertData} striped />
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
