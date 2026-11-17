import { Box, Typography, useTheme } from '@mui/material';
import { InflowProvider } from '../../providers';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { PanelLayouts } from './RightPanelPatternDemo.codeExamples';
import recipeSource from './RightPanelPatternDemo.codeExamples.tsx?raw';

export function RightPanelPatternDemo() {
  const mode = useTheme().palette.mode;
  return (
    <>
      <Typography color="text.secondary">Open one layout at a time. The panel controls presentation and close behavior. Place the recipe inside your app's InflowProvider.</Typography>
      <DemoFrame title="Push, overlay and chat layouts">
        {/* Isolate the demo from the showcase layout, which already consumes the push width. */}
        <InflowProvider mode={mode} cacheKey="recipe">
          {/* Preview only: push and chat panels are viewport-fixed and reserve their width inside
              the content, which would leave almost nothing in a docs-sized frame. Keep a usable
              content width; the frame scrolls horizontally when it is narrower. */}
          <Box
            data-testid="push-preview-stage"
            sx={(theme) => ({ minWidth: `calc(var(--infl-right-panel-width, 0px) + ${theme.spacing(45)})` })}
          >
            <PanelLayouts />
          </Box>
        </InflowProvider>
      </DemoFrame>
      <CodeBlock code={recipeSource.replace("../../components/themed", "@inriver/inflow-react")} />
    </>
  );
}
