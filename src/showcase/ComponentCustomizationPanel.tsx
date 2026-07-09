import { Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { CodeBlock } from './CodeBlock';
import { getComponentLabel } from './categories';

interface CustomizationMeta {
  importName: string;
  themeKey?: string;
  slotSelector?: string;
  stateClass?: string;
  stateSelector?: string;
  note?: string;
  supportsClasses?: boolean;
  supportsVariants?: boolean;
  /**
   * Compact icon-only controls (checkbox/radio/switch) have no natural
   * background surface of their own — filling the bare root with a solid
   * color looks like a broken square behind the icon rather than a
   * deliberate customization. When true, the "Background" preview applies a
   * small rounded highlight by default instead of a raw edge-to-edge fill.
   */
  isCompactControl?: boolean;
  example: string;
}

export type CustomizationMethodId = 'sx' | 'classes' | 'styled' | 'globalStyles' | 'theme';

export type CustomizationValuesByMethod = Partial<Record<CustomizationMethodId, Record<string, unknown>>>;

interface CustomizationMethod {
  id: CustomizationMethodId;
  label: string;
  description: string;
  controls: CustomizationControl[];
}

export interface CustomizationControl {
  name: string;
  type: 'select' | 'color';
  options?: string[];
  label?: string;
}

interface ComponentCustomizationPanelProps {
  componentId: string;
}

type PreviewRule = Record<string, string | number>;
type PreviewStyles = Record<string, PreviewRule>;

const metaOverrides: Record<string, Partial<CustomizationMeta>> = {
  textfield: {
    importName: 'TextField',
    themeKey: 'MuiTextField',
    slotSelector: '.MuiOutlinedInput-root',
    stateClass: '.Mui-focused',
    stateSelector: '.ProductTextField .MuiOutlinedInput-root.Mui-focused',
    note: 'This showcase uses MUI TextField slots, so customize the outlined input slot rather than a wrapper-only surface.',
    supportsVariants: true,
    example: '<TextField label="Product name" />',
  },
  button: { supportsVariants: true, stateClass: '.Mui-disabled' },
  select: { supportsVariants: true },
  chip: { supportsVariants: true },
  card: { supportsVariants: true },
  paper: { supportsVariants: true },
  alert: { supportsVariants: true },
  checkbox: { stateClass: '.Mui-checked', isCompactControl: true },
  radio: { stateClass: '.Mui-checked', isCompactControl: true },
  switch: { stateClass: '.Mui-checked', isCompactControl: true },
  checkboxgroup: {
    importName: 'FormGroup',
    themeKey: 'MuiFormGroup',
    slotSelector: '.MuiFormControlLabel-label',
    example: '<FormGroup row />',
  },
  radiogroup: {
    importName: 'RadioGroup',
    themeKey: 'MuiRadioGroup',
    slotSelector: '.MuiFormControlLabel-label',
    example: '<RadioGroup row />',
  },
  linearprogress: { importName: 'LinearProgress', themeKey: 'MuiLinearProgress' },
  circularprogress: { importName: 'CircularProgress', themeKey: 'MuiCircularProgress' },
  bottomnavigation: { importName: 'BottomNavigation', themeKey: 'MuiBottomNavigation' },
  speeddial: { importName: 'SpeedDial', themeKey: 'MuiSpeedDial' },
  togglebutton: { importName: 'ToggleButton', themeKey: 'MuiToggleButton', stateClass: '.Mui-selected' },
  formcontrol: { importName: 'FormControl', themeKey: 'MuiFormControl' },
  inputadornment: { importName: 'InputAdornment', themeKey: 'MuiInputAdornment' },
  imagelist: { importName: 'ImageList', themeKey: 'MuiImageList' },
  appbar: { importName: 'AppBar', themeKey: 'MuiAppBar' },
  fab: { importName: 'Fab', themeKey: 'MuiFab' },
  typographyvariants: { importName: 'Typography', themeKey: 'MuiTypography' },
  datepicker: {
    importName: 'TextField',
    themeKey: 'MuiTextField',
    slotSelector: '.MuiOutlinedInput-root',
    stateClass: '.Mui-focused',
    stateSelector: '.ProductTextField .MuiOutlinedInput-root.Mui-focused',
    note: 'This page is a native MUI TextField date input, not an MUI X picker. Customize TextField and its input slots here.',
    supportsVariants: true,
    example: '<TextField type="date" label="Date" InputLabelProps={{ shrink: true }} />',
  },
  timepicker: {
    importName: 'TextField',
    themeKey: 'MuiTextField',
    slotSelector: '.MuiOutlinedInput-root',
    stateClass: '.Mui-focused',
    stateSelector: '.ProductTextField .MuiOutlinedInput-root.Mui-focused',
    note: 'This page is a native MUI TextField time input, not an MUI X picker. Customize TextField and its input slots here.',
    supportsVariants: true,
    example: '<TextField type="time" label="Time" InputLabelProps={{ shrink: true }} />',
  },
  box: { importName: 'Box', themeKey: undefined, supportsClasses: false },
  stack: { importName: 'Stack', themeKey: 'MuiStack', supportsClasses: false },
  grid: { importName: 'Grid', themeKey: 'MuiGrid', supportsClasses: false },
};

const toPascalCase = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('');

const getMeta = (componentId: string): CustomizationMeta => {
  const label = getComponentLabel(componentId);
  const importName = toPascalCase(label);
  const base: CustomizationMeta = {
    importName,
    themeKey: `Mui${importName}`,
    supportsClasses: true,
    supportsVariants: false,
    example: `<${importName} />`,
  };

  return { ...base, ...metaOverrides[componentId] };
};

const getThemeStyleKey = (meta: CustomizationMeta) =>
  meta.themeKey === 'MuiTextField' && meta.slotSelector === '.MuiOutlinedInput-root'
    ? 'MuiOutlinedInput'
    : meta.themeKey;

const getSelectedValue = (values: Record<string, unknown> | undefined, key: string): string | undefined => {
  const value = values?.[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
};

const resolveThemeToken = (theme: Theme, value: string) => {
  const tokens: Record<string, string> = {
    'background.paper': theme.palette.background.paper,
    'primary.main': theme.palette.primary.main,
    'secondary.main': theme.palette.secondary.main,
    'text.primary': theme.palette.text.primary,
    'text.secondary': theme.palette.text.secondary,
    'theme.palette.divider': theme.palette.divider,
    'theme.palette.primary.main': theme.palette.primary.main,
    'theme.palette.secondary.main': theme.palette.secondary.main,
    transparent: 'transparent',
  };

  return tokens[value] ?? value;
};

const toRootSelector = (meta: CustomizationMeta) => {
  const themeStyleKey = getThemeStyleKey(meta);
  if (!themeStyleKey) {
    return '.ComponentCustomizationPreviewScope > .MuiPaper-root:first-of-type > *';
  }

  return `.ComponentCustomizationPreviewScope > .MuiPaper-root:first-of-type .${themeStyleKey}-root`;
};

const effectToRule = (effect: string): PreviewRule => {
  if (effect.startsWith('opacity')) {
    return { opacity: 0.72 };
  }

  if (effect.startsWith('filter')) {
    return { filter: 'saturate(0.8)' };
  }

  if (effect.startsWith('border-radius')) {
    return { borderRadius: 8 };
  }

  if (effect.startsWith('box-shadow')) {
    return { boxShadow: '0 0 0 1px currentColor' };
  }

  return { outline: effect.includes('2px') ? '2px solid currentColor' : '1px solid currentColor' };
};

export const getCustomizationPreviewStyles = (
  componentId: string,
  activeMethod: CustomizationMethodId,
  valuesByMethod: CustomizationValuesByMethod,
  theme: Theme,
): PreviewStyles => {
  const meta = getMeta(componentId);
  const rootSelector = toRootSelector(meta);
  const activeValues = valuesByMethod[activeMethod];
  const styles: PreviewStyles = {};

  // Every branch below only writes a CSS property once the visitor has explicitly
  // picked a value for the matching control. Falling back to a "representative"
  // value (e.g. background.paper) even before any interaction used to overwrite the
  // live preview's real theme styling (e.g. an invisible white-on-white contained
  // Button, or an unstyled Chip) on first load of every component page. Leaving a
  // control untouched must always mean "no override" so the preview matches the
  // component's real default rendering until the user opts into customizing it.

  if (activeMethod === 'sx') {
    const borderRadius = getSelectedValue(activeValues, 'borderRadius');
    const backgroundColor = getSelectedValue(activeValues, 'backgroundColor');
    const padding = getSelectedValue(activeValues, 'padding');
    const rule: PreviewRule = {};

    // Compact icon-only controls (checkbox/radio/switch) have no natural
    // background surface — apply a small rounded highlight by default so a
    // chosen background reads as intentional rather than a broken square.
    // Explicit borderRadius/padding picks below always take precedence.
    if (backgroundColor !== undefined && meta.isCompactControl) {
      rule.borderRadius = theme.shape.borderRadius;
      rule.padding = theme.spacing(0.5);
    }

    if (borderRadius !== undefined) rule.borderRadius = Number(borderRadius) * theme.shape.borderRadius;
    if (backgroundColor !== undefined) rule.backgroundColor = resolveThemeToken(theme, backgroundColor);
    if (padding !== undefined) rule.padding = theme.spacing(Number(padding));

    if (Object.keys(rule).length > 0) {
      rule.transition = theme.transitions.create(['background-color', 'border-radius', 'padding', 'color', 'box-shadow']);
      styles[rootSelector] = rule;
    }

    if (meta.slotSelector) {
      const slotColor = getSelectedValue(activeValues, 'slotColor');
      if (slotColor !== undefined) {
        styles[`.ComponentCustomizationPreviewScope > .MuiPaper-root:first-of-type ${meta.slotSelector}`] = {
          color: resolveThemeToken(theme, slotColor),
        };
      }
    }
  }

  if (activeMethod === 'classes') {
    const effect = getSelectedValue(activeValues, 'effect');
    if (effect !== undefined) {
      styles[rootSelector] = {
        ...effectToRule(effect),
        transition: theme.transitions.create(['opacity', 'filter', 'outline', 'border-radius', 'box-shadow']),
      };
    }
  }

  if (activeMethod === 'styled') {
    const borderRadiusSel = getSelectedValue(activeValues, 'borderRadius');
    const strongShadowSel = getSelectedValue(activeValues, 'strongShadow');
    const rule: PreviewRule = {};

    if (borderRadiusSel !== undefined) {
      rule.borderRadius = borderRadiusSel === 'theme.shape.borderRadius' ? theme.shape.borderRadius : Number(borderRadiusSel);
    }
    if (strongShadowSel !== undefined) {
      rule.boxShadow = strongShadowSel.includes('[4]')
        ? theme.shadows[4]
        : strongShadowSel.includes('[1]')
          ? theme.shadows[1]
          : theme.shadows[2];
    }

    if (Object.keys(rule).length > 0) {
      rule.transition = theme.transitions.create(['border-radius', 'box-shadow']);
      styles[rootSelector] = rule;
    }
  }

  if (activeMethod === 'globalStyles') {
    const outlineColorSel = getSelectedValue(activeValues, 'outlineColor');
    const paddingSel = getSelectedValue(activeValues, 'padding');
    const rule: PreviewRule = {};

    if (outlineColorSel !== undefined) {
      rule.outline = `1px solid ${resolveThemeToken(theme, outlineColorSel)}`;
    }
    if (paddingSel !== undefined) {
      rule.padding = paddingSel.includes('0.5')
        ? theme.spacing(0.5)
        : paddingSel.includes('(2)')
          ? theme.spacing(2)
          : theme.spacing(1);
    }

    if (Object.keys(rule).length > 0) {
      rule.transition = theme.transitions.create(['outline-color', 'padding']);
      styles[rootSelector] = rule;
    }
  }

  if (activeMethod === 'theme') {
    const borderRadiusSel = getSelectedValue(activeValues, 'borderRadius');
    const backgroundColorSel = getSelectedValue(activeValues, 'backgroundColor');
    const variantBorderWidthSel = getSelectedValue(activeValues, 'variantBorderWidth');
    const rule: PreviewRule = {};

    if (borderRadiusSel !== undefined) rule.borderRadius = Number(borderRadiusSel);
    if (backgroundColorSel !== undefined) rule.backgroundColor = resolveThemeToken(theme, backgroundColorSel);
    if (variantBorderWidthSel !== undefined) rule.borderWidth = Number(variantBorderWidthSel);

    if (Object.keys(rule).length > 0) {
      rule.transition = theme.transitions.create(['background-color', 'border-radius', 'border-width']);
      styles[rootSelector] = rule;
    }
  }

  return styles;
};

const getClassSelector = (meta: CustomizationMeta, componentName: string) =>
  meta.stateSelector
    ?? (meta.stateClass && meta.supportsClasses
      ? `.Product${componentName}${meta.stateClass},\n.Product${componentName}Root${meta.stateClass}`
      : meta.stateClass
        ? `.Product${componentName}${meta.stateClass}`
        : meta.supportsClasses
          ? `.Product${componentName},\n.Product${componentName}Root`
          : `.Product${componentName}`);

export const getCustomizationMethods = (meta: CustomizationMeta, classMethodLabel: string): CustomizationMethod[] => {
  const sxControls: CustomizationControl[] = [
    { name: 'borderRadius', label: 'Radius token', type: 'select', options: ['0', '1', '2', '3', '4'] },
    { name: 'backgroundColor', label: 'Background', type: 'color' },
    { name: 'padding', label: 'Padding scale', type: 'select', options: ['0', '1', '2', '3', '4'] },
  ];

  if (meta.slotSelector) {
    sxControls.push({ name: 'slotColor', label: 'Slot color', type: 'color' });
  }

  const themeStyleKey = getThemeStyleKey(meta);
  const themeControls: CustomizationControl[] = themeStyleKey
    ? [
        { name: 'borderRadius', label: 'Override radius', type: 'select', options: ['0', '5', '8', '12'] },
        { name: 'backgroundColor', label: 'Override background', type: 'select', options: ['transparent', 'var(--iv-navy-50, #f8fbff)', 'var(--iv-navy-100, #ebf1fc)'] },
        ...(meta.supportsVariants && themeStyleKey === meta.themeKey
          ? [{ name: 'variantBorderWidth', label: 'Outlined variant border', type: 'select', options: ['1', '2', '3'] } satisfies CustomizationControl]
          : []),
      ]
    : [
        { name: 'borderRadius', label: 'Wrapper radius', type: 'select', options: ['0', '5', '8', '12'] },
        { name: 'backgroundColor', label: 'Wrapper background', type: 'select', options: ['transparent', 'var(--iv-navy-50, #f8fbff)', 'var(--iv-navy-100, #ebf1fc)'] },
      ];

  return [
    {
      id: 'sx',
      label: 'sx prop',
      description: 'Try one-off instance styling with theme tokens and documented slot selectors.',
      controls: sxControls,
    },
    {
      id: 'classes',
      label: classMethodLabel,
      description: 'Choose the kind of scoped CSS rule you would apply through className/classes.',
      controls: [
        {
          name: 'effect',
          label: meta.stateSelector || meta.stateClass ? 'Scoped state rule' : 'Scoped CSS rule',
          type: 'select',
          options: meta.stateSelector || meta.stateClass
            ? ['opacity: 0.72;', 'outline: 2px solid currentColor;', 'filter: saturate(0.8);']
            : ['outline: 1px solid currentColor;', 'border-radius: 8px;', 'box-shadow: 0 0 0 1px currentColor;'],
        },
      ],
    },
    {
      id: 'styled',
      label: 'styled()',
      description: 'Explore reusable local styling inputs before turning them into a named wrapper.',
      controls: [
        { name: 'borderRadius', label: 'Radius source', type: 'select', options: ['theme.shape.borderRadius', '8', '12'] },
        { name: 'strongShadow', label: 'Strong emphasis', type: 'select', options: ['theme.shadows[1]', 'theme.shadows[2]', 'theme.shadows[4]'] },
      ],
    },
    {
      id: 'globalStyles',
      label: 'GlobalStyles',
      description: 'Model a controlled global CSS escape hatch without relying on generated MUI hash classes.',
      controls: [
        { name: 'outlineColor', label: 'Outline token', type: 'select', options: ['theme.palette.divider', 'theme.palette.primary.main', 'theme.palette.secondary.main'] },
        { name: 'padding', label: 'Global padding', type: 'select', options: ['theme.spacing(0.5)', 'theme.spacing(1)', 'theme.spacing(2)'] },
      ],
    },
    {
      id: 'theme',
      label: themeStyleKey ?? 'wrapper fallback',
      description: themeStyleKey
        ? 'Explore component-wide defaults and style override choices before moving them into the theme contract.'
        : 'Explore wrapper-level choices for components without a useful theme override surface.',
      controls: themeControls,
    },
  ];
};

export const getCustomizationMethodsForComponent = (componentId: string) => {
  const meta = getMeta(componentId);
  const classMethodLabel = meta.supportsClasses ? 'className/classes' : 'className';
  return getCustomizationMethods(meta, classMethodLabel);
};

export function ComponentCustomizationPanel({ componentId }: ComponentCustomizationPanelProps) {
  const label = getComponentLabel(componentId);
  const meta = getMeta(componentId);
  const componentName = meta.importName;
  const themeKey = meta.themeKey;
  const themeStyleKey = getThemeStyleKey(meta);
  const wrapperImports = componentName === 'Box' ? 'Box' : `Box, ${componentName}`;
  const nestedSx = meta.slotSelector
    ? `,
    '& ${meta.slotSelector}': {
      color: 'primary.main',
    }`
    : '';
  const classProps = meta.supportsClasses
    ? ` className="Product${componentName}" classes={{ root: 'Product${componentName}Root' }}`
    : ` className="Product${componentName}"`;
  const classSelector = getClassSelector(meta, componentName);
  const classComment = meta.stateSelector || meta.stateClass
    ? '/* Scope MUI state classes to your component class or slot class. */'
    : '/* Scope external CSS to your custom component class. */';
  const classDeclaration = meta.stateSelector || meta.stateClass
    ? 'opacity: 0.72;'
    : 'outline: 1px solid currentColor;';
  const variantsSnippet = meta.supportsVariants && themeStyleKey === themeKey
    ? `,
          variants: [
            {
              props: { variant: 'outlined' },
              style: { borderWidth: 2 },
            },
          ]`
    : '';
  const classMethodLabel = meta.supportsClasses ? 'className/classes' : 'className';

  const sxCode = `import { ${componentName} } from '@mui/material';

${meta.example.replace('/>', `\n  sx={{\n    borderRadius: 1,\n    backgroundColor: 'background.paper'${nestedSx}\n  }}\n/>`)}`;

  const classCode = `import { ${componentName} } from '@mui/material';
import './product-${componentId}.css';

${meta.example.replace('/>', `${classProps} />`)}

${classComment}
${classSelector} {
  ${classDeclaration}
}`;

  const styledCode = `import { styled } from '@mui/material/styles';
import { ${componentName} } from '@mui/material';

const Product${componentName} = styled(${componentName}, {
  shouldForwardProp: (prop) => prop !== 'emphasis',
})<{ emphasis?: 'normal' | 'strong' }>(({ theme, emphasis }) => ({
  borderRadius: theme.shape.borderRadius,
  ...(emphasis === 'strong' && {
    boxShadow: theme.shadows[2],
  }),
}));`;

  const globalStylesCode = `import { GlobalStyles, ${componentName} } from '@mui/material';

<>
  <GlobalStyles
    styles={(theme) => ({
      '.Product${componentName}Global': {
        borderRadius: theme.shape.borderRadius,
        outline: \`1px solid \${theme.palette.divider}\`,
      },
    })}
  />
  ${meta.example.replace('/>', ` className="Product${componentName}Global" />`)}
</>`;

  const themeCode = themeKey
    ? themeStyleKey !== themeKey
      ? `import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    ${themeKey}: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    ${themeStyleKey}: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          backgroundColor: 'transparent',
        },
      },
    },
  },
});`
      : `import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    ${themeKey}: {
      defaultProps: {
        // Set defaults that every ${label} should inherit.
      },
      styleOverrides: {
        root: {
          borderRadius: 5${variantsSnippet}
        },
      },
    },
  },
});`
    : `import { ${wrapperImports} } from '@mui/material';

function Product${componentName}Wrapper() {
  return (
    <Box
      className="Product${componentName}Wrapper"
      sx={{
        borderRadius: 5,
        backgroundColor: 'transparent',
        p: 2,
      }}
    >
      ${meta.example}
    </Box>
  );
}`;

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Customization reference
            </Typography>
            <Typography variant="h5">Reference patterns for this {label}</Typography>
            <Typography variant="body2" color="text.secondary">
              Keep this section as copyable guidance: start with <code>sx</code> for one-off changes, use
              scoped classes when external CSS must participate, move repeated styling into <code>styled()</code>,
              and only use theme overrides or wrappers when the behavior should be shared across products.
            </Typography>
            {meta.note && (
              <Typography variant="body2" color="text.secondary">
                {meta.note}
              </Typography>
            )}
          </Stack>

          <Grid container spacing={2}>
            {['sx', classMethodLabel, 'styled()', 'GlobalStyles', themeStyleKey ?? 'wrapper fallback'].map((method) => (
              <Grid item xs={12} sm={6} md={3} key={method}>
                <Chip label={method} variant="outlined" sx={{ width: '100%' }} />
              </Grid>
            ))}
          </Grid>

          <CodeBlock code={sxCode} language="tsx" />
          <CodeBlock code={classCode} language="tsx" />
          <CodeBlock code={styledCode} language="tsx" />
          <CodeBlock code={globalStylesCode} language="tsx" />
          <CodeBlock code={themeCode} language="tsx" />
        </Stack>
      </CardContent>
    </Card>
  );
}
