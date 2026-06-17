export interface Category {
  id: string;
  label: string;
  icon: string;
  iconOutlined?: boolean;
  hidden?: boolean;
  components: string[];
}

export interface ExamplePage {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const COMPONENT_CATEGORIES: Record<string, Category> = {
  forms: {
    id: 'forms',
    label: 'Forms',
    icon: 'Edit',
    components: [
      'button',
      'textfield',
      'select',
      'checkbox',
      'checkboxgroup',
      'radio',
      'radiogroup',
      'switch',
      'slider',
      'autocomplete',
      'rating',
      'togglebutton',
      'formcontrol',
      'inputadornment',
    ],
  },
  dataDisplay: {
    id: 'dataDisplay',
    label: 'Data Display',
    icon: 'TableRows',
    components: [
      'table',
      'card',
      'list',
      'accordion',
      'chip',
      'badge',
      'avatar',
      'tooltip',
      'divider',
      'imagelist',
    ],
  },
  navigation: {
    id: 'navigation',
    label: 'Navigation',
    icon: 'Explore',
    iconOutlined: true,
    components: [
      'tabs',
      'breadcrumbs',
      'menu',
      'drawer',
      'bottomnavigation',
      'pagination',
      'stepper',
      'speeddial',
    ],
  },
  feedback: {
    id: 'feedback',
    label: 'Feedback',
    icon: 'Campaign',
    iconOutlined: true,
    components: [
      'alert',
      'snackbar',
      'dialog',
      'skeleton',
      'linearprogress',
      'circularprogress',
    ],
  },
  layout: {
    id: 'layout',
    label: 'Layout',
    icon: 'Dashboard',
    hidden: true,
    components: ['grid', 'stack', 'container', 'box', 'paper', 'appbar'],
  },
  other: {
    id: 'other',
    label: 'Other',
    icon: 'Category',
    hidden: true,
    components: [
      'typography',
      'typographyvariants',
      'link',
      'fab',
      'datepicker',
      'timepicker',
    ],
  },
};

export const EXAMPLE_PAGES: ExamplePage[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Complete dashboard layout with charts and widgets',
    icon: 'Dashboard',
  },
  {
    id: 'login',
    label: 'Login',
    description: 'Authentication form with validation',
    icon: 'Login',
  },
  {
    id: 'table',
    label: 'Data Table',
    description: 'Advanced table with sorting and filtering',
    icon: 'TableChart',
  },
  {
    id: 'dialog',
    label: 'Dialog',
    description: 'Modal dialog with form content',
    icon: 'Dialog',
  },
  {
    id: 'empty',
    label: 'Empty State',
    description: 'Empty state with call-to-action',
    icon: 'Inbox',
  },
];

// Component display labels (maps slug -> human-readable label)
export const COMPONENT_LABELS: Record<string, string> = {
  button: 'Button',
  textfield: 'Text Field',
  select: 'Select',
  checkbox: 'Checkbox',
  checkboxgroup: 'Checkbox Group',
  radio: 'Radio',
  radiogroup: 'Radio Group',
  switch: 'Switch',
  slider: 'Slider',
  autocomplete: 'Autocomplete',
  rating: 'Rating',
  togglebutton: 'Toggle Button',
  formcontrol: 'Form Control',
  inputadornment: 'Input Adornment',
  table: 'Table',
  list: 'List',
  chip: 'Chip',
  badge: 'Badge',
  avatar: 'Avatar',
  tooltip: 'Tooltip',
  typography: 'Typography',
  card: 'Card',
  paper: 'Paper',
  imagelist: 'Image List',
  alert: 'Alert',
  snackbar: 'Snackbar',
  dialog: 'Dialog',
  skeleton: 'Skeleton',
  linearprogress: 'Linear Progress',
  circularprogress: 'Circular Progress',
  tabs: 'Tabs',
  breadcrumbs: 'Breadcrumbs',
  menu: 'Menu',
  drawer: 'Drawer',
  bottomnavigation: 'Bottom Navigation',
  pagination: 'Pagination',
  stepper: 'Stepper',
  speeddial: 'Speed Dial',
  grid: 'Grid',
  container: 'Container',
  stack: 'Stack',
  box: 'Box',
  accordion: 'Accordion',
  appbar: 'App Bar',
  link: 'Link',
  datepicker: 'Date Picker',
  timepicker: 'Time Picker',
  datetimepicker: 'Date Time Picker',
  icon: 'Icon',
  fab: 'Floating Action Button',
  typographyvariants: 'Typography Variants',
};

export const normalizeComponentId = (componentId: string): string => {
  return componentId.toLowerCase().replace(/-/g, '');
};

export const getComponentLabel = (slug: string): string => {
  return COMPONENT_LABELS[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
};

export const getCategoryById = (id: string): Category | undefined => {
  return COMPONENT_CATEGORIES[id];
};

export const getComponentCategory = (
  componentId: string
): Category | undefined => {
  return Object.values(COMPONENT_CATEGORIES).find((category) =>
    category.components.includes(componentId)
  );
};

export const getAllComponents = (): string[] => {
  return Object.values(COMPONENT_CATEGORIES).flatMap((cat) => cat.components);
};
