import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

export function CheckboxGroupDemo() {
  const codeExample = `<FormGroup>
  <FormControlLabel control={<Checkbox defaultChecked />} label="Option 1" />
  <FormControlLabel control={<Checkbox />} label="Option 2" />
</FormGroup>`;

  return (
    <DemoFrame title="CheckboxGroup">
      <FormGroup>
        <FormControlLabel control={<Checkbox defaultChecked />} label="React" />
        <FormControlLabel control={<Checkbox />} label="Vue" />
        <FormControlLabel control={<Checkbox defaultChecked />} label="Angular" />
        <FormControlLabel control={<Checkbox disabled />} label="Svelte (disabled)" />
      </FormGroup>
      <CodeBlock code={codeExample} />
    </DemoFrame>
  );
}
