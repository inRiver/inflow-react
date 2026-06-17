import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined } from '@mui/icons-material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

export function ToggleButtonDemo() {
  const [formats, setFormats] = useState<string[]>(['bold']);
  
  const handleFormat = (_event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setFormats(newFormats);
  };

  const codeExample = `<ToggleButtonGroup value={formats} onChange={handleFormat}>
  <ToggleButton value="bold"><FormatBold /></ToggleButton>
  <ToggleButton value="italic"><FormatItalic /></ToggleButton>
</ToggleButtonGroup>`;

  return (
    <DemoFrame title="ToggleButton">
      <ToggleButtonGroup value={formats} onChange={handleFormat}>
        <ToggleButton value="bold"><FormatBold /></ToggleButton>
        <ToggleButton value="italic"><FormatItalic /></ToggleButton>
        <ToggleButton value="underlined"><FormatUnderlined /></ToggleButton>
      </ToggleButtonGroup>
      <CodeBlock code={codeExample} />
    </DemoFrame>
  );
}
