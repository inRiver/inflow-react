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
  const [props, setProps] = useState<Record<string, any>>({
    size: 'small',
    disabled: false,
    buttonVariant: 'outlined',
    orientation: 'horizontal',
    unitLayout: 'unit inside field',
    divider: false,
    joined: false,
  });
  const size: FieldSize = props.size;
  const disabled: boolean = props.disabled;
  const [unit, setUnit] = useState('kg');
  const insideField = props.unitLayout === 'unit inside field';

  const schema: PropSchema[] = [
    { name: 'size', type: 'select', options: ['small', 'medium'] },
    { name: 'disabled', type: 'boolean' },
    { name: 'buttonVariant', label: 'button group variant', type: 'select', options: ['contained', 'outlined', 'text'] },
    { name: 'orientation', label: 'button group orientation', type: 'select', options: ['horizontal', 'vertical'] },
    { name: 'unitLayout', label: 'number with unit', type: 'select', options: ['unit inside field', 'side by side'] },
    { name: 'divider', label: 'divider (unit inside field)', type: 'boolean' },
    { name: 'joined', label: 'joined borders (side by side)', type: 'boolean' },
  ];

  const buttonGroupCode = `
import { Button, ButtonGroup } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<ButtonGroup variant={props.buttonVariant} orientation={props.orientation} size={props.size} disabled={props.disabled}>
  <Button>One</Button>
  <Button>Two</Button>
  <Button>Three</Button>
</ButtonGroup>`;

  const unitInsideCode = `<TextField
  label="Weight"
  type="number"
  slotProps={{
    input: {
      endAdornment: (
        <InputAdornment position="end">
          ${props.divider ? '<Divider orientation="vertical" flexItem sx={{ mr: 1, my: 1 }} />\n          ' : ''}<Select variant="standard" disableUnderline value={unit} onChange={...}>
            <MenuItem value="kg">kg</MenuItem>
          </Select>
        </InputAdornment>
      ),
    },
  }}
/>`;

  const unitSideBySideCode = `<Stack direction="row" spacing={${props.joined ? 0 : 1}}>
  <TextField label="Weight" type="number" sx={{ flex: 1${props.joined ? ", '& .MuiOutlinedInput-root': { borderTopRightRadius: 0, borderBottomRightRadius: 0 }" : ''} }} />
  <FormControl sx={{ minWidth: 100${props.joined ? ", ml: '-1px', '& .MuiOutlinedInput-root': { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }" : ''} }}>
    <InputLabel id="unit-label">Unit</InputLabel>
    <Select labelId="unit-label" label="Unit" value={unit} onChange={...}>
      <MenuItem value="kg">kg</MenuItem>
    </Select>
  </FormControl>
</Stack>`;

  return (
    <>
      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <SectionIntro title="Button group">
        Related actions joined into one control. Use it for a small set of peer actions.
      </SectionIntro>
      <DemoFrame title="Button Group">
        <ButtonGroup
          variant={props.buttonVariant}
          orientation={props.orientation}
          size={size}
          disabled={disabled}
          aria-label="Button group"
        >
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
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
        MUI and Material Design have no combined-field component. Use "number with unit" in the playground to compare the two options.
      </SectionIntro>
      <DemoFrame title={insideField ? 'Unit select inside the field (one label, one border, one error state)' : 'Side by side (two fields, two labels)'}>
        {insideField ? (
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
                    <UnitSelect
                      value={unit}
                      onChange={setUnit}
                      label="Weight unit"
                      size={size}
                      disabled={disabled}
                      divider={props.divider}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
        ) : (
          <Stack direction="row" spacing={props.joined ? 0 : 1} useFlexGap sx={{ maxWidth: 360 }}>
            <TextField
              size={size}
              disabled={disabled}
              label="Weight"
              type="number"
              defaultValue={10}
              sx={{
                flex: 1,
                ...(props.joined && {
                  '& .MuiOutlinedInput-root': { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
                }),
              }}
            />
            <FormControl
              size={size}
              disabled={disabled}
              sx={{
                minWidth: 100,
                ...(props.joined && {
                  ml: '-1px',
                  '& .MuiOutlinedInput-root': { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
                  '& .Mui-focused': { zIndex: 1 },
                }),
              }}
            >
              <InputLabel id="unit-label">Unit</InputLabel>
              <Select labelId="unit-label" label="Unit" value={unit} onChange={(event) => setUnit(event.target.value)}>
                {units.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        )}
      </DemoFrame>
      <CodeBlock code={insideField ? unitInsideCode : unitSideBySideCode} language="tsx" />
    </>
  );
}
