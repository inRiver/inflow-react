import { describe, expect, it } from 'vitest';
import { COMPONENT_CATEGORIES, COMPONENT_LABELS, getAllComponents } from './categories';
import { demoRegistry } from './demos/registry';

describe('Grouped Inputs registration', () => {
  it('is registered as a demo, a labelled component, and listed in exactly one category', () => {
    expect(demoRegistry.groupedinputs).toBeDefined();
    expect(COMPONENT_LABELS.groupedinputs).toBe('Grouped Inputs');
    expect(getAllComponents()).toContain('groupedinputs');

    const owners = Object.values(COMPONENT_CATEGORIES).filter((category) =>
      category.components.includes('groupedinputs'),
    );
    expect(owners).toHaveLength(1);
  });
});
