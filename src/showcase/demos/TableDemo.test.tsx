import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { TableDemo } from './TableDemo';

describe('TableDemo variants', () => {
  it('shows persistent ThemedToast guidance without a dismiss control', () => {
    // Given
    renderWithInflow(<TableDemo />);

    // Then
    const guidance = screen.getByRole('status');
    expect(within(guidance).getByText('Use themed AG Grid for focused product data')).toBeInTheDocument();
    const guidanceText =
      'For a single or focused product table, use AG Grid with the Inflow theme-provider parameters. Do not use MUI Table or ThemedTable for the focused data surface.';
    expect(within(guidance).getByText(guidanceText)).toBeInTheDocument();
    expect(guidance.querySelector('strong')).not.toBeInTheDocument();
    expect(getComputedStyle(guidance).maxWidth).toBe('none');
    expect(within(guidance).queryByRole('button')).not.toBeInTheDocument();
  });

  it('uses the shared product data with stock MUI table styling', () => {
    // Given
    renderWithInflow(<TableDemo />);

    // When
    const muiTable = screen.getAllByRole('table')[0];

    // Then
    expect(within(muiTable).getByRole('columnheader', { name: 'Entity' })).toBeInTheDocument();
    expect(within(muiTable).getAllByText('T60V0111')).toHaveLength(2);
    expect(within(muiTable).getAllByText('60V Push Mowers')).toHaveLength(2);
    expect(within(muiTable).getByRole('checkbox', { name: 'Select T60V0111' })).toBeChecked();
    expect(muiTable).not.toHaveStyle({ minWidth: '1273px', tableLayout: 'fixed' });
    expect(screen.queryByRole('checkbox', { name: 'striped' })).not.toBeInTheDocument();
  });

  it("shows Patricia's reference table only on the ThemedTable tab", async () => {
    // Given
    const user = userEvent.setup();
    renderWithInflow(<TableDemo />);

    // When
    const muiRowCheckbox = screen.getByRole('checkbox', { name: 'Select T80V0301' });
    await user.click(muiRowCheckbox);
    expect(muiRowCheckbox).toBeChecked();
    await user.click(screen.getByRole('tab', { name: /ThemedTable/ }));

    // Then
    const themedTable = screen.getAllByRole('table')[0];
    expect(within(themedTable).getAllByText('60V Push Mowers')).toHaveLength(2);
    expect(screen.getByRole('checkbox', { name: 'Select T60V0111' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'striped' })).toBeInTheDocument();

    const codeSample = document.querySelector('.code-block pre')?.textContent;
    expect(codeSample).toContain('T60V0111');
    expect(codeSample).toContain("id: 'mediaColors'");
    expect(codeSample).toContain('<ThemedTable');

    const themedRowCheckbox = screen.getByRole('checkbox', { name: 'Select T80V0301' });
    expect(themedRowCheckbox).toBeChecked();
    expect(themedRowCheckbox.closest('tr')).toHaveAttribute('aria-selected', 'true');
  });
});
