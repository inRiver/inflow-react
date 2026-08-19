import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ChipDemo } from './ChipDemo';

describe('ChipDemo', () => {
  it('opens the ThemedChip playground on the Suggested design-system example', () => {
    renderWithInflow(<ChipDemo />);

    fireEvent.click(screen.getByRole('tab', { name: 'ThemedChip' }));

    expect(screen.getByRole('combobox', { name: 'Design-system example' })).toHaveTextContent(
      'Suggested',
    );

    const interactiveSuggested = screen.getAllByText('Suggested')[0].closest('.MuiChip-root');
    expect(interactiveSuggested).not.toBeNull();
    expect(within(interactiveSuggested as HTMLElement).getByText('auto_awesome')).toHaveClass(
      'material-icons-outlined',
    );
  });
});
