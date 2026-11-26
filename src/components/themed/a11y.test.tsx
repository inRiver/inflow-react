import { useState, type ReactElement } from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { renderWithInflow } from '../../test/renderWithInflow';
import * as themed from './index';

function MenuFixture() {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  return <>
    <button ref={setAnchor} type="button">Open menu</button>
    <themed.ThemedMenu anchorEl={anchor} open={Boolean(anchor)} onClose={() => {}}
      items={[{ id: 'edit', label: 'Edit' }]} />
  </>;
}

function TabsFixture() {
  const [active, setActive] = useState(0);
  return <>
    <themed.ThemedTabs tabs={[{ label: 'Overview' }, { label: 'Details' }]} value={active}
      onChange={(_, index) => setActive(index)} ariaLabel="Product sections" />
    <themed.ThemedTabPanel value={active} index={0}>Overview contents</themed.ThemedTabPanel>
    <themed.ThemedTabPanel value={active} index={1}>Details contents</themed.ThemedTabPanel>
  </>;
}

const columns = [{ id: 'name', label: 'Name' }];
const data = [{ name: 'Example' }];
const noop = () => {};

// A fixture is required for every runtime Themed* barrel export. The explicit
// map supplies meaningful required props, while the barrel drives test discovery.
const fixtures = {
  ThemedAccordion: () => <themed.ThemedAccordion items={[{ id: 'one', summary: 'Details', details: 'More details' }]} expanded="one" />,
  ThemedAlert: () => <themed.ThemedAlert severity="warning" title="Notice" onClose={noop}>Details</themed.ThemedAlert>,
  ThemedAppNav: () => <themed.ThemedAppNav items={[{ label: 'Home', icon: 'home', active: true }]} />,
  ThemedAppNavPlaceholder: () => <themed.ThemedAppNavPlaceholder />,
  ThemedAvatar: () => <themed.ThemedAvatar alt="Ada">A</themed.ThemedAvatar>,
  ThemedAvatarGroup: () => <themed.ThemedAvatarGroup><themed.ThemedAvatar alt="Ada">A</themed.ThemedAvatar><themed.ThemedAvatar alt="Bob">B</themed.ThemedAvatar></themed.ThemedAvatarGroup>,
  ThemedBadge: () => <themed.ThemedBadge badgeContent={3}><button type="button">Messages</button></themed.ThemedBadge>,
  ThemedBreadcrumbs: () => <themed.ThemedBreadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products' }]} />,
  ThemedCard: () => <themed.ThemedCard title="Product">Details</themed.ThemedCard>,
  ThemedChatAccordion: () => <themed.ThemedChatAccordion title="Progress" steps={[{ id: 'one', label: 'Working' }]} defaultExpanded />,
  ThemedChatPanel: () => <themed.ThemedChatPanel title="Assistant" messages={[{ id: 'one', role: 'assistant', content: 'Hello' }]} onClose={noop} onSendMessage={noop} />,
  ThemedChip: () => <themed.ThemedChip label="Active" onDelete={noop} />,
  ThemedDetailPageShell: () => <themed.ThemedDetailPageShell panel={{ panelProps: { open: true, onClose: noop, 'aria-label': 'Editor' }, detailProps: { title: 'Edit product', children: 'Details' } }}><main>Product</main></themed.ThemedDetailPageShell>,
  ThemedDetailPanel: () => <themed.ThemedDetailPanel title="Details" onClose={noop}>Product details</themed.ThemedDetailPanel>,
  ThemedDetailPanelSection: () => <themed.ThemedDetailPanelSection title="Overview">Details</themed.ThemedDetailPanelSection>,
  ThemedDialog: () => <themed.ThemedDialog open title="Edit product" onClose={noop}>Details</themed.ThemedDialog>,
  ThemedFileTypeIcon: () => <themed.ThemedFileTypeIcon extension="pdf" />,
  ThemedMenu: () => <MenuFixture />,
  ThemedPageHeader: () => <themed.ThemedPageHeader title="Products" onBack={noop} actions={[{ label: 'Add', onClick: noop }]} />,
  ThemedRightPanel: () => <themed.ThemedRightPanel open onClose={noop} aria-label="Details">Panel contents</themed.ThemedRightPanel>,
  ThemedStepper: () => <themed.ThemedStepper steps={[{ label: 'First' }, { label: 'Second' }]} activeStep={0} onStepClick={noop} />,
  ThemedTable: () => <themed.ThemedTable columns={columns} data={data} />,
  ThemedTablePage: () => <themed.ThemedTablePage header={{ title: 'Products' }} columns={columns} data={data} />,
  ThemedTabPanel: () => <TabsFixture />,
  ThemedTabs: () => <TabsFixture />,
  ThemedToast: () => <themed.ThemedToast severity="success" title="Saved" message="Your changes were saved" onClose={noop} />,
} satisfies Record<Extract<keyof typeof themed, `Themed${string}`>, () => ReactElement>;

type ComponentName = keyof typeof fixtures;
const exportedNames = Object.keys(themed).filter((name) => name.startsWith('Themed')).sort();

// Frozen per-component counts: never raise these; lower or remove an entry as
// violations are fixed. Unlisted components are held to zero. A count is the
// number of affected nodes, so multiple instances of one rule cannot hide.
const EXISTING_VIOLATIONS: Partial<Record<ComponentName, number>> = {};

describe('themed wrapper accessibility ratchet', () => {
  it('has a representative fixture for every runtime Themed* export', () => {
    expect(Object.keys(fixtures).sort()).toEqual(exportedNames);
    expect(Object.keys(EXISTING_VIOLATIONS).filter((name) => !exportedNames.includes(name))).toEqual([]);
  });

  it.each(exportedNames)('%s does not exceed its violation baseline', async (exportName) => {
    const name = exportName as ComponentName;
    expect(fixtures[name], `Add an accessibility fixture for ${name}`).toBeDefined();
    const { container, baseElement } = renderWithInflow(fixtures[name]());
    // Dialog and Menu render in portals outside container. Assert that the
    // actual popup exists rather than silently testing nothing.
    const isPortal = name === 'ThemedDialog' || name === 'ThemedMenu';
    if (name === 'ThemedDialog') expect(screen.getByRole('dialog')).toBeInTheDocument();
    if (name === 'ThemedMenu') expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    if (name === 'ThemedTabs' || name === 'ThemedTabPanel') {
      const tab = screen.getByRole('tab', { name: 'Overview' });
      const panel = screen.getByRole('tabpanel', { name: 'Overview' });
      expect(tab).toHaveAttribute('aria-controls', panel.id);
      expect(panel).toHaveAttribute('aria-labelledby', tab.id);
    }
    if (name === 'ThemedRightPanel' || name === 'ThemedDetailPageShell') {
      expect(await screen.findByRole('complementary')).toBeInTheDocument();
    }
    if (!isPortal) expect(container.firstElementChild).not.toBeNull();
    // A portal's generic positioning paper is outside the page's landmarks. Scan
    // the menu itself: it is transient UI, not unlandmarked page content.
    const scanRoot = name === 'ThemedMenu' ? screen.getByRole('menu') : isPortal ? baseElement : container;
    const violations = await axeViolations(scanRoot);
    const allowed = EXISTING_VIOLATIONS[name] ?? 0;
    expect(violations.length, `${name}: ${violations.length} violations, ${allowed} allowed\n${violations.join('\n\n')}`).toBeLessThanOrEqual(allowed);
  });
});
