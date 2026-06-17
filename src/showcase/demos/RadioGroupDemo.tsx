import { useState } from 'react';
import { RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

export function RadioGroupDemo() {
  const [value, setValue] = useState('female');

  const codeExample = `<RadioGroup value={value} onChange={(e) => setValue(e.target.value)}>
  <FormControlLabel value="female" control={<Radio />} label="Female" />
  <FormControlLabel value="male" control={<Radio />} label="Male" />
</RadioGroup>`;

  return (
    <DemoFrame title="RadioGroup">
      <FormControl>
        <FormLabel>Gender</FormLabel>
        <RadioGroup value={value} onChange={(e) => setValue(e.target.value)}>
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </FormControl>
      <CodeBlock code={codeExample} />
    </DemoFrame>
  );
}
