import { useState } from 'react';
import { AccountCircle, Visibility } from '@mui/icons-material';
import { Divider, FormControl, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

const units = ['kg', 'lb', 'g'];

function UnitSelect({ value, onChange, label, divider }: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  divider?: boolean;
}) {
  return (
    <>
      {divider && <Divider orientation="vertical" flexItem sx={{ mr: 1, my: 1 }} />}
      <Select
        variant="standard"
        disableUnderline
        value={value}
        onChange={(event) => onChange(event.target.value)}
        slotProps={{ input: { 'aria-label': label } }}
        sx={{ minWidth: 56 }}
      >
        {units.map((unit) => (
          <MenuItem key={unit} value={unit}>{unit}</MenuItem>
        ))}
      </Select>
    </>
  );
}

export function InputAdornmentDemo() {
  const [unitInside, setUnitInside] = useState('kg');
  const [unitInsideDivided, setUnitInsideDivided] = useState('kg');
  const [unitGap, setUnitGap] = useState('kg');
  const [unitJoined, setUnitJoined] = useState('kg');
  const [props, setProps] = useState<Record<string, any>>({
    disabled: false,
    variant: 'outlined',
  });

  const schema: PropSchema[] = [
    {
      name: 'disabled',
      type: 'boolean',
    },
    {
      name: 'variant',
      type: 'select',
      options: ['outlined', 'filled', 'standard'],
    },
  ];

  const codeExample = `
import { InputAdornment, TextField } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<TextField
  variant={props.variant}
  disabled={props.disabled}
  InputProps={{
    startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment>
  }}
/>`;

  return (
    <>
      <DemoFrame title="Input Adornment - Interactive">
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <TextField
            label="Username"
            variant={props.variant}
            disabled={props.disabled}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant={props.variant}
            disabled={props.disabled}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Visibility />
                  </InputAdornment>
                ),
              },

              inputLabel: { shrink: true }
            }} />
        </Stack>
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
            <TextField
              label="Username"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }
              }}
            />
            <TextField
              label="Password"
              type="password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Visibility />
                    </InputAdornment>
                  ),
                },

                inputLabel: { shrink: true }
              }} />
            <TextField
              disabled
              label="Disabled"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }
              }}
            />
          </Stack>
        </Stack>
      </DemoFrame>

      <Typography variant="h6" sx={{ mt: 4 }}>Combined fields (for review)</Typography>
      <Typography variant="body2" color="text.secondary">
        MUI and Material Design have no combined-field component. These are two ways to pair a number with a unit.
      </Typography>

      <DemoFrame title="Option A - Unit select inside the field (one label, one border, one error state)">
        <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
          <TextField
            label="Weight"
            type="number"
            defaultValue={10}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <UnitSelect value={unitInside} onChange={setUnitInside} label="Weight unit" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label="Weight (with divider)"
            type="number"
            defaultValue={10}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <UnitSelect value={unitInsideDivided} onChange={setUnitInsideDivided} label="Weight unit with divider" divider />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
      </DemoFrame>

      <CodeBlock
        code={`<TextField
  label="Weight"
  type="number"
  slotProps={{
    input: {
      endAdornment: (
        <InputAdornment position="end">
          <Select variant="standard" disableUnderline value={unit} onChange={...}>
            <MenuItem value="kg">kg</MenuItem>
          </Select>
        </InputAdornment>
      ),
    },
  }}
/>`}
        language="tsx"
      />

      <DemoFrame title="Option B - Side by side (two fields, two labels)">
        <Stack spacing={3}>
          <Stack direction="row" spacing={1} sx={{ maxWidth: 360 }}>
            <TextField label="Weight" type="number" defaultValue={10} sx={{ flex: 1 }} />
            <FormControl sx={{ minWidth: 100 }}>
              <InputLabel id="unit-gap-label">Unit</InputLabel>
              <Select labelId="unit-gap-label" label="Unit" value={unitGap} onChange={(event) => setUnitGap(event.target.value)}>
                {units.map((unit) => (
                  <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" sx={{ maxWidth: 360 }}>
            <TextField
              label="Weight (joined)"
              type="number"
              defaultValue={10}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
              }}
            />
            <FormControl
              sx={{
                minWidth: 100,
                ml: '-1px',
                '& .MuiOutlinedInput-root': { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
                '& .Mui-focused': { zIndex: 1 },
              }}
            >
              <InputLabel id="unit-joined-label">Unit (joined)</InputLabel>
              <Select labelId="unit-joined-label" label="Unit (joined)" value={unitJoined} onChange={(event) => setUnitJoined(event.target.value)}>
                {units.map((unit) => (
                  <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </DemoFrame>

      <CodeBlock
        code={`<Stack direction="row" spacing={1}>
  <TextField label="Weight" type="number" sx={{ flex: 1 }} />
  <FormControl sx={{ minWidth: 100 }}>
    <InputLabel id="unit-label">Unit</InputLabel>
    <Select labelId="unit-label" label="Unit" value={unit} onChange={...}>
      <MenuItem value="kg">kg</MenuItem>
    </Select>
  </FormControl>
</Stack>`}
        language="tsx"
      />
    </>
  );
}
