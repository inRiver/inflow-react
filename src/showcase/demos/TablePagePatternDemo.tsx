import { Typography } from '@mui/material';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { PublishersList } from './TablePagePatternDemo.codeExamples';
import recipeSource from './TablePagePatternDemo.codeExamples.tsx?raw';

export function TablePagePatternDemo() {
  return (
    <>
      <Typography color="text.secondary">A compact list recipe. For focused product data, use the themed AG Grid recipe instead. Place the recipe inside your app's InflowProvider.</Typography>
      <DemoFrame title="List view: data, loading and empty">
        <PublishersList />
      </DemoFrame>
      <CodeBlock code={recipeSource.replace("../../components/themed", "@inriver/inflow-react")} />
    </>
  );
}
