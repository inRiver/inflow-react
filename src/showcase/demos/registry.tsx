import type { ComponentType } from 'react';
import * as demos from './index';

export type ComponentMaturityStatus = 'Ready' | 'Beta' | 'Deprecated';

export interface ComponentDocMeta {
  maturityStatus?: ComponentMaturityStatus;
  guidelines?: string[];
  muiDocsUrl?: string;
}

export interface DemoRegistryEntry {
  component: ComponentType;
  meta?: ComponentDocMeta;
}

const createEntry = (
  component: ComponentType,
  meta?: ComponentDocMeta,
): DemoRegistryEntry => ({ component, meta });

const MUI_DOC_PATHS: Record<string, string> = {
  accordion: 'react-accordion',
  alert: 'react-alert',
  appbar: 'react-app-bar',
  autocomplete: 'react-autocomplete',
  avatar: 'react-avatar',
  badge: 'react-badge',
  bottomnavigation: 'react-bottom-navigation',
  box: 'react-box',
  breadcrumbs: 'react-breadcrumbs',
  button: 'react-button',
  card: 'react-card',
  checkbox: 'react-checkbox',
  checkboxgroup: 'react-checkbox',
  chip: 'react-chip',
  circularprogress: 'react-progress',
  container: 'react-container',
  datepicker: 'react-text-field',
  dialog: 'react-dialog',
  divider: 'react-divider',
  drawer: 'react-drawer',
  fab: 'react-floating-action-button',
  formcontrol: 'react-text-field',
  grid: 'react-grid',
  imagelist: 'react-image-list',
  inputadornment: 'react-text-field',
  linearprogress: 'react-progress',
  link: 'react-link',
  list: 'react-list',
  menu: 'react-menu',
  pagination: 'react-pagination',
  paper: 'react-paper',
  radio: 'react-radio-button',
  radiogroup: 'react-radio-button',
  rating: 'react-rating',
  select: 'react-select',
  skeleton: 'react-skeleton',
  slider: 'react-slider',
  snackbar: 'react-snackbar',
  speeddial: 'react-speed-dial',
  stack: 'react-stack',
  stepper: 'react-stepper',
  switch: 'react-switch',
  table: 'react-table',
  tabs: 'react-tabs',
  textfield: 'react-text-field',
  timepicker: 'react-text-field',
  togglebutton: 'react-toggle-button',
  tooltip: 'react-tooltip',
  typography: 'react-typography',
  typographyvariants: 'react-typography',
};

const componentGroups = {
  actions: new Set(['button', 'fab', 'togglebutton']),
  textInputs: new Set(['textfield', 'select', 'autocomplete', 'datepicker', 'timepicker', 'inputadornment']),
  choiceInputs: new Set(['checkbox', 'checkboxgroup', 'radio', 'radiogroup', 'switch', 'slider', 'rating', 'formcontrol']),
  dataDisplay: new Set(['table', 'list', 'card', 'accordion', 'chip', 'badge', 'avatar', 'tooltip', 'imagelist']),
  navigation: new Set(['tabs', 'breadcrumbs', 'menu', 'drawer', 'bottomnavigation', 'pagination', 'stepper', 'speeddial', 'link']),
  feedback: new Set(['alert', 'snackbar', 'dialog', 'skeleton', 'linearprogress', 'circularprogress']),
  layout: new Set(['grid', 'stack', 'container', 'box', 'paper', 'divider', 'appbar']),
  typography: new Set(['typography', 'typographyvariants']),
};

const getDefaultGuidelines = (componentId: string): string[] => {
  if (componentGroups.actions.has(componentId)) {
    return [
      'Keep one action visually primary within the same view.',
      'Prefer short, sentence-case labels that describe the result.',
      'Group secondary actions nearby instead of adding more emphasis states.',
    ];
  }

  if (componentGroups.textInputs.has(componentId)) {
    return [
      'Use clear labels so people can scan the field before interacting.',
      'Only ask for the minimum input needed to complete the task.',
      'Reserve helper text for format cues or validation guidance.',
    ];
  }

  if (componentGroups.choiceInputs.has(componentId)) {
    return [
      'Match the control to the choice model: single, multiple, or on/off.',
      'Keep labels close to the control and easy to scan.',
      'Default to the safest sensible option when a selection is optional.',
    ];
  }

  if (componentGroups.dataDisplay.has(componentId)) {
    return [
      'Lead with the content people need most often.',
      'Use supporting text and decoration to clarify, not compete with, the primary data.',
      'Keep repeated item structure consistent so scanning stays fast.',
    ];
  }

  if (componentGroups.navigation.has(componentId)) {
    return [
      'Keep labels predictable so people can move without re-reading each option.',
      'Expose the current location or selection clearly.',
      'Avoid overcrowding a single navigation pattern with rarely used destinations.',
    ];
  }

  if (componentGroups.feedback.has(componentId)) {
    return [
      'Use feedback close to the action or content it refers to.',
      'Keep messages concise and focused on what happened or what to do next.',
      'Reserve stronger visual emphasis for urgent or blocking states.',
    ];
  }

  if (componentGroups.layout.has(componentId)) {
    return [
      'Use layout primitives to create hierarchy before adding extra decoration.',
      'Keep spacing decisions consistent so related content feels grouped.',
      'Choose the simplest structure that still supports the content flow.',
    ];
  }

  if (componentGroups.typography.has(componentId)) {
    return [
      'Use type scale to show hierarchy before relying on color or weight alone.',
      'Keep line lengths and spacing comfortable for reading.',
      'Apply decorative variants sparingly so emphasis still feels meaningful.',
    ];
  }

  return [
    'Use this component when it makes the content clearer or easier to act on.',
    'Keep the surrounding layout simple enough that the component stays legible.',
    'Prefer consistent patterns over one-off presentation changes.',
  ];
};

const getDefaultMuiDocsUrl = (componentId: string) => {
  const docPath = MUI_DOC_PATHS[componentId] ?? 'components';
  return `https://mui.com/material-ui/${docPath}/#accessibility`;
};

export const getComponentDocMeta = (
  componentId: string,
  entry?: DemoRegistryEntry,
) => ({
  maturityStatus: entry?.meta?.maturityStatus,
  guidelines: entry?.meta?.guidelines ?? getDefaultGuidelines(componentId),
  muiDocsUrl: entry?.meta?.muiDocsUrl ?? getDefaultMuiDocsUrl(componentId),
});

export const demoRegistry: Record<string, DemoRegistryEntry> = {
  button: createEntry(demos.ButtonDemo),
  textfield: createEntry(demos.TextFieldDemo),
  select: createEntry(demos.SelectDemo),
  checkbox: createEntry(demos.CheckboxDemo),
  radio: createEntry(demos.RadioDemo),
  switch: createEntry(demos.SwitchDemo),
  slider: createEntry(demos.SliderDemo),
  typography: createEntry(demos.TypographyDemo),
  chip: createEntry(demos.ChipDemo),
  badge: createEntry(demos.BadgeDemo),
  avatar: createEntry(demos.AvatarDemo),
  tooltip: createEntry(demos.TooltipDemo),
  table: createEntry(demos.TableDemo),
  card: createEntry(demos.CardDemo),
  list: createEntry(demos.ListDemo),
  accordion: createEntry(demos.AccordionDemo),
  alert: createEntry(demos.AlertDemo),
  linearprogress: createEntry(demos.LinearProgressDemo),
  circularprogress: createEntry(demos.CircularProgressDemo),
  snackbar: createEntry(demos.SnackbarDemo),
  dialog: createEntry(demos.DialogDemo),
  skeleton: createEntry(demos.SkeletonDemo),
  tabs: createEntry(demos.TabsDemo),
  breadcrumbs: createEntry(demos.BreadcrumbsDemo),
  pagination: createEntry(demos.PaginationDemo),
  stepper: createEntry(demos.StepperDemo),
  menu: createEntry(demos.MenuDemo),
  paper: createEntry(demos.PaperDemo),
  appbar: createEntry(demos.AppBarDemo),
  drawer: createEntry(demos.DrawerDemo),
  container: createEntry(demos.ContainerDemo),
  grid: createEntry(demos.GridDemo),
  stack: createEntry(demos.StackDemo),
  autocomplete: createEntry(demos.AutocompleteDemo),
  rating: createEntry(demos.RatingDemo),
  togglebutton: createEntry(demos.ToggleButtonDemo),
  formcontrol: createEntry(demos.FormControlDemo),
  inputadornment: createEntry(demos.InputAdornmentDemo),
  divider: createEntry(demos.DividerDemo),
  link: createEntry(demos.LinkDemo),
  imagelist: createEntry(demos.ImageListDemo),
  bottomnavigation: createEntry(demos.BottomNavigationDemo),
  speeddial: createEntry(demos.SpeedDialDemo),
  fab: createEntry(demos.FabDemo),
  datepicker: createEntry(demos.DatePickerDemo),
  timepicker: createEntry(demos.TimePickerDemo),
  radiogroup: createEntry(demos.RadioGroupDemo),
  checkboxgroup: createEntry(demos.CheckboxGroupDemo),
  box: createEntry(demos.BoxDemo),
  typographyvariants: createEntry(demos.TypographyVariantsDemo),
};
