import axe from 'axe-core';

/** axe cannot measure contrast or find the main landmark reliably in jsdom. */
export async function axeViolations(container: Element): Promise<string[]> {
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false },
      'landmark-one-main': { enabled: false },
    },
  });
  // Count each affected node, not just each rule, so an additional instance is a regression.
  return results.violations.flatMap((violation) =>
    violation.nodes.map((node) =>
      `${violation.id}: ${violation.help}\n  target: ${node.target.join(', ')}\n  html: ${node.html}\n  ${node.failureSummary ?? ''}`,
    ),
  );
}
