export interface ThemedComponentInfo {
  /** Name of the exported Themed* wrapper, e.g. 'ThemedButton'. */
  themedName: string;
  /** Short explanation of why this wrapper exists, shown in the sidebar and demo pages. */
  reason: string;
}

/**
 * Components that have a corresponding Themed* wrapper exported from
 * '@inriver/inflow-react' (see src/components/themed). Not every MUI
 * component gets one - most are already fully styled by the Inflow theme
 * via InflowProvider. A Themed* wrapper only exists where it adds real
 * value beyond what the theme alone can express: forced tokens that
 * survive theme overrides, sane ergonomic defaults, or a structural API
 * improvement over manual composition.
 */
export const THEMED_COMPONENT_INFO: Record<string, ThemedComponentInfo> = {
  accordion: {
    themedName: 'ThemedAccordion',
    reason:
      'Adds an items array API with single/multiple-expand control instead of hand-composed Accordion/AccordionSummary/AccordionDetails.',
  },
  alert: {
    themedName: 'ThemedAlert',
    reason:
      'Applies a curated outlined-icon mapping and consistent title/radius/alignment so severity alerts look uniform without manual icon wiring.',
  },
  appnav: {
    themedName: 'ThemedAppNav',
    reason: 'Dark navy app-navigation rail with pinned footer and wireframe placeholder for Inflow PIM chrome.',
  },
  avatar: {
    themedName: 'ThemedAvatar',
    reason:
      'Encapsulates the Inflow avatar size system, shape radii, status badge, and group overflow (+N) that the theme cannot express on its own.',
  },
  badge: {
    themedName: 'ThemedBadge',
    reason:
      'Forces badge geometry and a constrained semantic color set that remain consistent despite theme overrides.',
  },
  breadcrumbs: {
    themedName: 'ThemedBreadcrumbs',
    reason:
      'Adds an items array API with chevron/slash separators and expandable ellipsis collapse.',
  },
  button: {
    themedName: 'ThemedButton',
    reason:
      'Forces Inflow-specific tokens (radius, hover states, disableElevation) that stay consistent even if a product overrides the global button theme.',
  },
  chip: {
    themedName: 'ThemedChip',
    reason:
      'Forces Inflow-specific tokens (radius, color and delete-icon states) and adds DS primary chip variants that stay consistent regardless of global theme overrides.',
  },
  textfield: {
    themedName: 'ThemedTextField',
    reason: 'Applies the Inflow default of outlined + small so teams do not have to repeat those props on every field.',
  },
  card: {
    themedName: 'ThemedCard',
    reason:
      'Adds a structured title/subheader/actions API so teams do not hand-roll CardHeader/CardContent/CardActions composition.',
  },
  chatpanel: {
    themedName: 'ThemedChatPanel',
    reason: 'Composes the Inflow AI-assistant chat experience into a ThemedRightPanel.',
  },
  dialog: {
    themedName: 'ThemedDialog',
    reason:
      'Adds built-in title/actions slots and consistent close-button behavior instead of manual DialogTitle/DialogContent/DialogActions composition.',
  },
  detailpanel: {
    themedName: 'ThemedDetailPanel',
    reason: 'Provides the title, close control, scrollable editor body, and footer-action shell for detail views.',
  },
  menu: {
    themedName: 'ThemedMenu',
    reason:
      'Renders a popup menu from a declarative items array (icons, shortcuts, dividers, selection) instead of manual MenuItem composition.',
  },
  pageheader: {
    themedName: 'ThemedPageHeader',
    reason: 'Provides the structural Inflow page chrome for context, back navigation, and page-level actions.',
  },
  rightpanel: {
    themedName: 'ThemedRightPanel',
    reason: 'Provides the Inflow slide-in push or overlay panel foundation with resizing and composed content.',
  },
  stepper: {
    themedName: 'ThemedStepper',
    reason:
      'Encapsulates the Inflow stepper design (icons, connector, label underline) in a single steps array API so products do not hand-roll Step/StepLabel composition.',
  },
  table: {
    themedName: 'ThemedTable',
    reason: 'Replaces manual TableHead/TableBody children with a simple columns/data model.',
  },
  tabs: {
    themedName: 'ThemedTabs',
    reason: 'Structural pill-tab API with items[] state management and keyboard navigation.',
  },
  toast: {
    themedName: 'ThemedToast',
    reason:
      'Provides a per-severity tinted inline notification banner (info/warning/success/error) with title, action, and dismiss — distinct from the transient MUI Snackbar.',
  },
};

export const hasThemedComponent = (componentId: string): boolean =>
  Object.prototype.hasOwnProperty.call(THEMED_COMPONENT_INFO, componentId);

export const getThemedComponentInfo = (componentId: string): ThemedComponentInfo | undefined =>
  THEMED_COMPONENT_INFO[componentId];
