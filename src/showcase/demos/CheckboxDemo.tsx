import { useState, useMemo } from 'react';
import { Checkbox, FormControlLabel, Box, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

export function CheckboxDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    color: "primary",
    disabled: false,
    size: "medium",
    checked: true,
    indeterminate: false
  });

  const updateProp = (key: string, value: any) => {
    setProps({ ...props, [key]: value });
  };

  // Dynamic code example using actual prop values
  const codeExample = useMemo(() => {
    const lines = [
      "import { Checkbox } from '@mui/material';",
      "",
      "<Checkbox",
      `  color="${props.color}"`,
      `  size="${props.size}"`,
      `  disabled={${props.disabled}}`,
      `  checked={${props.checked}}`,
      `  indeterminate={${props.indeterminate}}`,
      "/>"
    ];
    return lines.join("\n");
  }, [props]);

  return (
    <>
      <DemoFrame title="Checkbox — Interactive">
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <FormControlLabel
            label="Label"
            disabled={props.disabled}
            control={
              <Checkbox
                color={props.color}
                size={props.size}
                checked={props.checked}
                indeterminate={props.indeterminate}
                onChange={(e) => setProps({ ...props, checked: e.target.checked })}
              />
            }
            sx={{ '& .MuiFormControlLabel-label': { fontSize: 20 } }}
          />
        </Box>
      </DemoFrame>

      <DemoFrame title="Props Playground">
        <Box sx={{ p: 3 }}>
          <Divider sx={{ mb: 4 }} />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center", justifyContent: "center" }}>
            <FormControl size="small" sx={{ minWidth: 180, bgcolor: "#fff", borderRadius: "4px" }}>
              <InputLabel>color</InputLabel>
              <Select label="color" value={props.color} onChange={(e) => updateProp("color", e.target.value)}>
                {["primary", "secondary", "success", "error", "warning", "default"].map((c) =>
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                )}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 180, bgcolor: "#fff", borderRadius: "4px" }}>
              <InputLabel>size</InputLabel>
              <Select label="size" value={props.size} onChange={(e) => updateProp("size", e.target.value)}>
                {["small", "medium"].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Checkbox checked={props.disabled} onChange={(e) => updateProp("disabled", e.target.checked)} />}
              label="disabled"
            />
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", mt: 2 }}>
            <FormControlLabel
              control={<Checkbox checked={props.checked} onChange={(e) => updateProp("checked", e.target.checked)} />}
              label="checked"
            />
            <FormControlLabel
              control={<Checkbox checked={props.indeterminate} onChange={(e) => updateProp("indeterminate", e.target.checked)} />}
              label="indeterminate"
            />
          </Box>
        </Box>
      </DemoFrame>

      <CodeBlock code={codeExample} language="tsx" plain />

      <DemoFrame title="All States">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'space-around', alignItems: 'center' }}>
          <FormControlLabel control={<Checkbox checked />} label="Checked" />
          <FormControlLabel control={<Checkbox />} label="Unchecked" />
          <FormControlLabel control={<Checkbox indeterminate />} label="Indeterminate" />
          <FormControlLabel disabled control={<Checkbox checked />} label="Disabled checked" />
          <FormControlLabel disabled control={<Checkbox />} label="Disabled unchecked" />
        </Box>
      </DemoFrame>
    </>
  );
}
