import { useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
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

// Compact controls rendered inside each example's frame, so a setting sits next to the UI it changes.
function ControlBar({ schema, values, onChange, idPrefix }: {
  schema: PropSchema[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  idPrefix: string;
}) {
  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
        {schema.map(({ name, label = name, type, options }) =>
          type === 'boolean' ? (
            <FormControlLabel
              key={name}
              label={label}
              control={
                <Checkbox
                  checked={!!values[name]}
                  onChange={(event) => onChange({ ...values, [name]: event.target.checked })}
                />
              }
            />
          ) : (
            <FormControl key={name} size="small" sx={{ minWidth: 160 }}>
              <InputLabel id={`${idPrefix}-${name}-label`}>{label}</InputLabel>
              <Select
                labelId={`${idPrefix}-${name}-label`}
                label={label}
                value={values[name]}
                onChange={(event) => onChange({ ...values, [name]: event.target.value })}
              >
                {options?.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ),
        )}
      </Box>
      <Divider sx={{ my: 3 }} />
    </>
  );
}

const sizeControl: PropSchema = { name: 'size', type: 'select', options: ['small', 'medium'] };
const disabledControl: PropSchema = { name: 'disabled', type: 'boolean' };

const buttonGroupSchema: PropSchema[] = [
  sizeControl,
  { name: 'variant', type: 'select', options: ['contained', 'outlined', 'text'] },
  { name: 'orientation', type: 'select', options: ['horizontal', 'vertical'] },
  disabledControl,
];
const groupedOptionsSchema: PropSchema[] = [sizeControl, disabledControl];
const unitSchema: PropSchema[] = [
  sizeControl,
  { name: 'layout', type: 'select', options: ['unit inside field', 'side by side'] },
  { name: 'divider', label: 'divider (unit inside field)', type: 'boolean' },
  { name: 'joined', label: 'joined borders (side by side)', type: 'boolean' },
  disabledControl,
];

function SectionIntro({ title, children }: { title: string; children: string }) {
  return (
    <Stack spacing={0.5} sx={{ mt: 4 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary">{children}</Typography>
    </Stack>
  );
}

export function GroupedInputsDemo() {
  const [buttonGroup, setButtonGroup] = useState<Record<string, any>>({
    size: 'small',
    variant: 'outlined',
    orientation: 'horizontal',
    disabled: false,
  });
  const [groupedOptions, setGroupedOptions] = useState<Record<string, any>>({ size: 'small', disabled: false });
  const [unitField, setUnitField] = useState<Record<string, any>>({
    size: 'small',
    layout: 'unit inside field',
    divider: false,
    joined: false,
    disabled: false,
  });
  const [unit, setUnit] = useState('kg');
  const insideField = unitField.layout === 'unit inside field';

  const buttonGroupCode = `
import { Button, ButtonGroup } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<ButtonGroup variant={variant} orientation={orientation} size={size} disabled={disabled}>
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
          ${unitField.divider ? '<Divider orientation="vertical" flexItem sx={{ mr: 1, my: 1 }} />\n          ' : ''}<Select variant="standard" disableUnderline value={unit} onChange={...}>
            <MenuItem value="kg">kg</MenuItem>
          </Select>
        </InputAdornment>
      ),
    },
  }}
/>`;

  const unitSideBySideCode = `<Stack direction="row" spacing={${unitField.joined ? 0 : 1}}>
  <TextField label="Weight" type="number" sx={{ flex: 1${unitField.joined ? ", '& .MuiOutlinedInput-root': { borderTopRightRadius: 0, borderBottomRightRadius: 0 }" : ''} }} />
  <FormControl sx={{ minWidth: 100${unitField.joined ? ", ml: '-1px', '& .MuiOutlinedInput-root': { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }" : ''} }}>
    <InputLabel id="unit-label">Unit</InputLabel>
    <Select labelId="unit-label" label="Unit" value={unit} onChange={...}>
      <MenuItem value="kg">kg</MenuItem>
    </Select>
  </FormControl>
</Stack>`;

  return (
    <>
      <SectionIntro title="Button group">
        Related actions joined into one control. Use it for a small set of peer actions. Small is the Inflow default size; medium is MUI's stock size.
      </SectionIntro>
      <DemoFrame title="Button Group">
        <ControlBar schema={buttonGroupSchema} values={buttonGroup} onChange={setButtonGroup} idPrefix="button-group" />
        <ButtonGroup
          variant={buttonGroup.variant}
          orientation={buttonGroup.orientation}
          size={buttonGroup.size}
          disabled={buttonGroup.disabled}
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
        <ControlBar schema={groupedOptionsSchema} values={groupedOptions} onChange={setGroupedOptions} idPrefix="grouped-options" />
        <Stack direction="row" spacing={3} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <Autocomplete
            options={groupedFilms}
            groupBy={(option) => option.decade}
            getOptionLabel={(option) => option.label}
            size={groupedOptions.size}
            disabled={groupedOptions.disabled}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Movie by decade" />}
          />
          <FormControl size={groupedOptions.size} disabled={groupedOptions.disabled} sx={{ width: 240 }}>
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
        MUI and Material Design have no combined-field component. Use the controls above the example to compare the two options.
      </SectionIntro>
      <DemoFrame title={insideField ? 'Unit select inside the field (one label, one border, one error state)' : 'Side by side (two fields, two labels)'}>
        <ControlBar schema={unitSchema} values={unitField} onChange={setUnitField} idPrefix="unit-field" />
        {insideField ? (
          <TextField
            size={unitField.size}
            disabled={unitField.disabled}
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
                      size={unitField.size}
                      disabled={unitField.disabled}
                      divider={unitField.divider}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
        ) : (
          <Stack direction="row" spacing={unitField.joined ? 0 : 1} useFlexGap sx={{ maxWidth: 360 }}>
            <TextField
              size={unitField.size}
              disabled={unitField.disabled}
              label="Weight"
              type="number"
              defaultValue={10}
              sx={{
                flex: 1,
                ...(unitField.joined && {
                  '& .MuiOutlinedInput-root': { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
                }),
              }}
            />
            <FormControl
              size={unitField.size}
              disabled={unitField.disabled}
              sx={{
                minWidth: 100,
                ...(unitField.joined && {
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
