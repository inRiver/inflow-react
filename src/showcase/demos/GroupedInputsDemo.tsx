import { useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
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

const units = ['kg', 'lb', 'g'];

const groupedFilms = [
  { label: 'Pulp Fiction', decade: '1990s' },
  { label: 'The Shawshank Redemption', decade: '1990s' },
  { label: 'The Godfather', decade: '1970s' },
  { label: 'The Dark Knight', decade: '2000s' },
].sort((a, b) => a.decade.localeCompare(b.decade));

// Compact controls rendered inside each example's frame, so a setting sits next to the UI it changes.
function ControlBar({ schema, values, onChange, idPrefix }: {
  schema: PropSchema[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  idPrefix: string;
}) {
  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'flex-start' }}>
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
const unitSchema: PropSchema[] = [sizeControl, disabledControl];

const splitOptions = [
  'even',
  'first wider (2:1)',
  'first much wider (3:1)',
  'last wider (1:2)',
  'last much wider (1:3)',
  'first narrower',
  'last narrower',
  'middle wider',
  'ends wider',
];
const contentOptions = ['all inputs', 'all dropdowns', 'last is a dropdown', 'first is a dropdown', 'alternate'];

const separatorOptions = ['icon', 'word', 'none'];

// One separator control per gap between fields, so each can differ or be removed.
const fieldRowSchema = (count: number): PropSchema[] => [
  sizeControl,
  { name: 'fields', label: 'fields', type: 'select', options: ['2', '3', '4', '5'] },
  ...Array.from({ length: count - 1 }, (_, i): PropSchema => ({
    name: `separator${i + 1}`,
    label: `separator ${i + 1}`,
    type: 'select',
    options: separatorOptions,
  })),
  { name: 'split', type: 'select', options: splitOptions },
  { name: 'content', type: 'select', options: contentOptions },
  { name: 'showWidths', label: 'show widths', type: 'boolean' },
  disabledControl,
];

// Relative weights per split; fields share the row width (minus separators) in these ratios.
function fieldWeights(count: number, split: string): number[] {
  const last = count - 1;
  const weight = (i: number): number => {
    switch (split) {
      case 'first wider (2:1)': return i === 0 ? 2 : 1;
      case 'first much wider (3:1)': return i === 0 ? 3 : 1;
      case 'last wider (1:2)': return i === last ? 2 : 1;
      case 'last much wider (1:3)': return i === last ? 3 : 1;
      case 'first narrower': return i === 0 ? 1 : 2;
      case 'last narrower': return i === last ? 1 : 2;
      case 'middle wider': return i > 0 && i < last ? 2 : 1;
      case 'ends wider': return i === 0 || i === last ? 2 : 1;
      default: return 1;
    }
  };
  return Array.from({ length: count }, (_, i) => weight(i));
}

function isDropdown(index: number, count: number, content: string): boolean {
  switch (content) {
    case 'all dropdowns': return true;
    case 'last is a dropdown': return index === count - 1;
    case 'first is a dropdown': return index === 0;
    case 'alternate': return index % 2 === 1;
    default: return false;
  }
}

const dropdownOptions = ['Option 1', 'Option 2', 'Option 3'];

const fieldLabels = ['Min', 'Max', 'Step', 'Unit', 'Extra'];

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
  const [unitField, setUnitField] = useState<Record<string, any>>({ size: 'small', disabled: false });
  const [fieldRow, setFieldRow] = useState<Record<string, any>>({
    size: 'small',
    fields: '2',
    separator1: 'icon',
    separator2: 'icon',
    separator3: 'icon',
    separator4: 'icon',
    split: 'even',
    content: 'all inputs',
    showWidths: true,
    disabled: false,
  });
  const [unit, setUnit] = useState('kg');
  const count = Number(fieldRow.fields);
  const weights = fieldWeights(count, fieldRow.split);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const fieldRowCode = `<Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center' }}>
  <TextField label="Min" type="number" sx={{ flex: ${weights[0]}, minWidth: 0 }} />
  ${fieldRow.separator1 === 'word' ? '<Typography color="text.secondary">to</Typography>' : fieldRow.separator1 === 'icon' ? '<ArrowForwardIcon fontSize="small" color="action" />' : '{/* no separator between these fields */}'}
  <TextField label="Max" type="number" sx={{ flex: ${weights[1]}, minWidth: 0 }} />
  {/* each gap between fields has its own separator: an icon, a word, or none */}
  {/* up to 5 fields: flex is the width ratio, so equal flex values split the row evenly */}
  {/* a dropdown field is <TextField select label="Unit" defaultValue="Option 1"><MenuItem .../></TextField> */}
</Stack>`;

  const buttonGroupCode = `
import { Button, ButtonGroup } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<ButtonGroup variant={variant} orientation={orientation} size={size} disabled={disabled}>
  <Button>One</Button>
  <Button>Two</Button>
  <Button>Three</Button>
</ButtonGroup>`;

  const unitCode = `<Stack direction="row" useFlexGap>
  <TextField
    label="Weight"
    type="number"
    sx={{ flex: 1, minWidth: 0, '& .MuiOutlinedInput-root': { borderTopRightRadius: 0, borderBottomRightRadius: 0 } }}
  />
  <FormControl
    sx={{
      minWidth: 100,
      ml: '-1px',
      '& .MuiOutlinedInput-root': { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
      '& .Mui-focused': { zIndex: 1 },
    }}
  >
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
            renderInput={(params) => <TextField {...params} label="Movie by decade" size={groupedOptions.size} />}
          />
          <FormControl size={groupedOptions.size} disabled={groupedOptions.disabled} sx={{ width: 240 }}>
            <InputLabel id="grouped-select-label">Grouping</InputLabel>
            <Select defaultValue="" labelId="grouped-select-label" label="Grouping" size={groupedOptions.size}>
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
  renderInput={(params) => <TextField {...params} label="Movie by decade" size={size} />}
/>

<Select defaultValue="" label="Grouping" size={size}>
  <ListSubheader>Category 1</ListSubheader>
  <MenuItem value={1}>Option 1</MenuItem>
  <ListSubheader>Category 2</ListSubheader>
  <MenuItem value={3}>Option 3</MenuItem>
</Select>`}
        language="tsx"
      />

      <SectionIntro title="Number with unit">
        MUI and Material Design have no combined-field component. Pair a number field and a unit select side by side with joined borders. The pair stays on one row at every width: the number field shrinks and the unit keeps its width.
      </SectionIntro>
      <DemoFrame title="Number with unit">
        <ControlBar schema={unitSchema} values={unitField} onChange={setUnitField} idPrefix="unit-field" />
        <Stack direction="row" useFlexGap sx={{ width: '100%', maxWidth: 360 }}>
          <TextField
            size={unitField.size}
            disabled={unitField.disabled}
            label="Weight"
            type="number"
            defaultValue={10}
            sx={{
              flex: 1,
              minWidth: 0,
              '& .MuiOutlinedInput-root': { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
            }}
          />
          <FormControl
            size={unitField.size}
            disabled={unitField.disabled}
            sx={{
              minWidth: 100,
              ml: '-1px',
              '& .MuiOutlinedInput-root': { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
              '& .Mui-focused': { zIndex: 1 },
            }}
          >
            <InputLabel id="unit-label">Unit</InputLabel>
            <Select
              labelId="unit-label"
              label="Unit"
              size={unitField.size}
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
            >
              {units.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DemoFrame>
      <CodeBlock code={unitCode} language="tsx" />

      <SectionIntro title="Field group (range and multi-field rows)">
        Two to five related fields in one row, with an icon, a word, or nothing between each pair, such as min and max. Each separator is set on its own. Fields share the row by flex ratio, so equal values split it evenly and 2:1 makes one field twice as wide. Separators take only the space they need. Use up to five. When the container is too narrow (about 100px per field), the row stacks into one column and the separator turns downward.
      </SectionIntro>
      <DemoFrame title="Field group">
        <ControlBar schema={fieldRowSchema(count)} values={fieldRow} onChange={setFieldRow} idPrefix="field-row" />
        {/* Stacks by the width of its own container (about 100px per field), not the screen, so it also works in narrow panels. */}
        <Box sx={{ width: '100%', maxWidth: 640, containerType: 'inline-size' }}>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              alignItems: 'center',
              mb: fieldRow.showWidths ? 3 : 0,
              [`@container (max-width: ${count * 100}px)`]: { flexDirection: 'column', alignItems: 'stretch', rowGap: fieldRow.showWidths ? 3 : 1 },
            }}
          >
            {weights.map((weight, index) => (
              <Box key={index} sx={{ display: 'contents' }}>
                {index > 0 && fieldRow[`separator${index}`] !== 'none' && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      alignSelf: 'center',
                      color: 'text.secondary',
                      [`@container (max-width: ${count * 100}px)`]: { transform: 'rotate(90deg)' },
                    }}
                  >
                    {fieldRow[`separator${index}`] === 'icon' ? <ArrowForwardIcon fontSize="small" aria-hidden /> : <Typography variant="body2" color="text.secondary">to</Typography>}
                  </Box>
                )}
                <Box sx={{ position: 'relative', flex: weight, minWidth: 0, [`@container (max-width: ${count * 100}px)`]: { flex: 'none' } }}>
                  <TextField
                    fullWidth
                    select={isDropdown(index, count, fieldRow.content)}
                    size={fieldRow.size}
                    disabled={fieldRow.disabled}
                    label={fieldLabels[index]}
                    type={isDropdown(index, count, fieldRow.content) ? undefined : 'number'}
                    defaultValue={isDropdown(index, count, fieldRow.content) ? dropdownOptions[0] : index * 10}
                    slotProps={{ select: { size: fieldRow.size } }}
                  >
                    {dropdownOptions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </TextField>
                  {fieldRow.showWidths && (
                    <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', top: '100%', left: 0, right: 0, textAlign: 'center', mt: 0.5 }}>
                      {Math.round((weight / totalWeight) * 100)}%
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </DemoFrame>
      <CodeBlock code={fieldRowCode} language="tsx" />
    </>
  );
}
