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
  button: {
    themedName: 'ThemedButton',
    reason:
      'Forces Inflow-specific tokens (radius, hover states, disableElevation) that stay consistent even if a product overrides the global button theme.',
  },
  chip: {
    themedName: 'ThemedChip',
    reason:
      'Forces Inflow-specific tokens (radius, color and delete-icon states) that stay consistent regardless of global theme overrides.',
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
  dialog: {
    themedName: 'ThemedDialog',
    reason:
      'Adds built-in title/actions slots and consistent close-button behavior instead of manual DialogTitle/DialogContent/DialogActions composition.',
  },
  table: {
    themedName: 'ThemedTable',
    reason: 'Replaces manual TableHead/TableBody children with a simple columns/data model.',
  },
};

export const hasThemedComponent = (componentId: string): boolean =>
  Object.prototype.hasOwnProperty.call(THEMED_COMPONENT_INFO, componentId);

export const getThemedComponentInfo = (componentId: string): ThemedComponentInfo | undefined =>
  THEMED_COMPONENT_INFO[componentId];
