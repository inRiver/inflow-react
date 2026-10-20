import { useState } from 'react';
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

type FieldSize = 'small' | 'medium';

const units = ['kg', 'lb', 'g'];

const groupedFilms = [
  { label: 'Pulp Fiction', decade: '1990s' },
  { label: 'The Shawshank Redemption', decade: '1990s' },
  { label: 'The Godfather', decade: '1970s' },
  { label: 'The Dark Knight', decade: '2000s' },
].sort((a, b) => a.decade.localeCompare(b.decade));

// Icons follow the field: 20px in a small (40px) field, 24px in a medium (56px) field.
const iconSize: Record<FieldSize, string> = { small: '1.25rem', medium: '1.5rem' };

function UnitSelect({ value, onChange, label, size, disabled, divider }: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  size: FieldSize;
  disabled?: boolean;
  divider?: boolean;
}) {
  return (
    <>
      {divider && <Divider orientation="vertical" flexItem sx={{ mr: 1, my: size === 'small' ? 1 : 1.5 }} />}
      <Select
        variant="standard"
        disableUnderline
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        slotProps={{ input: { 'aria-label': label } }}
        size={size}
        sx={{ minWidth: 56, '& .MuiSelect-icon': { fontSize: iconSize[size] } }}
      >
        {units.map((unit) => (
          <MenuItem key={unit} value={unit}>{unit}</MenuItem>
        ))}
      </Select>
    </>
  );
}

function SectionIntro({ title, children }: { title: string; children: string }) {
  return (
    <Stack spacing={0.5} sx={{ mt: 4 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary">{children}</Typography>
    </Stack>
  );
}

export function GroupedInputsDemo() {
  const [props, setProps] = useState<Record<string, any>>({ size: 'small', disabled: false });
  const size: FieldSize = props.size;
  const disabled: boolean = props.disabled;
  const [unitInside, setUnitInside] = useState('kg');
  const [unitInsideDivided, setUnitInsideDivided] = useState('kg');
  const [unitGap, setUnitGap] = useState('kg');
  const [unitJoined, setUnitJoined] = useState('kg');

  const schema: PropSchema[] = [
    { name: 'size', type: 'select', options: ['small', 'medium'] },
    { name: 'disabled', type: 'boolean' },
  ];

  const buttonGroupCode = `
import { Button, ButtonGroup } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<ButtonGroup variant="outlined" size={props.size} disabled={props.disabled}>
  <Button>One</Button>
  <Button>Two</Button>
  <Button>Three</Button>
</ButtonGroup>`;

  return (
    <>
      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <SectionIntro title="Button group">
        Related actions joined into one control. Use it for a small set of peer actions.
      </SectionIntro>
      <DemoFrame title="Button Group">
        <Stack spacing={2} useFlexGap>
          {(['contained', 'outlined', 'text'] as const).map((variant) => (
            <ButtonGroup
              key={variant}
              variant={variant}
              size={size}
              disabled={disabled}
              aria-label={`${variant} button group`}
            >
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
          ))}
        </Stack>
      </DemoFrame>
      <CodeBlock code={buttonGroupCode} language="tsx" />

      <SectionIntro title="Grouped options">
        Long option lists split under headings. Autocomplete uses groupBy, and Select uses ListSubheader.
      </SectionIntro>
      <DemoFrame title="Grouped Options">
        <Stack direction="row" spacing={3} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <Autocomplete
            options={groupedFilms}
            groupBy={(option) => option.decade}
            getOptionLabel={(option) => option.label}
            size={size}
            disabled={disabled}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Movie by decade" />}
          />
          <FormControl size={size} disabled={disabled} sx={{ width: 240 }}>
            <InputLabel id="grouped-select-label">Grouping</InputLabel>
            <Select defaultValue="" labelId="grouped-select-label" label="Grouping">
              <ListSubheader>Category 1</ListSubheader>
              <MenuItem value={1}>Option 1</MenuItem>
              <MenuItem value={2}>Option 2</MenuItem>
              <ListSubheader>Category 2</ListSubheader>
              <MenuItem value={3}>Option 3</MenuItem>
              <MenuItem value={4}>Option 4</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DemoFrame>
      <CodeBlock
        code={`<Autocomplete
  options={options.sort((a, b) => a.decade.localeCompare(b.decade))}
  groupBy={(option) => option.decade}
  renderInput={(params) => <TextField {...params} label="Movie by decade" />}
/>

<Select defaultValue="" label="Grouping">
  <ListSubheader>Category 1</ListSubheader>
  <MenuItem value={1}>Option 1</MenuItem>
  <ListSubheader>Category 2</ListSubheader>
  <MenuItem value={3}>Option 3</MenuItem>
</Select>`}
        language="tsx"
      />

      <SectionIntro title="Number with unit (for review)">
        MUI and Material Design have no combined-field component. These are two ways to pair a number with a unit.
      </SectionIntro>
      <DemoFrame title="Option A - Unit select inside the field (one label, one border, one error state)">
        <Stack direction="row" spacing={3} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <TextField
            size={size}
            disabled={disabled}
            label="Weight"
            type="number"
            defaultValue={10}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <UnitSelect value={unitInside} onChange={setUnitInside} label="Weight unit" size={size} disabled={disabled} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            size={size}
            disabled={disabled}
            label="Weight (with divider)"
            type="number"
            defaultValue={10}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <UnitSelect
                      value={unitInsideDivided}
                      onChange={setUnitInsideDivided}
                      label="Weight unit with divider"
                      size={size}
                      disabled={disabled}
                      divider
                    />
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
        <Stack spacing={3} useFlexGap>
          <Stack direction="row" spacing={1} useFlexGap sx={{ maxWidth: 360 }}>
            <TextField size={size} disabled={disabled} label="Weight" type="number" defaultValue={10} sx={{ flex: 1 }} />
            <FormControl size={size} disabled={disabled} sx={{ minWidth: 100 }}>
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
              size={size}
              disabled={disabled}
              label="Weight (joined)"
              type="number"
              defaultValue={10}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
              }}
            />
            <FormControl
              size={size}
              disabled={disabled}
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
