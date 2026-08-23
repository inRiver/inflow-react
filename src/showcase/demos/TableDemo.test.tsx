import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { TableDemo } from './TableDemo';

describe('TableDemo variants', () => {
  it('uses the shared product data with stock MUI table styling', () => {
    renderWithInflow(<TableDemo />);

    const muiTable = screen.getAllByRole('table')[0];
    expect(within(muiTable).getByRole('columnheader', { name: 'Entity' })).toBeInTheDocument();
    expect(within(muiTable).getAllByText('T60V0111')).toHaveLength(2);
    expect(within(muiTable).getAllByText('60V Push Mowers')).toHaveLength(2);
    expect(within(muiTable).getByRole('checkbox', { name: 'Select T60V0111' })).toBeChecked();
    expect(muiTable).not.toHaveStyle({ minWidth: '1273px', tableLayout: 'fixed' });
    expect(screen.queryByRole('checkbox', { name: 'striped' })).not.toBeInTheDocument();
  });

  it('shows Patricia\'s reference table only on the ThemedTable tab', async () => {
    const user = userEvent.setup();
    renderWithInflow(<TableDemo />);

    await user.click(screen.getByRole('tab', { name: /ThemedTable/ }));

    const themedTable = screen.getAllByRole('table')[0];
    expect(within(themedTable).getAllByText('60V Push Mowers')).toHaveLength(2);
    expect(screen.getByRole('checkbox', { name: 'Select T60V0111' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'striped' })).toBeInTheDocument();

    const codeSample = document.querySelector('.code-block pre')?.textContent;
    expect(codeSample).toContain("const products = [");
    expect(codeSample).toContain('T60V0111');
    expect(codeSample).toContain("id: 'mediaColors'");
    expect(codeSample).toContain("tableLayout: 'fixed'");
    expect(codeSample).toContain('<ThemedTable');

    const thirdRowCheckbox = screen.getByRole('checkbox', { name: 'Select T80V0301' });
    await user.click(thirdRowCheckbox);
    expect(thirdRowCheckbox).toBeChecked();
    expect(thirdRowCheckbox.closest('tr')).toHaveAttribute('aria-selected', 'true');
  });
});
