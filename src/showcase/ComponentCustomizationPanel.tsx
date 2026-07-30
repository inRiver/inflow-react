import { useState } from 'react';
import { Card, CardContent, Chip, Collapse, Grid, IconButton, Stack, Typography } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { CodeBlock } from './CodeBlock';
import { getComponentLabel } from './categories';

interface CustomizationMeta {
  importName: string;
  themeKey?: string;
  slotSelector?: string;
  stateClass?: string;
  stateSelector?: string;
  textSlotSelector?: string;
  secondarySlotSelector?: string;
  iconSlotSelector?: string;
  labelSlotSelector?: string;
  controlLabelOverrides?: Partial<Record<SxControlName, string>>;
  controlSelectorOverrides?: Partial<Record<SxControlName, string>>;
  /**
   * Controls to leave out of the generated `theme.components[...].styleOverrides`
   * snippet specifically, even though they work correctly in the live sx
   * preview. Needed when a control's real DOM target is a SIBLING of the
   * element that the theme snippet's styleOverrides.root actually renders
   * (e.g. TextField/Select's InputLabel is a sibling of MuiOutlinedInput's
   * own root, not a descendant of it) - nesting `'& .MuiInputLabel-root'`
   * inside `MuiOutlinedInput.styleOverrides.root` would be misleading,
   * unrunnable example code.
   */
  themeSnippetExcludeControls?: SxControlName[];
  /**
   * Named styleOverrides slot the theme snippet should target, when it isn't
   * the component's own `root` (e.g. Tooltip's visible bubble is styled via
   * `MuiTooltip.styleOverrides.tooltip`, not `.root` - `root` on Tooltip is
   * its trigger-wrapping span). Defaults to 'root'.
   */
  themeSlotKey?: string;
  previewRootSelector?: string;
  sxControls?: SxControlName[];
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

type TargetSlot = 'root' | 'text' | 'secondary' | 'icon' | 'label';

interface SxCustomizationControl extends CustomizationControl {
  name: SxControlName;
  cssProperty: string;
  targetSlot: TargetSlot;
  impliedStyles?: PreviewRule;
}

interface ComponentCustomizationPanelProps {
  componentId: string;
}

type PreviewRule = Record<string, string | number>;
type PreviewStyles = Record<string, PreviewRule>;
type SxControlName =
  | 'borderRadius'
  | 'backgroundColor'
  | 'textColor'
  | 'padding'
  | 'secondaryTextColor'
  | 'iconColor'
  | 'borderColor'
  | 'labelColor';

const sxControlDefinitions: Record<SxControlName, SxCustomizationControl> = {
  borderRadius: {
    name: 'borderRadius',
    label: 'Radius token',
    type: 'select',
    options: ['0', '1', '2', '3', '4'],
    cssProperty: 'borderRadius',
    targetSlot: 'root',
  },
  backgroundColor: {
    name: 'backgroundColor',
    label: 'Background',
    type: 'color',
    cssProperty: 'backgroundColor',
    targetSlot: 'root',
  },
  textColor: {
    name: 'textColor',
    label: 'Text color',
    type: 'color',
    cssProperty: 'color',
    targetSlot: 'text',
  },
  padding: {
    name: 'padding',
    label: 'Padding scale',
    type: 'select',
    options: ['0', '1', '2', '3', '4'],
    cssProperty: 'padding',
    targetSlot: 'root',
  },
  secondaryTextColor: {
    name: 'secondaryTextColor',
    label: 'Secondary text color',
    type: 'color',
    cssProperty: 'color',
    targetSlot: 'secondary',
  },
  iconColor: {
    name: 'iconColor',
    label: 'Icon color',
    type: 'color',
    cssProperty: 'color',
    targetSlot: 'icon',
  },
  borderColor: {
    name: 'borderColor',
    label: 'Border color',
    type: 'color',
    cssProperty: 'borderColor',
    targetSlot: 'root',
    impliedStyles: { borderStyle: 'solid', borderWidth: 1 },
  },
  labelColor: {
    name: 'labelColor',
    label: 'Label color',
    type: 'color',
    cssProperty: 'color',
    targetSlot: 'label',
  },
};

const sxControlsByComponent: Record<string, SxControlName[]> = {
  button: ['borderRadius', 'backgroundColor', 'textColor', 'padding', 'iconColor'],
  textfield: ['borderRadius', 'backgroundColor', 'textColor', 'labelColor', 'borderColor', 'padding'],
  select: ['borderRadius', 'backgroundColor', 'textColor', 'labelColor', 'borderColor', 'padding'],
  checkbox: ['backgroundColor', 'iconColor', 'labelColor'],
  radio: ['backgroundColor', 'iconColor', 'labelColor'],
  switch: ['backgroundColor', 'labelColor'],
  slider: ['textColor', 'secondaryTextColor'],
  typography: ['textColor'],
  chip: ['borderRadius', 'backgroundColor', 'textColor', 'iconColor'],
  badge: ['backgroundColor', 'textColor'],
  avatar: ['backgroundColor', 'textColor', 'borderColor'],
  tooltip: ['backgroundColor', 'textColor'],
  table: ['backgroundColor', 'textColor', 'secondaryTextColor', 'borderColor'],
  card: ['borderRadius', 'backgroundColor', 'textColor', 'secondaryTextColor', 'padding'],
  list: ['backgroundColor', 'textColor', 'secondaryTextColor', 'iconColor'],
  accordion: ['borderRadius', 'backgroundColor', 'textColor', 'secondaryTextColor', 'iconColor'],
  alert: ['borderRadius', 'backgroundColor', 'textColor', 'iconColor', 'borderColor'],
  linearprogress: ['backgroundColor'],
  circularprogress: ['textColor'],
  snackbar: ['borderRadius', 'backgroundColor', 'textColor', 'secondaryTextColor'],
  dialog: ['borderRadius', 'backgroundColor', 'textColor', 'secondaryTextColor', 'padding'],
  skeleton: ['borderRadius', 'backgroundColor'],
  tabs: ['textColor', 'secondaryTextColor', 'backgroundColor'],
  breadcrumbs: ['textColor', 'secondaryTextColor'],
  pagination: ['borderRadius', 'backgroundColor', 'textColor', 'secondaryTextColor'],
  stepper: ['textColor', 'iconColor', 'borderColor'],
  menu: ['borderRadius', 'backgroundColor', 'textColor', 'secondaryTextColor'],
  paper: ['borderRadius', 'backgroundColor', 'padding', 'borderColor'],
  appbar: ['backgroundColor', 'textColor', 'iconColor'],
  drawer: ['backgroundColor', 'textColor', 'secondaryTextColor'],
  container: ['backgroundColor', 'padding'],
  grid: ['backgroundColor', 'padding'],
  stack: ['backgroundColor', 'padding'],
  autocomplete: ['borderRadius', 'backgroundColor', 'textColor', 'labelColor', 'borderColor', 'padding'],
  rating: ['iconColor'],
  togglebutton: ['borderRadius', 'backgroundColor', 'textColor', 'iconColor', 'padding'],
  formcontrol: ['textColor', 'secondaryTextColor', 'padding'],
  inputadornment: ['iconColor', 'textColor'],
  divider: ['borderColor', 'textColor'],
  link: ['textColor'],
  imagelist: ['borderRadius', 'backgroundColor'],
  bottomnavigation: ['textColor', 'secondaryTextColor', 'iconColor'],
  speeddial: ['backgroundColor', 'textColor', 'iconColor'],
  fab: ['borderRadius', 'backgroundColor', 'iconColor'],
  datepicker: ['borderRadius', 'backgroundColor', 'textColor', 'labelColor', 'borderColor', 'padding'],
  timepicker: ['borderRadius', 'backgroundColor', 'textColor', 'labelColor', 'borderColor', 'padding'],
  radiogroup: ['textColor', 'labelColor', 'iconColor'],
  checkboxgroup: ['textColor', 'labelColor', 'iconColor'],
  box: ['backgroundColor', 'textColor', 'padding', 'borderRadius', 'borderColor'],
  typographyvariants: ['textColor'],
};

const metaOverrides: Record<string, Partial<CustomizationMeta>> = {
  button: {
    supportsVariants: true,
    stateClass: '.Mui-disabled',
    iconSlotSelector: '& .MuiButton-startIcon, & .MuiButton-endIcon, & .MuiButton-icon',
  },
  textfield: {
    importName: 'TextField',
    themeKey: 'MuiTextField',
    slotSelector: '.MuiOutlinedInput-root',
    stateClass: '.Mui-focused',
    stateSelector: '.ProductTextField .MuiOutlinedInput-root.Mui-focused',
    textSlotSelector: '.MuiOutlinedInput-input',
    controlSelectorOverrides: {
      borderColor: '.MuiOutlinedInput-notchedOutline',
      labelColor: '.MuiInputLabel-root',
    },
    themeSnippetExcludeControls: ['labelColor'],
    note: 'This showcase uses MUI TextField slots, so customize the outlined input slot rather than a wrapper-only surface.',
    supportsVariants: true,
    example: '<TextField label="Product name" />',
  },
  select: {
    supportsVariants: true,
    slotSelector: '.MuiOutlinedInput-root',
    textSlotSelector: '.MuiSelect-select',
    controlSelectorOverrides: {
      borderColor: '.MuiOutlinedInput-notchedOutline',
      labelColor: '.MuiInputLabel-root',
    },
    themeSnippetExcludeControls: ['labelColor'],
    note: 'This showcase uses Select with an outlined input slot, so surface and border controls target the outlined input rather than the wrapper FormControl.',
  },
  checkbox: {
    stateClass: '.Mui-checked',
    isCompactControl: true,
    controlSelectorOverrides: {
      iconColor: '.MuiCheckbox-root',
      labelColor: '.MuiFormControlLabel-label',
    },
    // labelColor targets FormControlLabel's own label span, which is a
    // SIBLING of the Checkbox (both children of FormControlLabel), not a
    // descendant of MuiCheckbox's own root - nesting it under
    // MuiCheckbox.styleOverrides.root would be unrunnable example code, even
    // though the live preview correctly reaches it via the scoped selector.
    themeSnippetExcludeControls: ['labelColor'],
  },
  radio: {
    stateClass: '.Mui-checked',
    isCompactControl: true,
    controlSelectorOverrides: {
      iconColor: '.MuiRadio-root',
      labelColor: '.MuiFormControlLabel-label',
    },
    themeSnippetExcludeControls: ['labelColor'],
  },
  switch: {
    stateClass: '.Mui-checked',
    isCompactControl: true,
    controlSelectorOverrides: { labelColor: '.MuiFormControlLabel-label' },
    themeSnippetExcludeControls: ['labelColor'],
  },
  slider: { secondarySlotSelector: '.MuiSlider-valueLabel' },
  chip: {
    supportsVariants: true,
    textSlotSelector: '.MuiChip-label',
    iconSlotSelector: '& .MuiChip-icon, & .MuiChip-deleteIcon',
  },
  badge: {
    controlSelectorOverrides: {
      backgroundColor: '.MuiBadge-badge',
      borderRadius: '.MuiBadge-badge',
    },
    textSlotSelector: '.MuiBadge-badge',
  },
  tooltip: { previewRootSelector: '.MuiTooltip-tooltip', themeSlotKey: 'tooltip' },
  table: {
    textSlotSelector: '.MuiTableCell-body',
    secondarySlotSelector: '.MuiTableCell-head',
    controlSelectorOverrides: {
      backgroundColor: '.MuiTableCell-root',
      borderColor: '.MuiTableCell-root',
    },
    controlLabelOverrides: { secondaryTextColor: 'Header text color' },
  },
  card: {
    supportsVariants: true,
    textSlotSelector: '.MuiCardContent-root',
    secondarySlotSelector: '.MuiCardHeader-title',
    controlLabelOverrides: {
      textColor: 'Body text color',
      secondaryTextColor: 'Title color',
    },
  },
  list: {
    textSlotSelector: '.MuiListItemText-primary',
    secondarySlotSelector: '.MuiListItemText-secondary',
    iconSlotSelector: '.MuiListItemIcon-root',
  },
  accordion: {
    textSlotSelector: '.MuiAccordionSummary-root',
    secondarySlotSelector: '.MuiAccordionDetails-root',
    iconSlotSelector: '.MuiAccordionSummary-expandIconWrapper',
  },
  alert: {
    supportsVariants: true,
    textSlotSelector: '.MuiAlert-message',
    iconSlotSelector: '.MuiAlert-icon',
  },
  checkboxgroup: {
    importName: 'FormGroup',
    themeKey: 'MuiFormGroup',
    textSlotSelector: '.MuiFormControlLabel-label',
    labelSlotSelector: '.MuiFormControlLabel-label',
    iconSlotSelector: '.MuiCheckbox-root',
    example: '<FormGroup row />',
  },
  radiogroup: {
    importName: 'RadioGroup',
    themeKey: 'MuiRadioGroup',
    previewRootSelector: '.MuiFormControl-root',
    textSlotSelector: '.MuiFormLabel-root',
    labelSlotSelector: '.MuiFormControlLabel-label',
    iconSlotSelector: '.MuiRadio-root',
    // textColor targets FormLabel, a sibling of RadioGroup within the wrapping
    // FormControl (hence previewRootSelector above) - not a descendant of
    // MuiRadioGroup's own root, so it can't be truthfully nested inside
    // MuiRadioGroup.styleOverrides.root in the generated theme snippet.
    // labelColor/iconColor stay in the snippet: FormControlLabel/Radio ARE
    // genuine children of RadioGroup itself.
    themeSnippetExcludeControls: ['textColor'],
    example: '<RadioGroup row />',
  },
  linearprogress: { importName: 'LinearProgress', themeKey: 'MuiLinearProgress' },
  circularprogress: { importName: 'CircularProgress', themeKey: 'MuiCircularProgress' },
  snackbar: {
    importName: 'Snackbar',
    themeKey: 'MuiSnackbarContent',
    secondarySlotSelector: '.MuiSnackbarContent-action .MuiButton-root',
    controlLabelOverrides: { secondaryTextColor: 'Action button color' },
  },
  dialog: {
    previewRootSelector: '.MuiDialog-paper',
    themeSlotKey: 'paper',
    textSlotSelector: '.MuiDialogTitle-root',
    secondarySlotSelector: '.MuiDialogContentText-root',
    controlLabelOverrides: {
      textColor: 'Title color',
      secondaryTextColor: 'Content text color',
    },
  },
  tabs: {
    textSlotSelector: '.MuiTab-root',
    secondarySlotSelector: '.MuiTab-root.Mui-selected',
    controlSelectorOverrides: { backgroundColor: '.MuiTabs-indicator' },
    controlLabelOverrides: {
      secondaryTextColor: 'Active tab color',
      backgroundColor: 'Indicator color',
    },
  },
  breadcrumbs: {
    secondarySlotSelector: '.MuiBreadcrumbs-separator',
    controlLabelOverrides: { secondaryTextColor: 'Separator color' },
  },
  pagination: {
    textSlotSelector: '.MuiPaginationItem-root',
    secondarySlotSelector: '.MuiPaginationItem-page.Mui-selected',
    controlSelectorOverrides: {
      borderRadius: '.MuiPaginationItem-root',
      backgroundColor: '.MuiPaginationItem-root',
    },
    controlLabelOverrides: { secondaryTextColor: 'Active page color' },
  },
  stepper: {
    textSlotSelector: '.MuiStepLabel-label',
    iconSlotSelector: '.MuiStepIcon-root',
    controlSelectorOverrides: { borderColor: '.MuiStepConnector-line' },
    controlLabelOverrides: { borderColor: 'Connector color' },
  },
  menu: {
    importName: 'MenuList',
    themeKey: 'MuiMenuList',
    previewRootSelector: '.MuiList-root',
    textSlotSelector: '.MuiMenuItem-root',
    secondarySlotSelector: '.MuiMenuItem-root.Mui-selected',
    controlLabelOverrides: { secondaryTextColor: 'Selected item color' },
  },
  paper: { supportsVariants: true },
  appbar: {
    importName: 'AppBar',
    themeKey: 'MuiAppBar',
    iconSlotSelector: '.MuiIconButton-root',
  },
  drawer: {
    controlSelectorOverrides: { backgroundColor: '.MuiDrawer-paper' },
    textSlotSelector: '.MuiListItemText-primary',
    secondarySlotSelector: '.MuiListItemButton-root.Mui-selected .MuiListItemText-primary',
    controlLabelOverrides: { secondaryTextColor: 'Selected item color' },
  },
  bottomnavigation: {
    importName: 'BottomNavigation',
    themeKey: 'MuiBottomNavigation',
    textSlotSelector: '.MuiBottomNavigationAction-root',
    secondarySlotSelector: '.MuiBottomNavigationAction-root.Mui-selected',
    iconSlotSelector: '.MuiBottomNavigationAction-root svg',
    controlLabelOverrides: { secondaryTextColor: 'Active color' },
  },
  speeddial: {
    importName: 'SpeedDial',
    themeKey: 'MuiSpeedDial',
    controlSelectorOverrides: { backgroundColor: '.MuiSpeedDial-fab' },
    textSlotSelector: '.MuiSpeedDial-fab',
    iconSlotSelector: '.MuiSpeedDial-fab svg',
  },
  togglebutton: {
    importName: 'ToggleButton',
    themeKey: 'MuiToggleButton',
    stateClass: '.Mui-selected',
    iconSlotSelector: '& svg',
  },
  formcontrol: {
    importName: 'FormControl',
    themeKey: 'MuiFormControl',
    textSlotSelector: '.MuiFormLabel-root',
    secondarySlotSelector: '.MuiFormHelperText-root',
  },
  inputadornment: {
    importName: 'InputAdornment',
    themeKey: 'MuiInputAdornment',
    iconSlotSelector: '& svg',
  },
  imagelist: { importName: 'ImageList', themeKey: 'MuiImageList' },
  autocomplete: {
    slotSelector: '.MuiOutlinedInput-root',
    textSlotSelector: '.MuiOutlinedInput-input',
    controlSelectorOverrides: {
      borderColor: '.MuiOutlinedInput-notchedOutline',
      labelColor: '.MuiInputLabel-root',
    },
    themeSnippetExcludeControls: ['labelColor'],
    note: 'Autocomplete reuses an outlined input slot here, so root surface controls map to the input slot rather than the outer wrapper.',
  },
  rating: { iconSlotSelector: '.MuiRating-iconFilled' },
  fab: { importName: 'Fab', themeKey: 'MuiFab', iconSlotSelector: '& svg' },
  typographyvariants: { importName: 'Typography', themeKey: 'MuiTypography' },
  datepicker: {
    importName: 'TextField',
    themeKey: 'MuiTextField',
    slotSelector: '.MuiOutlinedInput-root',
    stateClass: '.Mui-focused',
    stateSelector: '.ProductTextField .MuiOutlinedInput-root.Mui-focused',
    textSlotSelector: '.MuiOutlinedInput-input',
    controlSelectorOverrides: {
      borderColor: '.MuiOutlinedInput-notchedOutline',
      labelColor: '.MuiInputLabel-root',
    },
    themeSnippetExcludeControls: ['labelColor'],
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
    textSlotSelector: '.MuiOutlinedInput-input',
    controlSelectorOverrides: {
      borderColor: '.MuiOutlinedInput-notchedOutline',
      labelColor: '.MuiInputLabel-root',
    },
    themeSnippetExcludeControls: ['labelColor'],
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

  return { ...base, sxControls: sxControlsByComponent[componentId] ?? ['backgroundColor', 'textColor'], ...metaOverrides[componentId] };
};

const getThemeStyleKey = (meta: CustomizationMeta) =>
  meta.slotSelector === '.MuiOutlinedInput-root' ? 'MuiOutlinedInput' : meta.themeKey;

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

const previewContainerSelector = '& > .MuiPaper-root:first-of-type';

const composeSelectors = (baseSelector: string, selector: string): string[] =>
  selector
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => (part.includes('&') ? part.replaceAll('&', baseSelector) : `${baseSelector} ${part}`));

const toRootSelector = (meta: CustomizationMeta) => {
  if (meta.previewRootSelector) {
    // previewRootSelector marks a component whose real customizable class
    // differs from the themeStyleKey-derived guess below (e.g. MenuList
    // renders `.MuiList-root`, not `.MuiMenuList-root`). It still only needs
    // to be scoped to the first interactive preview - not the whole
    // .ComponentCustomizationPreviewScope, which would also match unrelated
    // "All States" example instances further down the same page. Dialog and
    // Tooltip's demos additionally pass an explicit `container`/`slotProps.
    // popper.container` pointing at a ref inside that same first preview, so
    // their portaled content is a real descendant of it too.
    return composeSelectors(previewContainerSelector, meta.previewRootSelector)[0] ?? previewContainerSelector;
  }

  const themeStyleKey = getThemeStyleKey(meta);
  if (!themeStyleKey) {
    return `${previewContainerSelector} > *`;
  }

  return `${previewContainerSelector} .${themeStyleKey}-root`;
};

const toKebabCase = (value: string) => value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

const mergePreviewRule = (styles: PreviewStyles, selector: string, rule: PreviewRule) => {
  styles[selector] = { ...(styles[selector] ?? {}), ...rule };
};

const finalizePreviewTransitions = (styles: PreviewStyles, theme: Theme) => {
  Object.entries(styles).forEach(([selector, rule]) => {
    const transitionProps = Object.keys(rule)
      .filter((property) => property !== 'transition')
      .map(toKebabCase);

    if (transitionProps.length > 0) {
      styles[selector] = {
        ...rule,
        transition: theme.transitions.create(transitionProps),
      };
    }
  });
};

const resolvePreviewValue = (method: 'sx' | 'theme', controlName: SxControlName, value: string, theme: Theme) => {
  switch (controlName) {
    case 'borderRadius':
      return method === 'sx' ? Number(value) * theme.shape.borderRadius : Number(value);
    case 'padding':
      return theme.spacing(Number(value));
    case 'backgroundColor':
    case 'textColor':
    case 'secondaryTextColor':
    case 'iconColor':
    case 'borderColor':
    case 'labelColor':
      return resolveThemeToken(theme, value);
    default:
      return value;
  }
};

const getTargetSelectors = (
  controlName: SxControlName,
  meta: CustomizationMeta,
  rootSelector: string,
): string[] | null => {
  const controlDefinition = sxControlDefinitions[controlName];
  const selectorOverride = meta.controlSelectorOverrides?.[controlName];
  if (selectorOverride) {
    // Compose against previewContainerSelector (the first interactive
    // preview), not rootSelector: rootSelector can already point at a
    // themeStyleKey-derived sub-element (e.g. TextField's rootSelector
    // resolves to .MuiOutlinedInput-root), and some override targets - like
    // TextField's own InputLabel - are SIBLINGS of that sub-element rather
    // than its descendants, so composing through it would never match.
    return composeSelectors(previewContainerSelector, selectorOverride);
  }

  switch (controlDefinition.targetSlot) {
    case 'root':
      return [rootSelector];
    case 'text':
      return meta.textSlotSelector ? composeSelectors(rootSelector, meta.textSlotSelector) : [rootSelector];
    case 'secondary':
      return meta.secondarySlotSelector ? composeSelectors(rootSelector, meta.secondarySlotSelector) : null;
    case 'icon':
      return meta.iconSlotSelector ? composeSelectors(rootSelector, meta.iconSlotSelector) : null;
    case 'label':
      return meta.labelSlotSelector ? composeSelectors(rootSelector, meta.labelSlotSelector) : null;
    default:
      return null;
  }
};

const FORCED_PREVIEW_PROPERTIES = new Set(['color', 'backgroundColor', 'borderColor']);

const applyGenericPreviewControls = (
  method: 'sx' | 'theme',
  controlNames: SxControlName[],
  activeValues: Record<string, unknown> | undefined,
  meta: CustomizationMeta,
  rootSelector: string,
  styles: PreviewStyles,
  theme: Theme,
) => {
  controlNames.forEach((controlName) => {
    const selectedValue = getSelectedValue(activeValues, controlName);
    if (selectedValue === undefined) {
      return;
    }

    const selectors = getTargetSelectors(controlName, meta, rootSelector);
    if (!selectors || selectors.length === 0) {
      return;
    }

    const controlDefinition = sxControlDefinitions[controlName];
    const resolvedValue = resolvePreviewValue(method, controlName, selectedValue, theme);
    // Many MUI components set color/background/border explicitly on the exact
    // slot being targeted here (selected/active states, color="inherit" on
    // icons, input text, etc.), sometimes with equal-or-greater specificity or
    // later insertion order than this dynamically generated preview rule. This
    // is a "show me exactly this value" playground, not a general style sheet,
    // so force the value to win rather than silently no-op depending on which
    // component happens to win the cascade.
    const forcedValue =
      typeof resolvedValue === 'string' && FORCED_PREVIEW_PROPERTIES.has(controlDefinition.cssProperty)
        ? `${resolvedValue} !important`
        : resolvedValue;
    const rule: PreviewRule = {
      ...(controlDefinition.impliedStyles ?? {}),
      [controlDefinition.cssProperty]: forcedValue,
    };

    selectors.forEach((selector) => mergePreviewRule(styles, selector, rule));
  });
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

// eslint-disable-next-line react-refresh/only-export-components
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
    const backgroundColor = getSelectedValue(activeValues, 'backgroundColor');

    // Compact icon-only controls (checkbox/radio/switch) have no natural
    // background surface — apply a small rounded highlight by default so a
    // chosen background reads as intentional rather than a broken square.
    // Explicit borderRadius/padding picks below always take precedence.
    if (backgroundColor !== undefined && meta.isCompactControl) {
      mergePreviewRule(styles, rootSelector, {
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(0.5),
      });
    }

    applyGenericPreviewControls('sx', meta.sxControls ?? [], activeValues, meta, rootSelector, styles, theme);
    finalizePreviewTransitions(styles, theme);
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
    const variantBorderWidthSel = getSelectedValue(activeValues, 'variantBorderWidth');

    applyGenericPreviewControls('theme', meta.sxControls ?? [], activeValues, meta, rootSelector, styles, theme);

    if (variantBorderWidthSel !== undefined) {
      mergePreviewRule(styles, rootSelector, { borderWidth: Number(variantBorderWidthSel) });
    }

    finalizePreviewTransitions(styles, theme);
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

const createControlWithLabelOverride = (control: CustomizationControl, label?: string): CustomizationControl =>
  label ? { ...control, label } : control;

const themeControlDefinitions: Record<SxControlName, CustomizationControl> = {
  borderRadius: { name: 'borderRadius', label: 'Override radius', type: 'select', options: ['0', '5', '8', '12'] },
  backgroundColor: {
    name: 'backgroundColor',
    label: 'Override background',
    type: 'select',
    options: ['transparent', 'var(--iv-navy-50, #f8fbff)', 'var(--iv-navy-100, #ebf1fc)'],
  },
  textColor: {
    name: 'textColor',
    label: 'Override text color',
    type: 'select',
    options: ['text.primary', 'text.secondary', 'primary.main'],
  },
  padding: { name: 'padding', label: 'Override padding', type: 'select', options: ['0', '1', '2', '3', '4'] },
  secondaryTextColor: {
    name: 'secondaryTextColor',
    label: 'Override secondary text',
    type: 'select',
    options: ['text.secondary', 'text.primary', 'primary.main'],
  },
  iconColor: {
    name: 'iconColor',
    label: 'Override icon color',
    type: 'select',
    options: ['text.secondary', 'primary.main', 'secondary.main'],
  },
  borderColor: {
    name: 'borderColor',
    label: 'Override border color',
    type: 'select',
    options: ['theme.palette.divider', 'primary.main', 'secondary.main'],
  },
  labelColor: {
    name: 'labelColor',
    label: 'Override label color',
    type: 'select',
    options: ['text.secondary', 'text.primary', 'primary.main'],
  },
};

// eslint-disable-next-line react-refresh/only-export-components
export const getCustomizationMethods = (meta: CustomizationMeta, classMethodLabel: string): CustomizationMethod[] => {
  const sxControlNames = meta.sxControls ?? ['backgroundColor', 'textColor'];
  const sxControls = sxControlNames.map((controlName) =>
    createControlWithLabelOverride(sxControlDefinitions[controlName], meta.controlLabelOverrides?.[controlName]),
  );

  const themeStyleKey = getThemeStyleKey(meta);
  const themeControls: CustomizationControl[] = themeStyleKey
    ? [
        ...sxControlNames
          .filter((controlName) => !meta.themeSnippetExcludeControls?.includes(controlName))
          .map((controlName) =>
            createControlWithLabelOverride(themeControlDefinitions[controlName], meta.controlLabelOverrides?.[controlName]),
          ),
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

// eslint-disable-next-line react-refresh/only-export-components
export const getCustomizationMethodsForComponent = (componentId: string) => {
  const meta = getMeta(componentId);
  const classMethodLabel = meta.supportsClasses ? 'className/classes' : 'className';
  return getCustomizationMethods(meta, classMethodLabel);
};

type SnippetEntry = { selector?: string; property: string; value: string };

const sxSnippetValues: Record<SxControlName, string> = {
  borderRadius: '2',
  backgroundColor: `'background.paper'`,
  textColor: `'text.primary'`,
  padding: '2',
  secondaryTextColor: `'text.secondary'`,
  iconColor: `'primary.main'`,
  borderColor: `'divider'`,
  labelColor: `'text.secondary'`,
};

const themeSnippetValues: Record<SxControlName, string> = {
  borderRadius: '8',
  backgroundColor: 'theme.palette.background.paper',
  textColor: 'theme.palette.text.primary',
  padding: 'theme.spacing(2)',
  secondaryTextColor: 'theme.palette.text.secondary',
  iconColor: 'theme.palette.primary.main',
  borderColor: 'theme.palette.divider',
  labelColor: 'theme.palette.text.secondary',
};

const getSnippetSelector = (controlName: SxControlName, meta: CustomizationMeta) => {
  const overrideSelector = meta.controlSelectorOverrides?.[controlName];
  if (overrideSelector) {
    return overrideSelector;
  }

  switch (sxControlDefinitions[controlName].targetSlot) {
    case 'root':
      return undefined;
    case 'text':
      return meta.textSlotSelector;
    case 'secondary':
      return meta.secondarySlotSelector;
    case 'icon':
      return meta.iconSlotSelector;
    case 'label':
      return meta.labelSlotSelector;
    default:
      return undefined;
  }
};

const getSnippetProperty = (controlName: SxControlName) => {
  switch (controlName) {
    case 'padding':
      return 'padding';
    default:
      return sxControlDefinitions[controlName].cssProperty;
  }
};

const getSnippetEntries = (
  meta: CustomizationMeta,
  values: Record<SxControlName, string>,
  excludeControls?: SxControlName[],
): SnippetEntry[] => {
  const entries = (meta.sxControls ?? [])
    .filter((controlName) => !excludeControls?.includes(controlName))
    .map((controlName) => ({
      selector: getSnippetSelector(controlName, meta),
      property: getSnippetProperty(controlName),
      value: values[controlName],
    }));

  const rootEntries = entries.filter((entry) => !entry.selector).slice(0, 2);
  const nestedEntries = entries.filter((entry) => entry.selector);
  if (rootEntries.length === 0) {
    return nestedEntries.slice(0, 3);
  }

  const selectedNestedEntries = nestedEntries.slice(0, 2);
  const selectedEntries = [...rootEntries, ...selectedNestedEntries];
  return selectedEntries.length > 0 ? selectedEntries : entries.slice(0, 3);
};

const formatSnippetObject = (entries: SnippetEntry[]) => {
  const rootEntries = entries.filter((entry) => !entry.selector);
  const nestedEntries = entries.filter((entry) => entry.selector);
  const lines = [
    ...rootEntries.map((entry) => `    ${entry.property}: ${entry.value},`),
    ...nestedEntries.map(
      (entry) => `    '${entry.selector?.includes('&') ? entry.selector : `& ${entry.selector}`}': {\n      ${entry.property}: ${entry.value},\n    },`,
    ),
  ];

  return lines.join('\n');
};

const buildSxCodeSnippet = (componentName: string, meta: CustomizationMeta) => {
  const snippetEntries = getSnippetEntries(meta, sxSnippetValues);
  const sxObject = formatSnippetObject(snippetEntries);

  return `import { ${componentName} } from '@mui/material';

${meta.example.replace('/>', `\n  sx={{\n${sxObject}\n  }}\n/>`)}`;
};

const buildThemeOverrideObject = (entries: SnippetEntry[]) => {
  const rootEntries = entries.filter((entry) => !entry.selector);
  const nestedEntries = entries.filter((entry) => entry.selector);
  const lines = [
    ...rootEntries.map((entry) => `            ${entry.property}: ${entry.value},`),
    ...nestedEntries.map(
      (entry) =>
        `            '${entry.selector?.includes('&') ? entry.selector : `& ${entry.selector}`}': {\n              ${entry.property}: ${entry.value},\n            },`,
    ),
  ];

  return lines.join('\n');
};

export function ComponentCustomizationPanel({ componentId }: ComponentCustomizationPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const label = getComponentLabel(componentId);
  const meta = getMeta(componentId);
  const componentName = meta.importName;
  const themeKey = meta.themeKey;
  const themeStyleKey = getThemeStyleKey(meta);
  const wrapperImports = componentName === 'Box' ? 'Box' : `Box, ${componentName}`;
  const sxCode = buildSxCodeSnippet(componentName, meta);
  const themeSnippetEntries = getSnippetEntries(meta, themeSnippetValues, meta.themeSnippetExcludeControls);
  const themeOverrideObject = buildThemeOverrideObject(themeSnippetEntries);
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
        root: ({ theme }) => ({
${themeOverrideObject}
        }),
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
        ${meta.themeSlotKey ?? 'root'}: ({ theme }) => ({
${themeOverrideObject}
        }),
      }
${variantsSnippet}
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
          <Stack
            direction="row"
            spacing={1}
            alignItems="flex-start"
            justifyContent="space-between"
            onClick={() => setExpanded((prev) => !prev)}
            sx={{ cursor: 'pointer' }}
          >
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
            <IconButton
              aria-label={expanded ? 'Collapse customization reference' : 'Expand customization reference'}
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                setExpanded((prev) => !prev);
              }}
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: (theme) => theme.transitions.create('transform', {
                  duration: theme.transitions.duration.shortest,
                }),
                flexShrink: 0,
              }}
            >
              <ExpandMoreRoundedIcon />
            </IconButton>
          </Stack>

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Stack spacing={3}>
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
          </Collapse>
        </Stack>
      </CardContent>
    </Card>
  );
}
