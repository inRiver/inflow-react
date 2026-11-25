import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { AutocompleteDemo } from './AutocompleteDemo';

// The demo renders many Autocompletes; under a full parallel run each test can take longer than the 5s default.
describe('AutocompleteDemo', { timeout: 20000 }, () => {
  it('renders the interactive autocomplete with its clear icon by default', () => {
    renderWithInflow(<AutocompleteDemo />);

    const interactive = screen.getByText('Autocomplete - Interactive').closest('section, div') as HTMLElement;
    expect(within(interactive.parentElement as HTMLElement).getAllByRole('combobox')[0]).toHaveValue('The Shawshank Redemption');
    expect(screen.getAllByTitle('Clear').length).toBeGreaterThan(0);
  });

  it('hides the clear icon on the interactive autocomplete when disableClearable is on', () => {
    renderWithInflow(<AutocompleteDemo />);

    const before = screen.getAllByTitle('Clear').length;
    fireEvent.click(screen.getByRole('checkbox', { name: 'disableClearable' }));

    expect(screen.getAllByTitle('Clear').length).toBe(before - 1);
  });

  it('shows a fixed "No clear icon" example in All States', () => {
    renderWithInflow(<AutocompleteDemo />);

    expect(screen.getByLabelText('No clear icon')).toHaveValue('The Shawshank Redemption');
  });

  it('keeps individual chip removal when multiple and disableClearable are both on', () => {
    renderWithInflow(<AutocompleteDemo />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'multiple' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'disableClearable' }));

    expect(screen.getAllByText('The Dark Knight').length).toBeGreaterThan(0);
  });

  it('shows a checkbox on each multi-select row and keeps the list open while picking', () => {
    renderWithInflow(<AutocompleteDemo />);

    fireEvent.keyDown(screen.getByLabelText('Categories'), { key: 'ArrowDown' });
    const listbox = screen.getByRole('listbox');
    const options = within(listbox).getAllByRole('option');
    expect(options).toHaveLength(6);
    options.forEach((option) => expect(within(option).getByRole('checkbox')).toBeInTheDocument());
    expect(within(options[0]).getByRole('checkbox')).toBeChecked();
    expect(within(options[2]).getByRole('checkbox')).not.toBeChecked();

    fireEvent.click(options[2]);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(within(within(screen.getByRole('listbox')).getAllByRole('option')[2]).getByRole('checkbox')).toBeChecked();
  });

  it('shows a radio button on each single-select row with the current choice marked', () => {
    renderWithInflow(<AutocompleteDemo />);

    fireEvent.keyDown(screen.getByLabelText('Category'), { key: 'ArrowDown' });
    const options = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(options).toHaveLength(6);
    expect(within(options[0]).getByRole('radio')).toBeChecked();
    expect(within(options[1]).getByRole('radio')).not.toBeChecked();
  });

  it('shows a checkbox on each row of the interactive list when multiple is on', () => {
    renderWithInflow(<AutocompleteDemo />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'multiple' }));
    fireEvent.keyDown(screen.getByLabelText('Movies'), { key: 'ArrowDown' });

    const options = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(options.length).toBeGreaterThan(0);
    options.forEach((option) => expect(within(option).getByRole('checkbox')).toBeInTheDocument());
  });

  it('shows checkboxes on the "Multiple" state in All States', () => {
    renderWithInflow(<AutocompleteDemo />);

    fireEvent.keyDown(screen.getByLabelText('Multiple'), { key: 'ArrowDown' });

    const options = within(screen.getByRole('listbox')).getAllByRole('option');
    options.forEach((option) => expect(within(option).getByRole('checkbox')).toBeInTheDocument());
  });

  it('collapses extra chips with limitTags when the field is not focused', () => {
    renderWithInflow(<AutocompleteDemo />);

    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('shows a loading state, then the options, when the async list opens', async () => {
    renderWithInflow(<AutocompleteDemo />);

    fireEvent.keyDown(screen.getByLabelText('Category (async)'), { key: 'ArrowDown' });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Loading…')).toBeInTheDocument();

    await waitFor(() => expect(within(screen.getByRole('listbox')).getAllByRole('option')).toHaveLength(6));
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('shows unavailable options as disabled', () => {
    renderWithInflow(<AutocompleteDemo />);

    fireEvent.keyDown(screen.getByLabelText('Category (some unavailable)'), { key: 'ArrowDown' });
    const options = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(options[4]).toHaveAttribute('aria-disabled', 'true');
    expect(options[0]).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('offers to add a typed value that is not in the list', () => {
    renderWithInflow(<AutocompleteDemo />);

    const input = screen.getByLabelText('Category (creatable)');
    fireEvent.change(input, { target: { value: 'Pet supplies' } });
    fireEvent.click(screen.getByRole('option', { name: 'Add "Pet supplies"' }));

    expect(input).toHaveValue('Pet supplies');
  });
});
