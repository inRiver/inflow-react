import { Typography, useTheme } from '@mui/material';
import { InflowProvider } from '../../providers';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { PublisherDetail } from './DetailPagePatternDemo.codeExamples';
import recipeSource from './DetailPagePatternDemo.codeExamples.tsx?raw';

export function DetailPagePatternDemo() {
  const mode = useTheme().palette.mode;
  return (
    <>
      <Typography color="text.secondary">The shell applies the push width to its content; do not apply it again to an ancestor. Place the recipe inside your app's InflowProvider.</Typography>
      <DemoFrame title="Detail page with a push panel">
        {/* Isolate the demo from the showcase layout, which already consumes the push width. */}
        <InflowProvider mode={mode} cacheKey="recipe">
          <PublisherDetail />
        </InflowProvider>
      </DemoFrame>
      <CodeBlock code={recipeSource.replace("../../components/themed", "@inriver/inflow-react")} />
    </>
  );
}
