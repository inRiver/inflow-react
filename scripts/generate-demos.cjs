const fs = require('fs');
const path = require('path');

const demosDir = path.join(__dirname, 'src', 'showcase', 'demos');

if (!fs.existsSync(demosDir)) {
  fs.mkdirSync(demosDir, { recursive: true });
}

const generateFile = (component, config) => {
  const code = `import { useState } from 'react';
import { ${config.imports.join(', ')} } from '@mui/material';
${config.extraImports ? config.extraImports.join('\n') + '\n' : ''}import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground, PropSchema } from '../PropsPlayground';

export function ${component}Demo() {
  const [props, setProps] = useState<Record<string, any>>(${JSON.stringify(config.initialProps, null, 2)});

  const schema: PropSchema[] = ${JSON.stringify(config.schema, null, 2)};

  const codeExample = \`
import { ${component} } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<${component} ${config.codeProps(component)}\n/>\`;

  return (
    <>
      <DemoFrame title="${component} - Interactive">
        ${config.interactiveRender(component)}
      </DemoFrame>

      <PropsPlayground 
        schema={schema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          ${config.statesRender(component)}
        </Stack>
      </DemoFrame>
    </>
  );
}
`;
  fs.writeFileSync(path.join(demosDir, `${component}Demo.tsx`), code);
};

// Define components
const components = [
  {
    name: 'Button',
    imports: ['Button', 'Stack'],
    initialProps: { variant: 'contained', color: 'primary', disabled: false, size: 'medium' },
    schema: [
      { name: 'variant', type: 'select', options: ['text', 'outlined', 'contained'] },
      { name: 'color', type: 'select', options: ['primary', 'secondary', 'error', 'info', 'success', 'warning'] },
      { name: 'size', type: 'select', options: ['small', 'medium', 'large'] },
      { name: 'disabled', type: 'boolean' }
    ],
    codeProps: () => `\n  variant={props.variant}\n  color={props.color}\n  size={props.size}\n  disabled={props.disabled}\n  onClick={() => {}}`,
    interactiveRender: (c) => `<${c} {...props}>Interactive Button</${c}>`,
    statesRender: (c) => `
          <Stack direction="row" spacing={2}>
            <${c} variant="contained">Default</${c}>
            <${c} variant="contained" disabled>Disabled</${c}>
            <${c} variant="contained" color="error">Error</${c}>
            <${c} variant="outlined">Outlined</${c}>
            <${c} variant="text">Text</${c}>
          </Stack>`
  },
  {
    name: 'TextField',
    imports: ['TextField', 'Stack'],
    initialProps: { variant: 'outlined', color: 'primary', disabled: false, error: false, size: 'medium', label: 'Label' },
    schema: [
      { name: 'variant', type: 'select', options: ['outlined', 'filled', 'standard'] },
      { name: 'color', type: 'select', options: ['primary', 'secondary', 'error', 'info', 'success', 'warning'] },
      { name: 'size', type: 'select', options: ['small', 'medium'] },
      { name: 'disabled', type: 'boolean' },
      { name: 'error', type: 'boolean' }
    ],
    codeProps: () => `\n  variant={props.variant}\n  color={props.color}\n  size={props.size}\n  disabled={props.disabled}\n  error={props.error}\n  label="Label"`,
    interactiveRender: (c) => `<${c} {...props} />`,
    statesRender: (c) => `
          <Stack direction="row" spacing={2}>
            <${c} label="Default" />
            <${c} label="Disabled" disabled />
            <${c} label="Error" error helperText="Incorrect entry." />
            <${c} label="Focused" focused />
          </Stack>`
  },
  {
    name: 'Select',
    imports: ['Select', 'MenuItem', 'FormControl', 'InputLabel', 'Stack'],
    initialProps: { variant: 'outlined', disabled: false, error: false, size: 'medium' },
    schema: [
      { name: 'variant', type: 'select', options: ['outlined', 'filled', 'standard'] },
      { name: 'size', type: 'select', options: ['small', 'medium'] },
      { name: 'disabled', type: 'boolean' },
      { name: 'error', type: 'boolean' }
    ],
    codeProps: () => `\n  variant={props.variant}\n  size={props.size}\n  disabled={props.disabled}\n  error={props.error}`,
    interactiveRender: (c) => `
        <FormControl {...props} fullWidth>
          <InputLabel>Age</InputLabel>
          <${c} label="Age" value={10}>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
          </${c}>
        </FormControl>`,
    statesRender: (c) => `
          <Stack direction="row" spacing={2}>
            <FormControl>
              <InputLabel>Default</InputLabel>
              <${c} label="Default" value={10}><MenuItem value={10}>Ten</MenuItem></${c}>
            </FormControl>
            <FormControl disabled>
              <InputLabel>Disabled</InputLabel>
              <${c} label="Disabled" value={10}><MenuItem value={10}>Ten</MenuItem></${c}>
            </FormControl>
            <FormControl error>
              <InputLabel>Error</InputLabel>
              <${c} label="Error" value={10}><MenuItem value={10}>Ten</MenuItem></${c}>
            </FormControl>
          </Stack>`
  },
  {
    name: 'Checkbox',
    imports: ['Checkbox', 'FormControlLabel', 'Stack'],
    initialProps: { color: 'primary', disabled: false, size: 'medium', checked: true, indeterminate: false },
    schema: [
      { name: 'color', type: 'select', options: ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'default'] },
      { name: 'size', type: 'select', options: ['small', 'medium'] },
      { name: 'disabled', type: 'boolean' },
      { name: 'checked', type: 'boolean' },
      { name: 'indeterminate', type: 'boolean' }
    ],
    codeProps: () => `\n  color={props.color}\n  size={props.size}\n  disabled={props.disabled}\n  checked={props.checked}\n  indeterminate={props.indeterminate}`,
    interactiveRender: (c) => `<FormControlLabel control={<${c} {...props} />} label="Label" />`,
    statesRender: (c) => `
          <Stack direction="row" spacing={2}>
            <FormControlLabel control={<${c} checked />} label="Checked" />
            <FormControlLabel control={<${c} />} label="Unchecked" />
            <FormControlLabel control={<${c} indeterminate />} label="Indeterminate" />
            <FormControlLabel control={<${c} checked disabled />} label="Disabled Checked" />
            <FormControlLabel control={<${c} disabled />} label="Disabled Unchecked" />
            <FormControlLabel control={<${c} checked color="error" />} label="Error color" />
          </Stack>`
  },
  {
    name: 'Radio',
    imports: ['Radio', 'RadioGroup', 'FormControlLabel', 'FormControl', 'FormLabel', 'Stack'],
    initialProps: { color: 'primary', disabled: false, size: 'medium' },
    schema: [
      { name: 'color', type: 'select', options: ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'default'] },
      { name: 'size', type: 'select', options: ['small', 'medium'] },
      { name: 'disabled', type: 'boolean' }
    ],
    codeProps: () => `\n  color={props.color}\n  size={props.size}\n  disabled={props.disabled}`,
    interactiveRender: (c) => `
        <FormControl>
          <FormLabel>Gender</FormLabel>
          <RadioGroup defaultValue="female" row>
            <FormControlLabel value="female" control={<${c} {...props} />} label="Female" />
            <FormControlLabel value="male" control={<${c} {...props} />} label="Male" />
          </RadioGroup>
        </FormControl>`,
    statesRender: (c) => `
          <Stack direction="row" spacing={2}>
            <FormControlLabel control={<${c} checked />} label="Checked" />
            <FormControlLabel control={<${c} />} label="Unchecked" />
            <FormControlLabel control={<${c} checked disabled />} label="Disabled Checked" />
            <FormControlLabel control={<${c} disabled />} label="Disabled Unchecked" />
            <FormControlLabel control={<${c} checked color="error" />} label="Error color" />
          </Stack>`
  },
  {
    name: 'Switch',
    imports: ['Switch', 'FormControlLabel', 'Stack'],
    initialProps: { color: 'primary', disabled: false, size: 'medium', checked: true },
    schema: [
      { name: 'color', type: 'select', options: ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'default'] },
      { name: 'size', type: 'select', options: ['small', 'medium'] },
      { name: 'disabled', type: 'boolean' },
      { name: 'checked', type: 'boolean' }
    ],
    codeProps: () => `\n  color={props.color}\n  size={props.size}\n  disabled={props.disabled}\n  checked={props.checked}`,
    interactiveRender: (c) => `<FormControlLabel control={<${c} {...props} />} label="Label" />`,
    statesRender: (c) => `
          <Stack direction="row" spacing={2}>
            <FormControlLabel control={<${c} checked />} label="Checked" />
            <FormControlLabel control={<${c} />} label="Unchecked" />
            <FormControlLabel control={<${c} checked disabled />} label="Disabled Checked" />
            <FormControlLabel control={<${c} disabled />} label="Disabled Unchecked" />
            <FormControlLabel control={<${c} checked color="error" />} label="Error color" />
          </Stack>`
  },
  {
    name: 'Slider',
    imports: ['Slider', 'Box', 'Stack'],
    initialProps: { color: 'primary', disabled: false, size: 'medium', valueLabelDisplay: 'auto' },
    schema: [
      { name: 'color', type: 'select', options: ['primary', 'secondary'] },
      { name: 'size', type: 'select', options: ['small', 'medium'] },
      { name: 'valueLabelDisplay', type: 'select', options: ['on', 'auto', 'off'] },
      { name: 'disabled', type: 'boolean' }
    ],
    codeProps: () => `\n  color={props.color}\n  size={props.size}\n  disabled={props.disabled}\n  valueLabelDisplay={props.valueLabelDisplay}`,
    interactiveRender: (c) => `<Box sx={{ width: 300, px: 2 }}><${c} defaultValue={30} {...props} /></Box>`,
    statesRender: (c) => `
          <Stack spacing={4} sx={{ width: 300, px: 2 }}>
            <${c} defaultValue={30} />
            <${c} defaultValue={30} disabled />
            <${c} defaultValue={30} color="secondary" />
            <${c} defaultValue={[20, 37]} marks />
          </Stack>`
  },
  {
    name: 'Typography',
    imports: ['Typography', 'Stack'],
    initialProps: { variant: 'body1', color: 'text.primary', align: 'inherit' },
    schema: [
      { name: 'variant', type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption', 'button', 'overline'] },
      { name: 'color', type: 'select', options: ['text.primary', 'text.secondary', 'primary', 'secondary', 'error', 'info', 'success', 'warning'] },
      { name: 'align', type: 'select', options: ['inherit', 'left', 'center', 'right', 'justify'] }
    ],
    codeProps: () => `\n  variant={props.variant}\n  color={props.color}\n  align={props.align}`,
    interactiveRender: (c) => `<${c} {...props}>Interactive Typography</${c}>`,
    statesRender: (c) => `
          <Stack spacing={2}>
            <${c} variant="h4">Heading 4</${c}>
            <${c} variant="body1">Body 1</${c}>
            <${c} variant="body2" color="text.secondary">Body 2 Secondary</${c}>
            <${c} variant="caption" color="error">Caption Error</${c}>
            <${c} variant="overline">Overline</${c}>
          </Stack>`
  },
  {
    name: 'Chip',
    imports: ['Chip', 'Stack', 'Avatar'],
    initialProps: { variant: 'filled', color: 'default', disabled: false, size: 'medium', label: 'Chip' },
    schema: [
      { name: 'variant', type: 'select', options: ['filled', 'outlined'] },
      { name: 'color', type: 'select', options: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'] },
      { name: 'size', type: 'select', options: ['small', 'medium'] },
      { name: 'disabled', type: 'boolean' }
    ],
    codeProps: () => `\n  variant={props.variant}\n  color={props.color}\n  size={props.size}\n  disabled={props.disabled}\n  label={props.label}`,
    interactiveRender: (c) => `<${c} {...props} />`,
    statesRender: (c) => `
          <Stack direction="row" spacing={2} alignItems="center">
            <${c} label="Default" />
            <${c} label="Outlined" variant="outlined" />
            <${c} label="Disabled" disabled />
            <${c} label="Clickable" onClick={() => {}} />
            <${c} label="Deletable" onDelete={() => {}} />
            <${c} label="Avatar" avatar={<Avatar>M</Avatar>} />
            <${c} label="Error" color="error" />
          </Stack>`
  },
  {
    name: 'Badge',
    imports: ['Badge', 'Stack', 'Avatar'],
    extraImports: ["import MailIcon from '@mui/icons-material/Mail';"],
    initialProps: { color: 'primary', variant: 'standard', invisible: false, max: 99 },
    schema: [
      { name: 'color', type: 'select', options: ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'default'] },
      { name: 'variant', type: 'select', options: ['standard', 'dot'] },
      { name: 'invisible', type: 'boolean' }
    ],
    codeProps: () => `\n  color={props.color}\n  variant={props.variant}\n  invisible={props.invisible}\n  badgeContent={4}`,
    interactiveRender: (c) => `
        <${c} {...props} badgeContent={4}>
          <MailIcon color="action" />
        </${c}>`,
    statesRender: (c) => `
          <Stack direction="row" spacing={4}>
            <${c} badgeContent={4} color="primary"><MailIcon color="action" /></${c}>
            <${c} badgeContent={100} color="secondary"><MailIcon color="action" /></${c}>
            <${c} variant="dot" color="error"><MailIcon color="action" /></${c}>
            <${c} invisible badgeContent={4}><MailIcon color="action" /></${c}>
          </Stack>`
  },
  {
    name: 'Avatar',
    imports: ['Avatar', 'Stack'],
    extraImports: ["import FolderIcon from '@mui/icons-material/Folder';"],
    initialProps: { variant: 'circular' },
    schema: [
      { name: 'variant', type: 'select', options: ['circular', 'rounded', 'square'] }
    ],
    codeProps: () => `\n  variant={props.variant}`,
    interactiveRender: (c) => `<${c} {...props}>H</${c}>`,
    statesRender: (c) => `
          <Stack direction="row" spacing={2}>
            <${c}>H</${c}>
            <${c} sx={{ bgcolor: 'secondary.main' }}>N</${c}>
            <${c} sx={{ bgcolor: 'error.main' }}><FolderIcon /></${c}>
            <${c} variant="rounded" sx={{ bgcolor: 'success.main' }}>R</${c}>
            <${c} variant="square" sx={{ bgcolor: 'info.main' }}>S</${c}>
          </Stack>`
  },
  {
    name: 'Tooltip',
    imports: ['Tooltip', 'Button', 'Stack'],
    initialProps: { placement: 'bottom', arrow: false },
    schema: [
      { name: 'placement', type: 'select', options: ['top', 'bottom', 'left', 'right'] },
      { name: 'arrow', type: 'boolean' }
    ],
    codeProps: () => `\n  placement={props.placement}\n  arrow={props.arrow}\n  title="Tooltip text"`,
    interactiveRender: (c) => `<${c} {...props} title="Interactive tooltip"><Button>Hover Me</Button></${c}>`,
    statesRender: (c) => `
          <Stack direction="row" spacing={2}>
            <${c} title="Default"><Button>Default</Button></${c}>
            <${c} title="With Arrow" arrow><Button>Arrow</Button></${c}>
            <${c} title="Top" placement="top"><Button>Top</Button></${c}>
            <${c} title="Bottom" placement="bottom"><Button>Bottom</Button></${c}>
          </Stack>`
  },
  {
    name: 'Table',
    imports: ['Table', 'TableBody', 'TableCell', 'TableContainer', 'TableHead', 'TableRow', 'Paper', 'Stack'],
    initialProps: { size: 'medium', padding: 'normal' },
    schema: [
      { name: 'size', type: 'select', options: ['small', 'medium'] },
      { name: 'padding', type: 'select', options: ['normal', 'checkbox', 'none'] }
    ],
    codeProps: () => `\n  size={props.size}\n  padding={props.padding}`,
    interactiveRender: (c) => `
        <TableContainer component={Paper}>
          <${c} {...props}>
            <TableHead>
              <TableRow>
                <TableCell>Dessert</TableCell>
                <TableCell align="right">Calories</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Frozen yoghurt</TableCell>
                <TableCell align="right">159</TableCell>
              </TableRow>
            </TableBody>
          </${c}>
        </TableContainer>`,
    statesRender: (c) => `
          <Stack spacing={4}>
            <TableContainer component={Paper}>
              <${c}>
                <TableHead>
                  <TableRow>
                    <TableCell>Default</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow><TableCell>Data</TableCell></TableRow>
                </TableBody>
              </${c}>
            </TableContainer>
            <TableContainer component={Paper}>
              <${c} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Dense</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow><TableCell>Data</TableCell></TableRow>
                </TableBody>
              </${c}>
            </TableContainer>
          </Stack>`
  },
  {
    name: 'Card',
    imports: ['Card', 'CardActions', 'CardContent', 'Button', 'Typography', 'Stack'],
    initialProps: { variant: 'elevation' },
    schema: [
      { name: 'variant', type: 'select', options: ['elevation', 'outlined'] }
    ],
    codeProps: () => `\n  variant={props.variant}`,
    interactiveRender: (c) => `
        <${c} sx={{ minWidth: 275 }} {...props}>
          <CardContent>
            <Typography variant="h5" component="div">Card Title</Typography>
            <Typography variant="body2">Card content</Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </${c}>`,
    statesRender: (c) => `
          <Stack direction="row" spacing={2}>
            <${c} sx={{ minWidth: 200 }}>
              <CardContent><Typography>Elevation Card</Typography></CardContent>
            </${c}>
            <${c} sx={{ minWidth: 200 }} variant="outlined">
              <CardContent><Typography>Outlined Card</Typography></CardContent>
            </${c}>
            <${c} sx={{ minWidth: 200, bgcolor: 'action.disabledBackground' }}>
              <CardContent><Typography>Disabled-like Card</Typography></CardContent>
            </${c}>
          </Stack>`
  },
  {
    name: 'List',
    imports: ['List', 'ListItem', 'ListItemText', 'ListItemButton', 'ListItemIcon', 'Stack', 'Paper'],
    extraImports: ["import InboxIcon from '@mui/icons-material/Inbox';"],
    initialProps: { dense: false },
    schema: [
      { name: 'dense', type: 'boolean' }
    ],
    codeProps: () => `\n  dense={props.dense}`,
    interactiveRender: (c) => `
        <Paper variant="outlined">
          <${c} {...props}>
            <ListItem>
              <ListItemText primary="Item 1" secondary="Secondary text" />
            </ListItem>
            <ListItemButton>
              <ListItemIcon><InboxIcon /></ListItemIcon>
              <ListItemText primary="Button Item" />
            </ListItemButton>
          </${c}>
        </Paper>`,
    statesRender: (c) => `
          <Stack direction="row" spacing={2}>
            <Paper variant="outlined" sx={{ width: 200 }}>
              <${c}>
                <ListItem><ListItemText primary="Default" /></ListItem>
                <ListItem disabled><ListItemText primary="Disabled" /></ListItem>
                <ListItemButton><ListItemText primary="Hover/Click me" /></ListItemButton>
              </${c}>
            </Paper>
            <Paper variant="outlined" sx={{ width: 200 }}>
              <${c} dense>
                <ListItem><ListItemText primary="Dense Default" /></ListItem>
                <ListItemButton selected><ListItemText primary="Selected" /></ListItemButton>
              </${c}>
            </Paper>
          </Stack>`
  },
  {
    name: 'Accordion',
    imports: ['Accordion', 'AccordionSummary', 'AccordionDetails', 'Typography', 'Stack'],
    extraImports: ["import ExpandMoreIcon from '@mui/icons-material/ExpandMore';"],
    initialProps: { disabled: false, defaultExpanded: false },
    schema: [
      { name: 'disabled', type: 'boolean' },
      { name: 'defaultExpanded', type: 'boolean' }
    ],
    codeProps: () => `\n  disabled={props.disabled}\n  defaultExpanded={props.defaultExpanded}`,
    interactiveRender: (c) => `
        <${c} {...props}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Accordion 1</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Content 1</Typography>
          </AccordionDetails>
        </${c}>`,
    statesRender: (c) => `
          <Stack spacing={1}>
            <${c}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>Default</Typography></AccordionSummary>
              <AccordionDetails><Typography>Content</Typography></AccordionDetails>
            </${c}>
            <${c} disabled>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>Disabled</Typography></AccordionSummary>
              <AccordionDetails><Typography>Content</Typography></AccordionDetails>
            </${c}>
            <${c} expanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>Expanded</Typography></AccordionSummary>
              <AccordionDetails><Typography>Content</Typography></AccordionDetails>
            </${c}>
          </Stack>`
  },
  {
    name: 'Alert',
    imports: ['Alert', 'Stack', 'Button'],
    initialProps: { severity: 'success', variant: 'standard' },
    schema: [
      { name: 'severity', type: 'select', options: ['error', 'warning', 'info', 'success'] },
      { name: 'variant', type: 'select', options: ['standard', 'filled', 'outlined'] }
    ],
    codeProps: () => `\n  severity={props.severity}\n  variant={props.variant}`,
    interactiveRender: (c) => `<${c} {...props}>This is an alert message.</${c}>`,
    statesRender: (c) => `
          <Stack spacing={2}>
            <${c} severity="success">Success alert</${c}>
            <${c} severity="info">Info alert</${c}>
            <${c} severity="warning">Warning alert</${c}>
            <${c} severity="error">Error alert</${c}>
            <${c} severity="error" action={<Button color="inherit" size="small">UNDO</Button>}>Action alert</${c}>
          </Stack>`
  },
  {
    name: 'LinearProgress',
    imports: ['LinearProgress', 'Stack', 'Box'],
    initialProps: { color: 'primary', variant: 'indeterminate' },
    schema: [
      { name: 'color', type: 'select', options: ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'inherit'] },
      { name: 'variant', type: 'select', options: ['determinate', 'indeterminate', 'buffer', 'query'] }
    ],
    codeProps: () => `\n  color={props.color}\n  variant={props.variant}\n  value={50}`,
    interactiveRender: (c) => `<Box sx={{ width: '100%' }}><${c} {...props} value={50} valueBuffer={75} /></Box>`,
    statesRender: (c) => `
          <Stack spacing={4} sx={{ width: '100%' }}>
            <${c} />
            <${c} variant="determinate" value={50} />
            <${c} color="secondary" />
            <${c} color="error" variant="determinate" value={70} />
          </Stack>`
  },
  {
    name: 'CircularProgress',
    imports: ['CircularProgress', 'Stack'],
    initialProps: { color: 'primary', variant: 'indeterminate', size: 40 },
    schema: [
      { name: 'color', type: 'select', options: ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'inherit'] },
      { name: 'variant', type: 'select', options: ['determinate', 'indeterminate'] },
    ],
    codeProps: () => `\n  color={props.color}\n  variant={props.variant}\n  value={50}`,
    interactiveRender: (c) => `<${c} {...props} value={50} />`,
    statesRender: (c) => `
          <Stack direction="row" spacing={4} alignItems="center">
            <${c} />
            <${c} variant="determinate" value={75} />
            <${c} color="secondary" />
            <${c} color="error" />
            <${c} size={20} />
          </Stack>`
  },
  {
    name: 'Snackbar',
    imports: ['Snackbar', 'Button', 'Stack', 'SnackbarContent'],
    initialProps: { anchorOrigin: { vertical: 'bottom', horizontal: 'left' } },
    schema: [], // Complex prop for this basic generator, keeping simple
    codeProps: () => `\n  open={true}\n  message="Note archived"`,
    interactiveRender: (c) => `<SnackbarContent message="Snackbar content preview" action={<Button color="secondary" size="small">UNDO</Button>} />`,
    statesRender: (c) => `
          <Stack spacing={2}>
            <SnackbarContent message="Default snackbar" />
            <SnackbarContent message="With action" action={<Button color="secondary" size="small">UNDO</Button>} />
          </Stack>`
  },
  {
    name: 'Dialog',
    imports: ['Dialog', 'DialogTitle', 'DialogContent', 'DialogContentText', 'DialogActions', 'Button', 'Stack', 'Paper'],
    initialProps: { maxWidth: 'sm', fullWidth: false },
    schema: [
      { name: 'maxWidth', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
      { name: 'fullWidth', type: 'boolean' }
    ],
    codeProps: () => `\n  open={true}\n  maxWidth={props.maxWidth}\n  fullWidth={props.fullWidth}`,
    interactiveRender: (c) => `
        <Paper elevation={24} sx={{ p: 0, m: 2, position: 'relative' }}>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogContent>
            <DialogContentText>Dialog content goes here.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button>Cancel</Button>
            <Button>Agree</Button>
          </DialogActions>
        </Paper>`,
    statesRender: (c) => `
          <Stack spacing={4}>
            <Paper elevation={24}>
              <DialogTitle>Default</DialogTitle>
              <DialogContent><DialogContentText>Simple text</DialogContentText></DialogContent>
              <DialogActions><Button>OK</Button></DialogActions>
            </Paper>
          </Stack>`
  },
  {
    name: 'Skeleton',
    imports: ['Skeleton', 'Stack', 'Box'],
    initialProps: { variant: 'text', animation: 'pulse' },
    schema: [
      { name: 'variant', type: 'select', options: ['text', 'circular', 'rectangular', 'rounded'] },
      { name: 'animation', type: 'select', options: ['pulse', 'wave', 'false'] }
    ],
    codeProps: () => `\n  variant={props.variant}\n  animation={props.animation}`,
    interactiveRender: (c) => `<${c} {...props} width={210} height={props.variant === 'circular' ? 60 : 60} />`,
    statesRender: (c) => `
          <Stack spacing={1}>
            <${c} variant="text" sx={{ fontSize: '1rem' }} />
            <${c} variant="circular" width={40} height={40} />
            <${c} variant="rectangular" width={210} height={60} />
            <${c} variant="rounded" width={210} height={60} />
          </Stack>`
  },
  {
    name: 'Tabs',
    imports: ['Tabs', 'Tab', 'Stack', 'Box'],
    initialProps: { textColor: 'primary', indicatorColor: 'primary', variant: 'standard' },
    schema: [
      { name: 'textColor', type: 'select', options: ['secondary', 'primary', 'inherit'] },
      { name: 'indicatorColor', type: 'select', options: ['secondary', 'primary'] },
      { name: 'variant', type: 'select', options: ['standard', 'scrollable', 'fullWidth'] }
    ],
    codeProps: () => `\n  textColor={props.textColor}\n  indicatorColor={props.indicatorColor}\n  variant={props.variant}`,
    interactiveRender: (c) => `
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <${c} value={0} {...props}>
            <Tab label="Item One" />
            <Tab label="Item Two" />
            <Tab label="Item Three" />
          </${c}>
        </Box>`,
    statesRender: (c) => `
          <Stack spacing={4}>
            <${c} value={0}><Tab label="Active" /><Tab label="Default" /><Tab label="Disabled" disabled /></${c}>
            <${c} value={0} textColor="secondary" indicatorColor="secondary"><Tab label="Secondary" /><Tab label="Two" /></${c}>
          </Stack>`
  },
  {
    name: 'Breadcrumbs',
    imports: ['Breadcrumbs', 'Link', 'Typography', 'Stack'],
    initialProps: { maxItems: 8 },
    schema: [],
    codeProps: () => ``,
    interactiveRender: (c) => `
        <${c} aria-label="breadcrumb" {...props}>
          <Link underline="hover" color="inherit" href="/">Home</Link>
          <Link underline="hover" color="inherit" href="/catalog">Catalog</Link>
          <Typography color="text.primary">Accessories</Typography>
        </${c}>`,
    statesRender: (c) => `
          <Stack spacing={2}>
            <${c}>
              <Link underline="hover" color="inherit" href="/">Home</Link>
              <Typography color="text.primary">Current</Typography>
            </${c}>
            <${c} separator=">">
              <Link underline="hover" color="inherit" href="/">Home</Link>
              <Typography color="text.primary">Custom Separator</Typography>
            </${c}>
          </Stack>`
  },
  {
    name: 'Pagination',
    imports: ['Pagination', 'Stack'],
    initialProps: { color: 'standard', size: 'medium', variant: 'text', shape: 'circular' },
    schema: [
      { name: 'color', type: 'select', options: ['primary', 'secondary', 'standard'] },
      { name: 'size', type: 'select', options: ['small', 'medium', 'large'] },
      { name: 'variant', type: 'select', options: ['text', 'outlined'] },
      { name: 'shape', type: 'select', options: ['circular', 'rounded'] }
    ],
    codeProps: () => `\n  count={10}\n  color={props.color}\n  size={props.size}\n  variant={props.variant}\n  shape={props.shape}`,
    interactiveRender: (c) => `<${c} count={10} {...props} />`,
    statesRender: (c) => `
          <Stack spacing={2}>
            <${c} count={10} />
            <${c} count={10} disabled />
            <${c} count={10} color="primary" />
            <${c} count={10} variant="outlined" shape="rounded" />
          </Stack>`
  },
  {
    name: 'Stepper',
    imports: ['Stepper', 'Step', 'StepLabel', 'Stack', 'Box'],
    initialProps: { alternativeLabel: false, orientation: 'horizontal' },
    schema: [
      { name: 'alternativeLabel', type: 'boolean' },
      { name: 'orientation', type: 'select', options: ['horizontal', 'vertical'] }
    ],
    codeProps: () => `\n  activeStep={1}\n  alternativeLabel={props.alternativeLabel}\n  orientation={props.orientation}`,
    interactiveRender: (c) => `
        <Box sx={{ width: '100%' }}>
          <${c} activeStep={1} {...props}>
            <Step><StepLabel>Step 1</StepLabel></Step>
            <Step><StepLabel>Step 2</StepLabel></Step>
            <Step><StepLabel>Step 3</StepLabel></Step>
          </${c}>
        </Box>`,
    statesRender: (c) => `
          <Stack spacing={4}>
            <${c} activeStep={1}>
              <Step><StepLabel>Completed</StepLabel></Step>
              <Step><StepLabel>Active</StepLabel></Step>
              <Step><StepLabel>Pending</StepLabel></Step>
            </${c}>
            <${c} activeStep={0}>
              <Step><StepLabel error>Error</StepLabel></Step>
            </${c}>
          </Stack>`
  },
  {
    name: 'Menu',
    imports: ['Menu', 'MenuItem', 'Button', 'Stack', 'Paper', 'MenuList'],
    initialProps: {},
    schema: [],
    codeProps: () => ``,
    interactiveRender: (c) => `
        <Paper sx={{ width: 200, maxWidth: '100%' }}>
          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem>My account</MenuItem>
            <MenuItem>Logout</MenuItem>
          </MenuList>
        </Paper>`,
    statesRender: (c) => `
          <Stack direction="row" spacing={4}>
            <Paper>
              <MenuList>
                <MenuItem>Default</MenuItem>
                <MenuItem disabled>Disabled</MenuItem>
                <MenuItem selected>Selected</MenuItem>
              </MenuList>
            </Paper>
          </Stack>`
  },
  {
    name: 'Paper',
    imports: ['Paper', 'Stack', 'Box'],
    initialProps: { elevation: 1, variant: 'elevation', square: false },
    schema: [
      { name: 'elevation', type: 'select', options: [0, 1, 3, 6, 12, 24] },
      { name: 'variant', type: 'select', options: ['elevation', 'outlined'] },
      { name: 'square', type: 'boolean' }
    ],
    codeProps: () => `\n  elevation={props.elevation}\n  variant={props.variant}\n  square={props.square}`,
    interactiveRender: (c) => `
        <${c} {...props} sx={{ p: 2, minHeight: 100 }}>
          Paper content
        </${c}>`,
    statesRender: (c) => `
          <Stack direction="row" spacing={2}>
            <${c} elevation={1} sx={{ p: 2, width: 100 }}>Elevation 1</${c}>
            <${c} elevation={6} sx={{ p: 2, width: 100 }}>Elevation 6</${c}>
            <${c} variant="outlined" sx={{ p: 2, width: 100 }}>Outlined</${c}>
            <${c} square sx={{ p: 2, width: 100 }}>Square</${c}>
          </Stack>`
  },
  {
    name: 'AppBar',
    imports: ['AppBar', 'Toolbar', 'Typography', 'Button', 'IconButton', 'Stack', 'Box'],
    extraImports: ["import MenuIcon from '@mui/icons-material/Menu';"],
    initialProps: { color: 'primary', position: 'static' },
    schema: [
      { name: 'color', type: 'select', options: ['inherit', 'primary', 'secondary', 'default', 'transparent'] },
      { name: 'position', type: 'select', options: ['static', 'fixed', 'absolute', 'sticky', 'relative'] }
    ],
    codeProps: () => `\n  color={props.color}\n  position={props.position}`,
    interactiveRender: (c) => `
        <Box sx={{ flexGrow: 1 }}>
          <${c} {...props}>
            <Toolbar>
              <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                News
              </Typography>
              <Button color="inherit">Login</Button>
            </Toolbar>
          </${c}>
        </Box>`,
    statesRender: (c) => `
          <Stack spacing={4}>
            <${c} position="static">
              <Toolbar><Typography>Primary</Typography></Toolbar>
            </${c}>
            <${c} position="static" color="secondary">
              <Toolbar><Typography>Secondary</Typography></Toolbar>
            </${c}>
            <${c} position="static" color="inherit">
              <Toolbar><Typography>Inherit</Typography></Toolbar>
            </${c}>
          </Stack>`
  },
  {
    name: 'Drawer',
    imports: ['Drawer', 'Button', 'List', 'ListItem', 'ListItemText', 'Box', 'Stack'],
    initialProps: { anchor: 'left', variant: 'permanent' },
    schema: [
      { name: 'anchor', type: 'select', options: ['left', 'right', 'top', 'bottom'] },
      { name: 'variant', type: 'select', options: ['permanent', 'persistent', 'temporary'] }
    ],
    codeProps: () => `\n  anchor={props.anchor}\n  variant={props.variant}\n  open={true}`,
    interactiveRender: (c) => `
        <Box sx={{ position: 'relative', height: 200, border: '1px solid grey', overflow: 'hidden' }}>
          <${c} {...props} sx={{ position: 'absolute', '& .MuiDrawer-paper': { position: 'absolute', width: 120 } }}>
            <List>
              <ListItem><ListItemText primary="Item 1" /></ListItem>
            </List>
          </${c}>
        </Box>`,
    statesRender: (c) => `
          <Stack spacing={2}>
            <Box sx={{ position: 'relative', height: 100, border: '1px solid grey' }}>
               <${c} variant="permanent" sx={{ '& .MuiDrawer-paper': { position: 'absolute', width: 120 } }}>
                 <List><ListItem><ListItemText primary="Permanent" /></ListItem></List>
               </${c}>
            </Box>
          </Stack>`
  },
  {
    name: 'Container',
    imports: ['Container', 'Box', 'Stack'],
    initialProps: { maxWidth: 'sm', disableGutters: false, fixed: false },
    schema: [
      { name: 'maxWidth', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', false] },
      { name: 'disableGutters', type: 'boolean' },
      { name: 'fixed', type: 'boolean' }
    ],
    codeProps: () => `\n  maxWidth={props.maxWidth}\n  disableGutters={props.disableGutters}\n  fixed={props.fixed}`,
    interactiveRender: (c) => `
        <${c} {...props} sx={{ bgcolor: 'cfe8fc', height: '10vh' }}>
          Container Content
        </${c}>`,
    statesRender: (c) => `
          <Stack spacing={2}>
            <${c} maxWidth="sm" sx={{ bgcolor: 'cfe8fc' }}>maxWidth="sm"</${c}>
            <${c} disableGutters sx={{ bgcolor: 'cfe8fc' }}>disableGutters</${c}>
          </Stack>`
  },
  {
    name: 'Grid',
    imports: ['Grid2', 'Box', 'Paper', 'Stack'],
    initialProps: { spacing: 2 },
    schema: [
      { name: 'spacing', type: 'select', options: [0, 1, 2, 3, 4, 8] }
    ],
    codeProps: () => `\n  container\n  spacing={props.spacing}`,
    interactiveRender: (c) => `
        <Box sx={{ flexGrow: 1 }}>
          <Grid2 container spacing={props.spacing}>
            <Grid2 size={8}><Paper sx={{p:2}}>xs=8</Paper></Grid2>
            <Grid2 size={4}><Paper sx={{p:2}}>xs=4</Paper></Grid2>
            <Grid2 size={4}><Paper sx={{p:2}}>xs=4</Paper></Grid2>
            <Grid2 size={8}><Paper sx={{p:2}}>xs=8</Paper></Grid2>
          </Grid2>
        </Box>`,
    statesRender: (c) => `
          <Stack spacing={4}>
             <Grid2 container spacing={2}>
               <Grid2 size={6}><Paper sx={{p:2}}>Half</Paper></Grid2>
               <Grid2 size={6}><Paper sx={{p:2}}>Half</Paper></Grid2>
             </Grid2>
          </Stack>`
  },
  {
    name: 'Stack',
    imports: ['Stack', 'Paper', 'Box'],
    initialProps: { direction: 'row', spacing: 2 },
    schema: [
      { name: 'direction', type: 'select', options: ['row', 'row-reverse', 'column', 'column-reverse'] },
      { name: 'spacing', type: 'select', options: [0, 1, 2, 3, 4, 8] }
    ],
    codeProps: () => `\n  direction={props.direction}\n  spacing={props.spacing}`,
    interactiveRender: (c) => `
        <${c} {...props}>
          <Paper sx={{p:2}}>Item 1</Paper>
          <Paper sx={{p:2}}>Item 2</Paper>
          <Paper sx={{p:2}}>Item 3</Paper>
        </${c}>`,
    statesRender: (c) => `
          <Box>
            <${c} direction="row" spacing={2} sx={{ mb: 4 }}>
              <Paper sx={{p:2}}>Row</Paper>
              <Paper sx={{p:2}}>Row</Paper>
            </${c}>
            <${c} direction="column" spacing={2}>
              <Paper sx={{p:2}}>Column</Paper>
              <Paper sx={{p:2}}>Column</Paper>
            </${c}>
          </Box>`
  }
];

components.forEach(config => generateFile(config.name, config));

const indexExports = components.map(c => `export { ${c.name}Demo } from './${c.name}Demo';`).join('\n') + '\n';
fs.writeFileSync(path.join(demosDir, 'index.ts'), indexExports);

console.log('Successfully generated 33 MUI demos!');
